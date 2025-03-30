from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.shortcuts import get_object_or_404
from .models import Usuario, Congregacao, Evento, Inscricao, Camisa
from .serializers import (CongregacaoSerializer, EventoSerializer, 
                        CamisaSerializer, UsuarioSerializer, InscricaoSerializer)
from django.db import transaction
from django.utils import timezone

# Create your views here.

@api_view(['POST'])
def cadastrar_participante(request):
    try:
        with transaction.atomic():
            # Verificar se o usuário já existe
            cpf = request.data.get('cpf')
            telefone = request.data.get('telefone_whatsapp')
            
            usuario_existente = None
            if cpf:
                usuario_existente = Usuario.objects.filter(cpf=cpf).first()
            
            if not usuario_existente and telefone:
                usuario_existente = Usuario.objects.filter(telefone_whatsapp=telefone).first()
            
            # Dados do usuário
            usuario_data = {
                'nome': request.data['nome_completo'],
                'apelido': request.data.get('apelido', ''),
                'cpf': cpf,
                'telefone_whatsapp': telefone,
                'congregacao': get_object_or_404(Congregacao, id=request.data['congregacao_id']),
                'observacao': request.data.get('observacao', '')
            }
            
            # Criar novo usuário ou atualizar existente
            if usuario_existente:
                for key, value in usuario_data.items():
                    if value:  # Apenas atualiza campos não vazios
                        setattr(usuario_existente, key, value)
                usuario_existente.save()
                usuario = usuario_existente
            else:
                usuario = Usuario.objects.create(**usuario_data)
            
            # Criar inscrição
            inscricao_data = {
                'usuario': usuario,
                'evento': get_object_or_404(Evento, id=request.data['evento_id']),
                'camisa': get_object_or_404(Camisa, id=request.data['camisa_id']),
                'tamanho': request.data['tamanho'],
                'forma_pagamento': request.data.get('forma_pagamento', 'especie'),
                'valor_pago': request.data.get('valor_pago', 0),
                'camisa_entregue': request.data.get('camisa_entregue', False),
                'observacao': request.data.get('observacao', ''),
                'tipo_no_evento': 'participante',
                'data': timezone.now().date(),
            }
            
            inscricao = Inscricao.objects.create(**inscricao_data)
            
            return Response({
                'message': 'Participante cadastrado com sucesso!',
                'usuario_id': usuario.id,
                'inscricao_id': inscricao.id
            }, status=status.HTTP_201_CREATED)
            
    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def listar_congregacoes(request):
    """
    Lista todas as congregações cadastradas
    """
    try:
        congregacoes = Congregacao.objects.all().order_by('nome')
        serializer = CongregacaoSerializer(congregacoes, many=True)
        return Response({'congregacoes': serializer.data})
    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def listar_eventos(request):
    """
    Lista todos os eventos ativos (data_fim >= hoje)
    """
    try:
        hoje = timezone.now().date()
        eventos = Evento.objects.filter(data_fim__gte=hoje).order_by('data_inicio')
        serializer = EventoSerializer(eventos, many=True)
        return Response({'eventos': serializer.data})
    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def listar_camisas(request):
    """
    Lista todas as camisas disponíveis
    """
    try:
        camisas = Camisa.objects.all()
        serializer = CamisaSerializer(camisas, many=True)
        return Response({'camisas': serializer.data})
    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def api_root(request):
    """
    Página raiz da API com links para os recursos disponíveis
    """
    host = request.get_host()
    scheme = request.scheme
    base_url = f"{scheme}://{host}"
    
    return Response({
        'endpoints': {
            'congregacoes': f"{base_url}/api/congregacoes/",
            'eventos': f"{base_url}/api/eventos/",
            'camisas': f"{base_url}/api/camisas/",
            'cadastro_participante': f"{base_url}/api/participante/cadastro/",
        },
        'documentacao': 'Para mais informações, consulte o README do projeto',
        'devs': ['Ytallo Gomes', 'Jesse', 'Ramielke']
    })