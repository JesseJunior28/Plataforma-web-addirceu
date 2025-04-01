'use client';
import React from 'react';
import authService from '@/services/authService';
import { useRouter } from 'next/navigation';

const DashboardPage: React.FC = () => {
  const router = useRouter();

  const handleLogout = (): void => {
    authService.logout();
    router.push('/login');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-blue-800">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-black">Inscrições</h2>
          <p className="text-black">Visualize e gerencie as inscrições.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-black">Escalar</h2>
          <p className="text-black">Organize a escala de ministérios.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-black">Calendário</h2>
          <p className="text-black">Confira os próximos eventos.</p>
        </div>
      </div>
      <button
        onClick={handleLogout}
        className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Sair
      </button>
    </div>
  );
};

export default DashboardPage;
