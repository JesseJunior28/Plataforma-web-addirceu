"use client"

import React, { useState } from 'react';
import Link from 'next/link';

export default function InscricoesPage() {
  const [modalAberto, setModalAberto] = useState(false);
  const [congressoSelecionado, setCongressoSelecionado] = useState(null);
  
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
      titulo: "Congresso de Mulheres",
      descricao: "Um tempo especial de comunhão e edificação para mulheres de todas as idades.",
      data: "15-17 de Outubro, 2023",
      imagem: "/images/congresso-mulheres.jpg"
    },
    {
      id: 2,
      titulo: "Congresso de Crianças",
      descricao: "Diversão, aprendizado e atividades especiais para crianças de 5 a 12 anos.",
      data: "5-7 de Novembro, 2023",
      imagem: "/images/congresso-criancas.jpg"
    },
    {
      id: 3,
      titulo: "Congresso de Homens",
      descricao: "Momentos de edificação, desafios e comunhão para homens de todas as idades.",
      data: "26-28 de Novembro, 2023",
      imagem: "/images/congresso-homens.jpg"
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

  return (
    <div className="space-y-6 relative">
      <h1 className="text-3xl font-bold text-blue-800">Inscrições Abertas</h1>
      <p className="text-lg text-gray-700">
        Confira os congressos disponíveis e realize sua inscrição.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {congressos.map((congresso) => (
          <div key={congresso.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-48 bg-gray-200 relative">
              {/* Imagem do congresso (comentado pois as imagens podem não existir ainda) */}
              {/* <img 
                src={congresso.imagem} 
                alt={congresso.titulo} 
                className="w-full h-full object-cover"
              /> */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold text-gray-500">Imagem do Evento</span>
              </div>
            </div>
            
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2 text-black">{congresso.titulo}</h2>
              <p className="text-gray-700 mb-3">{congresso.descricao}</p>
              <p className="text-sm font-medium text-blue-600 mb-4">{congresso.data}</p>
              
              <div className="flex space-x-3">
                <button 
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                  onClick={() => abrirModal(congresso.id)}
                >
                  Inscrever-se
                </button>
                <button className="flex-1 border border-blue-600 text-blue-600 py-2 px-4 rounded-md hover:bg-blue-50 transition-colors">
                  Programação
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
              {/* Renderização condicional dos formulários por tipo de congresso */}
              {congressoSelecionado.id === 1 ? (
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
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="block text-black font-medium mb-1 text-sm uppercase tracking-wide">
                        CPF
                      </label>
                      <input 
                        type="text" 
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black transition-all duration-200 hover:border-blue-500"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="block text-black font-medium mb-1 text-sm uppercase tracking-wide">
                        Telefone do WhatsApp <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="tel" 
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black transition-all duration-200 hover:border-blue-500"
                        required
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="block text-black font-medium mb-1 text-sm uppercase tracking-wide">
                        Congregação <span className="text-red-500">*</span>
                      </label>
                      <select 
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black transition-all duration-200 hover:border-blue-500 appearance-none bg-white"
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
                          <input type="radio" name="cor_camisa" value="Preta" className="mr-2 h-4 w-4 text-blue-600" required />
                          <span className="text-black">Preta</span>
                        </label>
                        <label className="inline-flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200 cursor-pointer">
                          <input type="radio" name="cor_camisa" value="Lilás" className="mr-2 h-4 w-4 text-blue-600" />
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
                          <input type="radio" name="estilo" value="Babylook" className="mr-2 h-4 w-4 text-blue-600" required />
                          <span className="text-black">Babylook</span>
                        </label>
                        <label className="inline-flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200 cursor-pointer">
                          <input type="radio" name="estilo" value="Normal" className="mr-2 h-4 w-4 text-blue-600" />
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
              ) : congressoSelecionado.id === 2 ? (
                <form className="space-y-8 relative">
                  <div className="absolute inset-0 bg-blue-50/50 backdrop-blur-3xl -z-10 rounded-xl"></div>
                  <div className="bg-white p-6 rounded-xl shadow-lg shadow-blue-100 space-y-6 border border-blue-100">
                    <div className="space-y-1">
                      <label className="block text-black font-medium mb-1 text-sm uppercase tracking-wide">
                        Nome completo da criança <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="text" 
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black transition-all duration-200 hover:border-blue-500"
                        required
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="block text-black font-medium mb-1 text-sm uppercase tracking-wide">
                        Nome do responsável <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="text" 
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black transition-all duration-200 hover:border-blue-500"
                        required
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="block text-black font-medium mb-1 text-sm uppercase tracking-wide">
                        Apelido da criança
                      </label>
                      <input 
                        type="text" 
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black transition-all duration-200 hover:border-blue-500"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="block text-black font-medium mb-1 text-sm uppercase tracking-wide">
                        Telefone do WhatsApp do responsável <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="tel" 
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black transition-all duration-200 hover:border-blue-500"
                        required
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="block text-black font-medium mb-1 text-sm uppercase tracking-wide">
                        Congregação <span className="text-red-500">*</span>
                      </label>
                      <select 
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black transition-all duration-200 hover:border-blue-500 appearance-none bg-white"
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
                      <div className="flex items-center">
                        <input type="radio" name="cor_camisa" value="Branca" className="mr-2 h-4 w-4 text-blue-600" checked required />
                        <span className="text-black">Branca</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-black font-medium mb-1 text-sm uppercase tracking-wide">
                        Estilo <span className="text-red-500">*</span>
                      </label>
                      <div className="flex items-center">
                        <input type="radio" name="estilo" value="Normal" className="mr-2 h-4 w-4 text-blue-600" checked required />
                        <span className="text-black">Normal</span>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <label className="block text-black font-medium mb-1 text-sm uppercase tracking-wide">
                        Tamanho da camisa <span className="text-red-500">*</span>
                      </label>
                      <select 
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black transition-all duration-200 hover:border-blue-500 appearance-none bg-white"
                        required
                      >
                        <option value="">Selecione...</option>
                        <option value="2">2</option>
                        <option value="4">4</option>
                        <option value="6">6</option>
                        <option value="8">8</option>
                        <option value="10">10</option>
                        <option value="12">12</option>
                        <option value="14">14</option>
                        <option value="P">P</option>
                        <option value="M">M</option>
                        <option value="G">G</option>
                        <option value="GG">GG</option>
                      </select>
                    </div>
                    
                    <div className="space-y-1">
                      <label className="block text-black font-medium mb-1 text-sm uppercase tracking-wide">
                        Forma de pagamento
                      </label>
                      <select 
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black transition-all duration-200 hover:border-blue-500 appearance-none bg-white"
                      >
                        <option value="">Selecione...</option>
                        <option value="Espécie">Espécie</option>
                        <option value="Pix">Pix</option>
                        <option value="Cartão">Cartão</option>
                      </select>
                    </div>
                    
                    <div className="space-y-1">
                      <label className="block text-black font-medium mb-1 text-sm uppercase tracking-wide">
                        Valor pago
                      </label>
                      <input 
                        type="number" 
                        step="0.01"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black transition-all duration-200 hover:border-blue-500"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-black font-medium mb-1 text-sm uppercase tracking-wide">
                        Camisa entregue
                      </label>
                      <label className="inline-flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200 cursor-pointer">
                        <input type="checkbox" className="mr-2 h-4 w-4 text-blue-600 rounded" />
                        <span className="text-black">Sim, a camisa foi entregue</span>
                      </label>
                    </div>
                    
                    <div className="space-y-1">
                      <label className="block text-black font-medium mb-1 text-sm uppercase tracking-wide">
                        Observação
                      </label>
                      <textarea 
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black transition-all duration-200 hover:border-blue-500"
                        rows={3}
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
              ) : congressoSelecionado.id === 3 ? (
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
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="block text-black font-medium mb-1 text-sm uppercase tracking-wide">
                        CPF
                      </label>
                      <input 
                        type="text" 
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black transition-all duration-200 hover:border-blue-500"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="block text-black font-medium mb-1 text-sm uppercase tracking-wide">
                        Telefone do WhatsApp <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="tel" 
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black transition-all duration-200 hover:border-blue-500"
                        required
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="block text-black font-medium mb-1 text-sm uppercase tracking-wide">
                        Congregação <span className="text-red-500">*</span>
                      </label>
                      <select 
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black transition-all duration-200 hover:border-blue-500 appearance-none bg-white"
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
                      <div className="flex items-center">
                        <input type="radio" name="cor_camisa" value="Vinho" className="mr-2 h-4 w-4 text-blue-600" checked required />
                        <span className="text-black">Vinho</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-black font-medium mb-1 text-sm uppercase tracking-wide">
                        Estilo <span className="text-red-500">*</span>
                      </label>
                      <div className="flex items-center">
                        <input type="radio" name="estilo" value="Normal" className="mr-2 h-4 w-4 text-blue-600" checked required />
                        <span className="text-black">Normal</span>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <label className="block text-black font-medium mb-1 text-sm uppercase tracking-wide">
                        Tamanho da camisa <span className="text-red-500">*</span>
                      </label>
                      <select 
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
                        <option value="Sob medida">Sob medida</option>
                      </select>
                    </div>
                    
                    <div className="space-y-1">
                      <label className="block text-black font-medium mb-1 text-sm uppercase tracking-wide">
                        Forma de pagamento
                      </label>
                      <select 
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black transition-all duration-200 hover:border-blue-500 appearance-none bg-white"
                      >
                        <option value="">Selecione...</option>
                        <option value="Espécie">Espécie</option>
                        <option value="Pix">Pix</option>
                        <option value="Cartão">Cartão</option>
                      </select>
                    </div>
                    
                    <div className="space-y-1">
                      <label className="block text-black font-medium mb-1 text-sm uppercase tracking-wide">
                        Valor pago
                      </label>
                      <input 
                        type="number" 
                        step="0.01"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black transition-all duration-200 hover:border-blue-500"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-black font-medium mb-1 text-sm uppercase tracking-wide">
                        Camisa entregue
                      </label>
                      <label className="inline-flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200 cursor-pointer">
                        <input type="checkbox" className="mr-2 h-4 w-4 text-blue-600 rounded" />
                        <span className="text-black">Sim, a camisa foi entregue</span>
                      </label>
                    </div>
                    
                    <div className="space-y-1">
                      <label className="block text-black font-medium mb-1 text-sm uppercase tracking-wide">
                        Observação
                      </label>
                      <textarea 
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black transition-all duration-200 hover:border-blue-500"
                        rows={3}
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
              ) : (
                <div className="py-8 text-center">
                  <p className="text-black">
                    O formulário de inscrição para este evento ainda não está disponível.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Adicione esta animação no final do arquivo global.css ou em um componente de estilo
// @keyframes fadeIn {
//   from { opacity: 0; transform: translateY(-20px); }
//   to { opacity: 1; transform: translateY(0); }
// }
// 
// .animate-fadeIn {
//   animation: fadeIn 0.3s ease-out forwards;
// }
