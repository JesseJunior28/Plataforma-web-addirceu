from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, schema
from django.shortcuts import get_object_or_404
from .models import Usuario, Congregacao, Evento, Inscricao, Login
from .serializers import (CongregacaoSerializer, EventoSerializer,
                        UsuarioSerializer, InscricaoSerializer, LoginSerializer)
from django.db import transaction
from django.utils import timezone
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from django.core.exceptions import ValidationError

# Create your views here.

@swagger_auto_schema(
    method='post',
    operation_description="Cadastra um novo participante",
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        required=['evento_id', 'cor_camisa', 'tamanho', 'nome_completo', 'congregacao_id'],
        properties={
            'evento_id': openapi.Schema(type=openapi.TYPE_INTEGER, description='ID do evento'),
            'cor_camisa': openapi.Schema(type=openapi.TYPE_STRING, description='Cor da camisa'),
            'estilo_camisa': openapi.Schema(type=openapi.TYPE_STRING, description='Estilo da camisa (normal ou babylook)'),
            'nome_completo': openapi.Schema(type=openapi.TYPE_STRING, description='Nome completo do participante'),
            'apelido': openapi.Schema(type=openapi.TYPE_STRING, description='Apelido do participante'),
            'cpf': openapi.Schema(type=openapi.TYPE_STRING, description='CPF do participante'),
            'whatsapp': openapi.Schema(type=openapi.TYPE_STRING, description='Número de WhatsApp'),
            'congregacao_id': openapi.Schema(type=openapi.TYPE_INTEGER, description='ID da congregação'),
            'tamanho': openapi.Schema(type=openapi.TYPE_STRING, description='Tamanho da camisa (P, M, G, GG, EXG, SOB MEDIDA)'),
            'camisa_entregue': openapi.Schema(type=openapi.TYPE_BOOLEAN, description='Se a camisa foi entregue'),
            'forma_pagamento': openapi.Schema(type=openapi.TYPE_STRING, description='Forma de pagamento (especie, pix, cartao)'),
            'pagamento_feito': openapi.Schema(type=openapi.TYPE_BOOLEAN, description='Se o pagamento foi realizado'),
            'valor_pago': openapi.Schema(type=openapi.TYPE_NUMBER, description='Valor pago'),
            'observacao': openapi.Schema(type=openapi.TYPE_STRING, description='Observação'),
            'tipo_evento': openapi.Schema(type=openapi.TYPE_STRING, description='Tipo do evento (texto livre)'),
        }
    ),
    responses={
        201: openapi.Response(
            description="Inscrição criada com sucesso",
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'message': openapi.Schema(type=openapi.TYPE_STRING),
                    'inscricao_id': openapi.Schema(type=openapi.TYPE_INTEGER),
                }
            )
        ),
        400: "Erro na requisição"
    }
)
@api_view(['POST'])
def cadastrar_participante(request):
    try:
        print("Dados recebidos:", request.data)
        
        with transaction.atomic():
            inscricao = Inscricao()
            
            # Informações da camisa
            inscricao.cor_camisa = request.data.get('cor_camisa')
            inscricao.estilo_camisa = request.data.get('estilo_camisa', 'normal')
            inscricao.tamanho = request.data.get('tamanho', 'G')
            
            inscricao.data = timezone.now().date()
            inscricao.tipo_no_evento = request.data.get('tipo_no_evento', 'participante')
            inscricao.tipo_evento = request.data.get('tipo_evento', '')  # Campo de texto livre
            
            # Dados do participante
            inscricao.nome_completo = request.data.get('nome_completo', 'Participante')
            inscricao.apelido = request.data.get('apelido', '')
            inscricao.cpf = request.data.get('cpf', '')
            inscricao.whatsapp = request.data.get('whatsapp', '')
            inscricao.congregacao = request.data.get('congregacao', '')  # Agora recebe uma string
            
            # Dados da camisa e pagamento
            inscricao.camisa_entregue = request.data.get('camisa_entregue', False)
            inscricao.forma_pagamento = request.data.get('forma_pagamento', 'especie')
            inscricao.pagamento_feito = request.data.get('pagamento_feito', False)
            inscricao.valor_pago = request.data.get('valor_pago', 0)
            inscricao.observacao = request.data.get('observacao', '')
            
            inscricao.save()
            
            return Response({
                'message': 'Inscrição realizada com sucesso!',
                'inscricao_id': inscricao.id,
                'camisa_info': {
                    'cor': inscricao.cor_camisa,
                    'tamanho': inscricao.tamanho
                }
            }, status=status.HTTP_201_CREATED)
            
    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)

