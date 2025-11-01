// ==========================================
// 🏖️ FÉRIAS VIEW
// ==========================================
// Explicação para iniciantes:
// - Página para solicitar férias
// - Calcula automaticamente os dias entre datas
// - Gestores/Admins podem aprovar ou rejeitar
// ==========================================

import React, { useState, useEffect } from 'react';
import { Umbrella, CheckCircle, Check, XCircle } from 'lucide-react';
import { colaboradoresService, feriasService } from '../../../services/api';
import { useAuth } from '../../../contexts/AuthContext';
import { useTheme } from '../../../contexts/ThemeContext';

const FeriasView = ({ mostrarNotificacao }) => {
  const { usuario } = useAuth();
  const { configuracao } = useTheme();
  const [colaboradores, setColaboradores] = useState([]);
  const [ferias, setFerias] = useState([]);
  const [carregando, setCarregando] = useState(false);

  const [formulario, setFormulario] = useState({
    colaborador_id: '',
    data_inicio: '',
    data_fim: '',
    dias_solicitados: 0,
    motivo: ''
  });

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setCarregando(true);
      const [colabResponse, feriasResponse] = await Promise.all([
        colaboradoresService.listar(),
        feriasService.listar()
      ]);

      setColaboradores(colabResponse.colaboradores || []);
      setFerias(feriasResponse.ferias || []);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      mostrarNotificacao?.('Erro ao carregar dados', 'error');
    } finally {
      setCarregando(false);
    }
  };

  // Calcular dias automaticamente
  useEffect(() => {
    if (formulario.data_inicio && formulario.data_fim) {
      const inicio = new Date(formulario.data_inicio);
      const fim = new Date(formulario.data_fim);
      const diffTime = Math.abs(fim - inicio);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      setFormulario(prev => ({ ...prev, dias_solicitados: diffDays }));
    }
  }, [formulario.data_inicio, formulario.data_fim]);

  const handleSubmit = async () => {
    if (!formulario.colaborador_id || !formulario.data_inicio || !formulario.data_fim) {
      mostrarNotificacao?.('Preencha todos os campos obrigatórios', 'error');
      return;
    }

    if (new Date(formulario.data_inicio) >= new Date(formulario.data_fim)) {
      mostrarNotificacao?.('Data de fim deve ser posterior à data de início', 'error');
      return;
    }

    try {
      setCarregando(true);

      const dados = {
        ...formulario,
        colaborador_id: parseInt(formulario.colaborador_id),
        status: 'pendente'
      };

      await feriasService.criar(dados);
      mostrarNotificacao?.('Pedido de férias enviado com sucesso!', 'success');

      // Recarregar lista
      await carregarDados();

      // Limpar formulário
      setFormulario({
        colaborador_id: '',
        data_inicio: '',
        data_fim: '',
        dias_solicitados: 0,
        motivo: ''
      });
    } catch (error) {
      console.error('Erro ao solicitar férias:', error);
      mostrarNotificacao?.(error.error || 'Erro ao solicitar férias', 'error');
    } finally {
      setCarregando(false);
    }
  };

  const aprovarFerias = async (id) => {
    try {
      setCarregando(true);
      await feriasService.aprovar(id, usuario.id);
      mostrarNotificacao?.('Férias aprovadas!', 'success');
      await carregarDados();
    } catch (error) {
      console.error('Erro ao aprovar:', error);
      mostrarNotificacao?.(error.error || 'Erro ao aprovar férias', 'error');
    } finally {
      setCarregando(false);
    }
  };

  const rejeitarFerias = async (id) => {
    try {
      setCarregando(true);
      await feriasService.rejeitar(id, usuario.id);
      mostrarNotificacao?.('Férias rejeitadas!', 'success');
      await carregarDados();
    } catch (error) {
      console.error('Erro ao rejeitar:', error);
      mostrarNotificacao?.(error.error || 'Erro ao rejeitar férias', 'error');
    } finally {
      setCarregando(false);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'aprovado': return 'bg-green-500';
      case 'rejeitado': return 'bg-red-500';
      case 'pendente': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'aprovado': return 'Aprovado';
      case 'rejeitado': return 'Rejeitado';
      case 'pendente': return 'Pendente';
      default: return status;
    }
  };

  return (
    <div className="pb-24 max-w-6xl mx-auto">
      {/* Formulário de Solicitação */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 border border-gray-100">
        <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 text-blue-600">
          <Umbrella size={24} />
          Solicitar Férias
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {/* Colaborador */}
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

          {/* Dias Solicitados (calculado automaticamente) */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Dias Solicitados
            </label>
            <input
              type="text"
              value={formulario.dias_solicitados}
              readOnly
              className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl outline-none text-center font-bold text-lg"
              placeholder="0 dias"
            />
          </div>

          {/* Data de Início */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Data de Início *
            </label>
            <input
              type="date"
              value={formulario.data_inicio}
              onChange={(e) => setFormulario({...formulario, data_inicio: e.target.value})}
              disabled={carregando}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition disabled:opacity-50"
            />
          </div>

          {/* Data de Fim */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Data de Fim *
            </label>
            <input
              type="date"
              value={formulario.data_fim}
              onChange={(e) => setFormulario({...formulario, data_fim: e.target.value})}
              disabled={carregando}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition disabled:opacity-50"
            />
          </div>

          {/* Motivo */}
          <div className="col-span-1 sm:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Motivo
            </label>
            <textarea
              value={formulario.motivo}
              onChange={(e) => setFormulario({...formulario, motivo: e.target.value})}
              disabled={carregando}
              rows={3}
              placeholder="Ex: Férias de verão, viagem familiar..."
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition disabled:opacity-50"
            />
          </div>
        </div>

        {/* Botão Solicitar */}
        <button
          onClick={handleSubmit}
          disabled={carregando}
          style={{ backgroundColor: configuracao.corPrimaria }}
          className="w-full px-6 py-3 text-white rounded-xl font-semibold hover:opacity-90 active:scale-98 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <CheckCircle size={20} />
          {carregando ? 'Enviando...' : 'Solicitar Férias'}
        </button>
      </div>

      {/* Lista de Pedidos */}
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-xl font-bold mb-4 text-gray-900">
          Pedidos de Férias ({ferias.length})
        </h3>

        {ferias.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            Nenhum pedido de férias cadastrado
          </p>
        ) : (
          <div className="space-y-4">
            {ferias.map((f) => (
              <div
                key={f.id}
                className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-4 mb-3">
                  {/* Foto ou Avatar */}
                  {f.colaborador?.foto_url ? (
                    <img 
                      src={f.colaborador.foto_url} 
                      alt={f.colaborador.nome_completo}
                      className="h-12 w-12 object-cover rounded-full border-2 border-blue-500"
                    />
                  ) : (
                    <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                      {f.colaborador?.nome_completo?.charAt(0).toUpperCase()}
                    </div>
                  )}

                  {/* Informações */}
                  <div className="flex-1">
                    <p className="font-bold text-gray-900">
                      {f.colaborador?.nome_completo}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(f.data_inicio).toLocaleDateString('pt-BR')} até{' '}
                      {new Date(f.data_fim).toLocaleDateString('pt-BR')}
                      {' '} • {f.dias_solicitados} dias
                    </p>
                    {f.motivo && (
                      <p className="text-sm text-gray-500 mt-1">{f.motivo}</p>
                    )}
                  </div>

                  {/* Status */}
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-white text-xs font-bold ${getStatusColor(f.status)}`}
                    >
                      {getStatusText(f.status)}
                    </span>
                  </div>
                </div>

                {/* Botões de Aprovação/Rejeição */}
                {f.status === 'pendente' && (usuario.tipo === 'admin' || usuario.tipo === 'gestor') && (
                  <div className="flex gap-2 mt-3 pt-3 border-t border-gray-200">
                    <button
                      onClick={() => aprovarFerias(f.id)}
                      disabled={carregando}
                      className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <Check size={16} />
                      Aprovar
                    </button>
                    <button
                      onClick={() => rejeitarFerias(f.id)}
                      disabled={carregando}
                      className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <XCircle size={16} />
                      Rejeitar
                    </button>
                  </div>
                )}

                {/* Info do Aprovador */}
                {f.status !== 'pendente' && f.aprovador && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600">
                      <strong>
                        {f.status === 'aprovado' ? 'Aprovado' : 'Rejeitado'}
                      </strong>{' '}
                      por {f.aprovador.nome} em{' '}
                      {new Date(f.data_aprovacao).toLocaleDateString('pt-BR')}
                    </p>
                    {f.observacoes_aprovador && (
                      <p className="text-xs text-gray-600 mt-1">
                        {f.observacoes_aprovador}
                      </p>
                    )}
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

export default FeriasView;