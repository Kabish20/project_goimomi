from django.apps import AppConfig


class HolidaysConfig(AppConfig):
    name = 'Holidays'

    def ready(self):
        from . import profile_notifications  # noqa: F401
