from django.contrib import admin
from .models import Congregacao, Usuario, Evento, CongregacaoEvento, Inscricao

@admin.register(Congregacao)
class CongregacaoAdmin(admin.ModelAdmin):
    list_display = ('nome',)
    search_fields = ('nome',)

@admin.register(Usuario)
class UsuarioAdmin(admin.ModelAdmin):
    list_display = ('nome', 'congregacao', 'telefone_whatsapp', 'cpf')
    list_filter = ('congregacao',)
    search_fields = ('nome', 'cpf')

@admin.register(Evento)
class EventoAdmin(admin.ModelAdmin):
    list_display = ('nome', 'data_inicio', 'data_fim')
    list_filter = ('data_inicio', 'data_fim')
    search_fields = ('nome',)

@admin.register(CongregacaoEvento)
class CongregacaoEventoAdmin(admin.ModelAdmin):
    list_display = ('congregacao', 'evento', 'concentrador')
    list_filter = ('congregacao', 'evento')

@admin.register(Inscricao)
class InscricaoAdmin(admin.ModelAdmin):
    list_display = ('nome_completo', 'congregacao', 'cor_camisa', 'tamanho', 'data')
    list_filter = ('congregacao', 'cor_camisa', 'tamanho', 'pagamento_feito', 'camisa_entregue')
    search_fields = ('nome_completo', 'cpf', 'whatsapp')
    list_editable = ('cor_camisa', 'tamanho')



