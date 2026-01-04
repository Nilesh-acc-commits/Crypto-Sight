from pydantic import BaseModel
from typing import Dict, Any

class PredictionRequest(BaseModel):
    # Defining specific fields helps with documentation and validation
    # Features derived from visualize_predictions.py
    SMA_20: float
    RSI_14: float
    volatility_20: float
    close_lag_1: float
    close_lag_2: float
    close_lag_3: float
    close_lag_7: float
    MACD: float
    MACD_signal: float
    MACD_hist: float
    BB_upper: float
    BB_lower: float
    BB_width: float
    ATR: float
    OBV: float

class PredictionResponse(BaseModel):
    coin: str
    predicted_price: float
