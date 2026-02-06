import requests
import json

# Test the API endpoint
url = "http://127.0.0.1:8000/predict/BNB/forecast?steps=24"
print(f"Testing: {url}\n")

try:
    response = requests.get(url, timeout=30)
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print(f"\nResponse Keys: {data.keys()}")
        print(f"Coin: {data.get('coin')}")
        print(f"Current Price: {data.get('current_price')}")
        print(f"Forecast Length: {len(data.get('forecast', []))}")
        
        if data.get('forecast'):
            print(f"First Forecast: {data['forecast'][0]}")
        
        if data.get('technical_indicators'):
            print(f"\nTechnical Indicators:")
            for key, value in data['technical_indicators'].items():
                print(f"  {key}: {value}")
        
        # Pretty print first part of response
        print(f"\nFull Response (first 500 chars):")
        print(json.dumps(data, indent=2)[:500])
    else:
        print(f"Error: {response.text}")
        
except Exception as e:
    print(f"Exception: {e}")