@swagger_auto_schema(
    method='post',
    operation_description="Cadastra um novo evento",
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        required=['nome', 'data_inicio', 'data_fim'],
        properties={
            'nome': openapi.Schema(type=openapi.TYPE_STRING, description='Nome do evento'),
            'data_inicio': openapi.Schema(type=openapi.TYPE_STRING, format='date', description='Data de início (formato: YYYY-MM-DD)'),
            'data_fim': openapi.Schema(type=openapi.TYPE_STRING, format='date', description='Data de fim (formato: YYYY-MM-DD)'),
        }
    ),
    responses={
        201: openapi.Response(
            description="Evento criado com sucesso",
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'message': openapi.Schema(type=openapi.TYPE_STRING),
                    'evento_id': openapi.Schema(type=openapi.TYPE_INTEGER),
                }
            )
        ),
        400: "Erro na requisição"
    }
)
@api_view(['POST'])
def cadastrar_evento(request):
    """
    Cadastra um novo evento
    """
    try:
        with transaction.atomic():
            # Obter dados do evento
            nome = request.data.get('nome')
            data_inicio = request.data.get('data_inicio')
            data_fim = request.data.get('data_fim')
            
            # Validar dados
            if not nome or not data_inicio or not data_fim:
                return Response({
                    'error': 'Os campos nome, data_inicio e data_fim são obrigatórios'
                }, status=status.HTTP_400_BAD_REQUEST)
                
            # Criar evento
            evento = Evento(
                nome=nome,
                data_inicio=data_inicio,
                data_fim=data_fim
            )
            
            # Validar datas
            try:
                evento.clean()
            except ValidationError as e:
                return Response({
                    'error': str(e)
                }, status=status.HTTP_400_BAD_REQUEST)
                
            evento.save()
            
            return Response({
                'message': 'Evento cadastrado com sucesso!',
                'evento_id': evento.id
            }, status=status.HTTP_201_CREATED)
            
    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)

@swagger_auto_schema(
    method='post',
    operation_description="Cadastra uma nova congregação",
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        required=['nome'],
        properties={
            'nome': openapi.Schema(type=openapi.TYPE_STRING, description='Nome da congregação'),
        }
    ),
    responses={
        201: openapi.Response(
            description="Congregação criada com sucesso",
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'message': openapi.Schema(type=openapi.TYPE_STRING),
                    'congregacao_id': openapi.Schema(type=openapi.TYPE_INTEGER),
                }
            )
        ),
        400: "Erro na requisição"
    }
)
@api_view(['POST'])
def cadastrar_congregacao(request):
    """
    Cadastra uma nova congregação
    """
    try:
        with transaction.atomic():
            # Obter dados da congregação
            nome = request.data.get('nome')
            
            # Validar dados
            if not nome:
                return Response({
                    'error': 'O campo nome é obrigatório'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Verificar se já existe uma congregação com o mesmo nome
            if Congregacao.objects.filter(nome=nome).exists():
                return Response({
                    'error': 'Já existe uma congregação com este nome'
                }, status=status.HTTP_400_BAD_REQUEST)
                
            # Criar congregação
            congregacao = Congregacao.objects.create(nome=nome)
            
            return Response({
                'message': 'Congregação cadastrada com sucesso!',
                'congregacao_id': congregacao.id
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

@swagger_auto_schema(
    method='put',
    operation_description="Edita uma inscrição existente",
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'evento_id': openapi.Schema(type=openapi.TYPE_INTEGER),
            'cor_camisa': openapi.Schema(type=openapi.TYPE_STRING),
            'estilo_camisa': openapi.Schema(type=openapi.TYPE_STRING),
            'congregacao_id': openapi.Schema(type=openapi.TYPE_INTEGER),
            'tamanho': openapi.Schema(type=openapi.TYPE_STRING),
            'nome_completo': openapi.Schema(type=openapi.TYPE_STRING),
            'apelido': openapi.Schema(type=openapi.TYPE_STRING),
            'whatsapp': openapi.Schema(type=openapi.TYPE_STRING),
            'cpf': openapi.Schema(type=openapi.TYPE_STRING),
            'forma_pagamento': openapi.Schema(type=openapi.TYPE_STRING),
            'pagamento_feito': openapi.Schema(type=openapi.TYPE_BOOLEAN),
            'valor_pago': openapi.Schema(type=openapi.TYPE_NUMBER),
            'camisa_entregue': openapi.Schema(type=openapi.TYPE_BOOLEAN),
            'observacao': openapi.Schema(type=openapi.TYPE_STRING),
            'tipo_no_evento': openapi.Schema(type=openapi.TYPE_STRING),
            'tipo_evento': openapi.Schema(type=openapi.TYPE_STRING, description='Tipo do evento (texto livre)'),
        }
    ),
    responses={
        200: "Inscrição atualizada com sucesso",
        400: "Erro na requisição",
        404: "Inscrição não encontrada"
    }
)
@api_view(['PUT'])
def editar_inscricao(request, inscricao_id):
    """
    Edita uma inscrição existente
    """
    try:
        with transaction.atomic():
            inscricao = get_object_or_404(Inscricao, id=inscricao_id)
            
            # Atualizar campos permitidos - agora incluindo tipo_evento
            campos_permitidos = [
                'cor_camisa', 'estilo_camisa', 'congregacao', 'tamanho', 
                'forma_pagamento', 'valor_pago', 'camisa_entregue', 
                'pagamento_feito', 'observacao', 'tipo_no_evento', 
                'tipo_evento',  # Garantindo que tipo_evento está incluído
                'nome_completo', 'apelido', 'whatsapp', 'cpf'
            ]
            
            for campo in campos_permitidos:
                if campo in request.data:
                    if campo == 'valor_pago' and isinstance(request.data[campo], str):
                        try:
                            valor = request.data[campo].replace('.', '').replace(',', '.')
                            setattr(inscricao, campo, float(valor))
                        except (ValueError, TypeError):
                            return Response({
                                'error': f'Valor inválido para {campo}: {request.data[campo]}'
                            }, status=status.HTTP_400_BAD_REQUEST)
                    else:
                        setattr(inscricao, campo, request.data[campo])
            
            inscricao.updated_at = timezone.now()
            inscricao.save()
            
            serializer = InscricaoSerializer(inscricao)
            return Response({
                'message': 'Inscrição atualizada com sucesso!',
                'inscricao': serializer.data
            })
            
    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)

@swagger_auto_schema(
    method='delete',
    operation_description="Exclui uma inscrição existente",
    responses={
        200: "Inscrição excluída com sucesso",
        400: "Erro na requisição",
        404: "Inscrição não encontrada"
    }
)
@api_view(['DELETE'])
def deletar_inscricao(request, inscricao_id):
    """
    Exclui uma inscrição existente
    """
    try:
        inscricao = get_object_or_404(Inscricao, id=inscricao_id)
        inscricao.delete()
        
        return Response({
            'message': 'Inscrição excluída com sucesso!',
            'inscricao_id': inscricao_id
        }, status=status.HTTP_200_OK)
    
    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)

