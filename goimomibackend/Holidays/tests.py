from decimal import Decimal
from types import SimpleNamespace
from unittest.mock import patch

from django.test import SimpleTestCase, override_settings
from django.urls import reverse

from Holidays.services.zoho_payment import ZohoPaymentService
from Holidays.views import GoimomiProductOrderViewSet


class ZohoPaymentSessionVerifierTests(SimpleTestCase):
    def test_rejects_mismatched_session_identity_reference_or_amount(self):
        expected = {
            'payments_session_id': 'session-123',
            'reference_number': 'GO-ORD-0001',
            'amount': '100.00',
            'currency': 'INR',
            'status': 'paid',
            'payments': [],
        }
        mismatches = {
            'session identity': {'payments_session_id': 'other-session'},
            'reference number': {'reference_number': 'GO-ORD-9999'},
            'amount': {'amount': '100.01'},
        }

        for name, override in mismatches.items():
            with self.subTest(name=name):
                session = SimpleNamespace(**{**expected, **override})
                with patch.object(ZohoPaymentService, 'get_payment_session', return_value=session) as get_session:
                    verified = ZohoPaymentService.verify_paid_session(
                        'session-123',
                        reference_number='GO-ORD-0001',
                        amount=Decimal('100.00'),
                        currency='INR',
                    )

                self.assertFalse(verified)
                get_session.assert_called_once_with('session-123')


@override_settings(FRONTEND_URL='https://frontend.example', ZOHO_PAYMENTS_EDITION='IN_SANDBOX')
class ProductPaymentHardeningTests(SimpleTestCase):
    def setUp(self):
        self.order = SimpleNamespace(
            order_id='GO-ORD-0001',
            zoho_payment_session_id='session-123',
            total_amount=Decimal('99.00'),
            status='Pending',
            stock_deducted_at=None,
        )

    def test_forged_redirect_payment_status_does_not_confirm_an_unpaid_order(self):
        verify_url = reverse('goimomi-product-order-verify-zoho-payment')

        with patch(
            'Holidays.views.GoimomiProductOrder.objects.get',
            return_value=self.order,
        ) as get_order, patch(
            'Holidays.views.verify_zoho_payment_session',
            return_value=False,
        ) as verify_session, patch.object(
            GoimomiProductOrderViewSet,
            '_confirm_paid_order',
        ) as confirm_order:
            response = self.client.get(
                verify_url,
                {
                    'order_id': self.order.order_id,
                    'payment_status': 'paid',
                },
            )

        self.assertEqual(response.status_code, 302)
        self.assertEqual(
            response['Location'],
            f'https://frontend.example/payment-failed?order_id={self.order.order_id}',
        )
        get_order.assert_called_once_with(order_id=self.order.order_id)
        verify_session.assert_called_once_with(
            None,
            self.order.zoho_payment_session_id,
            self.order.order_id,
            self.order.total_amount,
        )
        confirm_order.assert_not_called()
        self.assertEqual(self.order.status, 'Pending')
        self.assertIsNone(self.order.stock_deducted_at)

    def test_product_webhook_without_signature_is_rejected(self):
        webhook_url = reverse('goimomi-product-order-zoho-webhook')

        response = self.client.post(
            webhook_url,
            data=b'{"event_type":"payment.succeeded"}',
            content_type='application/json',
        )

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.content, b'Missing signature header')

    def test_cab_document_download_rejects_an_enumerable_booking_id_without_a_token(self):
        voucher_url = reverse('cab-booking-download-voucher-public')

        response = self.client.get(voucher_url, {'booking_id': 'GO-TRN-0001'})

        self.assertEqual(response.status_code, 403)
