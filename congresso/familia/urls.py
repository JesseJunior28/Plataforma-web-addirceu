from django.urls import path
from . import views

urlpatterns = [
    path('', views.api_root, name='api-root'),
    path('participante/cadastro/', views.cadastrar_participante, name='cadastrar_participante'),
    path('congregacao/cadastro/', views.cadastrar_congregacao, name='cadastrar_congregacao'),
    path('evento/cadastro/', views.cadastrar_evento, name='cadastrar_evento'),
    path('congregacao/deletar/<int:congregacao_id>/', views.deletar_congregacao, name='deletar_congregacao'),
    path('evento/deletar/<int:evento_id>/', views.deletar_evento, name='deletar_evento'),
    path('congregacoes/', views.listar_congregacoes, name='listar_congregacoes'),
    path('eventos/', views.listar_eventos, name='listar_eventos'),
    path('camisas/', views.listar_camisas, name='listar_camisas'),
    path('inscricoes/', views.listar_inscricoes, name='listar_inscricoes'),
    path('inscricao/editar/<int:inscricao_id>/', views.editar_inscricao, name='editar_inscricao'),
    path('inscricao/deletar/<int:inscricao_id>/', views.deletar_inscricao, name='deletar_inscricao'),
]
