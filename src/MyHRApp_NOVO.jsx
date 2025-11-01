import React, { useState, useEffect } from 'react';
import { Users, Home, Star, Calendar, Building2, BookOpen, LogOut, Bell, FileText, Award } from 'lucide-react';
import { authService, colaboradoresService, avaliacoesService, feriasService } from './services/api';

const MyHRApp = () => {
  const [usuario, setUsuario] = useState(null);
  const [modo, setModo] = useState('dashboard');
  const [colaboradores, setColaboradores] = useState([]);
  const [estatisticas, setEstatisticas] = useState({
    totalColaboradores: 0,
    feriasPendentes: 0,
    totalAvaliacoes: 0,
    mediaGeral: 0
  });

  useEffect(() => {
    if (authService.isAuthenticated()) {
      const user = authService.getCurrentUser();
      setUsuario(user);
      carregarDados();
    }
  }, []);

  const carregarDados = async () => {
    try {
      const colabRes = await colaboradoresService.listar();
      const avalRes = await avaliacoesService.obterEstatisticas();
      const ferRes = await feriasService.obterEstatisticas();
      
      setColaboradores(colabRes.colaboradores || []);
      setEstatisticas({
        totalColaboradores: colabRes.colaboradores?.length || 0,
        feriasPendentes: ferRes.pendentes || 0,
        totalAvaliacoes: avalRes.totalAvaliacoes || 0,
        mediaGeral: avalRes.mediaGeral || 0
      });
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  const handleLogout = async () => {
    await authService.logout();
    window.location.reload();
  };

  if (!usuario) return null;

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'pessoal', label: 'Meu Pessoal', icon: Users },
    { id: 'avaliacoes', label: 'Avaliações', icon: Star },
    { id: 'ferias', label: 'Férias', icon: Calendar },
    { id: 'empresa', label: 'Minha Empresa', icon: Building2 },
    { id: 'onboarding', label: 'Onboarding', icon: BookOpen },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* 📱 SIDEBAR FIXA */}
      <aside className="w-72 bg-gradient-to-b from-blue-600 via-blue-700 to-blue-800 text-white flex flex-col shadow-2xl">
        {/* Logo/Header */}
        <div className="p-6 border-b border-blue-500/30">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
              <Users size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">MyHR</h1>
              <p className="text-sm text-blue-200">Sistema de Gestão</p>
            </div>
          </div>
          
          {/* Info do usuário */}
          <div className="mt-4 p-3 bg-white/10 backdrop-blur rounded-xl">
            <p className="text-xs text-blue-200 mb-1">Logado como</p>
            <p className="font-semibold text-white">{usuario.nome}</p>
            <span className="inline-block mt-1 px-2 py-1 bg-blue-500 text-xs rounded-full">
              {usuario.tipo}
            </span>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = modo === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setModo(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  isActive 
                    ? 'bg-white text-blue-600 shadow-lg transform scale-105' 
                    : 'text-white hover:bg-white/10 hover:translate-x-1'
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Botão Sair */}
        <div className="p-4 border-t border-blue-500/30">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-white hover:bg-red-500 transition-all"
          >
            <LogOut size={20} />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      {/* 📄 CONTEÚDO PRINCIPAL */}
      <main className="flex-1 overflow-auto">
        {/* Header Superior */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
          <div className="px-8 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {menuItems.find(m => m.id === modo)?.label || 'Dashboard'}
              </h2>
              <p className="text-sm text-gray-600">
                Bem-vindo de volta, {usuario.nome}! 👋
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="relative p-2 hover:bg-gray-100 rounded-xl transition">
                <Bell size={20} className="text-gray-700" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {usuario.nome.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Conteúdo da Página */}
        <div className="p-8">
          {modo === 'dashboard' && (
            <>
              <h3 className="text-xl font-bold text-gray-800 mb-6">
                📊 Visão Geral
              </h3>
              
              {/* Cards de Estatísticas */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Card 1: Colaboradores */}
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all cursor-pointer">
                  <div className="flex items-center justify-between mb-4">
                    <Users size={32} className="opacity-80" />
                  </div>
                  <div className="text-4xl font-bold mb-2">
                    {estatisticas.totalColaboradores}
                  </div>
                  <p className="text-sm opacity-90 font-medium">
                    Colaboradores Ativos
                  </p>
                </div>

                {/* Card 2: Férias Pendentes */}
                <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all cursor-pointer">
                  <div className="flex items-center justify-between mb-4">
                    <Calendar size={32} className="opacity-80" />
                  </div>
                  <div className="text-4xl font-bold mb-2">
                    {estatisticas.feriasPendentes}
                  </div>
                  <p className="text-sm opacity-90 font-medium">
                    Férias Pendentes
                  </p>
                </div>

                {/* Card 3: Avaliações */}
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all cursor-pointer">
                  <div className="flex items-center justify-between mb-4">
                    <FileText size={32} className="opacity-80" />
                  </div>
                  <div className="text-4xl font-bold mb-2">
                    {estatisticas.totalAvaliacoes}
                  </div>
                  <p className="text-sm opacity-90 font-medium">
                    Avaliações Realizadas
                  </p>
                </div>

                {/* Card 4: Média Geral */}
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all cursor-pointer">
                  <div className="flex items-center justify-between mb-4">
                    <Award size={32} className="opacity-80" />
                  </div>
                  <div className="text-4xl font-bold mb-2">
                    {estatisticas.mediaGeral.toFixed(1)}
                  </div>
                  <p className="text-sm opacity-90 font-medium">
                    Média de Desempenho
                  </p>
                </div>
              </div>

              {/* Mensagem de boas-vindas */}
              <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-200">
                <h4 className="text-lg font-bold text-gray-900 mb-3">
                  🚀 Sistema MyHR
                </h4>
                <p className="text-gray-600 mb-4">
                  Gerencie sua equipe de forma simples e eficiente. Cadastre colaboradores, 
                  registre avaliações e controle férias tudo em um só lugar.
                </p>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setModo('pessoal')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Cadastrar Colaborador
                  </button>
                  <button 
                    onClick={() => setModo('avaliacoes')}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                  >
                    Nova Avaliação
                  </button>
                </div>
              </div>
            </>
          )}

          {modo !== 'dashboard' && (
            <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                🚧 Em Desenvolvimento
              </h3>
              <p className="text-gray-600">
                Esta funcionalidade estará disponível em breve!
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MyHRApp;
