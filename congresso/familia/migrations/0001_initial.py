# Generated by Django 5.1.7 on 2025-03-31 04:03

import django.db.models.deletion
import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Camisa',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('cor', models.CharField(max_length=50)),
                ('estilo', models.CharField(choices=[('normal', 'Normal'), ('babylook', 'Babylook')], max_length=10)),
                ('flg_p', models.BooleanField(verbose_name='P')),
                ('flg_m', models.BooleanField(verbose_name='M')),
                ('flg_g', models.BooleanField(verbose_name='G')),
                ('flg_gg', models.BooleanField(verbose_name='GG')),
                ('flg_exg', models.BooleanField(verbose_name='EXG')),
                ('flg_sobmedida', models.BooleanField(verbose_name='Sob-Medida')),
            ],
        ),
        migrations.CreateModel(
            name='Congregacao',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nome', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='Evento',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nome', models.CharField(max_length=255)),
                ('data_inicio', models.DateField()),
                ('data_fim', models.DateField()),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now)),
                ('updated_at', models.DateTimeField(default=django.utils.timezone.now)),
            ],
        ),
        migrations.CreateModel(
            name='Inscricao',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('data', models.DateField()),
                ('tipo_no_evento', models.CharField(choices=[('participante', 'Participante'), ('concentrador', 'Concentrador'), ('administrador', 'Administrador'), ('administrador_evento', 'Administrador de Evento')], max_length=50)),
                ('nome_completo', models.CharField(default='Participante', max_length=255)),
                ('apelido', models.CharField(blank=True, max_length=255, null=True)),
                ('cpf', models.CharField(blank=True, max_length=14, null=True)),
                ('whatsapp', models.CharField(blank=True, max_length=20, null=True)),
                ('cor_camisa', models.CharField(max_length=50, verbose_name='Cor da camisa')),
                ('data_entrega_camisa', models.DateField(blank=True, null=True)),
                ('tamanho', models.CharField(choices=[('P', 'P'), ('M', 'M'), ('G', 'G'), ('GG', 'GG'), ('EXG', 'EXG'), ('SOB MEDIDA', 'Sob Medida')], max_length=10)),
                ('camisa_entregue', models.BooleanField(default=False, verbose_name='Camisa foi entregue?')),
                ('pagamento_feito', models.BooleanField(default=False, verbose_name='Pagamento feito?')),
                ('forma_pagamento', models.CharField(blank=True, choices=[('especie', 'Espécie'), ('pix', 'PIX'), ('cartao', 'Cartão')], default='especie', max_length=10, null=True)),
                ('valor_pago', models.DecimalField(decimal_places=2, default=0, max_digits=10)),
                ('observacao', models.TextField(blank=True, null=True)),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now)),
                ('updated_at', models.DateTimeField(default=django.utils.timezone.now)),
                ('congregacao', models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, to='familia.congregacao')),
                ('evento', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='familia.evento')),
            ],
        ),
        migrations.CreateModel(
            name='Remessa',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('data_pedido', models.DateField()),
                ('status', models.CharField(choices=[('pendente', 'Pendente'), ('enviado', 'Enviado'), ('recebido', 'Recebido')], max_length=50)),
                ('evento', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='familia.evento')),
            ],
        ),
        migrations.CreateModel(
            name='Usuario',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nome', models.CharField(max_length=255)),
                ('apelido', models.CharField(max_length=255)),
                ('telefone_whatsapp', models.CharField(max_length=20)),
                ('cpf', models.CharField(blank=True, max_length=14, null=True, unique=True)),
                ('observacao', models.TextField(blank=True, null=True)),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now)),
                ('updated_at', models.DateTimeField(default=django.utils.timezone.now)),
                ('congregacao', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='familia.congregacao')),
            ],
        ),
        migrations.CreateModel(
            name='CongregacaoEvento',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('congregacao', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='familia.congregacao')),
                ('evento', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='familia.evento')),
                ('concentrador', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='familia.usuario')),
            ],
            options={
                'unique_together': {('congregacao', 'evento')},
            },
        ),
    ]
