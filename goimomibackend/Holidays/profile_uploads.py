from pathlib import Path
from uuid import uuid4

from django.core.exceptions import ValidationError
from PIL import Image, UnidentifiedImageError


def profile_photo_path(instance, filename):
    return f'global_horizons/srilanka/{uuid4().hex}{Path(filename).suffix.lower()}'


def validate_profile_photo(value):
    if value.size > 5 * 1024 * 1024:
        raise ValidationError('Please upload a photo smaller than 5 MB.')
    try:
        value.seek(0)
        with Image.open(value) as photo:
            if photo.format not in ('JPEG', 'PNG', 'WEBP'):
                raise ValidationError('Please upload a JPEG, PNG or WebP photo.')
            photo.verify()
    except (UnidentifiedImageError, OSError, Image.DecompressionBombError):
        raise ValidationError('Please upload a valid image.')
    finally:
        value.seek(0)
