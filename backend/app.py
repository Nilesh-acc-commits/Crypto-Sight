from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

from pydantic import BaseModel
from predictor import Predictor
from schemas import PredictionRequest, PredictionResponse

app = FastAPI(title="Crypto Price Predictor API")

# --- CORS Configuration ---
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

predictor = Predictor()

@app.get("/health")
def health_check():
    return {"status": "ok", "message": "Service is running"}

# @app.get("/")
# def read_root():
#     return {"message": "Welcome to the Crypto Price Predictor API. Visit /docs for documentation."}

@app.post("/predict/{coin}", response_model=PredictionResponse)
def predict_price(coin: str, request: PredictionRequest):
    coin = coin.upper()
    try:
        # Convert Pydantic model to dict
        features = request.dict()
        predicted_price = predictor.predict(coin, features)
        return {"coin": coin, "predicted_price": round(predicted_price, 2)}
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail=f"Model for {coin} not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/predict/{coin}/latest", response_model=PredictionResponse)
def predict_latest_price(coin: str):
    coin = coin.upper()
    try:
        features = predictor.get_latest_features(coin)
        predicted_price = predictor.predict(coin, features)
        return {"coin": coin, "predicted_price": round(predicted_price, 2)}
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail=f"Data or Model for {coin} not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# --- Google Authentication ---
from pydantic import BaseModel
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from passlib.context import CryptContext

# Security & Hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class GoogleAuthRequest(BaseModel):
    token: str

class UserAuth(BaseModel):
    email: str
    password: str

GOOGLE_CLIENT_ID = "164298787471-uebhak22t9liak0sjcdkep1dc0dno27p.apps.googleusercontent.com" # User must replace this!

# In-Memory Database for Models (Simple Demo)
# Format: { "email": { "password": "hashed_password", "type": "email" } }
fake_users_db = {}

@app.post("/auth/signup")
def signup(user: UserAuth):
    if user.email in fake_users_db:
        raise HTTPException(status_code=400, detail="User already exists")
    
    hashed_password = pwd_context.hash(user.password)
    fake_users_db[user.email] = {
        "password": hashed_password,
        "type": "email",
        "name": user.email.split("@")[0]
    }
    return {
        "message": "User created successfully",
        "user": {
            "email": user.email,
            "name": fake_users_db[user.email]["name"]
        }
    }

@app.post("/auth/login")
def login(user: UserAuth):
    db_user = fake_users_db.get(user.email)
    if not db_user:
        raise HTTPException(status_code=400, detail="Invalid credentials")
    
    if db_user.get("type") == "google":
         raise HTTPException(status_code=400, detail="Please sign in with Google")

    if not pwd_context.verify(user.password, db_user["password"]):
         raise HTTPException(status_code=400, detail="Invalid credentials")
         
    return {
        "message": "Login successful", 
        "user": {
            "email": user.email,
            "name": db_user["name"]
        }
    }

@app.post("/auth/google")
def google_login(auth: GoogleAuthRequest):
    try:
        # Verify the token with Google
        idinfo = id_token.verify_oauth2_token(
            auth.token, 
            google_requests.Request(), 
            GOOGLE_CLIENT_ID
        )
        
        # ID token is valid. Get the user's Google Account ID from the decoded token.
        userid = idinfo['sub']
        email = idinfo['email']
        name = idinfo.get('name', 'User')
        
        # Create user if not exists
        if email not in fake_users_db:
             fake_users_db[email] = { "type": "google", "name": name }
        
        # In a real app, you would check if the user exists in your DB here, 
        # create a session, and return your own JWT token.
        # For now, we return success and the user profile.
        
        return {
            "message": "Login successful",
            "user": {
                "email": email,
                "name": name,
                "picture": idinfo.get('picture')
            }
        }
        
    except ValueError:
        # Invalid token
        raise HTTPException(status_code=401, detail="Invalid Google Token")
    except Exception as e:
        # Note: If CLIENT_ID is wrong, it might throw an error here too
        print(f"Auth Error: {e}") 
        # If the user hasn't set the ID yet, we might want to bypass for demo purposes
        # Notes:
        # - If "Audience" error occurs, it means the token was issued for a different Client ID.
        # - Make sure the Frontend and Backend use the EXACT SAME Client ID.
             
        raise HTTPException(status_code=401, detail=f"Authentication Failed: {str(e)}")

