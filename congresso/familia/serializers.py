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
    usuario_nome = serializers.ReadOnlyField(source='usuario.nome')
    evento_nome = serializers.ReadOnlyField(source='evento.nome')
    camisa_cor = serializers.ReadOnlyField(source='camisa.cor')
    
    class Meta:
        model = Inscricao
        fields = ['id', 'data', 'usuario', 'usuario_nome', 'evento', 'evento_nome',
                 'tipo_no_evento', 'camisa', 'camisa_cor', 'tamanho', 'forma_pagamento',
                 'valor_pago', 'pagamento', 'camisa_entregue', 'observacao']
