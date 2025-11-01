// ==========================================
// 📌 HEADER - Cabeçalho
// ==========================================
// Explicação para iniciantes:
// - Barra superior com logo, nome da empresa e botão hambúrguer
// - Hambúrguer: só aparece no mobile para abrir/fechar menu
// - No desktop: hambúrguer fica escondido (menu sempre visível)
// ==========================================

import React from 'react';
import { Menu } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

const Header = ({ abrirMenu }) => {
  const { usuario } = useAuth();
  const { configuracao, empresa } = useTheme();

  return (
    <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Lado esquerdo: Hambúrguer + Logo + Nome */}
        <div className="flex items-center gap-3">
          {/* Botão hambúrguer - só aparece no mobile */}
          <button
            onClick={abrirMenu}
            className="p-2 rounded-xl hover:bg-gray-100 transition lg:hidden"
          >
            <Menu size={24} className="text-gray-700" />
          </button>

          {/* Logo e nome da empresa */}
          <div className="flex items-center gap-2">
            {configuracao.logo && (
              <img
                src={configuracao.logo}
                alt="Logo"
                className="h-8 rounded"
              />
            )}
            <h1 className="text-xl font-bold text-gray-900">
              {empresa.nome}
            </h1>
          </div>
        </div>

        {/* Lado direito: Nome do usuário */}
        <p className="text-sm font-semibold text-gray-700 hidden sm:block">
          {usuario?.nome}
        </p>
      </div>
    </div>
  );
};

export default Header;