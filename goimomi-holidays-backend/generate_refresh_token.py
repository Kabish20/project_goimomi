import os
import django
import requests

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
try:
    django.setup()
    from django.conf import settings
    
    client_id = getattr(settings, 'ZOHO_PAYMENTS_CLIENT_ID', '')
    client_secret = getattr(settings, 'ZOHO_PAYMENTS_CLIENT_SECRET', '')
    account_id = getattr(settings, 'ZOHO_PAYMENTS_ACCOUNT_ID', '')
    redirect_uri = getattr(settings, 'ZOHO_PAYMENTS_REDIRECT_URI', 'https://goimomi.com')
    edition_str = getattr(settings, 'ZOHO_PAYMENTS_EDITION', 'IN_SANDBOX').upper()
except Exception:
    # Fallback to manual reading of env file
    print("Django setup not ready; reading .env files manually...")
    client_id = ""
    client_secret = ""
    account_id = ""
    redirect_uri = "https://goimomi.com"
    edition_str = "IN_SANDBOX"
    
    env_path = os.path.join(os.path.dirname(__file__), ".env")
    if os.path.exists(env_path):
        with open(env_path, 'r') as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith('#'):
                    continue
                if '=' in line:
                    k, v = line.split('=', 1)
                    k = k.strip()
                    v = v.strip().strip("'").strip('"')
                    if k == 'ZOHO_PAYMENTS_CLIENT_ID':
                        client_id = v
                    elif k == 'ZOHO_PAYMENTS_CLIENT_SECRET':
                        client_secret = v
                    elif k == 'ZOHO_PAYMENTS_ACCOUNT_ID':
                        account_id = v
                    elif k == 'ZOHO_PAYMENTS_REDIRECT_URI':
                        redirect_uri = v
                    elif k == 'ZOHO_PAYMENTS_EDITION':
                        edition_str = v.upper()

# Configure endpoints based on Edition
is_sandbox = "SANDBOX" in edition_str

if "US" in edition_str:
    accounts_url = "https://accounts.zoho.com"
else:
    accounts_url = "https://accounts.zoho.in"

if is_sandbox:
    scope = "ZohoPaySandbox.payments.CREATE,ZohoPaySandbox.payments.READ,ZohoPaySandbox.payments.UPDATE"
    soid = f"zohopaysandbox.{account_id}"
else:
    scope = "ZohoPay.payments.CREATE,ZohoPay.payments.READ,ZohoPay.payments.UPDATE"
    soid = f"zohopay.{account_id}"

print("\n=======================================================")
print("  ZOHO PAYMENTS REFRESH TOKEN GENERATOR")
print("=======================================================")
print(f"Edition: {edition_str}")
print(f"Client ID: {client_id}")
print(f"Account ID: {account_id}")
print(f"Redirect URI: {redirect_uri}")
print(f"Target Accounts URL: {accounts_url}")
print("=======================================================\n")

if not client_id or not client_secret or not account_id:
    print("ERROR: Please configure ZOHO_PAYMENTS_CLIENT_ID, ZOHO_PAYMENTS_CLIENT_SECRET, and ZOHO_PAYMENTS_ACCOUNT_ID in your .env file.")
    exit(1)

# Construct auth url
auth_url = (
    f"{accounts_url}/oauth/v2/org/auth"
    f"?scope={scope}"
    f"&client_id={client_id}"
    f"&soid={soid}"
    f"&state=generate_refresh_token"
    f"&response_type=code"
    f"&redirect_uri={redirect_uri}"
    f"&access_type=offline"
    f"&prompt=consent"
)

print("STEP 1: Open the following URL in your web browser and click 'Accept' to authorize:")
print("-" * 80)
print(auth_url)
print("-" * 80)
print("\nSTEP 2: After accepting, you will be redirected to your Redirect URI.")
print("Copy the value of the 'code' parameter from the redirected browser URL bar.")
print("Example redirected URL: https://goimomi.com/?code=1000.xxxxxxxxx.xxxxxxxxx&state=...")
print("-" * 80)

code = input("\nEnter the copied 'code' parameter value here: ").strip()

if not code:
    print("ERROR: Code cannot be empty.")
    exit(1)

# Exchange code for refresh token
print("\nSTEP 3: Exchanging authorization code for tokens...")
token_url = f"{accounts_url}/oauth/v2/token"
payload = {
    'code': code,
    'client_id': client_id,
    'client_secret': client_secret,
    'redirect_uri': redirect_uri,
    'grant_type': 'authorization_code'
}

response = requests.post(token_url, data=payload)
data = response.json()

if response.status_code == 200 and 'refresh_token' in data:
    refresh_token = data['refresh_token']
    access_token = data.get('access_token', 'N/A')
    print("\nSUCCESS!")
    print(f"Refresh Token: {refresh_token}")
    print(f"Access Token: {access_token}")
    print("\n=======================================================")
    
    # Optional auto-update
    auto_update = input("Would you like to write this new refresh token to your .env files? (y/n): ").strip().lower()
    if auto_update == 'y':
        # Update helper function
        def update_env(file_path):
            if not os.path.exists(file_path):
                return False
            with open(file_path, 'r') as f:
                lines = f.readlines()
            updated = False
            for idx, line in enumerate(lines):
                if line.startswith('ZOHO_PAYMENTS_REFRESH_TOKEN='):
                    lines[idx] = f"ZOHO_PAYMENTS_REFRESH_TOKEN={refresh_token}\n"
                    updated = True
                    break
            if not updated:
                lines.append(f"ZOHO_PAYMENTS_REFRESH_TOKEN={refresh_token}\n")
            with open(file_path, 'w') as f:
                f.writelines(lines)
            return True

        backend_env = os.path.join(os.path.dirname(__file__), ".env")
        root_env = os.path.join(os.path.dirname(__file__), "..", ".env")
        
        if update_env(backend_env):
            print(f"Updated: {backend_env}")
        if update_env(root_env):
            print(f"Updated: {root_env}")
        print("\nAll done! You can now test client connectivity.")
else:
    print(f"\nFAILED to exchange code: HTTP {response.status_code}")
    print("Response:", data)
