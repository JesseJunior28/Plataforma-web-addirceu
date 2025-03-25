'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  FiMenu, 
  FiCalendar, 
  FiUsers, 
  FiSettings, 
  FiClipboard,
  FiChevronLeft,
  FiChevronRight
} from 'react-icons/fi';
import Image from 'next/image';

interface SidebarProps {
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div 
      className={`h-screen bg-blue-900 text-white transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      } ${className}`}
    >
      <div className="flex flex-col h-full">
        {/* Logo e botão de toggle */}
        <div className="flex items-center justify-between p-4 border-b border-blue-800">
          {!collapsed && (
            <div className="flex items-center">
              <Image 
                src="/addirceu.png" 
                alt="Logo AD-Dirceu" 
                width={40} 
                height={40} 
                className="rounded-full bg-white p-1"
              />
              <span className="ml-2 font-bold text-lg">ADDIRCEU</span>
            </div>
          )}
          {collapsed && (
            <Image 
              src="/addirceu.png" 
              alt="Logo" 
              width={40} 
              height={40} 
              className="mx-auto rounded-full bg-white p-1"
            />
          )}
          <button 
            onClick={toggleSidebar} 
            className="text-white hover:bg-blue-800 rounded-full p-2"
          >
            {collapsed ? <FiChevronRight /> : <FiChevronLeft />}
          </button>
        </div>

        {/* Itens do menu */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-2 px-2">
            <li>
              <Link href="/dashboard/inscricoes" className={`flex items-center p-3 hover:bg-blue-800 rounded-md transition-colors ${
                collapsed ? 'justify-center' : ''
              }`}>
                <FiUsers className="text-xl" />
                {!collapsed && <span className="ml-3">Inscrições</span>}
              </Link>
            </li>
            <li>
              <Link href="/escalar" className={`flex items-center p-3 hover:bg-blue-800 rounded-md transition-colors ${
                collapsed ? 'justify-center' : ''
              }`}>
                <FiClipboard className="text-xl" />
                {!collapsed && <span className="ml-3">Escalas</span>}
              </Link>
            </li>
            <li>
              <Link href="/calendario" className={`flex items-center p-3 hover:bg-blue-800 rounded-md transition-colors ${
                collapsed ? 'justify-center' : ''
              }`}>
                <FiCalendar className="text-xl" />
                {!collapsed && <span className="ml-3">Calendário</span>}
              </Link>
            </li>
            <li>
              <Link href="/configuracoes" className={`flex items-center p-3 hover:bg-blue-800 rounded-md transition-colors ${
                collapsed ? 'justify-center' : ''
              }`}>
                <FiSettings className="text-xl" />
                {!collapsed && <span className="ml-3">Configurações</span>}
              </Link>
            </li>
          </ul>
        </nav>

        {/* Rodapé da sidebar */}
        <div className="p-4 border-t border-blue-800">
          {!collapsed ? (
            <div className="text-sm text-white">
              <p>Logado como Admin</p>
              <Link href="/logout" className="text-blue-300 hover:text-white hover:underline">
                Sair
              </Link>
            </div>
          ) : (
            <Link href="/logout" className="flex justify-center text-blue-300 hover:text-white">
              <FiMenu />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
