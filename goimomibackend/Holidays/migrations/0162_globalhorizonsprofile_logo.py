from django.db import migrations, models
import Holidays.profile_uploads


class Migration(migrations.Migration):
    dependencies = [('Holidays', '0161_alter_globalhorizonsprofile_organization')]

    operations = [
        migrations.AddField(
            model_name='globalhorizonsprofile',
            name='logo',
            field=models.ImageField(blank=True, upload_to=Holidays.profile_uploads.profile_photo_path,
                                    validators=[Holidays.profile_uploads.validate_profile_photo]),
        ),
    ]
