// ==========================================
// 🎨 CONTEXTO DE TEMA
// ==========================================
// Explicação para iniciantes:
// - Guarda configurações visuais: logo, cores, nome da empresa
// - Persiste no localStorage (fica salvo mesmo ao fechar o navegador)
// - Todos os componentes podem acessar e modificar o tema
// ==========================================

import React, { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

// Hook customizado
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme deve ser usado dentro de ThemeProvider');
  }
  return context;
};

// Provider
export const ThemeProvider = ({ children }) => {
  const [configuracao, setConfiguracao] = useState({
    logo: null,
    corPrimaria: '#007AFF',
    corSecundaria: '#5856D6',
    corTexto: '#FFFFFF'
  });

  const [empresa, setEmpresa] = useState({
    nome: 'Minha Empresa',
    endereco: '',
    telefone: '',
    email: ''
  });

  // Carregar configurações do localStorage
  useEffect(() => {
    const configStorage = localStorage.getItem('myhr_config');
    if (configStorage) {
      setConfiguracao(JSON.parse(configStorage));
    }

    const empresaStorage = localStorage.getItem('myhr_empresa');
    if (empresaStorage) {
      setEmpresa(JSON.parse(empresaStorage));
    }
  }, []);

  // Salvar quando mudar
  useEffect(() => {
    localStorage.setItem('myhr_config', JSON.stringify(configuracao));
  }, [configuracao]);

  useEffect(() => {
    localStorage.setItem('myhr_empresa', JSON.stringify(empresa));
  }, [empresa]);

  // Funções para atualizar
  const atualizarConfiguracao = (novaConfig) => {
    setConfiguracao(prev => ({ ...prev, ...novaConfig }));
  };

  const atualizarEmpresa = (novosdados) => {
    setEmpresa(prev => ({ ...prev, ...novosData }));
  };

  const value = {
    configuracao,
    empresa,
    atualizarConfiguracao,
    atualizarEmpresa
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};