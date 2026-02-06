import pandas as pd
import numpy as np
import joblib
import os
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import timedelta

# --- Configuration ---
# Scripts are in Crypto-Sight/scripts/, Data in Crypto-Sight/data/, Models in Crypto-Sight/models/
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, 'data')
MODELS_DIR = os.path.join(BASE_DIR, 'models')
PLOTS_DIR = os.path.join(BASE_DIR, 'scripts', 'plots')
os.makedirs(PLOTS_DIR, exist_ok=True)

COINS = ['ADA', 'BNB', 'BTC', 'DOGE', 'ETH']
USD_TO_INR = 90.0

def prepare_features(df: pd.DataFrame):
    """
    Feature engineering logic. Must match predictor.py EXACTLY.
    """
    df = df.copy()
    df['close'] = df['close'].astype(float)
    
    # 1. Moving Averages & RSI
    df['SMA_20'] = df['close'].rolling(20).mean()
    delta = df['close'].diff()
    gain = (delta.where(delta > 0, 0)).rolling(14).mean()
    loss = (-delta.where(delta < 0, 0)).rolling(14).mean()
    rs = gain / loss
    df['RSI_14'] = 100 - (100 / (1 + rs))
    
    # 2. Lag Features
    for lag in [1, 2, 3, 7]:
        df[f'close_lag_{lag}'] = df['close'].shift(lag)
        
    # 3. Volatility
    df['volatility_20'] = df['close'].rolling(20).std()

    # 4. MACD
    exp1 = df['close'].ewm(span=12, adjust=False).mean()
    exp2 = df['close'].ewm(span=26, adjust=False).mean()
    df['MACD'] = exp1 - exp2
    df['MACD_signal'] = df['MACD'].ewm(span=9, adjust=False).mean()
    df['MACD_hist'] = df['MACD'] - df['MACD_signal']

    # 5. Bollinger Bands
    df['BB_upper'] = df['SMA_20'] + (df['volatility_20'] * 2)
    df['BB_lower'] = df['SMA_20'] - (df['volatility_20'] * 2)
    df['BB_width'] = (df['BB_upper'] - df['BB_lower']) / df['SMA_20']

    # 6. ATR
    high_low = df['high'] - df['low']
    high_close = np.abs(df['high'] - df['close'].shift())
    low_close = np.abs(df['low'] - df['close'].shift())
    ranges = pd.concat([high_low, high_close, low_close], axis=1)
    true_range = np.max(ranges, axis=1)
    df['ATR'] = true_range.rolling(14).mean()

    # 7. OBV
    df['OBV'] = (np.sign(df['close'].diff()) * df['volume']).fillna(0).cumsum()
    
    df_clean = df.dropna().reset_index(drop=True)
    
    feature_cols = ['SMA_20', 'RSI_14', 'volatility_20', 'close_lag_1', 'close_lag_2', 'close_lag_3', 'close_lag_7',
                    'MACD', 'MACD_signal', 'MACD_hist', 'BB_upper', 'BB_lower', 'BB_width', 'ATR', 'OBV']
    
    return df_clean, feature_cols

def visualize_coin(coin: str):
    print(f">> Visualizing {coin}...")
    
    data_path = os.path.join(DATA_DIR, f"{coin}_ML_ready.csv")
    model_path = os.path.join(MODELS_DIR, coin, 'LinearRegression_model.pkl')
    scaler_path = os.path.join(MODELS_DIR, coin, 'scaler.pkl')
    
    if not os.path.exists(data_path):
        print(f"   [!] Data missing: {data_path}")
        return
    if not os.path.exists(model_path):
        print(f"   [!] Model missing: {model_path}")
        return

    # Load Data
    df = pd.read_csv(data_path)
    if 'open_time' in df.columns:
        df['open_time'] = pd.to_datetime(df['open_time'])
    
    # Feature Engineering
    df_proc, feature_cols = prepare_features(df)
    
    if df_proc.empty:
        print(f"   [!] Not enough data features")
        return

    # Load Model
    try:
        model = joblib.load(model_path)
        scaler = joblib.load(scaler_path)
    except Exception as e:
        print(f"   [!] Load error: {e}")
        return
    
    # Predict on LAST row
    last_row_features = df_proc[feature_cols].iloc[-1].values.reshape(1, -1)
    
    try:
        last_row_scaled = scaler.transform(last_row_features)
        pred_price_usd = model.predict(last_row_scaled)[0]
    except Exception as e:
        print(f"   [!] Prediction error: {e}")
        return
    
    # --- Visualization ---
    plt.figure(figsize=(12, 6))
    
    # Plot last 100 points
    plot_df = df.iloc[-100:].copy()
    
    # Get last actual price BEFORE conversion
    last_price_usd = plot_df['close'].iloc[-1]
    last_time = plot_df['open_time'].iloc[-1] if 'open_time' in plot_df.columns else len(plot_df)

    # Convert to INR
    plot_df['close_inr'] = plot_df['close'] * USD_TO_INR
    pred_price_inr = pred_price_usd * USD_TO_INR
    last_price_inr = last_price_usd * USD_TO_INR
    
    x_axis = plot_df['open_time'] if 'open_time' in plot_df.columns else range(len(plot_df))
    
    # Historical Line
    plt.plot(x_axis, plot_df['close_inr'], label='Historical (INR)', color='#3B82F6', linewidth=2)
    
    # Prediction Point
    next_time = last_time + timedelta(hours=1) if isinstance(last_time, pd.Timestamp) else last_time + 1
    
    plt.scatter(next_time, pred_price_inr, color='#EF4444', s=100, label=f'Forecast: ₹{pred_price_inr:,.2f}', zorder=5)
    
    # Dotted Connection Line
    plt.plot([last_time, next_time], [last_price_inr, pred_price_inr], color='#EF4444', linestyle='--', alpha=0.7)
    
    # Annotation
    pct_change = (pred_price_usd - last_price_usd) / last_price_usd * 100
    change_str = f"{pct_change:+.2f}%"
    plt.text(next_time, pred_price_inr, f"  {change_str}", verticalalignment='center', fontweight='bold')

    plt.title(f'{coin} Price Forecast (1 Hour Ahead)', fontsize=14)
    plt.xlabel('Time')
    plt.ylabel('Price (INR)')
    plt.legend()
    plt.grid(True, alpha=0.3)
    plt.tight_layout()
    
    save_path = os.path.join(PLOTS_DIR, f"{coin}_prediction.png")
    plt.savefig(save_path)
    plt.close()
    print(f"   Saved plot to {save_path}")

if __name__ == "__main__":
    sns.set_style("whitegrid")
    print(f"Generating predictions for {len(COINS)} coins...")
    for coin in COINS:
        visualize_coin(coin)
    print("Done.")
