from django.db import models
from django.core.exceptions import ValidationError
from django.utils import timezone

class Congregacao(models.Model):
    nome = models.CharField(max_length=255)

    def __str__(self):
        return self.nome

class Usuario(models.Model):
    nome = models.CharField(max_length=255)
    apelido = models.CharField(max_length=255)
    congregacao = models.ForeignKey(Congregacao, on_delete=models.PROTECT)
    telefone_whatsapp = models.CharField(max_length=20)
    cpf = models.CharField(max_length=14, unique=True, null=True, blank=True)
    observacao = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.nome

class Evento(models.Model):
    nome = models.CharField(max_length=255)
    data_inicio = models.DateField()
    data_fim = models.DateField()
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)

    def clean(self):
        if self.data_fim < self.data_inicio:
            raise ValidationError("Data final não pode ser anterior à data inicial")

    def __str__(self):
        return self.nome

class CongregacaoEvento(models.Model):
    congregacao = models.ForeignKey(Congregacao, on_delete=models.CASCADE)
    evento = models.ForeignKey(Evento, on_delete=models.CASCADE)
    concentrador = models.ForeignKey(Usuario, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('congregacao', 'evento')
        
    def __str__(self):
        return f"{self.congregacao} - {self.evento}" 

class Remessa(models.Model):
    evento = models.ForeignKey(Evento, on_delete=models.CASCADE)
    data_pedido = models.DateField()
    STATUS_CHOICES = [
        ('pendente', 'Pendente'),
        ('enviado', 'Enviado'),
        ('recebido', 'Recebido'),
    ]    
    status = models.CharField(max_length=50, choices=STATUS_CHOICES)

    def __str__(self):
        return f"Remessa {self.id} - {self.evento.nome}"

class Inscricao(models.Model):
    TIPO_PARTICIPANTE = 'participante'
    TIPO_CONCENTRADOR = 'concentrador'
    TIPO_ADMIN = 'administrador'
    TIPO_ADMIN_EVENTO = 'administrador_evento'
    
    TIPO_NO_EVENTO_CHOICES = [
        (TIPO_PARTICIPANTE, 'Participante'),
        (TIPO_CONCENTRADOR, 'Concentrador'),
        (TIPO_ADMIN, 'Administrador'),
        (TIPO_ADMIN_EVENTO, 'Administrador de Evento'),
    ]
    
    # Campos básicos da inscrição
    data = models.DateField()
    evento = models.ForeignKey(Evento, on_delete=models.CASCADE)
    tipo_no_evento = models.CharField(max_length=50, choices=TIPO_NO_EVENTO_CHOICES)
    
    # Dados do participante diretamente na inscrição
    nome_completo = models.CharField(max_length=255, default="Participante")
    apelido = models.CharField(max_length=255, blank=True, null=True)
    cpf = models.CharField(max_length=14, blank=True, null=True)
    whatsapp = models.CharField(max_length=20, blank=True, null=True)
    congregacao = models.ForeignKey(Congregacao, on_delete=models.PROTECT, null=True)
    
    # Dados da camisa simplificados
    cor_camisa = models.CharField(max_length=50, verbose_name="Cor da camisa")
    ESTILO_CHOICES = [
        ('normal', 'Normal'),
        ('babylook', 'Babylook'),
    ]
    estilo_camisa = models.CharField(max_length=10, choices=ESTILO_CHOICES, default='normal')
    TAMANHO_CHOICES = [
        ('P', 'P'),
        ('M', 'M'),
        ('G', 'G'),
        ('GG', 'GG'),
        ('EXG', 'EXG'),
        ('SOB MEDIDA', 'Sob Medida'),
    ]
    tamanho = models.CharField(max_length=10, choices=TAMANHO_CHOICES)
    camisa_entregue = models.BooleanField(default=False, verbose_name="Camisa foi entregue?")
    
    # Dados do pagamento
    pagamento_feito = models.BooleanField(default=False, verbose_name="Pagamento feito?")
    FORMA_PAGAMENTO_CHOICES = [
        ('especie', 'Espécie'),
        ('pix', 'PIX'),
        ('cartao', 'Cartão'),
    ]
    forma_pagamento = models.CharField(max_length=10, choices=FORMA_PAGAMENTO_CHOICES, default='especie', null=True, blank=True)
    valor_pago = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    observacao = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Inscrição de {self.nome_completo} para {self.evento}"

    def valor_pago_formatado(self):
        return f"R$ {self.valor_pago:,.2f}".replace(",", "X").replace(".", ",").replace("X", ".")
