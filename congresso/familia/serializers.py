from rest_framework import serializers
from .models import Usuario, Congregacao, Evento, Camisa, Inscricao, Remessa, CongregacaoEvento

class CongregacaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Congregacao
        fields = ['id', 'nome']

class EventoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Evento
        fields = ['id', 'nome', 'data_inicio', 'data_fim']

class CamisaSerializer(serializers.ModelSerializer):
    estilo_display = serializers.SerializerMethodField()
    tamanhos_disponiveis = serializers.SerializerMethodField()
    
    class Meta:
        model = Camisa
        fields = ['id', 'cor', 'estilo', 'estilo_display', 'tamanhos_disponiveis']
    
    def get_estilo_display(self, obj):
        return 'Babylook' if obj.estilo else 'Normal'
    
    def get_tamanhos_disponiveis(self, obj):
        return {
            'P': obj.flg_p,
            'M': obj.flg_m,
            'G': obj.flg_g,
            'GG': obj.flg_gg,
            'EXG': obj.flg_exg,
            'SOB MEDIDA': obj.flg_sobmedida,
        }

class UsuarioSerializer(serializers.ModelSerializer):
    congregacao_nome = serializers.ReadOnlyField(source='congregacao.nome')
    
    class Meta:
        model = Usuario
        fields = ['id', 'nome', 'apelido', 'congregacao', 'congregacao_nome', 
                 'telefone_whatsapp', 'cpf', 'observacao']

class InscricaoSerializer(serializers.ModelSerializer):
    evento_nome = serializers.ReadOnlyField(source='evento.nome')
    camisa_cor = serializers.ReadOnlyField(source='camisa.cor')
    camisa_estilo = serializers.ReadOnlyField(source='camisa.get_estilo_display')
    congregacao_nome = serializers.ReadOnlyField(source='congregacao.nome')
    
    class Meta:
        model = Inscricao
        fields = ['id', 'data', 'nome_completo', 'apelido', 'cpf', 'whatsapp',
                 'congregacao', 'congregacao_nome', 'evento', 'evento_nome', 
                 'tipo_no_evento', 'camisa', 'camisa_cor', 'camisa_estilo',
                 'tamanho', 'camisa_entregue', 'forma_pagamento',
                 'pagamento_feito', 'valor_pago', 'observacao']

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
