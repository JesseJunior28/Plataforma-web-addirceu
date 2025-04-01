# Sistema de Gerenciamento de Congressos

## Sobre o projeto
Sistema para gerenciamento de congressos da AD Dirceu, permitindo o cadastro de participantes, controle de camisetas, pagamentos e outros recursos relacionados a eventos.

## Tecnologias
### Backend
- Django
- Django REST Framework
- SQLite (desenvolvimento)

### Frontend
- Next.js 13
- TypeScript
- Tailwind CSS
- React

## Instalação e Execução

### Backend (Django)

1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/plataforma-web-addirceu.git
cd plataforma-web-addirceu
```

2. Crie um ambiente virtual
```bash
python -m venv venv
```

3. Ative o ambiente virtual
```bash
# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

4. Instale as dependências
```bash
pip install -r requirements.txt
```

5. Execute as migrações
```bash
python manage.py migrate
```

6. Crie um superusuário
```bash
python manage.py createsuperuser
```

7. Inicie o servidor backend
```bash
python manage.py runserver
```

O backend estará rodando em `http://localhost:8000`

### Frontend (Next.js)

1. Navegue até a pasta do frontend
```bash
cd frontend/web-addirceu
```

2. Instale as dependências
```bash
npm install
# ou
yarn install
```

3. Inicie o servidor de desenvolvimento
```bash
npm run dev
# ou
yarn dev
```

O frontend estará rodando em `http://localhost:3000`

## APIs disponíveis

- `api/congregacoes/` - Lista todas as congregações
- `api/eventos/` - Lista eventos ativos
- `api/camisas/` - Lista camisas disponíveis
- `api/participante/cadastro/` - Cadastra um novo participante (POST)
- `api/participante/lista/` - Lista todos os participantes (GET)
- `api/participante/editar/<id>/` - Edita um participante (PUT)

## Configuração do Ambiente

### Variáveis de Ambiente (Frontend)

Crie um arquivo `.env.local` na pasta `frontend/web-addirceu` com as seguintes variáveis:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### Variáveis de Ambiente (Backend)

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
DEBUG=True
SECRET_KEY=sua_chave_secreta
ALLOWED_HOSTS=localhost,127.0.0.1
```

## Devs
- Ytallo Gomes
- Jesse
- Ramielke