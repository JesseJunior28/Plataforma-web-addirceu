# Generated by Django 5.1.7 on 2025-03-31 04:11

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('familia', '0002_remove_inscricao_data_entrega_camisa'),
    ]

    operations = [
        migrations.DeleteModel(
            name='Camisa',
        ),
    ]
