from datetime import date
from decimal import Decimal
from unittest.mock import patch

from django.contrib.auth.models import User
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient

from Holidays.models import (
    CabBooking, GoimomiProductOrder, OTPVerification, VehicleMaster, VehicleRateCard,
    CatalogueMaster, SubCatalogue, Visa, VisaApplication, GoimomiProduct,
)
from Holidays.views import quote_cab_fare


class BookingRegressionTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.vehicle = VehicleMaster.objects.create(name='Sedan')
        self.rate = VehicleRateCard.objects.create(
            name='Test route', country='India', validity_start=date(2026, 1, 1),
            validity_end=date(2026, 12, 31), column_vehicles=['Sedan'],
            routes=[{'start_city': 'Chennai', 'drop_city': 'Bengaluru',
                     'start_from': 'Airport', 'drop_to': 'Hotel', 'v1': '2500.00'}],
        )

    def test_public_and_non_staff_users_cannot_create_manual_orders(self):
        payload = {'is_manual': 'true', 'name': 'Test', 'phone': '1234567890',
                   'address': 'Test address', 'custom_product_title': 'Test item'}
        for user in (None, User(username='customer', is_staff=False)):
            with self.subTest(user=user):
                self.client.force_authenticate(user=user)
                with patch('Holidays.models.GoimomiProductOrder.objects.create',
                           side_effect=AssertionError('Unauthorized write')):
                    response = self.client.post(reverse('goimomi-product-order-list'), payload)
                self.assertEqual(response.status_code, 403)
        self.assertFalse(GoimomiProductOrder.objects.exists())

    def test_customer_account_cannot_read_private_enquiries(self):
        self.client.force_authenticate(user=User(username='customer', is_staff=False))
        for route in ('enquiry-form-list', 'holiday-enquiry-list', 'umrah-enquiry-list',
                      'canton-enquiry-list', 'business-journey-registrations-list'):
            with self.subTest(route=route):
                self.assertEqual(self.client.get(reverse(route)).status_code, 403)

    def test_vehicle_without_optional_brand_has_a_display_name(self):
        self.assertEqual(str(self.vehicle), 'Sedan')

    def test_quote_uses_current_matching_rate(self):
        vehicle, fare = quote_cab_fare(self.vehicle.pk, 'Chennai', 'Bengaluru',
                                      '2026-09-05', 'Airport', 'Hotel')
        self.assertEqual(vehicle, self.vehicle)
        self.assertEqual(fare, Decimal('2500.00'))

    def test_quote_rejects_expired_rates_bad_dates_and_wrong_points(self):
        for travel_date, pickup in [('2027-01-01', 'Airport'), ('invalid', 'Airport'),
                                    ('2026-09-05', 'Station')]:
            with self.subTest(travel_date=travel_date, pickup=pickup):
                _, fare = quote_cab_fare(self.vehicle.pk, 'Chennai', 'Bengaluru',
                                        travel_date, pickup, 'Hotel')
                self.assertIsNone(fare)

    def test_cab_checkout_rejects_a_client_price_without_a_valid_quote(self):
        OTPVerification.objects.create(email='buyer@example.test', otp='123456', is_verified=True)
        response = self.client.post(reverse('cab-booking-list'), {
            'email': 'buyer@example.test', 'vehicle_id': self.vehicle.pk,
            'from_city': 'Chennai', 'to_city': 'Bengaluru', 'pickup_date': '2027-01-01',
            'price': '1.00',
        })
        self.assertEqual(response.status_code, 400)
        self.assertIn('error', response.data)
        self.assertFalse(CabBooking.objects.exists())

    def test_quote_ignores_non_finite_and_nonpositive_fares(self):
        for price in ('NaN', 'Infinity', '-10', '0'):
            with self.subTest(price=price):
                self.rate.routes[0]['v1'] = price
                self.rate.save()
                _, fare = quote_cab_fare(self.vehicle.pk, 'Chennai', 'Bengaluru', '2026-09-05')
                self.assertIsNone(fare)

    def test_cab_search_ignores_malformed_routes(self):
        self.rate.routes = [None, 'invalid', {'start_city': 'Chennai', 'drop_city': 'Bengaluru', 'v1': 'NaN'}]
        self.rate.save()
        response = self.client.get(reverse('cab-search'), {
            'from_city': 'Chennai', 'to_city': 'Bengaluru', 'pickup_date': '2026-09-05',
        })
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, [])


class DataValidationRegressionTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.client.force_authenticate(user=User(username='admin', is_staff=True))

    def test_all_registered_resource_lists_can_be_read_by_staff(self):
        from Holidays.urls import router
        seen = set()
        for _, viewset, basename in router.registry:
            if viewset in seen:
                continue
            seen.add(viewset)
            with self.subTest(resource=basename):
                response = self.client.get(reverse(f'{basename}-list'))
                self.assertEqual(response.status_code, 200)

    def test_invalid_hierarchy_pagination_returns_validation_error(self):
        for params in ({'page': 'abc'}, {'page': '0'}, {'page': '-1'},
                       {'page_size': '-1'}, {'page_size': '0'}, {'page_size': 'abc'}):
            with self.subTest(params=params):
                response = self.client.get(reverse('destination-hierarchy'), params)
                self.assertEqual(response.status_code, 400)

    def test_nested_catalogue_edit_updates_existing_child_without_duplicates(self):
        catalogue = CatalogueMaster.objects.create(name='Travel')
        child = SubCatalogue.objects.create(catalogue=catalogue, name='Old name')
        response = self.client.patch(reverse('catalogue-master-detail', args=[catalogue.pk]), {
            'sub_catalogues': [{'id': child.pk, 'name': 'New name', 'catalogue': catalogue.pk}],
        }, format='json')
        self.assertEqual(response.status_code, 200)
        child.refresh_from_db()
        self.assertEqual(child.name, 'New name')
        self.assertEqual(catalogue.sub_catalogues.count(), 1)

    def test_nested_catalogue_edit_rejects_child_owned_by_another_catalogue(self):
        first = CatalogueMaster.objects.create(name='First')
        second = CatalogueMaster.objects.create(name='Second')
        child = SubCatalogue.objects.create(catalogue=second, name='Existing')
        response = self.client.patch(reverse('catalogue-master-detail', args=[first.pk]), {
            'name': 'Should not be saved', 'sub_catalogues': [{'id': child.pk, 'name': 'Wrong'}],
        }, format='json')
        self.assertEqual(response.status_code, 400)
        first.refresh_from_db()
        child.refresh_from_db()
        self.assertEqual(first.name, 'First')
        self.assertEqual(child.name, 'Existing')

    def test_malformed_subcatalogue_bulk_payload_is_rejected(self):
        catalogue = CatalogueMaster.objects.create(name='Travel')
        for items in (None, 'bad', [None], ['bad']):
            with self.subTest(items=items):
                response = self.client.post(
                    reverse('catalogue-master-add-sub-catalogues', args=[catalogue.pk]),
                    {'sub_catalogues': items}, format='json',
                )
                self.assertEqual(response.status_code, 400)

    def test_invalid_visa_applicant_does_not_leave_a_partial_application(self):
        import json
        visa = Visa.objects.create(country='India', title='Test visa', cost_price=100)
        response = self.client.post(reverse('visa-application-list'), {
            'visa': visa.pk, 'departure_date': '2026-10-01', 'return_date': '2026-10-10',
            'applicants_data': json.dumps([{'first_name': 'Test', 'dob': 'invalid-date'}]),
        })
        self.assertEqual(response.status_code, 400)
        self.assertFalse(VisaApplication.objects.exists())

    def test_valid_visa_submission_creates_all_applicants_and_uses_server_price(self):
        from types import SimpleNamespace
        visa = Visa.objects.create(country='India', title='Test visa', cost_price=100)
        applicant = {
            'first_name': 'Test', 'last_name': 'Traveller', 'passport_number': 'TEST1234',
            'sex': 'Male', 'dob': '1990-01-01', 'place_of_birth': 'Chennai',
            'place_of_issue': 'Chennai', 'marital_status': 'Single',
            'date_of_issue': '2024-01-01', 'date_of_expiry': '2034-01-01', 'phone': '1234567890',
        }
        with patch('threading.Thread') as thread, patch(
            'Holidays.services.zoho_payment.ZohoPaymentService.create_visa_checkout_session',
            return_value=SimpleNamespace(payments_session_id='test-session', access_key='test-key'),
        ):
            response = self.client.post(reverse('visa-application-list'), {
                'visa': visa.pk, 'departure_date': '2026-10-01', 'return_date': '2026-10-10',
                'applicants_data': [applicant, applicant], 'total_price': '1',
            }, format='json')
        self.assertEqual(response.status_code, 201)
        application = VisaApplication.objects.get()
        self.assertEqual(application.applicants.count(), 2)
        self.assertEqual(application.total_price, Decimal('200.00'))
        thread.assert_called_once()


class ProductInventoryRegressionTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.client.force_authenticate(user=User(username='admin', is_staff=True))
        self.product = GoimomiProduct.objects.create(
            title='Travel pillow', description='Test', price=100, mrp=100, quantity=3,
        )
        for name in ('send_product_order_email', 'send_product_shipped_email',
                     'send_product_delivered_email', 'send_product_cancelled_email'):
            mock = patch(f'Holidays.utils.{name}', return_value=True)
            mock.start()
            self.addCleanup(mock.stop)

    def payload(self, **changes):
        return {'is_manual': True, 'product': self.product.pk, 'quantity': 1,
                'name': 'Test', 'phone': '1234567890', 'address': 'Test address', **changes}

    def test_manual_orders_reject_invalid_quantity_price_and_status(self):
        for changes in ({'quantity': 0}, {'quantity': -1}, {'price': 'NaN'},
                        {'price': '-1'}, {'total_amount': 'Infinity'}, {'status': 'Unknown'}):
            with self.subTest(changes=changes):
                response = self.client.post(reverse('goimomi-product-order-list'), self.payload(**changes), format='json')
                self.assertEqual(response.status_code, 400)
        self.assertFalse(GoimomiProductOrder.objects.exists())

    def test_manual_order_cannot_confirm_more_stock_than_available(self):
        response = self.client.post(reverse('goimomi-product-order-list'), self.payload(quantity=4), format='json')
        self.assertEqual(response.status_code, 400)
        self.assertFalse(GoimomiProductOrder.objects.exists())
        self.product.refresh_from_db()
        self.assertEqual(self.product.quantity, 3)

    def test_manual_delivered_order_deducts_stock_once(self):
        response = self.client.post(reverse('goimomi-product-order-list'), self.payload(status='Delivered'), format='json')
        self.assertEqual(response.status_code, 201)
        order = GoimomiProductOrder.objects.get()
        self.product.refresh_from_db()
        self.assertEqual(self.product.quantity, 2)
        self.assertIsNotNone(order.stock_deducted_at)
        from Holidays.views import GoimomiProductOrderViewSet
        self.assertFalse(GoimomiProductOrderViewSet()._deduct_stock_and_notify(order))

    def test_put_cannot_bypass_inventory_validation(self):
        order = GoimomiProductOrder.objects.create(
            product=self.product, name='Test', phone='1234567890', address='Test address',
            quantity=1, price=100, total_amount=100, status='Confirmed',
        )
        from Holidays.views import GoimomiProductOrderViewSet
        GoimomiProductOrderViewSet()._deduct_stock_and_notify(order)
        response = self.client.put(reverse('goimomi-product-order-detail', args=[order.pk]), {
            'product': self.product.pk, 'name': order.name, 'phone': order.phone, 'address': order.address,
            'price': '100.00', 'total_amount': '200.00', 'quantity': 2, 'status': 'Confirmed',
        }, format='json')
        self.assertEqual(response.status_code, 400)
        order.refresh_from_db()
        self.assertEqual(order.quantity, 1)

    def test_shipping_failure_does_not_change_order_status_or_send_email(self):
        order = GoimomiProductOrder.objects.create(
            product=self.product, name='Test', phone='1234567890', address='Test address',
            quantity=4, price=100, total_amount=400,
        )
        with patch('Holidays.utils.send_product_shipped_email') as send_email:
            response = self.client.post(reverse('goimomi-product-order-send-shipping-email-action', args=[order.pk]))
        self.assertEqual(response.status_code, 400)
        order.refresh_from_db()
        self.assertEqual(order.status, 'Pending')
        self.assertIsNone(order.stock_deducted_at)
        send_email.assert_not_called()
