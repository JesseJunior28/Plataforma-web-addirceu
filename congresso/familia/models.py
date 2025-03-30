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

class Camisa(models.Model):
    ESTILO_CHOICES = [
        ('normal', 'Normal'),
        ('babylook', 'Babylook'),
    ]

    cor = models.CharField(max_length=50)
    estilo = models.CharField(max_length=10, choices=ESTILO_CHOICES)
    flg_p = models.BooleanField(verbose_name= "P")
    flg_m = models.BooleanField(verbose_name= "M")
    flg_g = models.BooleanField(verbose_name= "G")
    flg_gg = models.BooleanField(verbose_name= "GG")
    flg_exg = models.BooleanField(verbose_name= "EXG")
    flg_sobmedida = models.BooleanField(verbose_name= "Sob-Medida")

    def __str__(self):
        return f"Camisa {self.cor} - {self.get_estilo_display()}"

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
    
    data = models.DateField()
    evento = models.ForeignKey(Evento, on_delete=models.CASCADE)
    tipo_no_evento = models.CharField(max_length=50, choices=TIPO_NO_EVENTO_CHOICES)
    camisa = models.ForeignKey(Camisa, on_delete=models.CASCADE)
    data_entrega_camisa = models.DateField(null=True, blank=True)
    TAMANHO_CHOICES = [
        ('P', 'P'),
        ('M', 'M'),
        ('G', 'G'),
        ('GG', 'GG'),
        ('EXG', 'EXG'),
        ('SOB MEDIDA', 'Sob Medida'),
    ]
    tamanho = models.CharField(max_length=10, choices=TAMANHO_CHOICES)
    pagamento = models.BooleanField(default=False)
    FORMA_PAGAMENTO_CHOICES = [
        ('especie', 'Espécie'),
        ('pix', 'PIX'),
        ('cartao', 'Cartão'),
    ]
    forma_pagamento = models.CharField(max_length=10, choices=FORMA_PAGAMENTO_CHOICES, default='especie', null=True, blank=True)
    valor_pago = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    camisa_entregue = models.BooleanField(default=False)
    observacao = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Inscrição para {self.evento} - {self.tamanho}"

    
    def valor_pago_formatado(self):
        return f"R$ {self.valor_pago:,.2f}".replace(",", "X").replace(".", ",").replace("X", ".")
