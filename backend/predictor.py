import joblib
import os
import numpy as np
import pandas as pd
from datetime import timedelta
import io
import requests
from typing import Tuple, List, Dict

# Define paths relative to this file
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODELS_DIR = os.path.join(BASE_DIR, 'models')
DATA_DIR = os.path.join(BASE_DIR, 'data')

class Predictor:
    def __init__(self):
        self.models = {}
        self.scalers = {}

    def _load_artifacts(self, coin: str) -> None:
        """Loads model and scaler for a specific coin if not already loaded."""
        if coin in self.models and coin in self.scalers:
            return

        model_path = os.path.join(MODELS_DIR, coin, 'LinearRegression_model.pkl')
        scaler_path = os.path.join(MODELS_DIR, coin, 'scaler.pkl')

        if not os.path.exists(model_path) or not os.path.exists(scaler_path):
            raise FileNotFoundError(f"Model or scaler not found for {coin}")

        # print(f"Loading model and scaler for {coin}...")
        self.models[coin] = joblib.load(model_path)
        self.scalers[coin] = joblib.load(scaler_path)

    def _fetch_binance_data(self, coin: str) -> pd.DataFrame:
        """
        Fetches the last 500 hours of OHLCV data from Binance for feature calculation.
        """
        symbol = f"{coin}USDT"
        url = "https://api.binance.com/api/v3/klines"
        params = {
            "symbol": symbol,
            "interval": "1h",
            "limit": 500  # Ensure enough data for rolling windows (20, 26, etc.)
        }
        
        try:
            response = requests.get(url, params=params, timeout=5)
            response.raise_for_status()
            data = response.json()
            
            # Binance response: [Open time, Open, High, Low, Close, Volume, ...]
            # We only need first 6 columns
            df = pd.DataFrame(data, columns=[
                'open_time', 'open', 'high', 'low', 'close', 'volume',
                'close_time', 'quote_asset_volume', 'number_of_trades',
                'taker_buy_base_asset_volume', 'taker_buy_quote_asset_volume', 'ignore'
            ])
            
            # Filter and convert types
            df = df[['open_time', 'open', 'high', 'low', 'close', 'volume']]
            df['open_time'] = pd.to_datetime(df['open_time'], unit='ms')
            for col in ['open', 'high', 'low', 'close', 'volume']:
                df[col] = df[col].astype(float)
                
            return df
            
        except requests.RequestException as e:
            print(f"Error fetching data from Binance: {e}")
            return pd.DataFrame() # Empty DataFrame indicates failure

    def _prepare_features(self, df: pd.DataFrame) -> Tuple[pd.DataFrame, list]:
        """
        Replicates the feature engineering logic from visualize_predictions.py
        to ensure the model gets the exact same input structure.
        """
        # Ensure close is float
        df = df.copy()
        df['close'] = df['close'].astype(float)
        
        # SMA & RSI
        df['SMA_20'] = df['close'].rolling(20).mean()
        delta = df['close'].diff()
        gain = (delta.where(delta > 0, 0)).rolling(14).mean()
        loss = (-delta.where(delta < 0, 0)).rolling(14).mean()
        rs = gain / loss
        df['RSI_14'] = 100 - (100 / (1 + rs))
        
        # Lags
        for lag in [1, 2, 3, 7]:
            df[f'close_lag_{lag}'] = df['close'].shift(lag)
            
        # Volatility
        df['volatility_20'] = df['close'].rolling(20).std()

        # MACD (12, 26, 9)
        exp1 = df['close'].ewm(span=12, adjust=False).mean()
        exp2 = df['close'].ewm(span=26, adjust=False).mean()
        df['MACD'] = exp1 - exp2
        df['MACD_signal'] = df['MACD'].ewm(span=9, adjust=False).mean()
        df['MACD_hist'] = df['MACD'] - df['MACD_signal']

        # Bollinger Bands (20, 2)
        df['BB_upper'] = df['SMA_20'] + (df['volatility_20'] * 2)
        df['BB_lower'] = df['SMA_20'] - (df['volatility_20'] * 2)
        df['BB_width'] = (df['BB_upper'] - df['BB_lower']) / df['SMA_20']

        # ATR (14)
        high_low = df['high'] - df['low']
        high_close = np.abs(df['high'] - df['close'].shift())
        low_close = np.abs(df['low'] - df['close'].shift())
        ranges = pd.concat([high_low, high_close, low_close], axis=1)
        true_range = np.max(ranges, axis=1)
        df['ATR'] = true_range.rolling(14).mean()

        # OBV
        df['OBV'] = (np.sign(df['close'].diff()) * df['volume']).fillna(0).cumsum()
        
        # Drop NaNs created by rolling/shifting
        # IMPORTANT: For iterative prediction, we don't want to drop rows until the end
        # But to match the return signature, we'll return the full df with NaNs and let caller handle
        feature_cols = ['SMA_20', 'RSI_14', 'volatility_20', 'close_lag_1', 'close_lag_2', 'close_lag_3', 'close_lag_7',
                        'MACD', 'MACD_signal', 'MACD_hist', 'BB_upper', 'BB_lower', 'BB_width', 'ATR', 'OBV']
        
        return df, feature_cols

    def get_latest_features(self, coin: str) -> dict:
        """
        Reads the CSV data for the coin, computes features, and returns the last row.
        """
        # 1. Try fetching from Binance first
        df = self._fetch_binance_data(coin)
        
        # 2. Fallback to local CSV if Binance fails
        if df.empty:
            data_path = os.path.join(DATA_DIR, f"{coin}_ML_ready.csv")
            if not os.path.exists(data_path):
                raise FileNotFoundError(f"Data file not found: {data_path}")
            df = pd.read_csv(data_path)
            
        # We need enough history to calculate rolling features (SMA 20, etc.)
        # Passing strict=False to _prepare_features if needed, but here we just pass the whole df
        df_proc, feature_cols = self._prepare_features(df)
        
        if df_proc.empty:
             raise ValueError("Not enough data to calculate features")

        # Get the last row
        last_row = df_proc.iloc[-1]
        
        # Convert to dict for the generic predict method
        features = {col: last_row[col] for col in feature_cols}
        return features

    def predict_forecast(self, coin: str, steps: int = 24) -> Dict:
        """
        Generates an iterative forecast for the next `steps` hours.
        Returns dictionary with historical data and forecast data.
        """
        # 1. Try fetching from Binance first
        df = self._fetch_binance_data(coin)
        
        # 2. Fallback to local CSV if Binance fails
        if df.empty:
            data_path = os.path.join(DATA_DIR, f"{coin}_ML_ready.csv")
            if not os.path.exists(data_path):
                raise FileNotFoundError(f"Data file not found: {data_path}")
            # print(f"Using local CSV data for {coin}")
            df = pd.read_csv(data_path)
            if 'open_time' in df.columns:
                df['open_time'] = pd.to_datetime(df['open_time'])
        
        # Prepare for iteration
        forecast = []
        
        # We need a working dataframe that we append to
        # To avoid performance issues with huge DF, we validly only need the last ~100 rows 
        # to calculate window features like SMA_20, RSI_14, MACD(26).
        # Let's keep last 200 for safety.
        working_df = df.tail(200).copy().reset_index(drop=True)
        
        # Get latest actual price
        current_price = float(working_df['close'].iloc[-1])
        last_time = working_df['open_time'].iloc[-1] if 'open_time' in working_df.columns else pd.Timestamp.now()

        # Iterative Prediction Loop
        for i in range(steps):
            # 1. Feature Engineering on current state
            df_proc, feature_cols = self._prepare_features(working_df)
            
            # Check if we have valid features for the last row
            last_row = df_proc.iloc[-1]
            if last_row[feature_cols].isnull().any():
               # Should not happen if we have enough history
               break
               
            features = {col: last_row[col] for col in feature_cols}
            
            # 2. Predict next price
            # We predict in USD (model output)
            pred_price_usd = self.predict(coin, features)
            
            # 3. Append prediction to working_df to support next step
            next_time = last_time + timedelta(hours=i+1)
            
            # We need to construct a new row. 
            # Most columns like open, high, low, volume are not predicted by our simple model.
            # For the sake of feature engineering (SMA, RSI), we essentially assume 
            # the price stays at 'close'. 
            # Approximations: High=Low=Close=Pred, Volume=Last Volume (naive)
            new_row = {
                'open_time': next_time,
                'open': pred_price_usd,
                'high': pred_price_usd,
                'low': pred_price_usd,
                'close': pred_price_usd,
                'volume': working_df['volume'].iloc[-1] # Carry forward volume
            }
            
            # Append using loc (faster than concat for single row usually, or just concat)
            working_df = pd.concat([working_df, pd.DataFrame([new_row])], ignore_index=True)
            
            forecast.append({
                "time": next_time.isoformat(),
                "price": pred_price_usd
            })
            
        # Prepare return data
        # Historical (last 24 hours)
        history_df = df.tail(24)
        history = []
        for _, row in history_df.iterrows():
            history.append({
                "time": row['open_time'].isoformat() if 'open_time' in row else str(row.name),
                "price": float(row['close'])
            })
            
        # Extract latest technical indicators from the current state
        # (calculated from the full dataframe before forecasting loop starts)
        latest_features = self.get_latest_features(coin)
        
        return {
            "coin": coin,
            "current_price": current_price,
            "history": history,
            "forecast": forecast,
            "technical_indicators": {
                "rsi": float(latest_features.get('RSI_14', 50)),
                "volatility": float(latest_features.get('volatility_20', 0)),
                "macd_hist": float(latest_features.get('MACD_hist', 0)),
                "bb_width": float(latest_features.get('BB_width', 0))
            }
        }

    def predict(self, coin: str, features: dict) -> float:
        """
        Loads the model for the coin, scales the input, and predicts the price.
        """
        self._load_artifacts(coin)
        
        feature_order = [
            'SMA_20', 'RSI_14', 'volatility_20', 'close_lag_1', 'close_lag_2', 
            'close_lag_3', 'close_lag_7', 'MACD', 'MACD_signal', 'MACD_hist', 
            'BB_upper', 'BB_lower', 'BB_width', 'ATR', 'OBV'
        ]
        
        try:
            input_values = [features[f] for f in feature_order]
        except KeyError as e:
            raise ValueError(f"Missing feature: {e}")

        # Reshape for scaler (1 sample, n features)
        input_array = np.array(input_values).reshape(1, -1)
        
        # Scale
        scaler = self.scalers[coin]
        scaled_input = scaler.transform(input_array)
        
        # Predict
        model = self.models[coin]
        prediction = model.predict(scaled_input)
        
        return float(prediction[0])
