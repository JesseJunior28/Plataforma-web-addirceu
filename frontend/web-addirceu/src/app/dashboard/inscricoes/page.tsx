"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import { InputMaskWrapper } from '@/components/InputMaskWrapper';

// Dados mockados para teste
const inscritosMock = [
  {
    id: 1,
    nome: "João Silva",
    apelido: "João",
    cpf: "123.456.789-00",
    telefone: "(86) 99999-9999",
    congregacao: "Sede",
    corCamisa: "Preta",
    estilo: "Normal",
    tamanhoCamisa: "G",
    inscricaoFeita: "10/01/2024",
    status: "Confirmada"
  },
  {
    id: 2,
    nome: "Maria Santos",
    apelido: "Mari",
    cpf: "987.654.321-00",
    telefone: "(86) 98888-8888",
    congregacao: "Vila Nova",
    corCamisa: "Preta",
    estilo: "Babylook",
    tamanhoCamisa: "M",
    inscricaoFeita: "11/01/2024",
    status: "Pendente"
  }
];

export default function InscricoesPage() {
  const [modalAberto, setModalAberto] = useState(false);
  const [modalListagemAberto, setModalListagemAberto] = useState(false);
  const [modalEdicaoAberto, setModalEdicaoAberto] = useState(false);
  const [congressoSelecionado, setCongressoSelecionado] = useState(null);
  const [inscritoParaEditar, setInscritoParaEditar] = useState(null);

  const congregacoes = [
    "Sede", 
    "Jardim Pérola", 
    "Vila Nova", 
    "Centro", 
    "Jardim São Paulo",
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
    setInscritoParaEditar(inscrito);
    setModalListagemAberto(false);
    setModalEdicaoAberto(true);
  };

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
                  Editar Inscrição
                </button>
                
                <button 
                  className="w-full border border-red-500 text-red-600 py-2 px-4 rounded-md hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                  onClick={() => console.log('Excluir inscrição')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Excluir Inscrição
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
              <form className="space-y-8 relative" onSubmit={(e) => {
                e.preventDefault();
                // TODO: Implementar envio dos dados
              }}>
                <div className="absolute inset-0 bg-blue-50/50 backdrop-blur-3xl -z-10 rounded-xl"></div>
                <div className="bg-white p-6 rounded-xl shadow-lg shadow-blue-100 space-y-6 border border-blue-100">
                  {/* Campos obrigatórios */}
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
                      name="congregacao_id"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black transition-all duration-200 hover:border-blue-500 appearance-none bg-white"
                      required
                    >
                      <option value="">Selecione...</option>
                      {congregacoes.map((cong, index) => (
                        <option key={index} value={index + 1}>{cong}</option>
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
                      <option value="lideranca">Liderança</option>
                      <option value="organizacao">Organização</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-black font-medium mb-1 text-sm uppercase tracking-wide">
                      Cor da camisa <span className="text-red-500">*</span>
                    </label>
                    <div className="flex space-x-6">
                      <label className="inline-flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200 cursor-pointer">
                        <input type="radio" name="cor_camisa" value="preta" className="mr-2 h-4 w-4 text-blue-600" required />
                        <span className="text-black">Preta</span>
                      </label>
                      <label className="inline-flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200 cursor-pointer">
                        <input type="radio" name="cor_camisa" value="lilas" className="mr-2 h-4 w-4 text-blue-600" />
                        <span className="text-black">Lilás</span>
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
                    <input 
                      type="number" 
                      name="valor_pago"
                      step="0.01"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black transition-all duration-200 hover:border-blue-500"
                    />
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
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Congregação</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {inscritosMock.map((inscrito) => (
                      <tr key={inscrito.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{inscrito.nome}</div>
                          <div className="text-sm text-gray-500">{inscrito.telefone}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{inscrito.congregacao}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            inscrito.status === "Confirmada" 
                              ? "bg-green-100 text-green-800" 
                              : "bg-yellow-100 text-yellow-800"
                          }`}>
                            {inscrito.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => abrirModalEdicao(inscrito)}
                            className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-full transition-colors"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
                  Editar Inscrição - {inscritoParaEditar.nome}
                </h2>
              </div>
              <button 
                onClick={() => setModalEdicaoAberto(false)}
                className="text-gray-500 hover:text-gray-700 transition-all duration-200 p-2 rounded-full hover:bg-gray-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-8 bg-gradient-to-br from-blue-50 to-white">
              <form className="space-y-8 relative">
                <div className="absolute inset-0 bg-blue-50/50 backdrop-blur-3xl -z-10 rounded-xl"></div>
                <div className="bg-white p-6 rounded-xl shadow-lg shadow-blue-100 space-y-6 border border-blue-100">
                  <div className="space-y-1">
                    <label className="block text-black font-medium mb-1 text-sm uppercase tracking-wide">
                      Nome completo <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black transition-all duration-200 hover:border-blue-500"
                      defaultValue={inscritoParaEditar.nome}
                      required
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="block text-black font-medium mb-1 text-sm uppercase tracking-wide">
                      Apelido
                    </label>
                    <input 
                      type="text" 
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black transition-all duration-200 hover:border-blue-500"
                      defaultValue={inscritoParaEditar.apelido}
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="block text-black font-medium mb-1 text-sm uppercase tracking-wide">
                      CPF
                    </label>
                    <InputMaskWrapper 
                      mask="999.999.999-99"
                      type="text" 
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black transition-all duration-200 hover:border-blue-500"
                      defaultValue={inscritoParaEditar.cpf}
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="block text-black font-medium mb-1 text-sm uppercase tracking-wide">
                      Telefone do WhatsApp <span className="text-red-500">*</span>
                    </label>
                    <InputMaskWrapper 
                      mask="(99) 99999-9999"
                      type="tel" 
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black transition-all duration-200 hover:border-blue-500"
                      defaultValue={inscritoParaEditar.telefone}
                      required
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="block text-black font-medium mb-1 text-sm uppercase tracking-wide">
                      Congregação <span className="text-red-500">*</span>
                    </label>
                    <select 
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black transition-all duration-200 hover:border-blue-500 appearance-none bg-white"
                      defaultValue={inscritoParaEditar.congregacao}
                      required
                    >
                      <option value="">Selecione...</option>
                      {congregacoes.map((cong, index) => (
                        <option key={index} value={cong}>{cong}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-black font-medium mb-1 text-sm uppercase tracking-wide">
                      Cor da camisa <span className="text-red-500">*</span>
                    </label>
                    <div className="flex space-x-6">
                      <label className="inline-flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200 cursor-pointer">
                        <input 
                          type="radio" 
                          name="cor_camisa" 
                          value="Preta" 
                          className="mr-2 h-4 w-4 text-blue-600" 
                          defaultChecked={inscritoParaEditar.corCamisa === "Preta"}
                          required 
                        />
                        <span className="text-black">Preta</span>
                      </label>
                      <label className="inline-flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200 cursor-pointer">
                        <input 
                          type="radio" 
                          name="cor_camisa" 
                          value="Lilás" 
                          className="mr-2 h-4 w-4 text-blue-600" 
                          defaultChecked={inscritoParaEditar.corCamisa === "Lilás"}
                        />
                        <span className="text-black">Lilás</span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-black font-medium mb-1 text-sm uppercase tracking-wide">
                      Estilo <span className="text-red-500">*</span>
                    </label>
                    <div className="flex space-x-6">
                      <label className="inline-flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200 cursor-pointer">
                        <input 
                          type="radio" 
                          name="estilo" 
                          value="Babylook" 
                          className="mr-2 h-4 w-4 text-blue-600" 
                          defaultChecked={inscritoParaEditar.estilo === "Babylook"}
                          required 
                        />
                        <span className="text-black">Babylook</span>
                      </label>
                      <label className="inline-flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200 cursor-pointer">
                        <input 
                          type="radio" 
                          name="estilo" 
                          value="Normal" 
                          className="mr-2 h-4 w-4 text-blue-600" 
                          defaultChecked={inscritoParaEditar.estilo === "Normal"}
                        />
                        <span className="text-black">Normal</span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="block text-black font-medium mb-1 text-sm uppercase tracking-wide">
                      Tamanho da camisa <span className="text-red-500">*</span>
                    </label>
                    <select 
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black transition-all duration-200 hover:border-blue-500 appearance-none bg-white"
                      defaultValue={inscritoParaEditar.tamanhoCamisa}
                      required
                    >
                      <option value="">Selecione...</option>
                      <option value="PP">PP</option>
                      <option value="P">P</option>
                      <option value="M">M</option>
                      <option value="G">G</option>
                      <option value="GG">GG</option>
                      <option value="EXG">EXG</option>
                      <option value="Sob medida">Sob medida</option>
                    </select>
                  </div>
                </div>
                
                <div className="pt-6 flex justify-end space-x-4">
                  <button 
                    type="button"
                    onClick={() => setModalEdicaoAberto(false)}
                    className="px-6 py-3 border border-blue-200 rounded-lg text-blue-700 hover:bg-blue-50 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-medium shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transform hover:-translate-y-0.5"
                  >
                    Confirmar Edição
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
