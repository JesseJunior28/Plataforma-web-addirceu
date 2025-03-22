# Sistema de Gerenciamento de Congressos

## Sobre o projeto
Sistema para gerenciamento de congressos da AD Dirceu, permitindo o cadastro de participantes, controle de camisetas, pagamentos e outros recursos relacionados a eventos.

## Tecnologias
- Django
- Django REST Framework
- SQLite (desenvolvimento)

## Instalação

1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/plataforma-web-addirceu.git
cd plataforma-web-addirceu
```

2. Instale as dependências
```bash
pip install -r requirements.txt
```

3. Execute as migrações
```bash
python manage.py migrate
```

4. Crie um superusuário
```bash
python manage.py createsuperuser
```

5. Inicie o servidor
```bash
python manage.py runserver
```

## APIs disponíveis

- `api/congregacoes/` - Lista todas as congregações
- `api/eventos/` - Lista eventos ativos
- `api/camisas/` - Lista camisas disponíveis
- `api/participante/cadastro/` - Cadastra um novo participante (POST)

## Devs
- Ytallo Gomes
- Jesse
- Ramielke  