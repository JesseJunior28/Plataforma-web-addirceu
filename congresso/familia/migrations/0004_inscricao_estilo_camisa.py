# Generated by Django 5.1.7 on 2025-03-31 13:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('familia', '0003_delete_camisa'),
    ]

    operations = [
        migrations.AddField(
            model_name='inscricao',
            name='estilo_camisa',
            field=models.CharField(choices=[('normal', 'Normal'), ('babylook', 'Babylook')], default='normal', max_length=10),
        ),
    ]
