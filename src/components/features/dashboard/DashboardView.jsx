// ==========================================
// 📊 DASHBOARD VIEW - Versão Standalone
// ==========================================

import React, { useEffect, useState } from 'react';
import { Users, Calendar, FileText, Award, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { colaboradoresService, avaliacoesService, feriasService } from '../../../services/api';

// ==========================================
// 🎨 CORES (Inline)
// ==========================================
const colors = {
  primary: '#0066FF',
  gradients: {
    green: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    orange: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
    purple: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
    blue: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)'
  }
};

// ==========================================
// 📊 STAT CARD (Inline)
// ==========================================
const StatCard = ({ icon: Icon, value, label, gradient }) => (
  <div 
    className="rounded-2xl p-6 shadow-lg text-white"
    style={{ background: gradient }}
  >
    {Icon && <Icon size={28} className="mb-3 opacity-80" />}
    <div className="text-4xl font-bold mb-1">{value}</div>
    <p className="text-sm opacity-90">{label}</p>
  </div>
);

// ==========================================
// 💀 SKELETON (Inline)
// ==========================================
const StatCardSkeleton = () => (
  <div className="bg-gray-100 rounded-2xl p-6 animate-pulse">
    <div className="w-8 h-8 bg-gray-200 rounded mb-3"></div>
    <div className="w-16 h-10 bg-gray-200 rounded mb-2"></div>
    <div className="w-24 h-4 bg-gray-200 rounded"></div>
  </div>
);

// ==========================================
// 🎭 EMPTY STATE (Inline)
// ==========================================
const EmptyState = ({ icon: Icon, title, description }) => (
  <div className="text-center py-12">
    {Icon && (
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
        <Icon size={28} className="text-gray-400" />
      </div>
    )}
    <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
    {description && (
      <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">{description}</p>
    )}
  </div>
);

// ==========================================
// 📊 DASHBOARD PRINCIPAL
// ==========================================
const DashboardView = () => {
  const [colaboradores, setColaboradores] = useState([]);
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [estatisticas, setEstatisticas] = useState({
    mediaGeral: 0,
    totalAvaliacoes: 0
  });
  const [estatisticasFerias, setEstatisticasFerias] = useState({
    pendentes: 0,
    aprovados: 0,
    rejeitados: 0
  });
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setCarregando(true);
      
      const [colabResponse, avalResponse, statsAval, statsFerias] = await Promise.all([
        colaboradoresService.listar(),
        avaliacoesService.listar(),
        avaliacoesService.obterEstatisticas(),
        feriasService.obterEstatisticas()
      ]);

      setColaboradores(colabResponse.colaboradores || []);
      setAvaliacoes(avalResponse.avaliacoes || []);
      setEstatisticas(statsAval);
      setEstatisticasFerias(statsFerias);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setCarregando(false);
    }
  };

  if (carregando) {
    return (
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-gray-900">Dashboard</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[1, 2, 3, 4].map(i => (
            <StatCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-gray-900">Dashboard</h2>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={Users}
          value={colaboradores.length}
          label="Colaboradores"
          gradient={colors.gradients.green}
        />

        <StatCard
          icon={Calendar}
          value={estatisticasFerias.pendentes}
          label="Férias Pendentes"
          gradient={colors.gradients.orange}
        />

        <StatCard
          icon={FileText}
          value={estatisticas.totalAvaliacoes}
          label="Avaliações"
          gradient={colors.gradients.purple}
        />

        <StatCard
          icon={Award}
          value={estatisticas.mediaGeral}
          label="Média Geral"
          gradient={colors.gradients.blue}
        />
      </div>

      {/* Gráfico de Desempenho */}
      {avaliacoes.length > 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-xl font-bold mb-4 text-gray-900 flex items-center gap-2">
            <BarChart3 size={24} className="text-blue-600" />
            Desempenho por Colaborador
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={avaliacoes.slice(0, 5).map(a => ({
                nome: a.colaborador?.nome_completo?.split(' ')[0] || 'N/A',
                media: parseFloat(a.media_geral) || 0
              }))}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="nome" />
              <YAxis domain={[0, 5]} />
              <Tooltip />
              <Bar dataKey="media" fill={colors.primary} name="Média de Desempenho" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <EmptyState
            icon={BarChart3}
            title="Nenhuma avaliação ainda"
            description="Crie avaliações de desempenho para ver estatísticas aqui"
          />
        </div>
      )}
    </div>
  );
};

export default DashboardView;