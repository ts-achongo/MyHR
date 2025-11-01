// ==========================================
// 🏗️ LAYOUT - Estrutura Principal
// ==========================================
// Explicação para iniciantes:
// - Componente que envolve toda a aplicação
// - Controla: Sidebar + Header + Conteúdo
// - lg:ml-72 = margem esquerda de 288px (largura do menu)
//   só no desktop, para não ficar embaixo do menu fixo
// ==========================================

import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = ({ children, modoAtivo, setModo }) => {
  const [menuAberto, setMenuAberto] = useState(false);

  const abrirMenu = () => setMenuAberto(true);
  const fecharMenu = () => setMenuAberto(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Menu Lateral */}
      <Sidebar
        menuAberto={menuAberto}
        fecharMenu={fecharMenu}
        modoAtivo={modoAtivo}
        setModo={setModo}
      />

      {/* Conteúdo principal */}
      {/* lg:ml-72 = margem de 288px no desktop (largura do menu) */}
      <div className="lg:ml-72">
        {/* Cabeçalho */}
        <Header abrirMenu={abrirMenu} />

        {/* Área de conteúdo */}
        <div className="container mx-auto px-4 py-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;