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

# --- Legacy Auth & History Removed (Migrated to Firebase) ---
# The frontend now handles Authentication (Firebase Auth) and History (Firebase Firestore) directly.
# This backend is now dedicated to ML Predictions and Data Processing.

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

def analyze_sentiment(text):
    """
    Simple heuristic-based sentiment analysis for crypto news.
    Returns: (sentiment: str, score: int)
    """
    text = text.lower()
    
    bullish_keywords = [
        "surge", "jump", "rally", "record", "high", "all-time high", "ath", 
        "adoption", "etf", "approve", "approval", "buy", "support", "bull", 
        "bullish", "gain", "success", "launch", "partnership", "upgrade", 
        "soar", "rocket", "breakout", "accumulate"
    ]
    
    bearish_keywords = [
        "crash", "drop", "fall", "dump", "ban", "regulation", "lawsuit", 
        "sue", "hack", "scam", "bear", "bearish", "loss", "fail", "delay", 
        "reject", "warning", "risk", "critical", "plunge", "collapse", 
        "correction", "investigation"
    ]
    
    score = 50  # Neutral base
    sentiment = "Neutral"
    
    # Calculate score adjustments
    bullish_count = sum(1 for word in bullish_keywords if word in text)
    bearish_count = sum(1 for word in bearish_keywords if word in text)
    
    if bullish_count > bearish_count:
        sentiment = "Bullish"
        score = min(95, 60 + (bullish_count * 10))
    elif bearish_count > bullish_count:
        sentiment = "Bearish"
        score = max(15, 40 - (bearish_count * 10))
    
    # Determine strength based on keywords
    if "record" in text or "crash" in text or "hack" in text or "etf" in text:
        if sentiment == "Bullish": score = min(98, score + 10)
        elif sentiment == "Bearish": score = max(10, score - 10)

    return sentiment, score

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
                        "published_on": item.get('published_on'),
                        "body": item.get('body', '')  # Get body for analysis
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
        # Perform Sentiment Analysis
        for item in news_items:
            # Analyze combined title and body for better context
            full_text = f"{item['title']} {item.get('body', '')}"
            sentiment, score = analyze_sentiment(full_text)
            item['sentiment'] = sentiment
            item['impact_score'] = score
            
        NEWS_CACHE[coin] = (current_time, news_items)
        
    return {"coin": coin, "news": news_items, "source": "api"}

# --- Static File Serving (SPA Support) ---

# Only mount static files if the directory exists (for production deployment)
if os.path.exists("static/assets"):
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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
