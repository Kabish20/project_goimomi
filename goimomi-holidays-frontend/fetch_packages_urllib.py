import urllib.request
import json

try:
    with urllib.request.urlopen("http://localhost:8000/api/packages/") as url:
        data = json.loads(url.read().decode())
        for p in data:
            print(f"Title: {p.get('title')}, Category: '{p.get('category')}'")
except Exception as e:
    print(f"Error: {e}")
