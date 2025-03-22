from django.urls import path
from . import views

urlpatterns = [
    path('', views.api_root, name='api-root'),
    path('participante/cadastro/', views.cadastrar_participante, name='cadastrar_participante'),
    path('congregacoes/', views.listar_congregacoes, name='listar_congregacoes'),
    path('eventos/', views.listar_eventos, name='listar_eventos'),
    path('camisas/', views.listar_camisas, name='listar_camisas'),
]
