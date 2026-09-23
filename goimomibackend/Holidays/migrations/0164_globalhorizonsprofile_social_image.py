from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [('Holidays', '0163_globalhorizonsprofile_documents')]
    operations = [
        migrations.AddField(model_name='globalhorizonsprofile', name='attending_poster_image',
                            field=models.FileField(blank=True, editable=False, upload_to='global_horizons/documents/')),
    ]
