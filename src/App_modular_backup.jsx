// ==========================================
// 🏗️ APP.JSX - Arquivo Principal
// ==========================================
// Explicação para iniciantes:
// - Este é o "cérebro" do sistema
// - Conecta todos os componentes
// - Controla qual página mostrar
// - Gerencia notificações
// ==========================================

import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

// Layout
import Layout from './components/layout/Layout';

// Views/Páginas
import OnboardingSlides from './components/features/onboarding/OnboardingSlides';
import LoginView from './components/features/auth/LoginView';
import DashboardView from './components/features/dashboard/DashboardView';
import ColaboradoresView from './components/features/colaboradores/ColaboradoresView';
import AvaliacoesView from './components/features/avaliacoes/AvaliacoesView';
import FeriasView from './components/features/ferias/FeriasView';
import EmpresaView from './components/features/empresa/EmpresaView';
import OnboardingView from './components/features/onboarding/OnboardingView';

// Componentes comuns
import Notification from './components/common/Notification';

// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================
const AppContent = () => {
  const { usuario, isAuthenticated } = useAuth();
  const [mostrarOnboarding, setMostrarOnboarding] = useState(false);
  const [modo, setModo] = useState('dashboard');
  const [notificacao, setNotificacao] = useState(null);

  // Verificar se deve mostrar onboarding
  useEffect(() => {
    const jaVisto = localStorage.getItem('myhr_onboarding_visto');
    if (!jaVisto && !isAuthenticated) {
      setMostrarOnboarding(true);
    }
  }, [isAuthenticated]);

  // Função para mostrar notificações
  const mostrarNotificacao = (mensagem, tipo = 'info') => {
    setNotificacao({ mensagem, tipo });
    setTimeout(() => setNotificacao(null), 3000);
  };

  // ==========================================
  // RENDERIZAÇÃO CONDICIONAL
  // ==========================================

  // 1. Se deve mostrar onboarding (slides)
  if (mostrarOnboarding) {
    return (
      <OnboardingSlides
        onComplete={() => setMostrarOnboarding(false)}
      />
    );
  }

  // 2. Se não está autenticado, mostrar login
  if (!isAuthenticated) {
    return (
      <>
        {notificacao && (
          <Notification
            mensagem={notificacao.mensagem}
            tipo={notificacao.tipo}
            onClose={() => setNotificacao(null)}
          />
        )}
        <LoginView mostrarNotificacao={mostrarNotificacao} />
      </>
    );
  }

  // 3. Se está autenticado, mostrar sistema completo
  return (
    <>
      {/* Notificações */}
      {notificacao && (
        <Notification
          mensagem={notificacao.mensagem}
          tipo={notificacao.tipo}
          onClose={() => setNotificacao(null)}
        />
      )}

      {/* Layout com Sidebar + Header + Conteúdo */}
      <Layout modoAtivo={modo} setModo={setModo}>
        {/* Renderizar a view baseada no modo */}
        {modo === 'dashboard' && (
          <DashboardView mostrarNotificacao={mostrarNotificacao} />
        )}
        {modo === 'cadastro' && (
          <ColaboradoresView mostrarNotificacao={mostrarNotificacao} />
        )}
        {modo === 'avaliacoes' && (
          <AvaliacoesView mostrarNotificacao={mostrarNotificacao} />
        )}
        {modo === 'ferias' && (
          <FeriasView mostrarNotificacao={mostrarNotificacao} />
        )}
        {modo === 'minha_empresa' && (
          <EmpresaView mostrarNotificacao={mostrarNotificacao} />
        )}
        {modo === 'onboarding' && (
          <OnboardingView mostrarNotificacao={mostrarNotificacao} />
        )}
      </Layout>

      {/* Estilos das animações */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-in {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
        .active\\:scale-98:active {
          transform: scale(0.98);
        }
        .active\\:scale-95:active {
          transform: scale(0.95);
        }
      `}</style>
    </>
  );
};

// ==========================================
// COMPONENTE ROOT (com Providers)
// ==========================================
function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;