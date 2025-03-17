from django.db import models

class Usuario(models.Model):
    nome = models.CharField(max_length=255)
    apelido = models.CharField(max_length=255)
    congregacao = models.CharField(max_length=255)
    telefone_whatsapp = models.CharField(max_length=20)

    def __str__(self):
        return self.nome

class Evento(models.Model):
    nome = models.CharField(max_length=255)
    data_inicio = models.DateField()
    data_fim = models.DateField()

    def __str__(self):
        return self.nome
    
class Congregacao(models.Model):
    nome = models.CharField(max_length=255)

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

class Camisa (models.Model):
    cor = models.CharField(max_length=50)
    estilo = models.BooleanField()
    flg_p = models.BooleanField()
    flg_m = models.BooleanField()
    flg_g = models.BooleanField()
    flg_gg = models.BooleanField()
    flg_exg = models.BooleanField()
    flg_sobmedida = models.BooleanField()

    def __str__(self):
        return f"Camisa {self.cor}"

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
    data = models.DateField()
    evento = models.ForeignKey(Evento, on_delete=models.CASCADE)
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    TIPO_NO_EVENTO_CHOICES = [
        ('participante', 'Participante'),
        ('concentrador', 'Concentrador'),
        ('administrador', 'Administrador'),
        ('administrador_evento', 'Administrador de Evento'),
    ]
    tipo_no_evento = models.CharField(max_length=50, choices=TIPO_NO_EVENTO_CHOICES)
    camisa = models.ForeignKey(Camisa, on_delete=models.CASCADE)
    remessa = models.ForeignKey(Remessa, on_delete=models.SET_NULL, null= True, blank=True)
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

    def __str__ (self):
        return f"{self.usuario} - {self.evento}"
    