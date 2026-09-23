import smtplib
from unittest.mock import patch
from django.core import mail
from django.core.cache import cache
from django.test import TestCase
from rest_framework.test import APIClient
from Holidays.models import OTPVerification


class OTPDeliveryTests(TestCase):
    endpoints = ['/api/cab-bookings/send-otp/', '/api/goimomi-product-orders/send-otp/']

    def setUp(self):
        cache.clear()

    def test_code_matches_email_accepted_by_backend(self):
        for endpoint in self.endpoints:
            with self.subTest(endpoint=endpoint):
                response=APIClient().post(endpoint,{'email':'otp@example.test'},format='json')
                self.assertEqual(response.status_code,200)
                record=OTPVerification.objects.get(email='otp@example.test')
                self.assertRegex(record.otp,r'^\d{6}$')
                self.assertIn(record.otp,mail.outbox[-1].body)
                self.assertFalse(record.is_verified)

    def test_smtp_rejection_returns_failure_and_removes_unsent_code(self):
        for endpoint in self.endpoints:
            with self.subTest(endpoint=endpoint), patch('Holidays.otp_email.EmailMultiAlternatives.send',side_effect=smtplib.SMTPAuthenticationError(525,b'Unauthorized IP')), self.assertLogs('Holidays.otp_email',level='ERROR'):
                response=APIClient().post(endpoint,{'email':'otp@example.test'},format='json')
                self.assertEqual(response.status_code,503)
                self.assertFalse(OTPVerification.objects.filter(email='otp@example.test').exists())

    def test_zero_delivery_count_is_not_reported_as_success(self):
        with patch('Holidays.otp_email.EmailMultiAlternatives.send',return_value=0), self.assertLogs('Holidays.otp_email',level='ERROR'):
            response=APIClient().post(self.endpoints[0],{'email':'otp@example.test'},format='json')
        self.assertEqual(response.status_code,503)
        self.assertFalse(OTPVerification.objects.exists())

    def test_notification_tasks_route_to_running_worker_queue(self):
        from backend.celery import app
        for task in ['send_product_order_email_task','send_product_shipped_email_task','send_cab_booking_email_task']:
            with self.subTest(task=task):
                route=app.amqp.router.route({},'Holidays.tasks.'+task,args=[],kwargs={})
                self.assertEqual(route['queue'].name,'enquiries')

    def test_failed_notification_is_retried(self):
        from Holidays.tasks import send_product_order_email_task
        with patch('Holidays.models.GoimomiProductOrder.objects.get'), patch('Holidays.utils.send_product_order_email',return_value=False), patch.object(send_product_order_email_task,'retry',side_effect=RuntimeError('retry requested')) as retry, self.assertLogs('Holidays.tasks',level='ERROR'):
            with self.assertRaisesRegex(RuntimeError,'retry requested'):
                send_product_order_email_task.run(1)
            retry.assert_called_once()
