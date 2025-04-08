"use client"

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { InputMaskWrapper } from '@/components/InputMaskWrapper';
import participanteService from '../../../../../service/participanteService';
import congregacaoService from '../../../../../service/congregacaoService';

interface Congresso {
  id: number;
  titulo: string;
  descricao: string;
  data: string;
  imagem: string;
  evento: string;
}

interface Inscrito {
  id: number;
  nome_completo: string;
  apelido?: string;
  cpf?: string;
  whatsapp: string;
  congregacao: string;
  tipo_no_evento: string;
  tipo_evento?: string;
  cor_camisa: string;
  estilo_camisa: string;
  tamanho: string;
  forma_pagamento?: string;
  valor_pago?: number;
  valor_pago_formatado?: string;
  pagamento_feito: boolean;
  camisa_entregue: boolean;
  observacao?: string;
}

export default function InscricoesPage() {
  const [modalAberto, setModalAberto] = useState(false);
  const [modalListagemAberto, setModalListagemAberto] = useState(false);
  const [modalEdicaoAberto, setModalEdicaoAberto] = useState(false);
  const [congressoSelecionado, setCongressoSelecionado] = useState<Congresso | null>(null);
  const [inscritoParaEditar, setInscritoParaEditar] = useState<Inscrito | null>(null);
  const [inscritos, setInscritos] = useState<Inscrito[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [termoPesquisa, setTermoPesquisa] = useState('');

  // Lista fixa de congregações
  const congregacoesFixas = [
    "SEDE",
    "BEIRA RIO",
    "DEUS QUER",
    "ILHOTAS",
    "LAGOA DO PIRIPIRI",
    "LOURIVAL PARENTE",
    "PARQUE EXTREMA",
    "PARQUE IDEAL",
    "PARQUE JUREMA",
    "PARQUE SUL",
    "PIÇARREIRA",
    "RENASCENÇA I",
    "SANTA ISABEL",
    "SÃO RAIMUNDO",
    "SUB DIRCEU II",
    "TANCREDO NEVES",
    "TIMON",
    "VILA VERDE",
    "OUTRA"
  ];

  // Lista fixa de tipos de evento
  const tiposEvento = [
    "Congresso de Homens",
    "Congresso de Mulheres",
    "Congresso de Criança"
  ];

  const coresPorCongresso = {
    1: ["PRETA", "LILÁS"],
    2: ["VINHO"],
    3: ["BRANCO"]
  };

  const estilosPorCongresso = {
    1: ["NORMAL", "BABYLOOK"],
    2: ["NORMAL"],
    3: ["NORMAL"]
  };

  // 1. Defina os tamanhos permitidos por congresso
  const tamanhosPorCongresso: Record<number, string[]> = {
    1: ["PP", "P", "M", "G", "GG", "EXG", "SOB MEDIDA"],
    2: ["PP", "P", "M", "G", "GG", "EXG", "SOB MEDIDA"],
    3: ["2 ANOS", "4 ANOS", "6 ANOS", "8 ANOS", "10 ANOS", "12 ANOS", "14 ANOS", "PP", "P", "M", "G", "SOB MEDIDA"],
  };

  const [observacao, setObservacao] = useState("");

  const [nomeCompleto, setNomeCompleto] = useState("");

  const [apelido, setApelido] = useState("");

  const congressos = [
    {
      id: 1,
      titulo: "Congresso de Mulheres",
      descricao: "Momentos especiais de edificação, comunhão e renovação para toda a família.",
      data: "5-7 de Julho, 2025",
      imagem: "/congresso_familia.jpeg",
      evento: "Congresso de Mulheres"
    },
    {
      id: 2,
      titulo: "Congresso de Homens",
      descricao: "Momentos especiais de edificação, comunhão e renovação para toda a família.",
      data: "11-13 de Julho, 2025",
      imagem: "/congresso_familia.jpeg",
      evento: "Congresso de Homens"
    },
    {
      id: 3,
      titulo: "Congresso de Crianças",
      descricao: "Momentos especiais de edificação, comunhão e renovação para toda a família.",
      data: "5-7 de Julho, 2025",
      imagem: "/congresso_familia.jpeg",
      evento: "Congresso de Criança"
    }
  ];

  const id = congressoSelecionado?.id as 1 | 2 | 3 | undefined;
  const opcoesCores = id ? coresPorCongresso[id] : [];

  const id2 = congressoSelecionado?.id as 1 | 2 | 3 | undefined;
  const opcoesEstilo = id ? estilosPorCongresso[id] : [];

  const tamanhosDisponiveis =
    congressoSelecionado?.id && tamanhosPorCongresso[congressoSelecionado.id]
      ? tamanhosPorCongresso[congressoSelecionado.id]
      : [];

  const abrirModal = (congressoId: number) => {
    const congresso = congressos.find(c => c.id === congressoId);
    setCongressoSelecionado(congresso || null);
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setCongressoSelecionado(null);
  };

  const abrirModalListagem = (congressoId: number) => {
    const congresso = congressos.find(c => c.id === congressoId);
    setCongressoSelecionado(congresso || null);
    setModalListagemAberto(true);
  };

  const abrirModalEdicao = (inscrito: Inscrito) => {
    console.log("Abrindo modal de edição para", inscrito);
    setInscritoParaEditar(inscrito);
    setModalListagemAberto(false);
    setModalEdicaoAberto(true);
  };

  const fecharModalEdicao = () => {
    setModalEdicaoAberto(false);
    setInscritoParaEditar(null);
  };

  const salvarEdicao = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      setLoading(true);

      const valorPagoStr = formData.get('valor_pago') as string;
      let valorPago = 0;

      if (valorPagoStr) {
        valorPago = parseFloat(valorPagoStr.replace(/\./g, '').replace(',', '.'));
      }

      const inscricaoData = {
        forma_pagamento: formData.get('forma_pagamento') as string,
        valor_pago: valorPago,
        pagamento_feito: formData.get('pagamento_feito') === 'on',
        camisa_entregue: formData.get('camisa_entregue') === 'on',
        observacao: formData.get('observacao') as string
      };

      await participanteService.editarInscricao(inscritoParaEditar!.id, inscricaoData);
      alert('Inscrição atualizada com sucesso!');
      fecharModalEdicao();
      window.location.reload(); // Adiciona o refresh da página aqui
    } catch (error: any) {
      console.error('Erro ao atualizar:', error);
      alert('Erro ao atualizar inscrição: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const deletarInscricao = async (inscritoId: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta inscrição?')) {
      try {
        setLoading(true);
        await participanteService.deletarInscricao(inscritoId);
        alert('Inscrição excluída com sucesso!');
        carregarInscricoes(); // Recarrega a lista após deletar
      } catch (error: any) {
        console.error('Erro ao deletar:', error);
        alert('Erro ao excluir inscrição: ' + error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const carregarInscricoes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await participanteService.listarInscricoes();
      console.log('Resposta da API:', response);

      if (!response) {
        throw new Error('Não foi possível obter os dados dos inscritos');
      }

      let inscricoes: Inscrito[] = [];
      
      if (response.inscricoes) {
        inscricoes = response.inscricoes;
      } else if (Array.isArray(response)) {
        inscricoes = response;
      } else {
        throw new Error('Formato de resposta inválido');
      }

      // Filtra as inscrições pelo tipo de evento do congresso selecionado
      const inscricoesFiltradas = inscricoes.filter(
        inscrito => inscrito.tipo_evento === congressoSelecionado?.evento
      );

      setInscritos(inscricoesFiltradas);

    } catch (error: any) {
      console.error('Erro detalhado:', error);
      setError(error.message || 'Erro ao carregar as inscrições');
      setInscritos([]);
    } finally {
      setLoading(false);
    }
  };

  const exportarParaCSV = () => {
    if (inscritosFiltrados.length === 0) {
      alert('Não há dados para exportar.');
      return;
    }

    // Define os headers do CSV
    const headers = [
      'Nome Completo',
      'Apelido',
      'CPF',
      'WhatsApp',
      'Congregação',
      'Tipo no Evento',
      'Tipo Evento',
      'Cor Camisa',
      'Estilo Camisa',
      'Tamanho',
      'Forma Pagamento',
      'Valor Pago',
      'Pagamento Feito',
      'Camisa Entregue',
      'Observação'
    ];

    // Mapeia os dados dos inscritos para o formato CSV
    const dados = inscritosFiltrados.map(inscrito => [
      inscrito.nome_completo,
      inscrito.apelido || '',
      inscrito.cpf || '',
      inscrito.whatsapp,
      inscrito.congregacao,
      inscrito.tipo_no_evento,
      inscrito.tipo_evento,
      inscrito.cor_camisa,
      inscrito.estilo_camisa,
      inscrito.tamanho,
      inscrito.forma_pagamento || '',
      inscrito.valor_pago_formatado || '0,00',
      inscrito.pagamento_feito ? 'Sim' : 'Não',
      inscrito.camisa_entregue ? 'Sim' : 'Não',
      inscrito.observacao || ''
    ]);

    // Cria o conteúdo do CSV
    const csvContent = [
      headers.join(';'),
      ...dados.map(row => row.join(';'))
    ].join('\n');

    // Cria um Blob com o conteúdo do CSV
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    // Configura o link de download
    link.setAttribute('href', url);
    link.setAttribute('download', `inscritos_${congressoSelecionado?.titulo.toLowerCase().replace(/ /g, '_')}_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);

    // Dispara o download
    link.click();

    // Limpa o objeto URL e remove o link
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    if (congressoSelecionado?.id === 3) {
      setObservacao("NOME DO RESPONSÁVEL:");
    } else {
      setObservacao(""); // Limpa ou mantém, se quiser preservar outro texto
    }
  }, [congressoSelecionado]);

  useEffect(() => {
    if (modalListagemAberto && congressoSelecionado) {
      carregarInscricoes();
    }
  }, [modalListagemAberto, congressoSelecionado]);

  const inscritosFiltrados = useMemo(() => {
    return inscritos
      .filter(inscrito => {
        const termoPesquisaLower = termoPesquisa.toLowerCase();
        return inscrito.nome_completo.toLowerCase().includes(termoPesquisaLower) ||
               inscrito.congregacao.toLowerCase().includes(termoPesquisaLower);
      })
      .sort((a, b) => a.nome_completo.localeCompare(b.nome_completo));
  }, [inscritos, termoPesquisa]);

  return (
    <div className="space-y-6 relative">
      <h1 className="text-3xl font-bold text-blue-800">Inscrições Abertas</h1>
      <p className="text-lg text-gray-700">
        Confira o congresso disponível e realize sua inscrição.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {congressos.map((congresso) => (
          <div key={congresso.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-48 relative">
              <img
                src={congresso.imagem}
                alt={`Imagem do ${congresso.titulo}`}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2 text-black">{congresso.titulo}</h2>
              <p className="text-gray-700 mb-3">{congresso.descricao}</p>
              <p className="text-sm font-medium text-blue-600 mb-4">{congresso.data}</p>
              <div className="flex flex-col space-y-2">
                <button
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  onClick={() => abrirModal(congresso.id)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                  </svg>
                  Fazer Inscrição
                </button>
                <button
                  className="w-full border border-yellow-500 text-yellow-600 py-2 px-4 rounded-md hover:bg-yellow-50 transition-colors flex items-center justify-center gap-2"
                  onClick={() => abrirModalListagem(congresso.id)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8-379-2.83-2.828z" />
                  </svg>
                  Inscritos
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Inscrição */}
      {modalAberto && congressoSelecionado && (
        <div className="fixed inset-0 flex items-center justify-center z-[9999] p-4 backdrop-blur-md bg-black/20">
          <div
            className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-fadeIn"
            style={{
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)'
            }}
          >
            <div className="sticky top-0 bg-white p-6 border-b border-gray-200 flex justify-between items-center backdrop-blur-xl bg-white/80">
              <div className="flex items-center gap-3">
                <img
                  src="/addirceu.png"
                  alt="Logo AD Dirceu"
                  className="w-10 h-10 object-contain rounded-full bg-white p-1"
                />
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-800 to-blue-600 bg-clip-text text-transparent">
                  Inscrição - {congressoSelecionado.titulo}
                </h2>
              </div>
              <button
                onClick={fecharModal}
                className="text-gray-500 hover:text-gray-700 transition-all duration-200 p-2 rounded-full hover:bg-gray-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-8 bg-gradient-to-br from-blue-50 to-white">
              <form className="space-y-8 relative" onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);

                try {
                  const valorPagoStr = formData.get('valor_pago') as string;
                  let valorPago = 0;

                  if (valorPagoStr) {
                    valorPago = parseFloat(valorPagoStr.replace(/\./g, '').replace(',', '.'));
                  }

                  const inscricaoData = {
                    nome_completo: formData.get('nome_completo') as string,
                    apelido: formData.get('apelido') as string,
                    cpf: formData.get('cpf') as string,
                    whatsapp: formData.get('whatsapp') as string,
                    congregacao: formData.get('congregacao') as string,
                    tipo_no_evento: formData.get('tipo_no_evento') as string, // Aqui vai o tipo: participante, concentrador, etc
                    tipo_evento: formData.get('tipo_evento') as string, // Aqui vai o tipo do congresso: Mulheres, Crianças, etc
                    cor_camisa: formData.get('cor_camisa') as string,
                    estilo_camisa: formData.get('estilo_camisa') as string,
                    tamanho: formData.get('tamanho') as string,
                    forma_pagamento: formData.get('forma_pagamento') as string,
                    valor_pago: valorPago,
                    pagamento_feito: formData.get('pagamento_feito') === 'on',
                    camisa_entregue: formData.get('camisa_entregue') === 'on',
                    observacao: formData.get('observacao') as string
                  };

                  await participanteService.cadastrarParticipante(inscricaoData);
                  alert('Inscrição realizada com sucesso!');
                  fecharModal();
                  window.location.reload(); // Adiciona o refresh da página aqui
                } catch (error: any) {
                  console.error('Erro ao cadastrar:', error);
                  alert('Erro ao realizar inscrição: ' + error.message);
                }
              }}>
                <div className="absolute inset-0 bg-blue-50/50 backdrop-blur-3xl -z-10 rounded-xl"></div>
                <div className="bg-white p-6 rounded-xl shadow-lg shadow-blue-100 space-y-6 border border-blue-100">
                  <input type="hidden" name="evento_id" value={congressoSelecionado.id} />
                  <input type="hidden" name="tipo_no_evento" value="participante" />
                  <input type="hidden" name="tipo_evento" value={congressoSelecionado.evento} />

                  <div className="space-y-1">
                    <label className="block text-black font-medium mb-1 text-sm uppercase tracking-wide">
                      Nome completo <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="nome_completo"
                      value={nomeCompleto}
                      onChange={(e) => setNomeCompleto(e.target.value.toUpperCase())}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black transition-all duration-200 hover:border-blue-500 uppercase"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-black font-medium mb-1 text-sm uppercase tracking-wide">
                      Apelido
                    </label>
                    <input
                      type="text"
                      name="apelido"
                      value={apelido}
                      onChange={(e) => setApelido(e.target.value.toUpperCase())}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black transition-all duration-200 hover:border-blue-500 uppercase"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-black font-medium mb-1 text-sm uppercase tracking-wide">
                      CPF
                    </label>
                    <InputMaskWrapper
                      mask="999.999.999-99"
                      type="text"
                      name="cpf"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black transition-all duration-200 hover:border-blue-500"

                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-black font-medium mb-1 text-sm uppercase tracking-wide">
                      WhatsApp <span className="text-red-500">*</span>
                    </label>
                    <InputMaskWrapper
                      mask="(99) 99999-9999"
                      type="tel"
                      name="whatsapp"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black transition-all duration-200 hover:border-blue-500"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-black font-medium mb-1 text-sm uppercase tracking-wide">
                      Congregação <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="congregacao"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black transition-all duration-200 hover:border-blue-500 appearance-none bg-white"
                      required
                    >
                      <option value="">Selecione</option>
                      {congregacoesFixas.map((congregacao, index) => (
                        <option key={index} value={congregacao}>
                          {congregacao}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-black font-medium mb-1 text-sm uppercase tracking-wide">
                      Cor da camisa <span className="text-red-500">*</span>
                    </label>
                    <div className="flex space-x-6">
                      {opcoesCores.map((cor, index) => (
                        <label
                          key={index}
                          className="inline-flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200 cursor-pointer">
                          <input
                            type="radio"
                            name="cor_camisa"
                            value={cor.toLowerCase()}
                            className="mr-2 h-4 w-4 text-blue-600"
                            required={index === 0} // Aplica required apenas no primeiro
                          />
                          <span className="text-black">{cor}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-black font-medium mb-1 text-sm uppercase tracking-wide">
                      Estilo da Camisa <span className="text-red-500">*</span>
                    </label>
                    <div className="flex space-x-6">
                      {opcoesEstilo.map((estilo, index) => (
                        <label
                          key={index}
                          className="inline-flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200 cursor-pointer"                        >
                          <input
                            type="radio"
                            name="estilo_camisa"
                            value={estilo.toUpperCase()}
                            className="mr-2 h-4 w-4 text-blue-600"
                            required={index === 0} />
                          <span className="text-black">{estilo}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-black font-medium mb-1 text-sm uppercase tracking-wide">
                      Tamanho da camisa <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="tamanho"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 text-gray-700 appearance-none"
                      defaultValue={inscritoParaEditar?.tamanho || ""}
                      disabled={!congressoSelecionado} // Evita erro antes de selecionar
                      required
                    >
                      <option value="">Selecione...</option>
                      {tamanhosDisponiveis.map((tamanho) => (
                        <option key={tamanho} value={tamanho}>
                          {tamanho}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-black font-medium mb-1 text-sm uppercase tracking-wide">
                      Forma de Pagamento
                    </label>
                    <select
                      name="forma_pagamento"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black transition-all duration-200 hover:border-blue-500 appearance-none bg-white"
                      defaultValue="especie"
                    >
                      <option value="">Selecione</option>
                      <option value="especie">Espécie</option>
                      <option value="pix">PIX</option>
                      <option value="cartao">Cartão</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-black font-medium mb-1 text-sm uppercase tracking-wide">
                      Valor Pago
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        R$
                      </span>
                      <input
                        type="text"
                        name="valor_pago"
                        className="w-full border border-gray-300 rounded-lg pl-8 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black transition-all duration-200 hover:border-blue-500"
                        placeholder="0,00"
                        onChange={(e) => {
                          let value = e.target.value.replace(/\D/g, '');
                          const numericValue = Number(value) / 100;
                          e.target.value = numericValue.toLocaleString('pt-BR', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          });
                        }}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-black font-medium mb-1 text-sm uppercase tracking-wide">
                      Status do Pagamento
                    </label>
                    <label className="inline-flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200 cursor-pointer">
                      <input
                        type="checkbox"
                        name="pagamento_feito"
                        className="mr-2 h-4 w-4 text-blue-600 rounded"
                      />
                      <span className="text-black">Pagamento Realizado</span>
                    </label>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-black font-medium mb-1 text-sm uppercase tracking-wide">
                      Status da Camisa
                    </label>
                    <label className="inline-flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200 cursor-pointer">
                      <input
                        type="checkbox"
                        name="camisa_entregue"
                        className="mr-2 h-4 w-4 text-blue-600 rounded"
                      />
                      <span className="text-black">Camisa Entregue</span>
                    </label>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-black font-medium mb-1 text-sm uppercase tracking-wide">
                      Observação
                    </label>
                    <textarea
                      name="observacao"
                      rows={3}
                      value={observacao}
                      onChange={(e) => setObservacao(e.target.value.toUpperCase())}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black transition-all duration-200 hover:border-blue-500 uppercase"
                    ></textarea>
                  </div>
                </div>
                <div className="pt-6 flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={fecharModal}
                    className="px-6 py-3 border border-blue-200 rounded-lg text-blue-700 hover:bg-blue-50 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-medium shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transform hover:-translate-y-0.5"
                  >
                    Confirmar Inscrição
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Listagem de Inscritos */}
      {modalListagemAberto && (
        <div className="fixed inset-0 flex items-center justify-center z-[9999] p-4 backdrop-blur-md bg-black/20">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-blue-800">Inscritos - {congressoSelecionado?.titulo}</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={exportarParaCSV}
                  className="text-green-600 hover:text-green-800 p-2 hover:bg-green-50 rounded-lg transition-colors flex items-center gap-2"
                  title="Exportar para CSV"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd"/>
                  </svg>
                  <span>Exportar CSV</span>
                </button>
                <button
                  onClick={() => setModalListagemAberto(false)}
                  className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6">
              {/* Adicione o campo de pesquisa aqui */}
              <div className="mb-4">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Pesquisar por nome ou congregação..."
                    value={termoPesquisa}
                    onChange={(e) => setTermoPesquisa(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                  />
                  <svg
                    className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 3.5a5.5 5.5 5.5 0 100 11 5.5 5.5 5.5 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
                  <span className="ml-3 text-lg">Carregando inscrições...</span>
                </div>
              ) : error ? (
                <div className="bg-red-50 border border-red-300 p-4 rounded-md text-red-800">
                  <p className="font-medium">Erro ao carregar inscrições:</p>
                  <p>{error}</p>
                </div>
              ) : inscritosFiltrados.length === 0 ? (
                <div className="bg-yellow-50 border border-yellow-300 p-4 rounded-md">
                  <p className="text-yellow-800">
                    {inscritos.length === 0 ? "Nenhuma inscrição encontrada." : "Nenhum resultado encontrado para a pesquisa."}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Congregação</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo do Evento</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pagamento</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {[...inscritosFiltrados]
                        .sort((a, b) => a.nome_completo.localeCompare(b.nome_completo))
                        .map((inscrito) => (
                          <tr key={inscrito.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{inscrito.nome_completo}</div>
                              <div className="text-sm text-gray-500">{inscrito.whatsapp || 'Sem contato'}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{inscrito.congregacao}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-blue-600 font-medium">{inscrito.tipo_evento}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${inscrito.pagamento_feito
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                                }`}>
                                {inscrito.pagamento_feito ? "Pago" : "Pendente"}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex justify-end space-x-2">
                                <button
                                  onClick={() => abrirModalEdicao(inscrito)}
                                  className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-full transition-colors"
                                  title="Editar inscrição"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                  </svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal de Edição */}
      {modalEdicaoAberto && inscritoParaEditar && (
        <div className="fixed inset-0 flex items-center justify-center z-[9999] p-4 backdrop-blur-md bg-black/20">
          <div
            className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-fadeIn"
            style={{
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)'
            }}
          >
            <div className="sticky top-0 bg-white p-6 border-b border-gray-200 flex justify-between items-center backdrop-blur-xl bg-white/80">
              <div className="flex items-center gap-3">
                <img
                  src="/addirceu.png"
                  alt="Logo AD Dirceu"
                  className="w-10 h-10 object-contain rounded-full bg-white p-1"
                />
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-800 to-blue-600 bg-clip-text text-transparent">
                  Editar Inscrição - {inscritoParaEditar.nome_completo}
                </h2>
              </div>
              <button
                onClick={fecharModalEdicao}
                className="text-gray-500 hover:text-gray-700 transition-all duration-200 p-2 rounded-full hover:bg-gray-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-8 bg-gradient-to-br from-blue-50 to-white">
              <form className="space-y-8 relative" onSubmit={salvarEdicao}>
                <div className="absolute inset-0 bg-blue-50/50 backdrop-blur-3xl -z-10 rounded-xl"></div>
                <div className="bg-white p-6 rounded-xl shadow-lg shadow-blue-100 space-y-6 border border-blue-100">

                  {/* Campo tipo de evento (somente visualização) */}
                  <div className="space-y-1">
                    <label className="block text-black font-medium mb-1 text-sm uppercase tracking-wide">
                      Evento
                    </label>
                    <select
                      name="tipo_evento"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 text-gray-700 appearance-none"
                      defaultValue={inscritoParaEditar.tipo_evento || ""}
                      disabled
                    >
                      <option value="">Não especificado</option>
                      {tiposEvento.map((tipo, index) => (
                        <option key={index} value={tipo}>
                          {tipo}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-black font-medium mb-1 text-sm uppercase tracking-wide">
                      Nome completo <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="nome_completo"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 text-gray-700"
                      defaultValue={inscritoParaEditar.nome_completo}
                      readOnly
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-black font-medium mb-1 text-sm uppercase tracking-wide">
                      Apelido
                    </label>
                    <input
                      type="text"
                      name="apelido"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 text-gray-700"
                      defaultValue={inscritoParaEditar.apelido}
                      readOnly
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-black font-medium mb-1 text-sm uppercase tracking-wide">
                      CPF
                    </label>
                    <InputMaskWrapper
                      mask="999.999.999-99"
                      type="text"
                      name="cpf"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 text-gray-700"
                      defaultValue={inscritoParaEditar.cpf}
                      disabled={true}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-black font-medium mb-1 text-sm uppercase tracking-wide">
                      WhatsApp <span className="text-red-500">*</span>
                    </label>
                    <InputMaskWrapper
                      mask="(99) 99999-9999"
                      type="tel"
                      name="whatsapp"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 text-gray-700"
                      defaultValue={inscritoParaEditar.whatsapp}
                      disabled={true}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-black font-medium mb-1 text-sm uppercase tracking-wide">
                      Congregação <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="congregacao"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 text-gray-700 appearance-none"
                      defaultValue={inscritoParaEditar.congregacao}
                      disabled
                    >
                      <option value="">Selecione...</option>
                      {congregacoesFixas.map((congregacao, index) => (
                        <option key={index} value={congregacao}>
                          {congregacao}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-black font-medium mb-1 text-sm uppercase tracking-wide">
                      Tipo no Evento
                    </label>
                    <select
                      name="tipo_no_evento"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 text-gray-700 appearance-none"
                      defaultValue={inscritoParaEditar.tipo_no_evento}
                      disabled
                    >
                      <option value="participante">Participante</option>
                      <option value="concentrador">Concentrador</option>
                      <option value="lideranca">Liderança</option>
                      <option value="organizacao">Organização</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-black font-medium mb-1 text-sm uppercase tracking-wide">
                      Cor da camisa <span className="text-red-500">*</span>
                    </label>
                    <div className="flex space-x-6">
                      {opcoesCores.map((cor, index) => (
                        <label
                          key={index}
                          className="inline-flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="cor_camisa"
                            value={cor.toLowerCase()}
                            className="mr-2 h-4 w-4 text-blue-600"
                            required={index === 0} // Aplica required apenas no primeiro
                          />
                          <span className="text-black">{cor}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-black font-medium mb-1 text-sm uppercase tracking-wide">
                      Estilo da Camisa <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="estilo_camisa"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 text-gray-700 appearance-none"
                      defaultValue={inscritoParaEditar.estilo_camisa}
                      disabled
                    >
                      <option value="">Selecione...</option>
                      <option value="normal">Normal</option>
                      <option value="babylook">Babylook</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-black font-medium mb-1 text-sm uppercase tracking-wide">
                      Tamanho da camisa <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="tamanho"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 text-gray-700 appearance-none"
                      defaultValue={inscritoParaEditar.tamanho}
                      disabled
                    >
                      <option value="">Selecione...</option>
                      <option value="PP">PP</option>
                      <option value="P">P</option>
                      <option value="M">M</option>
                      <option value="G">G</option>
                      <option value="GG">GG</option>
                      <option value="EXG">EXG</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-black font-medium mb-1 text-sm uppercase tracking-wide">
                      Forma de Pagamento
                    </label>
                    <select
                      name="forma_pagamento"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black transition-all duration-200 hover:border-blue-500 appearance-none bg-white"
                      defaultValue={inscritoParaEditar.forma_pagamento || "especie"}
                    >
                      <option value="especie">Espécie</option>
                      <option value="pix">PIX</option>
                      <option value="cartao">Cartão</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-black font-medium mb-1 text-sm uppercase tracking-wide">
                      Valor Pago
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        R$
                      </span>
                      <input
                        type="text"
                        name="valor_pago"
                        className="w-full border border-gray-300 rounded-lg pl-8 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black transition-all duration-200 hover:border-blue-500"
                        defaultValue={inscritoParaEditar.valor_pago_formatado ?
                          inscritoParaEditar.valor_pago_formatado.replace('R$ ', '') :
                          inscritoParaEditar.valor_pago
                        }
                        onChange={(e) => {
                          let value = e.target.value.replace(/\D/g, '');
                          const numericValue = Number(value) / 100;
                          e.target.value = numericValue.toLocaleString('pt-BR', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          });
                        }}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-black font-medium mb-1 text-sm uppercase tracking-wide">
                      Status do Pagamento
                    </label>
                    <label className="inline-flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200 cursor-pointer">
                      <input
                        type="checkbox"
                        name="pagamento_feito"
                        className="mr-2 h-4 w-4 text-blue-600 rounded"
                        defaultChecked={inscritoParaEditar.pagamento_feito}
                      />
                      <span className="text-black">Pagamento Realizado</span>
                    </label>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-black font-medium mb-1 text-sm uppercase tracking-wide">
                      Status da Camisa
                    </label>
                    <label className="inline-flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200 cursor-pointer">
                      <input
                        type="checkbox"
                        name="camisa_entregue"
                        className="mr-2 h-4 w-4 text-blue-600 rounded"
                        defaultChecked={inscritoParaEditar.camisa_entregue}
                      />
                      <span className="text-black">Camisa Entregue</span>
                    </label>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-black font-medium mb-1 text-sm uppercase tracking-wide">
                      Observação
                    </label>
                    <textarea
                      name="observacao"
                      rows={3}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black transition-all duration-200 hover:border-blue-500"
                      defaultValue={inscritoParaEditar.observacao}
                    ></textarea>
                  </div>
                </div>
                <div className="pt-6 flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={fecharModalEdicao}
                    className="px-6 py-3 border border-blue-200 rounded-lg text-blue-700 hover:bg-blue-50 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                    disabled={loading}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-medium shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transform hover:-translate-y-0.5"
                    disabled={loading}
                  >
                    {loading ? 'Salvando...' : 'Salvar Alterações'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}