# -----------------------------
# User History Implementation
# -----------------------------

class HistoryItem(BaseModel):
    email: str
    type: str  # 'prediction', 'calculation', 'compare'
    details: dict
    timestamp: float

@app.post("/history/add")
def add_history(item: HistoryItem):
    if item.email not in fake_users_db:
        raise HTTPException(status_code=404, detail="User not found")
    
    user_record = fake_users_db[item.email]
    if "history" not in user_record:
        user_record["history"] = []
    
    # Prepend to keep newest first (simple in-memory approach)
    user_record["history"].insert(0, item.dict())
    
    # Optional: Limit history size
    if len(user_record["history"]) > 50:
        user_record["history"] = user_record["history"][:50]
        
    return {"status": "success", "message": "History added"}

@app.get("/history/{email}")
def get_history(email: str):
    if email not in fake_users_db:
         # For demo, if user doesn't exist in DB (e.g. restart), return empty or error.
         # Returning empty to be safe if frontend has cached user state.
         return {"history": []}
         
    user_record = fake_users_db[email]
    return {"history": user_record.get("history", [])}

# -----------------------------

@app.get("/predict/{coin}/forecast")
def predict_forecast(coin: str, steps: int = 24):
    coin = coin.upper()
    try:
        # Steps capped at 168 (1 week) to prevent abuse
        steps = min(steps, 168)
        result = predictor.predict_forecast(coin, steps=steps)
        return result
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail=f"Data or Model for {coin} not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Simple in-memory cache for news
NEWS_CACHE = {}
CACHE_TTL = 600  # 10 minutes

@app.get("/news/{coin}")
def get_news(coin: str):
    import requests
    import time
    
    coin = coin.upper()
    current_time = time.time()
    
    # Check Cache
    if coin in NEWS_CACHE:
        timestamp, cached_data = NEWS_CACHE[coin]
        if current_time - timestamp < CACHE_TTL:
            return {"coin": coin, "news": cached_data, "source": "cache"}
            
    # Prepare Fetch
    def fetch_from_api(category):
        url = f"https://min-api.cryptocompare.com/data/v2/news/?lang=EN&categories={category}"
        try:
            response = requests.get(url, timeout=5)
            data = response.json()
            items = []
            if 'Data' in data:
                for item in data['Data'][:6]:
                    items.append({
                        "id": item.get('id'),
                        "title": item.get('title'),
                        "url": item.get('url'),
                        "image_url": item.get('imageurl'),
                        "source": item.get('source_info', {}).get('name'),
                        "published_on": item.get('published_on')
                    })
            return items
        except Exception as e:
            print(f"Error fetching news for {category}: {e}")
            return []

    # Primary Fetch
    news_items = fetch_from_api(coin)
    
    # Fallback if empty (try 'Market' or 'Trading' generic tags if specific coin has no news)
    if not news_items:
        print(f"No news for {coin}, fetching general Market news.")
        news_items = fetch_from_api("Market,Trading,Blockchain")
        
    # Update Cache
    if news_items:
        NEWS_CACHE[coin] = (current_time, news_items)
        
    return {"coin": coin, "news": news_items, "source": "api"}

# --- Static File Serving (SPA Support) ---

# Mount the static directory (the built React app)
app.mount("/assets", StaticFiles(directory="static/assets"), name="assets")

# Catch-all route to serve index.html for any path not matched by API
@app.get("/{full_path:path}")
async def serve_react_app(full_path: str):
    file_path = f"static/{full_path}"
    # If the file exists (e.g., favicon.ico), serve it
    if os.path.exists(file_path) and os.path.isfile(file_path):
        return FileResponse(file_path)
    # Otherwise, return index.html for client-side routing
    return FileResponse("static/index.html")
