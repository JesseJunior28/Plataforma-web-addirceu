# Generated by Django 5.1.7 on 2025-03-21 21:56

import django.db.models.deletion
import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('familia', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='evento',
            name='created_at',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
        migrations.AddField(
            model_name='evento',
            name='updated_at',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
        migrations.AddField(
            model_name='inscricao',
            name='camisa_entregue',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='inscricao',
            name='created_at',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
        migrations.AddField(
            model_name='inscricao',
            name='forma_pagamento',
            field=models.CharField(blank=True, choices=[('especie', 'Espécie'), ('pix', 'PIX'), ('cartao', 'Cartão')], default='especie', max_length=10, null=True),
        ),
        migrations.AddField(
            model_name='inscricao',
            name='observacao',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='inscricao',
            name='updated_at',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
        migrations.AddField(
            model_name='inscricao',
            name='valor_pago',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=10),
        ),
        migrations.AddField(
            model_name='usuario',
            name='cpf',
            field=models.CharField(blank=True, max_length=14, null=True, unique=True),
        ),
        migrations.AddField(
            model_name='usuario',
            name='created_at',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
        migrations.AddField(
            model_name='usuario',
            name='observacao',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='usuario',
            name='updated_at',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
        migrations.AlterField(
            model_name='usuario',
            name='congregacao',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='familia.congregacao'),
        ),
    ]
