from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Holidays', '0133_country_card_image'),
    ]

    operations = [
        migrations.AddField(
            model_name='cabbooking',
            name='booking_id',
            field=models.CharField(blank=True, editable=False, max_length=20, null=True, unique=True),
        ),
    ]
