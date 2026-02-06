# CryptoSight 
## AI-Driven Cryptocurrency Forecasting Platform

CryptoSight is a cutting-edge cryptocurrency forecasting application that leverages machine learning to predict price trends for major cryptocurrencies. By combining real-time market data with advanced regression models, CryptoSight provides users with actionable insights through an immersive, interactive dashboard.

---

## 🌟 Key Features

*   **Real-Time Forecasting**: Generates instant price predictions for **5 Major Cryptocurrencies**: Bitcoin (BTC), Ethereum (ETH), Binance Coin (BNB), Cardano (ADA), and Dogecoin (DOGE). (Currently limited to these assets).
*   **Interactive Dashboard**: A responsive, futuristic UI featuring 3D backgrounds (Vanta.js) and dynamic data visualization.
*   **Machine Learning Engine**: Utilizes Scikit-Learn Linear Regression models trained on historical binance data, featuring advanced technical indicators (RSI, MACD, Bollinger Bands, ATR).
*   **Secure Authentication**: Integrated Google OAuth2 login for secure user access and session management.
*   **Iterative Forecasting**: Capable of generating multi-step forecasts up to 7 days into the future.
*   **News Integration**: Aggregates relevant crypto news to provide context for market movements.
*   **User History**: Tracks user activity and prediction requests (Session-based demo).

---

## 🛠 Technology Stack

### Frontend (User Interface)
*   **Framework**: React 18 + Vite
*   **Styling**: TailwindCSS, CSS Modules
*   **Visuals**: Vanta.js (3D Backgrounds), Framer Motion (Animations), Recharts (Charts)
*   **State Management**: React Hooks & Context API

### Backend (API & Inference)
*   **Server**: FastAPI (Python 3.x)
*   **Machine Learning**: Scikit-Learn, Pandas, NumPy, Joblib
*   **Data Source**: Binance API (Real-time OHLCV data)
*   **Authentication**: Google OAuth2 (Google Identity Services)
*   **Utilities**: Requests, Pydantic

---

## 📂 Project Structure

```bash
CryptoSight/
├── backend/                # FastAPI Server & ML Logic
│   ├── app.py              # Main API entry point and endpoints
│   ├── predictor.py        # ML Inference Engine & Feature Engineering
│   ├── schemas.py          # Pydantic data models for request/response
│   └── models/             # Pre-trained .pkl models and scalers for each coin
├── frontend/               # React Application
│   ├── src/                # Source code (Components, Pages, Context, Assets)
│   ├── public/             # Static assets
│   └── vite.config.js      # Vite configuration
├── data/                   # Fallback CSV datasets for offline inference
├── notebooks/              # Jupyter Notebooks for analysis and training
├── scripts/                # Utility scripts (Data fetching, visualization)
└── README.md               # Project documentation
```

---

## 🚀 Installation & Setup Guide

Follow these steps to deploy the application locally.

### Prerequisites
*   **Python 3.8+**
*   **Node.js 16+** & **npm**

### 1. Backend Setup

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Install the required Python dependencies:
    > **Tip:** We recommend using a virtual environment (`python -m venv venv`) to isolate dependencies.
    ```bash
    pip install -r requirements.txt
    ```
3.  Start the FastAPI server:
    ```bash
    uvicorn app:app --reload
    ```
    *   The server will start at `http://127.0.0.1:8000`.
    *   Interactive API Docs available at `http://127.0.0.1:8000/docs`.

### 2. Frontend Setup

1.  Open a new terminal and navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install Node.js dependencies:
    > **Important:** The `node_modules` folder is **not included** in the submission. You must run this command to download the necessary packages.
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
    *   The application will launch at `http://localhost:5173`.

---

## � API Documentation

The backend exposes a RESTful API. Below are the key endpoints:

### Inference Endpoints
*   **`GET /predict/{coin}/latest`**: Fetches the latest market data for a specific coin (e.g., BTC, ETH) and returns a real-time price prediction.
*   **`GET /predict/{coin}/forecast?steps=24`**: Generates an iterative forecast for the next N hours (default 24).
*   **`POST /predict/{coin}`**: Custom prediction endpoint accepting a JSON payload of technical indicators.

### User & Utility Endpoints
*   **`POST /auth/google`**: Handles Google Login token verification.
*   **`GET /history/{email}`**: Retrieves user activity history.
*   **`GET /news/{coin}`**: Fetches the latest related news for a cryptocurrency.
*   **`GET /health`**: System health check.

---

## ⚠️ Important Configuration Notes

1.  **Port Requirement**:
    The Frontend application is configured to run specifically on **port 5173** to ensure correct CORS communication with the Google Auth services.
    *   Ensure `http://localhost:5173` is available.
    *   The backend is configured to accept requests from this origin.

2.  **Data Fallbacks**:
    The system is designed to be robust. If the Binance API is unreachable (e.g., due to rate limits or connectivity issues), the `Predictor` class automatically switches to using local CSV data in the `data/` folder to ensure the demo continues to function smoothly.
    

---

*Built with ❤️ for the Future of Finance.*
