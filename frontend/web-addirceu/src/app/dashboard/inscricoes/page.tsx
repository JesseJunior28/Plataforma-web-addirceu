"use client"

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { InputMaskWrapper } from '@/components/InputMaskWrapper';
import participanteService from '../../../../../service/participanteService';
import congregacaoService from '../../../../../service/congregacaoService';

export default function InscricoesPage() {
  const [modalAberto, setModalAberto] = useState(false);
  const [modalListagemAberto, setModalListagemAberto] = useState(false);
  const [modalEdicaoAberto, setModalEdicaoAberto] = useState(false);
  const [congressoSelecionado, setCongressoSelecionado] = useState(null);
  const [inscritoParaEditar, setInscritoParaEditar] = useState(null);
  const [inscritos, setInscritos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [termoPesquisa, setTermoPesquisa] = useState('');

  // Lista fixa de congregações
  const congregacoesFixas = [
    "Sede",
    "Beira rio",
    "Parque extrema", 
    "Parque jurema",
    "São Raimundo",
    "Sub dirceu oi",
    "Tancredo Neves",
    "Outra"
  ];

  const congressos = [
    {
      id: 1,
      titulo: "Congresso de Famílias",
      descricao: "Momentos especiais de edificação, comunhão e renovação para toda a família.",
      data: "5-13 de Julho, 2025",
      imagem: "/images/congresso-familias.jpg"
    }
  ];

  const abrirModal = (congressoId) => {
    const congresso = congressos.find(c => c.id === congressoId);
    setCongressoSelecionado(congresso);
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setCongressoSelecionado(null);
  };

  const abrirModalListagem = (congressoId) => {
    const congresso = congressos.find(c => c.id === congressoId);
    setCongressoSelecionado(congresso);
    setModalListagemAberto(true);
  };

  const abrirModalEdicao = (inscrito) => {
    console.log("Abrindo modal de edição para", inscrito);
    setInscritoParaEditar(inscrito);
    setModalListagemAberto(false);
    setModalEdicaoAberto(true);
  };

  const fecharModalEdicao = () => {
    setModalEdicaoAberto(false);
    setInscritoParaEditar(null);
  };

  const salvarEdicao = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    try {
      setLoading(true);
      
      const valorPagoStr = formData.get('valor_pago');
      let valorPago = 0;
      
      if (valorPagoStr && typeof valorPagoStr === 'string') {
        valorPago = parseFloat(valorPagoStr.replace(/\./g, '').replace(',', '.'));
      }
      
      const inscricaoData = {
        forma_pagamento: formData.get('forma_pagamento'),
        valor_pago: valorPago,
        pagamento_feito: formData.get('pagamento_feito') === 'on',
        camisa_entregue: formData.get('camisa_entregue') === 'on',
        observacao: formData.get('observacao')
      };

      await participanteService.editarInscricao(inscritoParaEditar.id, inscricaoData);
      alert('Inscrição atualizada com sucesso!');
      fecharModalEdicao();
      
      // Recarregar a lista após a edição
      setModalListagemAberto(true);
    } catch (error) {
      console.error('Erro ao atualizar:', error);
      alert('Erro ao atualizar inscrição: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const deletarInscricao = async (inscritoId) => {
    if (window.confirm('Tem certeza que deseja excluir esta inscrição?')) {
      try {
        setLoading(true);
        await participanteService.deletarInscricao(inscritoId);
        alert('Inscrição excluída com sucesso!');
        carregarInscricoes(); // Recarrega a lista após deletar
      } catch (error) {
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
      const response = await participanteService.listarInscricoes();
      console.log('Inscrições carregadas:', response);
      
      if (response.inscricoes) {
        setInscritos(response.inscricoes);
      } else if (Array.isArray(response)) {
        setInscritos(response);
      } else {
        setInscritos([]);
      }
    } catch (error) {
      console.error('Erro ao carregar inscrições:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (modalListagemAberto) {
      carregarInscricoes();
    }
  }, [modalListagemAberto]);

  const inscritosFiltrados = useMemo(() => {
    return inscritos.filter(inscrito =>
      inscrito.nome_completo.toLowerCase().includes(termoPesquisa.toLowerCase())
    );
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
            <div className="h-48 bg-gray-200 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold text-gray-500">Imagem do Evento</span>
              </div>
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
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
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
                const formData = new FormData(e.target);
                
                try {
                  const valorPagoStr = formData.get('valor_pago');
                  let valorPago = 0;
                  
                  if (valorPagoStr && typeof valorPagoStr === 'string') {
                    valorPago = parseFloat(valorPagoStr.replace(/\./g, '').replace(',', '.'));
                  }
                  
                  const inscricaoData = {
                    nome_completo: formData.get('nome_completo'),
                    apelido: formData.get('apelido'),
                    cpf: formData.get('cpf'),
                    whatsapp: formData.get('whatsapp'),
                    congregacao: formData.get('congregacao'),
                    tipo_no_evento: formData.get('tipo_no_evento'),
                    cor_camisa: formData.get('cor_camisa'),
                    estilo_camisa: formData.get('estilo_camisa'),
                    tamanho: formData.get('tamanho'),
                    forma_pagamento: formData.get('forma_pagamento'),
                    valor_pago: valorPago,
                    pagamento_feito: formData.get('pagamento_feito') === 'on',
                    camisa_entregue: formData.get('camisa_entregue') === 'on',
                    observacao: formData.get('observacao')
                  };

                  await participanteService.cadastrarParticipante(inscricaoData);
                  alert('Inscrição realizada com sucesso!');
                  fecharModal();
                } catch (error) {
                  console.error('Erro ao cadastrar:', error);
                  alert('Erro ao realizar inscrição: ' + error.message);
                }
              }}>
                <div className="absolute inset-0 bg-blue-50/50 backdrop-blur-3xl -z-10 rounded-xl"></div>
                <div className="bg-white p-6 rounded-xl shadow-lg shadow-blue-100 space-y-6 border border-blue-100">
                  <input type="hidden" name="evento_id" value={congressoSelecionado.id} />
                  <div className="space-y-1">
                    <label className="block text-black font-medium mb-1 text-sm uppercase tracking-wide">
                      Nome completo <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text"
                      name="nome_completo"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black transition-all duration-200 hover:border-blue-500"
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
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black transition-all duration-200 hover:border-blue-500"
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
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black transition-all duration-200 hover:border-blue-500 appearance-none bg-white"
                      defaultValue="participante"
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
                      <label className="inline-flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200 cursor-pointer">
                        <input 
                          type="radio"
                          name="cor_camisa"
                          value="preta"
                          className="mr-2 h-4 w-4 text-blue-600"
                          required
                        />
                        <span className="text-black">Preta</span>
                      </label>
                      <label className="inline-flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200 cursor-pointer">
                        <input 
                          type="radio"
                          name="cor_camisa"
                          value="lilas"
                          className="mr-2 h-4 w-4 text-blue-600"
                        />
                        <span className="text-black">Lilás</span>
                      </label>
                      <label className="inline-flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200 cursor-pointer">
                        <input 
                          type="radio"
                          name="cor_camisa"
                          value="vinho"
                          className="mr-2 h-4 w-4 text-blue-600"
                        />
                        <span className="text-black">Vinho</span>
                      </label>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-black font-medium mb-1 text-sm uppercase tracking-wide">
                      Estilo da Camisa <span className="text-red-500">*</span>
                    </label>
                    <select 
                      name="estilo_camisa"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black transition-all duration-200 hover:border-blue-500 appearance-none bg-white"
                      required
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
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black transition-all duration-200 hover:border-blue-500 appearance-none bg-white"
                      required
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
                      defaultValue="especie"
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
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black transition-all duration-200 hover:border-blue-500"
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
              <h2 className="text-2xl font-bold text-blue-800">Inscritos - {congressoSelecionado.titulo}</h2>
              <button 
                onClick={() => setModalListagemAberto(false)}
                className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              {/* Adicione o campo de pesquisa aqui */}
              <div className="mb-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Pesquisar por nome..."
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
                      d="M9 3.5a5.5 5.5 5.5 0 100 11 5.5 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
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
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pagamento</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {inscritosFiltrados.map((inscrito) => (
                        <tr key={inscrito.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{inscrito.nome_completo}</div>
                            <div className="text-sm text-gray-500">{inscrito.whatsapp || 'Sem contato'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{inscrito.congregacao}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              inscrito.pagamento_feito 
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
                      readOnly
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
                      readOnly
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
                      <label className="inline-flex items-center p-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-700 cursor-not-allowed">
                        <input 
                          type="radio"
                          name="cor_camisa"
                          value="preta"
                          className="mr-2 h-4 w-4 text-blue-600"
                          defaultChecked={inscritoParaEditar.cor_camisa === "preta"}
                          disabled
                        />
                        <span className="text-black">Preta</span>
                      </label>
                      <label className="inline-flex items-center p-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-700 cursor-not-allowed">
                        <input 
                          type="radio"
                          name="cor_camisa"
                          value="lilas"
                          className="mr-2 h-4 w-4 text-blue-600"
                          defaultChecked={inscritoParaEditar.cor_camisa === "lilas"}
                          disabled
                        />
                        <span className="text-black">Lilás</span>
                      </label>
                      <label className="inline-flex items-center p-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-700 cursor-not-allowed">
                        <input 
                          type="radio"
                          name="cor_camisa"
                          value="vinho"
                          className="mr-2 h-4 w-4 text-blue-600"
                          defaultChecked={inscritoParaEditar.cor_camisa === "vinho"}
                          disabled
                        />
                        <span className="text-black">Vinho</span>
                      </label>
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