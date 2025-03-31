# Serviços de API

Esta pasta contém todos os serviços utilizados para comunicação com o backend.

## Arquivos disponíveis

- `api.js` - Configuração base do Axios e interceptadores
- `participanteService.js` - Funções para gerenciar participantes e inscrições
- `congregacaoService.js` - Funções para gerenciar congregações
- `eventoService.js` - Funções para gerenciar eventos
- `index.js` - Exportação centralizada de todos os serviços

## Como usar

```javascript
// Importando serviços individuais
import { participanteService } from '../service';

// Ou importando todos os serviços
import services from '../service';

// Exemplo de cadastro de participante
const handleCadastro = async () => {
  try {
    const response = await participanteService.cadastrarParticipante({
      evento_id: 1,
      congregacao_id: 2,
      nome_completo: 'Nome do Participante',
      cor_camisa: 'Azul',
      tamanho: 'M'
    });
    console.log('Participante cadastrado com sucesso!', response);
  } catch (error) {
    console.error('Erro ao cadastrar:', error.message);
  }
};

// Exemplo de tratamento de erro centralizado
import { handleApiError } from '../service';

const fetchData = async () => {
  try {
    const data = await services.evento.listarEventos();
    setEventos(data.eventos);
  } catch (error) {
    handleApiError(error, setErrorMessage);
  }
};
```

## Endpoints disponíveis

### Participantes
- `cadastrarParticipante(participanteData)` - Cadastra um novo participante
- `listarInscricoes(page, pageSize, filters)` - Lista inscrições com paginação e filtros opcionais
- `editarInscricao(inscricaoId, inscricaoData)` - Edita uma inscrição existente
- `deletarInscricao(inscricaoId)` - Remove uma inscrição

### Congregações
- `listarCongregacoes()` - Lista todas as congregações
- `buscarCongregacao(nome)` - Busca congregações por nome
- `cadastrarCongregacao(congregacaoData)` - Cadastra uma nova congregação
- `deletarCongregacao(congregacaoId)` - Remove uma congregação

### Eventos
- `listarEventos(incluirPassados)` - Lista eventos ativos ou todos os eventos
- `buscarEvento(id)` - Busca um evento específico
- `cadastrarEvento(eventoData)` - Cadastra um novo evento
- `editarEvento(eventoId, eventoData)` - Edita um evento existente
- `deletarEvento(eventoId)` - Remove um evento
