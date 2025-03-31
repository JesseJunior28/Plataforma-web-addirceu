from django.contrib import admin
from django.utils.html import format_html
import locale
from .models import Usuario, Evento, Congregacao, CongregacaoEvento, Remessa, Inscricao  

class InscricaoAdmin(admin.ModelAdmin):
    list_display = ("id", "evento", "display_valor_pago", "forma_pagamento")
    list_filter = ("evento", "forma_pagamento")
    search_fields = ("usuario__nome", "evento__nome")

    def display_valor_pago(self, obj):
        locale.setlocale(locale.LC_ALL, "pt_BR.UTF-8")  # Ajuste conforme necessário
        return format_html("<b>{}</b>", locale.currency(obj.valor_pago, grouping=True))

    display_valor_pago.short_description = "Valor Pago"

admin.site.register(Usuario)
admin.site.register(Evento)
admin.site.register(Congregacao)
admin.site.register(CongregacaoEvento)
admin.site.register(Remessa)
admin.site.register(Inscricao, InscricaoAdmin)



