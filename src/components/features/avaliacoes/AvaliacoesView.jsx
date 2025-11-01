// ==========================================
// ⭐ AVALIAÇÕES VIEW
// ==========================================
// Explicação para iniciantes:
// - Página para avaliar colaboradores (1 a 5 estrelas)
// - 10 critérios: assiduidade, pontualidade, etc
// - Histórico: lista todas as avaliações feitas
// ==========================================

import React, { useState, useEffect } from 'react';
import { Star, CheckCircle, BarChart3 } from 'lucide-react';
import { colaboradoresService, avaliacoesService } from '../../../services/api';
import { useAuth } from '../../../contexts/AuthContext';
import { useTheme } from '../../../contexts/ThemeContext';

// Lista dos critérios de avaliação
const criteriosData = [
  { nome: 'Assiduidade', descricao: 'Frequência e regularidade', campo: 'assiduidade' },
  { nome: 'Pontualidade', descricao: 'Cumprimento de horários', campo: 'pontualidade' },
  { nome: 'Postura', descricao: 'Comportamento profissional', campo: 'postura' },
  { nome: 'Disponibilidade', descricao: 'Flexibilidade de horário', campo: 'disponibilidade' },
  { nome: 'Comprometimento', descricao: 'Dedicação à empresa', campo: 'comprometimento' },
  { nome: 'Honestidade', descricao: 'Integridade e transparência', campo: 'honestidade' },
  { nome: 'Higiene sector', descricao: 'Limpeza do local', campo: 'higiene_sector' },
  { nome: 'Higiene pessoal', descricao: 'Apresentação pessoal', campo: 'higiene_pessoal' },
  { nome: 'Trabalho equipa', descricao: 'Colaboração', campo: 'trabalho_equipa' },
  { nome: 'Respeito', descricao: 'Tratamento respeitoso', campo: 'respeito' }
];

