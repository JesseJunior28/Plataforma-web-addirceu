'use client'

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
// Substitua FiMail, FiLock, FiLogIn por outro conjunto de ícones se react-icons estiver causando problemas
// Você pode usar importações condicionais ou remover temporariamente
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Lógica de autenticação será implementada aqui
    console.log('Login attempt with:', email, password);
  };

  return (
    <div className="flex h-screen w-full">
      {/* Lado esquerdo - Imagem/Logo */}
      <div className="hidden md:flex md:w-1/2 bg-blue-900 flex-col items-center justify-center text-white p-10">
        <div className="max-w-lg flex flex-col items-center">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold mb-4">Plataforma AD-Dirceu</h1>
            <p className="text-xl text-cyan-100">
              Conecte-se à nossa igreja
            </p>
          </div>
          <div className="w-80 h-80 bg-white rounded-full flex items-center justify-center mb-8 overflow-hidden">
            {/* Substituindo o texto LOGO pela imagem real */}
            <Image 
              src="/addirceu.png" 
              alt="Logo AD-Dirceu" 
              width={1000} 
              height={1000} 
              className="object-contain p-2"
            />
          </div>
        </div>
      </div>

      {/* Lado direito - Formulário de login */}
      <div className="w-full md:w-1/2 bg-white flex items-center justify-center p-5">
        <div className="max-w-md w-full">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-blue-800">Bem-vindo de volta</h2>
            <p className="text-gray-600 mt-2">Acesse sua conta para continuar</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                E-mail
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Senha
                </label>
                <Link href="/recuperar-senha" className="text-sm text-cyan-600 hover:text-cyan-800">
                  Esqueceu a senha?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500"
                  placeholder="********"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                // Substitui as classes com "navy" por cores padrão do Tailwind
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-800 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition duration-150"
              >
                <FiLogIn />
                Entrar
              </button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Não tem uma conta?{' '}
              <Link href="/cadastro" className="font-medium text-cyan-600 hover:text-cyan-800">
                Cadastre-se
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
