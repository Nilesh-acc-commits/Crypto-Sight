import sys
import os

# Ensure backend directory is in path
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(current_dir)

from predictor import Predictor

def test_predictor():
    print("Initializing Predictor...")
    try:
        p = Predictor()
        print("Predictor initialized.")
        
        coin = "BTC"
        print(f"Testing prediction for {coin}...")
        
        # Test 1: Get latest features
        features = p.get_latest_features(coin)
        print(f"Latest features for {coin}: OK")
        
        # Test 2: Predict price
        price = p.predict(coin, features)
        print(f"Predicted Price for {coin}: {price}")
        
    except Exception as e:
        print(f"ERROR: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_predictor()
