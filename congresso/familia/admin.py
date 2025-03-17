from django.contrib import admin

# Register your models here.
from .models import Usuario, Evento, Congregacao, CongregacaoEvento, Camisa, Remessa, Inscricao  

admin.site.register(Usuario)
admin.site.register(Evento)
admin.site.register(Congregacao)
admin.site.register(CongregacaoEvento)
admin.site.register(Camisa)
admin.site.register(Remessa)
admin.site.register(Inscricao)


