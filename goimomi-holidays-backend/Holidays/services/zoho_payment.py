import requests
import hmac
import hashlib
from django.conf import settings
from Holidays.models import CabBooking

class ZohoPaymentService:
    @staticmethod
    def get_access_token():
        """
        Gets a fresh OAuth2 access token for Zoho Payments/CRM using client credentials and refresh token.
        """
        zoho_client_id = getattr(settings, 'ZOHO_CLIENT_ID', '').strip()
        zoho_client_secret = getattr(settings, 'ZOHO_CLIENT_SECRET', '').strip()
        zoho_refresh_token = getattr(settings, 'ZOHO_REFRESH_TOKEN', '').strip()

        if not (zoho_client_id and zoho_client_secret and zoho_refresh_token):
            print("[ZohoPaymentService] Zoho credentials not fully configured in settings.")
            return None

        try:
            token_resp = requests.post(
                'https://accounts.zoho.in/oauth/v2/token',
                data={
                    'refresh_token': zoho_refresh_token,
                    'client_id':     zoho_client_id,
                    'client_secret': zoho_client_secret,
                    'grant_type':    'refresh_token',
                },
                timeout=10,
            )
            token_data = token_resp.json()
            access_token = token_data.get('access_token')
            if not access_token:
                print(f"[ZohoPaymentService] Failed to get Zoho access token: {token_data}")
            return access_token
        except Exception as exc:
            print(f"[ZohoPaymentService] Exception getting Zoho access token: {exc}")
            return None

    @staticmethod
    def create_payment(booking: CabBooking):
        """
        Creates a Zoho Payments checkout link for the given CabBooking.
        Returns the payment URL string, or None on unexpected failure.
        """
        access_token = ZohoPaymentService.get_access_token()
        if not access_token:
            print(f"[ZohoPaymentService] Cannot create payment link for {booking.booking_id} due to missing access token.")
            return None

        customer_name = f"{booking.first_name} {booking.last_name}".strip()
        amount = float(booking.price or 0)
        redirect_url = f"https://goimomi.com/payment-success/?booking_id={booking.booking_id}"

        headers = {
            'Authorization': f'Zoho-oauthtoken {access_token}',
            'Content-Type':  'application/json',
        }
        
        # Include organization header if configured
        org_id = getattr(settings, 'ZOHO_ORGANIZATION_ID', '').strip()
        if org_id:
            headers['X-Org-Id'] = org_id

        payload = {
            'amount':           amount,
            'currency':         'INR',
            'reference_number': booking.booking_id,
            'description':      f"Goimomi Cab Booking: {booking.booking_id}",
            'customer': {
                'name':  customer_name,
                'email': booking.email or '',
                'phone': booking.phone or '',
            },
            'metadata': {'booking_id': booking.booking_id},
            'redirect_url': redirect_url,
        }

        try:
            link_resp = requests.post(
                'https://payments.zoho.in/api/v1/paymentlinks',
                json=payload,
                headers=headers,
                timeout=15,
            )
            link_data = link_resp.json()
            payment_url = link_data.get('payment_url') or link_data.get('link_url')
            if payment_url:
                print(f"[ZohoPaymentService] Zoho payment link generated for {booking.booking_id}: {payment_url}")
                return payment_url
            else:
                print(f"[ZohoPaymentService] Zoho did not return a URL: {link_data}")
                return None
        except Exception as exc:
            print(f"[ZohoPaymentService] Exception generating Zoho payment link for {booking.booking_id}: {exc}")
            return None

    @staticmethod
    def verify_signature(raw_payload: bytes, received_signature: str) -> bool:
        """
        Verifies that the webhook request came from Zoho Payments using HMAC-SHA256.
        """
        signing_key = getattr(settings, 'ZOHO_PAYMENTS_SIGNING_KEY', '')
        if not signing_key or not received_signature:
            print("[ZohoPaymentService] Signing key or signature missing. Verification failed.")
            return False
            
        computed_hmac = hmac.new(
            signing_key.encode('utf-8'),
            msg=raw_payload,
            digestmod=hashlib.sha256
        )
        computed_signature = computed_hmac.hexdigest()
        return hmac.compare_digest(computed_signature, received_signature)
