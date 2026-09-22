"""Normalize optional participant website and social-profile links."""
from urllib.parse import urlsplit

from django.core.exceptions import ValidationError
from django.core.validators import URLValidator


def normalize_profile_link(value):
    value = value.strip()
    if not value:
        return ''
    if any(char.isspace() for char in value) or '\\' in value:
        raise ValidationError('Enter a valid website or social-profile link.')
    if value.startswith('//'):
        value = 'https:' + value
    elif '://' not in value:
        value = 'https://' + value
    URLValidator(schemes=['http', 'https'])(value)
    parts = urlsplit(value)
    if parts.username or parts.password or len(value) > 500:
        raise ValidationError('Enter a link without login credentials, up to 500 characters.')
    return value
