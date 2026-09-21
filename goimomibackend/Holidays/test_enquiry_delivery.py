from unittest.mock import patch

from django.contrib.auth.models import User
from django.test import TestCase
from rest_framework.test import APIClient

from Holidays.models import HolidayEnquiry


class EnquiryDeliveryTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.payload = dict(package_type='Golden Triangle', start_city='Delhi',
                            nationality='Indian', travel_date='2026-12-01', rooms=1,
                            adults=2, children=0, star_rating='Unrated', holiday_type='Domestic',
                            full_name='Test Traveller', email='test@example.test', phone='1234567890')

    def test_enquiry_returns_without_waiting_for_email_or_crm(self):
        with patch('Holidays.tasks.send_enquiry_email_task.apply_async') as email, \
             patch('Holidays.tasks.sync_enquiry_crm_task.apply_async') as crm, \
             patch('Holidays.utils.send_enquiry_email', side_effect=AssertionError('Synchronous email')), \
             patch('Holidays.utils.create_zoho_crm_lead', side_effect=AssertionError('Synchronous CRM')):
            with self.captureOnCommitCallbacks(execute=True):
                response = self.client.post('/api/holiday-form/', self.payload, format='json')
                self.assertEqual(response.status_code, 201)
                email.assert_not_called()
            self.assertEqual(HolidayEnquiry.objects.count(), 1)
            email.assert_called_once_with(args=['Holidays.HolidayEnquiry', response.data['id'], 'Holiday Package'],
                                          retry=False, queue='enquiries')
            crm.assert_called_once()

    def test_broker_outage_does_not_lose_or_reject_saved_enquiry(self):
        with patch('Holidays.tasks.send_enquiry_email_task.apply_async', side_effect=ConnectionError), \
             patch('Holidays.tasks.sync_enquiry_crm_task.apply_async', side_effect=ConnectionError), \
             self.assertLogs('Holidays.tasks', level='ERROR'), \
             self.captureOnCommitCallbacks(execute=True):
            response = self.client.post('/api/holiday-form/', self.payload, format='json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(HolidayEnquiry.objects.count(), 1)

    def test_anonymous_users_cannot_read_enquiries(self):
        response = self.client.get('/api/holiday-form/')
        self.assertIn(response.status_code, (401, 403))

    def test_admin_login_is_case_insensitive_and_refresh_works(self):
        User.objects.create_user(username='GOIMOMI', password='test-only-password', is_staff=True)
        response = self.client.post('/api/token/', {'username': 'goimomi', 'password': 'test-only-password'}, format='json')
        self.assertEqual(response.status_code, 200)
        refreshed = self.client.post('/api/token/refresh/', {'refresh': response.data['refresh']}, format='json')
        self.assertEqual(refreshed.status_code, 200)

    def test_public_visas_are_accessible_but_writes_are_protected(self):
        self.assertEqual(self.client.get('/api/visas/?is_popular=true').status_code, 200)
        self.assertIn(self.client.post('/api/visas/', {}, format='json').status_code, (401, 403))
