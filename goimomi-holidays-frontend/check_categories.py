import json

try:
    with open('packages.json', 'r', encoding='utf-16-le') as f:
        data = json.load(f)
except:
    with open('packages.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

for p in data:
    print(f"Title: {p.get('title')}, Category: '{p.get('category')}'")
