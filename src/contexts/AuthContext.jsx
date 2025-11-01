// ==========================================
// 🔐 CONTEXTO DE AUTENTICAÇÃO
// ==========================================
// Explicação para iniciantes:
// - Context API do React: compartilha dados entre componentes
// - Sem precisar passar props manualmente
// - Aqui guardamos: usuário logado, funções de login/logout
// ==========================================

import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/api';

// Criar o contexto
const AuthContext = createContext();

// Hook customizado para usar o contexto
// Use assim: const { usuario, login, logout } = useAuth();
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
};

// Provider: componente que envolve o app
export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  // Verificar se há usuário logado ao carregar
  useEffect(() => {
    const verificarAuth = () => {
      if (authService.isAuthenticated()) {
        const user = authService.getCurrentUser();
        setUsuario(user);
      }
      setCarregando(false);
    };

    verificarAuth();
  }, []);

  // Função de login
  const login = async (email, senha) => {
    try {
      const response = await authService.login(email, senha);
      setUsuario(response.utilizador);
      return response;
    } catch (error) {
      throw error;
    }
  };

  // Função de logout
  const logout = async () => {
    await authService.logout();
    setUsuario(null);
  };

  // Valores que serão compartilhados
  const value = {
    usuario,
    login,
    logout,
    isAuthenticated: !!usuario,
    carregando
  };

  // Se estiver carregando, mostra loading
  if (carregando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};