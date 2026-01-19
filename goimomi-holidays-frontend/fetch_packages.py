import requests

try:
    resp = requests.get("http://localhost:8000/api/packages/")
    data = resp.json()
    for p in data:
        print(f"Title: {p.get('title')}, Category: '{p.get('category')}'")
except Exception as e:
    print(e)