const AvaliacoesView = ({ mostrarNotificacao }) => {
  const { usuario } = useAuth();
  const { configuracao } = useTheme();
  const [colaboradores, setColaboradores] = useState([]);
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [carregando, setCarregando] = useState(false);

  const [formulario, setFormulario] = useState({
    colaborador_id: '',
    periodo: '',
    assiduidade: 3,
    pontualidade: 3,
    postura: 3,
    disponibilidade: 3,
    comprometimento: 3,
    honestidade: 3,
    higiene_sector: 3,
    higiene_pessoal: 3,
    trabalho_equipa: 3,
    respeito: 3,
    observacoes: ''
  });

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setCarregando(true);
      const [colabResponse, avalResponse] = await Promise.all([
        colaboradoresService.listar(),
        avaliacoesService.listar()
      ]);

      setColaboradores(colabResponse.colaboradores || []);
      setAvaliacoes(avalResponse.avaliacoes || []);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      mostrarNotificacao?.('Erro ao carregar dados', 'error');
    } finally {
      setCarregando(false);
    }
  };

  const handleSubmit = async () => {
    if (!formulario.colaborador_id || !formulario.periodo) {
      mostrarNotificacao?.('Selecione o colaborador e o período', 'error');
      return;
    }

    try {
      setCarregando(true);

      const dados = {
        ...formulario,
        colaborador_id: parseInt(formulario.colaborador_id),
        avaliador_id: usuario.id
      };

      await avaliacoesService.criar(dados);
      mostrarNotificacao?.('Avaliação registrada com sucesso!', 'success');

      // Recarregar lista
      await carregarDados();

      // Limpar formulário
      setFormulario({
        colaborador_id: '',
        periodo: '',
        assiduidade: 3,
        pontualidade: 3,
        postura: 3,
        disponibilidade: 3,
        comprometimento: 3,
        honestidade: 3,
        higiene_sector: 3,
        higiene_pessoal: 3,
        trabalho_equipa: 3,
        respeito: 3,
        observacoes: ''
      });
    } catch (error) {
      console.error('Erro ao salvar:', error);
      mostrarNotificacao?.(error.error || 'Erro ao salvar avaliação', 'error');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="pb-24 max-w-6xl mx-auto">
      {/* Formulário de Nova Avaliação */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 border border-gray-100">
        <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 text-blue-600">
          <Star size={24} />
          Nova Avaliação de Desempenho
        </h3>

        {/* Colaborador e Período */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Colaborador *
            </label>
            <select
              value={formulario.colaborador_id}
              onChange={(e) => setFormulario({...formulario, colaborador_id: e.target.value})}
              disabled={carregando}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition disabled:opacity-50"
            >
              <option value="">Selecione o colaborador</option>
              {colaboradores.map(c => (
                <option key={c.id} value={c.id}>
                  {c.nome_completo} - {c.cargo}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Período *
            </label>
            <input
              type="text"
              value={formulario.periodo}
              onChange={(e) => setFormulario({...formulario, periodo: e.target.value})}
              disabled={carregando}
              placeholder="Ex: Janeiro 2025"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition disabled:opacity-50"
            />
          </div>
        </div>

        {/* Critérios de Avaliação */}
        <div className="mb-6">
          <h4 className="font-bold text-lg mb-4 text-gray-800">
            Critérios de Avaliação (1 a 5 estrelas)
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {criteriosData.map((criterio) => (
              <div key={criterio.campo} className="p-4 bg-gray-50 rounded-xl">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {criterio.nome}
                  <span className="text-xs text-gray-500 ml-2">
                    ({criterio.descricao})
                  </span>
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(nota => (
                    <button
                      key={nota}
                      onClick={() => setFormulario({...formulario, [criterio.campo]: nota})}
                      className={`p-2 rounded-lg transition ${
                        formulario[criterio.campo] >= nota 
                          ? 'text-yellow-500' 
                          : 'text-gray-300 hover:text-yellow-400'
                      }`}
                    >
                      <Star 
                        size={24} 
                        fill={formulario[criterio.campo] >= nota ? 'currentColor' : 'none'} 
                      />
                    </button>
                  ))}
                  <span className="ml-2 flex items-center font-bold text-lg text-gray-700">
                    {formulario[criterio.campo]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Observações */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Observações
          </label>
          <textarea
            value={formulario.observacoes}
            onChange={(e) => setFormulario({...formulario, observacoes: e.target.value})}
            disabled={carregando}
            rows={4}
            placeholder="Comentários adicionais sobre o desempenho..."
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition disabled:opacity-50"
          />
        </div>

        {/* Botão Salvar */}
        <button
          onClick={handleSubmit}
          disabled={carregando}
          style={{ backgroundColor: configuracao.corPrimaria }}
          className="w-full px-6 py-3 text-white rounded-xl font-semibold hover:opacity-90 active:scale-98 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <CheckCircle size={20} />
          {carregando ? 'Salvando...' : 'Salvar Avaliação'}
        </button>
      </div>

      {/* Histórico de Avaliações */}
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-xl font-bold mb-4 text-gray-900 flex items-center gap-2">
          <BarChart3 size={24} className="text-blue-600" />
          Histórico de Avaliações ({avaliacoes.length})
        </h3>

        {avaliacoes.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            Nenhuma avaliação cadastrada ainda
          </p>
        ) : (
          <div className="space-y-4">
            {avaliacoes.map((av) => (
              <div
                key={av.id}
                className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-4 mb-3">
                  {/* Foto ou Avatar */}
                  {av.colaborador?.foto_url ? (
                    <img 
                      src={av.colaborador.foto_url} 
                      alt={av.colaborador.nome_completo}
                      className="h-12 w-12 object-cover rounded-full border-2 border-blue-500"
                    />
                  ) : (
                    <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                      {av.colaborador?.nome_completo?.charAt(0).toUpperCase()}
                    </div>
                  )}

                  {/* Informações */}
                  <div className="flex-1">
                    <p className="font-bold text-gray-900">
                      {av.colaborador?.nome_completo}
                    </p>
                    <p className="text-sm text-gray-600">
                      {av.periodo} • Avaliado por: {av.avaliador?.nome}
                    </p>
                  </div>

                  {/* Média */}
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star size={20} fill="currentColor" />
                      <span className="font-bold text-2xl text-gray-900">
                        {av.media_geral}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">Média Geral</p>
                  </div>
                </div>

                {/* Observações */}
                {av.observacoes && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-700">{av.observacoes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AvaliacoesView;