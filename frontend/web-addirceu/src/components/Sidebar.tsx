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
  FiChevronRight,
  FiFileText
} from 'react-icons/fi';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import authService from '@/services/authService';

interface SidebarProps {
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const router = useRouter();

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = async () => {
    try {
      await authService.logout();
      router.replace('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
    setShowLogoutModal(false);
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  return (
    <>
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
                <Link href="/dashboard/escalas" className={`flex items-center p-3 hover:bg-blue-800 rounded-md transition-colors ${
                  collapsed ? 'justify-center' : ''
                }`}>
                  <FiClipboard className="text-xl" />
                  {!collapsed && <span className="ml-3">Escalas</span>}
                </Link>
              </li>
              <li>
                <Link href="/dashboard/calendario" className={`flex items-center p-3 hover:bg-blue-800 rounded-md transition-colors ${
                  collapsed ? 'justify-center' : ''
                }`}>
                  <FiCalendar className="text-xl" />
                  {!collapsed && <span className="ml-3">Calendário</span>}
                </Link>
              </li>
              <li>
                <Link href="/dashboard/relatorios" className={`flex items-center p-3 hover:bg-blue-800 rounded-md transition-colors ${
                  collapsed ? 'justify-center' : ''
                }`}>
                  <FiFileText className="text-xl" />
                  {!collapsed && <span className="ml-3">Relatórios</span>}
                </Link>
              </li>
            </ul>
          </nav>

          {/* Rodapé da sidebar */}
          <div className="p-4 border-t border-blue-800">
            {!collapsed ? (
              <div className="text-sm text-white">
                <p>Logado como Admin</p>
                <button 
                  onClick={handleLogoutClick}
                  className="text-blue-300 hover:text-white hover:underline"
                >
                  Sair
                </button>
              </div>
            ) : (
              <button
                onClick={handleLogoutClick}
                className="flex justify-center text-blue-300 hover:text-white"
              >
                <FiMenu />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Modal de confirmação */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirmar Logout</h3>
            <p className="text-gray-700 mb-6">Tem certeza que deseja sair?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleLogoutCancel}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancelar
              </button>
              <button
                onClick={handleLogoutConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
