from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [('Holidays', '0162_globalhorizonsprofile_logo')]
    operations = [
        migrations.AddField(model_name='globalhorizonsprofile', name='attending_poster',
                            field=models.FileField(blank=True, editable=False, upload_to='global_horizons/documents/')),
        migrations.AddField(model_name='globalhorizonsprofile', name='profile_booklet',
                            field=models.FileField(blank=True, editable=False, upload_to='global_horizons/documents/')),
    ]
