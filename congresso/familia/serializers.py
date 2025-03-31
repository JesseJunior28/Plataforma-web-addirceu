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
    evento_nome = serializers.ReadOnlyField(source='evento.nome')
    congregacao_nome = serializers.ReadOnlyField(source='congregacao.nome')
    
    class Meta:
        model = Inscricao
        fields = [
            'id', 'data', 'nome_completo', 'apelido', 'cpf', 'whatsapp',
            'congregacao', 'congregacao_nome', 'evento', 'evento_nome', 
            'tipo_no_evento', 'cor_camisa', 'tamanho', 'camisa_entregue',
            'forma_pagamento', 'pagamento_feito', 'valor_pago', 'observacao',
            'created_at', 'updated_at'
        ]

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
        Fields = ['id', 'congrecacao', 'congrecacao_nome', 'evento', 'evento_nome', 'concentrador', 'concentrador_nome']
