import requests

regions = ['.com', '.in', '.eu', '.com.au', '.jp', '.com.cn']

for reg in regions:
    url = f'https://accounts.zoho{reg}/oauth/v2/token'
    data = {
        'code': '1000.6291e205d22f60d6535942434cea8021.9c290474dec95d81c1eb3b5848ce138a',
        'client_id': '1000.2F40J9V1VKVIMY6356VKIQWC4VHCCX',
        'client_secret': '96f5000f2717f6ff123ed3f568b864997dc49bc9bb',
        'grant_type': 'authorization_code'
    }
    try:
        response = requests.post(url, data=data, timeout=5)
        print(f"Region: {reg} -> Status: {response.status_code}")
        print("Response JSON:", response.json())
    except Exception as e:
        print(f"Region: {reg} -> Exception: {e}")
