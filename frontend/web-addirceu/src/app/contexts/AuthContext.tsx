// src/contexts/AuthContext.tsx
'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

type Usuario = {
  id: string;
  email: string;
  nome?: string;
  is_admin: boolean;
};

type AuthContextType = {
  usuario: Usuario | null;
  login: (dados: Usuario) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  const login = (dados: Usuario) => {
    setUsuario(dados);
  };

  const logout = () => {
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
