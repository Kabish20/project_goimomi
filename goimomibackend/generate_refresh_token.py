import os
import requests

# Read .env file manually
env_path = os.path.join(os.path.dirname(__file__), ".env")
env_vars = {}
if os.path.exists(env_path):
    with open(env_path, 'r') as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith('#'):
                continue
            if '=' in line:
                k, v = line.split('=', 1)
                env_vars[k.strip()] = v.strip().strip("'").strip('"')

client_id     = env_vars.get('ZOHO_PAYMENTS_CLIENT_ID', '')
client_secret = env_vars.get('ZOHO_PAYMENTS_CLIENT_SECRET', '')
redirect_uri  = env_vars.get('ZOHO_PAYMENTS_REDIRECT_URI', 'https://www.goimomi.com/')
edition_str   = env_vars.get('ZOHO_PAYMENTS_EDITION', 'IN').upper()
account_id    = env_vars.get('ZOHO_PAYMENTS_ACCOUNT_ID', '')

is_sandbox   = 'SANDBOX' in edition_str
accounts_url = 'https://accounts.zoho.com' if 'US' in edition_str else 'https://accounts.zoho.in'

if is_sandbox:
    scope = 'ZohoPaySandbox.payments.CREATE,ZohoPaySandbox.payments.READ,ZohoPaySandbox.payments.UPDATE'
else:
    scope = 'ZohoPay.payments.CREATE,ZohoPay.payments.READ,ZohoPay.payments.UPDATE'

print('\n=======================================================')
print('  ZOHO PAYMENTS REFRESH TOKEN GENERATOR')
print('  Method: Self Client (Recommended for Server Apps)')
print('=======================================================')
print(f'Edition     : {edition_str}')
print(f'Client ID   : {client_id}')
print(f'Account ID  : {account_id}')
print(f'Scope       : {scope}')
print('=======================================================\n')

print('STEP 1 — Open in browser (logged in as ceo@goimomi.com):')
print('  https://api-console.zoho.in/')
print()
print('STEP 2 — Click on your OAuth client:')
print(f'  Client ID: {client_id}')
print()
print('STEP 3 — Click the "Self Client" tab (top menu bar)')
print()
print('STEP 4 — In the "Generate Code" section enter:')
print(f'  Scope         : {scope}')
print('  Time Duration : 10 minutes')
print()
print('STEP 5 - Click "Create" -> Copy the one-time Grant Token shown')
print('-' * 60)

grant_token = input('\nPaste the Grant Token here: ').strip()

if not grant_token:
    print('ERROR: Grant token cannot be empty.')
    exit(1)

print('\nExchanging grant token for access + refresh tokens...')

token_url = f'{accounts_url}/oauth/v2/token'
payload = {
    'code':          grant_token,
    'client_id':     client_id,
    'client_secret': client_secret,
    'grant_type':    'authorization_code',
    # Note: redirect_uri is intentionally omitted for Self Client grant tokens
}

response = requests.post(token_url, data=payload)
data = response.json()

print(f'\nHTTP Status : {response.status_code}')
print(f'Response    : {data}')

if response.status_code == 200 and 'refresh_token' in data:
    refresh_token = data['refresh_token']
    access_token  = data.get('access_token', 'N/A')
    token_scope   = data.get('scope', 'N/A')

    print('\n SUCCESS!')
    print(f'   Refresh Token : {refresh_token}')
    print(f'   Access Token  : {access_token}')
    print(f'   Scope         : {token_scope}')
    print('=======================================================')

    save = input('\nSave this refresh token to .env automatically? (y/n): ').strip().lower()
    if save == 'y':
        lines = []
        with open(env_path, 'r') as f:
            lines = f.readlines()
        updated = False
        for i, line in enumerate(lines):
            if line.startswith('ZOHO_PAYMENTS_REFRESH_TOKEN='):
                lines[i] = f'ZOHO_PAYMENTS_REFRESH_TOKEN={refresh_token}\n'
                updated = True
                break
        if not updated:
            lines.append(f'ZOHO_PAYMENTS_REFRESH_TOKEN={refresh_token}\n')
        with open(env_path, 'w') as f:
            f.writelines(lines)
        print(f'\n .env updated successfully!')
        print(f'   ZOHO_PAYMENTS_REFRESH_TOKEN={refresh_token}')
        print('\nNext: Restart Django and clear token cache:')
        print('  python manage.py shell -c "from Holidays.services.zoho_payment import ZohoPaymentService; ZohoPaymentService.clear_token_cache()"')
    else:
        print(f'\nManually add to .env:')
        print(f'ZOHO_PAYMENTS_REFRESH_TOKEN={refresh_token}')

elif response.status_code == 200 and 'access_token' in data:
    print('\n Got access_token but NO refresh_token.')
    print('This means "Self Client" grant type is not enabled for this OAuth client.')
    print('\nFix in Zoho API Console:')
    print('  1. Open your client: https://api-console.zoho.in/')
    print('  2. Click Edit on your client')
    print('  3. Make sure "Self Client" is enabled as a grant type')
    print(f'\nTemporary access_token (expires in 1 hour):\n{data.get("access_token")}')
    print(f'Scope: {data.get("scope")}')
else:
    print(f'\n FAILED: HTTP {response.status_code}')
    print('Common reasons:')
    print('  - Grant token already used (each token is one-time only)')
    print('  - Grant token expired (valid for 10 minutes only)')
    print('  - Wrong client_id or client_secret in .env')
    print(f'  - Response: {data}')
