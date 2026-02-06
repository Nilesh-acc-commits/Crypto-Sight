import os
import time
import requests
import pandas as pd
from dotenv import load_dotenv

# --- Configuration ---
load_dotenv()
API_KEY = os.getenv("BINANCE_API_KEY") # Optional for public data
BASE_URL = "https://api.binance.com"

# Scripts are in Crypto-Sight/scripts/, Data is in Crypto-Sight/data/
DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data")
os.makedirs(DATA_DIR, exist_ok=True)

SYMBOLS = ["BTCUSDT", "ETHUSDT", "BNBUSDT", "ADAUSDT", "DOGEUSDT"]

def get_klines(symbol: str, interval: str, limit: int=1000, startTime: int=None) -> pd.DataFrame:
    """
    Fetches raw klines from Binance API v3.
    """
    url = BASE_URL + "/api/v3/klines"
    params = {
        "symbol": symbol,
        "interval": interval,
        "limit": limit
    }
    if startTime:
        params["startTime"] = startTime

    headers = {}
    if API_KEY:
        headers["X-MBX-APIKEY"] = API_KEY

    try:
        response = requests.get(url, params=params, headers=headers, timeout=10)
        response.raise_for_status()
        data = response.json()
    except Exception as e:
        print(f"Request failed: {e}")
        return pd.DataFrame()

    cols = [
        "open_time","open","high","low","close","volume",
        "close_time","quote_volume","trades",
        "taker_buy_base","taker_buy_quote","ignore"
    ]

    df = pd.DataFrame(data, columns=cols)
    if df.empty:
        return df

    # Convert timestamps and numeric types
    df["open_time"] = pd.to_datetime(df["open_time"], unit="ms")
    df["close_time"] = pd.to_datetime(df["close_time"], unit="ms")
    
    num_cols = ["open","high","low","close","volume","quote_volume"]
    df[num_cols] = df[num_cols].apply(pd.to_numeric)

    return df

def fetch_full_history(symbol: str, interval: str, years: int=3) -> pd.DataFrame:
    """
    Pagination loop to fetch long-term history.
    """
    end_ms = int(time.time() * 1000)
    start_ms = end_ms - years * 365 * 24 * 60 * 60 * 1000

    all_parts = []
    current_start = start_ms

    print(f"Downloading {interval} data for {symbol}...")
    
    while True:
        df = get_klines(symbol, interval, limit=1000, startTime=current_start)

        if df.empty:
            break

        all_parts.append(df)

        # Update start time for next batch
        last_close_ms = int(df["close_time"].iloc[-1].timestamp() * 1000)
        if last_close_ms >= end_ms:
            break

        current_start = last_close_ms + 1
        time.sleep(0.1)  # Respect rate limits

    if not all_parts:
        return pd.DataFrame()

    final_df = pd.concat(all_parts).drop_duplicates().sort_values("open_time")
    return final_df

def build_yearly(daily_df: pd.DataFrame) -> pd.DataFrame:
    """Resamples daily data to yearly candles (for macro view)."""
    df = daily_df.copy()
    df = df.set_index("open_time")

    yearly = df.resample("Y").agg({
        "open": "first",
        "high": "max",
        "low": "min",
        "close": "last",
        "volume": "sum"
    })
    return yearly.reset_index()

def fetch_for_all(years: int=3):
    print(f"\n--- Starting Data Ingestion ({years} years) ---\n")

    for symbol in SYMBOLS:
        print(f">> Processing {symbol}")

        # 1. Hourly Data (Core for ML)
        df_1h = fetch_full_history(symbol, "1h", years=years)
        if not df_1h.empty:
            path = os.path.join(DATA_DIR, f"{symbol}_1h.csv")
            df_1h.to_csv(path, index=False)
            print(f"   Saved {len(df_1h)} hourly records to {path}")

        # 2. Daily Data
        df_1d = fetch_full_history(symbol, "1d", years=years)
        if not df_1d.empty:
            path = os.path.join(DATA_DIR, f"{symbol}_1d.csv")
            df_1d.to_csv(path, index=False)
            print(f"   Saved {len(df_1d)} daily records to {path}")

            # 3. Yearly Data
            df_1y = build_yearly(df_1d)
            path_y = os.path.join(DATA_DIR, f"{symbol}_1y.csv")
            df_1y.to_csv(path_y, index=False)
            print(f"   Saved yearly records to {path_y}")
            
    print("\nData Ingestion Complete.")

if __name__ == "__main__":
    fetch_for_all(years=3)
