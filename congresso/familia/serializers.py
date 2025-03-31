from rest_framework import serializers
from .models import Usuario, Congregacao, Evento, Inscricao, Remessa, CongregacaoEvento

class CongregacaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Congregacao
        fields = ['id', 'nome']

class EventoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Evento
        fields = ['id', 'nome', 'data_inicio', 'data_fim']

class UsuarioSerializer(serializers.ModelSerializer):
    congregacao_nome = serializers.ReadOnlyField(source='congregacao.nome')
    
    class Meta:
        model = Usuario
        fields = ['id', 'nome', 'apelido', 'congregacao', 'congregacao_nome', 
                 'telefone_whatsapp', 'cpf', 'observacao']

class InscricaoSerializer(serializers.ModelSerializer):
    # Adicionar campo para formatar o valor pago
    valor_pago_formatado = serializers.SerializerMethodField()
    
    class Meta:
        model = Inscricao
        fields = [
            'id', 'data', 'nome_completo', 'apelido', 'cpf', 'whatsapp',
            'congregacao', 'tipo_no_evento', 'cor_camisa', 'estilo_camisa', 
            'tamanho', 'camisa_entregue', 'forma_pagamento', 'pagamento_feito', 
            'valor_pago', 'valor_pago_formatado', 'observacao', 'created_at', 'updated_at'
        ]
    
    def get_valor_pago_formatado(self, obj):
        """Formata o valor pago para exibição"""
        if obj.valor_pago is None:
            return "R$ 0,00"
        return f"R$ {obj.valor_pago:.2f}".replace(".", ",")

class RemessaSerializer(serializers.ModelSerializer):
    evento_nome = serializers.ReadOnlyField(source='evento.nome')

    class Meta:
        model = Remessa
        fields = ['id', 'evento', 'evento_nome', 'data_pedido', 'status' ]

class CongregacaoEventoSerializer(serializers.ModelSerializer):
    congregacao_nome = serializers.ReadOnlyField(source='congregacao.nome')
    evento_nome = serializers.ReadOnlyField(source='evento.nome')
    concentrador_nome = serializers.ReadOnlyField(source='concentrador.nome')

    class Meta:
        model = CongregacaoEvento
        fields = ['id', 'congregacao', 'congregacao_nome', 'evento', 'evento_nome', 'concentrador', 'concentrador_nome']
        # Correção: 'Fields' maiúsculo para 'fields' minúsculo, e corrigido de 'congrecacao' para 'congregacao'
