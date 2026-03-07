import requests
import json

try:
    response = requests.get("http://127.0.0.1:8000/api/vehicle-brands/")
    print(f"Status Code: {response.status_code}")
    data = response.json()
    print(f"Count: {len(data)}")
    if data:
        print(f"First item: {data[0]}")
except Exception as e:
    print(f"Error: {e}")
