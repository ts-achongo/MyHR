// ==========================================
// 📱 SIDEBAR - Menu Lateral
// ==========================================
// Explicação para iniciantes:
// - Menu lateral que aparece no desktop e mobile
// - No desktop: sempre visível
// - No mobile: só aparece quando clica no hambúrguer
// - menuAberto: controla se está aberto/fechado
// ==========================================

import React from 'react';
import { Home, Users, Star, Umbrella, Building2, BookOpen, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

const Sidebar = ({ menuAberto, fecharMenu, modoAtivo, setModo }) => {
  const { logout, usuario } = useAuth();
  const { configuracao, empresa } = useTheme();

  // Lista de itens do menu
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'cadastro', label: 'Meu Pessoal', icon: Users },
    { id: 'avaliacoes', label: 'Avaliações', icon: Star },
    { id: 'ferias', label: 'Férias', icon: Umbrella },
    { id: 'minha_empresa', label: 'Minha Empresa', icon: Building2 },
    { id: 'onboarding', label: 'Onboarding', icon: BookOpen }
  ];

  const handleMenuClick = (modo) => {
    setModo(modo);
    fecharMenu();
  };

  const handleLogout = async () => {
    await logout();
    fecharMenu();
  };

  return (
    <>
      {/* Overlay escuro (mobile) */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 lg:hidden ${
          menuAberto ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={fecharMenu}
      />

      {/* Menu lateral */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-white shadow-2xl z-50 transform transition-transform duration-300 overflow-y-auto
          ${menuAberto ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Cabeçalho do menu */}
        <div
          className="p-6"
          style={{
            background: `linear-gradient(135deg, ${configuracao.corPrimaria} 0%, ${configuracao.corSecundaria} 100%)`
          }}
        >
          <div className="flex items-center gap-3">
            {configuracao.logo ? (
              <img
                src={configuracao.logo}
                alt="Logo"
                className="h-10 w-10 bg-white rounded-xl p-1"
              />
            ) : (
              <div className="bg-white/20 rounded-xl p-2">
                <Users size={28} className="text-white" />
              </div>
            )}
            <div className="text-white">
              <h2 className="font-bold text-xl">{empresa.nome}</h2>
              <p className="text-xs opacity-90">{usuario?.nome}</p>
            </div>
          </div>
        </div>

        {/* Itens do menu */}
        <nav className="p-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = modoAtivo === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item.id)}
                className={`w-full text-left flex items-center p-3 rounded-xl font-semibold transition ${
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <Icon size={20} className="mr-3" />
                {item.label}
              </button>
            );
          })}

          {/* Separador */}
          <div className="border-t border-gray-200 pt-3 mt-3">
            <button
              onClick={handleLogout}
              className="w-full text-left flex items-center p-3 rounded-xl font-semibold text-red-600 hover:bg-red-50 transition"
            >
              <LogOut size={20} className="mr-3" />
              Sair
            </button>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;