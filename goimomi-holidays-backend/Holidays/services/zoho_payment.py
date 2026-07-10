import logging
from django.conf import settings
from django.core.cache import cache
from zohopayments import ZohoPayments, Edition
from zohopayments.params import (
    PaymentSessionCreateParams,
    ConfigurationsParams,
    HostedPageParams,
    CustomerCreateParams,
    RefundCreateParams
)

logger = logging.getLogger(__name__)

class ZohoPaymentService:
    @staticmethod
    def get_client():
        """
        Initializes and returns a ZohoPayments client instance.
        Uses cached access token if available, otherwise generates a new one.
        """
        account_id = getattr(settings, 'ZOHO_PAYMENTS_ACCOUNT_ID', '')
        client_id = getattr(settings, 'ZOHO_PAYMENTS_CLIENT_ID', '')
        client_secret = getattr(settings, 'ZOHO_PAYMENTS_CLIENT_SECRET', '')
        refresh_token = getattr(settings, 'ZOHO_PAYMENTS_REFRESH_TOKEN', '')
        redirect_uri = getattr(settings, 'ZOHO_PAYMENTS_REDIRECT_URI', 'https://goimomi.com')
        edition_str = getattr(settings, 'ZOHO_PAYMENTS_EDITION', 'IN_SANDBOX').upper()

        if not account_id or not client_id or not client_secret or not refresh_token:
            logger.error("Zoho Payments configuration parameters missing in settings.")
            raise ValueError("Zoho Payments configuration is missing in settings.")

        # Map edition string to Edition enum
        if edition_str == 'IN':
            edition = Edition.IN
        elif edition_str == 'US':
            edition = Edition.US
        else:
            edition = Edition.IN_SANDBOX

        # Retrieve cached access token
        cache_key = f"zoho_payments_access_token_{account_id}"
        access_token = cache.get(cache_key)

        if not access_token:
            logger.info("Generating a fresh Zoho Payments OAuth access token.")
            # Generate new access token using refresh token
            try:
                fresh_token_obj = ZohoPayments.generate_access_token(
                    refresh_token=refresh_token,
                    client_id=client_id,
                    client_secret=client_secret,
                    redirect_uri=redirect_uri,
                    edition=edition
                )
                access_token = fresh_token_obj.access_token
                # Cache token. Subtract 5 minutes from expiry for safety margin (default Zoho tokens are 3600 seconds)
                expires_in = getattr(fresh_token_obj, 'expires_in', 3600)
                cache_timeout = max(int(expires_in) - 300, 60)
                cache.set(cache_key, access_token, cache_timeout)
            except Exception as e:
                logger.error(f"Error generating Zoho Payments access token: {e}", exc_info=True)
                raise e

        # Build client
        client = (
            ZohoPayments.builder()
            .account_id(account_id)
            .edition(edition)
            .oauth_token(access_token)
            .build()
        )
        return client

    @classmethod
    def create_checkout_session(cls, booking, success_url, failure_url):
        """
        Creates a Zoho Payments session for a CabBooking.
        """
        try:
            client = cls.get_client()

            # Construct hosted page params
            hosted_params = HostedPageParams(
                description=f"Cab Booking {booking.booking_id} payment",
                success_url=success_url,
                failure_url=failure_url,
                name=f"{booking.first_name} {booking.last_name}",
                email=booking.email or "",
                phone=booking.phone or "",
            )

            config_params = ConfigurationsParams(
                hosted_page_parameters=hosted_params
            )

            # Determine currency based on edition or default to INR for India Sandbox
            edition_str = getattr(settings, 'ZOHO_PAYMENTS_EDITION', 'IN_SANDBOX').upper()
            currency = 'USD' if edition_str == 'US' else 'INR'

            create_params = PaymentSessionCreateParams(
                amount=float(booking.price),
                currency=currency,
                description=f"Goimomi Holidays Cab Booking - {booking.booking_id}",
                configurations=config_params,
                reference_number=booking.booking_id,
            )

            # Call the SDK API
            session = client.payment_sessions().create(create_params)
            return session
        except Exception as e:
            logger.error(f"Error creating Zoho checkout session for booking {booking.booking_id}: {e}", exc_info=True)
            raise e

    @classmethod
    def get_payment_session(cls, session_id):
        """
        Retrieves the details of a Zoho Payment Session.
        """
        try:
            client = cls.get_client()
            session = client.payment_sessions().get(session_id)
            return session
        except Exception as e:
            logger.error(f"Error retrieving Zoho payment session {session_id}: {e}", exc_info=True)
            raise e

    @classmethod
    def create_customer(cls, name, email, phone=None, country_code=None):
        """
        Creates a Zoho Payments customer profile.
        """
        try:
            client = cls.get_client()
            params = CustomerCreateParams(
                name=name,
                email=email,
                phone=phone,
                phone_country_code=country_code
            )
            customer = client.customers().create(params)
            return customer
        except Exception as e:
            logger.error(f"Error creating Zoho customer {email}: {e}", exc_info=True)
            raise e

    @classmethod
    def process_refund(cls, payment_id, amount, reason, initiated_by="initiated_by_merchant", description=None):
        """
        Processes a refund for a successful payment.
        """
        try:
            client = cls.get_client()
            params = RefundCreateParams(
                amount=float(amount),
                reason=reason,
                type=initiated_by,
                description=description
            )
            refund = client.refunds().create(payment_id, params)
            return refund
        except Exception as e:
            logger.error(f"Error processing Zoho refund for payment {payment_id}: {e}", exc_info=True)
            raise e