@swagger_auto_schema(
    method='delete',
    operation_description="Exclui uma congregação existente",
    responses={
        200: "Congregação excluída com sucesso",
        400: "Erro na requisição",
        404: "Congregação não encontrada"
    }
)
@api_view(['DELETE'])
def deletar_congregacao(request, congregacao_id):
    """
    Exclui uma congregação existente
    """
    try:
        # Verificar se existem inscrições associadas a esta congregação
        if Inscricao.objects.filter(congregacao_id=congregacao_id).exists():
            return Response({
                'error': 'Não é possível excluir esta congregação pois existem inscrições associadas a ela'
            }, status=status.HTTP_400_BAD_REQUEST)
            
        # Verificar se existem usuários associados a esta congregação
        if Usuario.objects.filter(congregacao_id=congregacao_id).exists():
            return Response({
                'error': 'Não é possível excluir esta congregação pois existem usuários associados a ela'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Verificar se a congregação existe
        congregacao = get_object_or_404(Congregacao, id=congregacao_id)
        
        # Excluir a congregação
        nome = congregacao.nome
        congregacao.delete()
        
        return Response({
            'message': f'Congregação "{nome}" excluída com sucesso!',
            'congregacao_id': congregacao_id
        }, status=status.HTTP_200_OK)
    
    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)

@swagger_auto_schema(
    method='delete',
    operation_description="Exclui um evento existente",
    responses={
        200: "Evento excluído com sucesso",
        400: "Erro na requisição",
        404: "Evento não encontrado"
    }
)
@api_view(['DELETE'])
def deletar_evento(request, evento_id):
    """
    Exclui um evento existente
    """
    try:
        # Verificar se existem inscrições associadas a este evento
        if Inscricao.objects.filter(evento_id=evento_id).exists():
            return Response({
                'error': 'Não é possível excluir este evento pois existem inscrições associadas a ele'
            }, status=status.HTTP_400_BAD_REQUEST)
            
        # Removemos a verificação de remessas que estava causando o erro
        # Verificação condicional apenas se o modelo CongregacaoEvento estiver disponível
        try:
            if 'CongregacaoEvento' in globals() and CongregacaoEvento.objects.filter(evento_id=evento_id).exists():
                return Response({
                    'error': 'Não é possível excluir este evento pois existem relações com congregações'
                }, status=status.HTTP_400_BAD_REQUEST)
        except NameError:
            # Se CongregacaoEvento não estiver definido, simplesmente pular esta verificação
            pass
            
        evento = get_object_or_404(Evento, id=evento_id)
        evento.delete()
        
        return Response({
            'message': 'Evento excluído com sucesso!',
            'evento_id': evento_id
        }, status=status.HTTP_200_OK)
    
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
    base_url = f"{scheme}://{host}/api"
    
    return Response({
        'endpoints': {
            'autenticacao': {
                'login': f"{base_url}/auth/login/",
                'register': f"{base_url}/auth/register/"
            },
            'congregacoes': {
                'listar': f"{base_url}/congregacoes/",
                'cadastrar': f"{base_url}/congregacao/cadastro/",
                'deletar': f"{base_url}/congregacao/deletar/<id>/"
            },
            'eventos': {
                'listar': f"{base_url}/eventos/",
                'cadastrar': f"{base_url}/evento/cadastro/",
                'deletar': f"{base_url}/evento/deletar/<id>/"
            },
            'inscricoes': {
                'listar': f"{base_url}/inscricoes/",
                'cadastrar': f"{base_url}/participante/cadastro/",
                'editar': f"{base_url}/inscricao/editar/<id>/",
                'deletar': f"{base_url}/inscricao/deletar/<id>/"
            }
        },
        'exemplos': {
            'login': {
                'method': 'POST',
                'payload': {
                    'email': 'usuario@exemplo.com',
                    'senha': '123456'
                }
            },
            'register': {
                'method': 'POST',
                'payload': {
                    'email': 'usuario@exemplo.com',
                    'senha': '123456',
                    'nome': 'Nome do Usuário',
                    'is_admin': False
                }
            },
            'cadastrar_inscricao': {
                'method': 'POST',
                'payload': {
                    'nome_completo': 'Nome do Participante',
                    'apelido': 'Apelido',
                    'cpf': '123.456.789-00',
                    'whatsapp': '86999999999',
                    'congregacao': 'Sede',
                    'cor_camisa': 'preta',
                    'estilo_camisa': 'normal',
                    'tamanho': 'G',
                    'tipo_evento': 'Congresso de Jovens',
                    'forma_pagamento': 'especie',
                    'valor_pago': 30.00,
                    'pagamento_feito': False,
                    'camisa_entregue': False,
                    'observacao': ''
                }
            }
        },
        'documentacao': 'Para mais informações, consulte o README do projeto',
        'versao': '1.0.0',
        'devs': ['Ytallo Gomes', 'Jesse', 'Ramielke']
    })

@api_view(['GET'])
def listar_inscricoes(request):
    """
    Lista todas as inscrições com tipo_evento incluído
    """
    try:
        inscricoes = Inscricao.objects.all().order_by('-data')
        serializer = InscricaoSerializer(inscricoes, many=True)
        # O tipo_evento já está incluído no serializer, então não precisa de modificação adicional
        return Response({
            'inscricoes': serializer.data
        })
    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def login(request):
    """
    Realiza o login do usuário
    """
    try:
        email = request.data.get('email')
        senha = request.data.get('senha')
        
        if not email or not senha:
            return Response({
                'error': 'Email e senha são obrigatórios'
            }, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            usuario = Login.objects.get(email=email, senha=senha)
            serializer = LoginSerializer(usuario)
            return Response({
                'message': 'Login realizado com sucesso!',
                'usuario': serializer.data
            })
        except Login.DoesNotExist:
            return Response({
                'error': 'Email ou senha inválidos'
            }, status=status.HTTP_401_UNAUTHORIZED)
            
    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def register(request):
    """
    Cadastra um novo usuário
    """
    try:
        email = request.data.get('email')
        senha = request.data.get('senha')
        nome = request.data.get('nome')
        is_admin = request.data.get('is_admin', False)
        
        if not email or not senha or not nome:
            return Response({
                'error': 'Email, senha e nome são obrigatórios'
            }, status=status.HTTP_400_BAD_REQUEST)
            
        # Verificar se já existe um usuário com este email
        if Login.objects.filter(email=email).exists():
            return Response({
                'error': 'Email já cadastrado'
            }, status=status.HTTP_400_BAD_REQUEST)
            
        usuario = Login.objects.create(
            email=email,
            senha=senha,
            nome=nome,
            is_admin=is_admin
        )
        
        serializer = LoginSerializer(usuario)
        return Response({
            'message': 'Usuário cadastrado com sucesso!',
            'usuario': serializer.data
        }, status=status.HTTP_201_CREATED)
            
    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def logout_view(request):
    """
    Realiza o logout do usuário
    """
    try:
        # Aqui você pode adicionar lógica adicional se necessário
        # Por exemplo, invalidar tokens, limpar sessões, etc.
        
        return Response({
            'message': 'Logout realizado com sucesso!'
        }, status=status.HTTP_200_OK)
            
    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)