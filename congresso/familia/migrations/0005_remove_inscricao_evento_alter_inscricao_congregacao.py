# Generated by Django 5.1.7 on 2025-03-31 14:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('familia', '0004_inscricao_estilo_camisa'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='inscricao',
            name='evento',
        ),
        migrations.AlterField(
            model_name='inscricao',
            name='congregacao',
            field=models.CharField(default='Não informada', max_length=255),
        ),
    ]
