# Generated by Django 5.1.7 on 2025-04-01 18:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('familia', '0006_login'),
    ]

    operations = [
        migrations.AddField(
            model_name='inscricao',
            name='tipo_evento',
            field=models.CharField(blank=True, help_text='Tipo de evento (ex: Congresso, EBD, Culto)', max_length=100, null=True),
        ),
    ]
