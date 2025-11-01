// ==========================================
// 👥 COLABORADORES VIEW
// ==========================================
// Explicação para iniciantes:
// - Página para cadastrar e listar colaboradores
// - Formulário: campos para nome, email, setor, cargo
// - Lista: mostra todos os colaboradores cadastrados
// - Upload de foto: converte imagem para base64
// ==========================================

import React, { useState, useEffect } from 'react';
import { UserPlus, Edit, Upload, CheckCircle } from 'lucide-react';
import { colaboradoresService } from '../../../services/api';
import { useTheme } from '../../../contexts/ThemeContext';

const ColaboradoresView = ({ mostrarNotificacao }) => {
  const { configuracao } = useTheme();
  const [colaboradores, setColaboradores] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [editando, setEditando] = useState(null);

  const [formulario, setFormulario] = useState({
    nome_completo: '',
    email: '',
    cargo: '',
    setor_id: '',
    foto_url: '',
    status: 'ativo'
  });

  useEffect(() => {
    carregarColaboradores();
  }, []);

  const carregarColaboradores = async () => {
    try {
      setCarregando(true);
      const response = await colaboradoresService.listar();
      setColaboradores(response.colaboradores || []);
    } catch (error) {
      console.error('Erro ao carregar colaboradores:', error);
      mostrarNotificacao?.('Erro ao carregar colaboradores', 'error');
    } finally {
      setCarregando(false);
    }
  };

  const handleFotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      mostrarNotificacao?.('Selecione uma imagem válida', 'error');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      mostrarNotificacao?.('Imagem muito grande! Máximo 2MB', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormulario(prev => ({ ...prev, foto_url: reader.result }));
      mostrarNotificacao?.('Foto carregada!', 'success');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    // Validações
    if (!formulario.nome_completo || !formulario.email || 
        !formulario.cargo || !formulario.setor_id) {
      mostrarNotificacao?.('Preencha todos os campos obrigatórios', 'error');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formulario.email)) {
      mostrarNotificacao?.('Email inválido', 'error');
      return;
    }

    try {
      setCarregando(true);

      const dados = {
        ...formulario,
        setor_id: parseInt(formulario.setor_id)
      };

      if (editando) {
        await colaboradoresService.atualizar(editando.id, dados);
        mostrarNotificacao?.('Colaborador atualizado!', 'success');
        setEditando(null);
      } else {
        await colaboradoresService.criar(dados);
        mostrarNotificacao?.('Colaborador cadastrado!', 'success');
      }

      // Recarregar lista
      await carregarColaboradores();

      // Limpar formulário
      setFormulario({
        nome_completo: '',
        email: '',
        cargo: '',
        setor_id: '',
        foto_url: '',
        status: 'ativo'
      });
    } catch (error) {
      console.error('Erro ao salvar:', error);
      mostrarNotificacao?.(error.error || 'Erro ao salvar', 'error');
    } finally {
      setCarregando(false);
    }
  };

  const handleEditar = (colaborador) => {
    setEditando(colaborador);
    setFormulario({
      nome_completo: colaborador.nome_completo,
      email: colaborador.email,
      cargo: colaborador.cargo,
      setor_id: colaborador.setor_id?.toString() || '',
      foto_url: colaborador.foto_url || '',
      status: colaborador.status || 'ativo'
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="pb-24 max-w-4xl mx-auto">
      {/* Formulário de Cadastro */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 border border-gray-100">
        <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 text-blue-600">
          <UserPlus size={24} />
          {editando ? 'Editar' : 'Cadastrar'} Colaborador
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Nome Completo */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nome Completo *
            </label>
            <input
              type="text"
              value={formulario.nome_completo}
              onChange={(e) => setFormulario({...formulario, nome_completo: e.target.value})}
              disabled={carregando}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition disabled:opacity-50"
              placeholder="João Silva"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              value={formulario.email}
              onChange={(e) => setFormulario({...formulario, email: e.target.value})}
              disabled={carregando}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition disabled:opacity-50"
              placeholder="joao@empresa.com"
            />
          </div>

          {/* Setor */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Setor *
            </label>
            <select
              value={formulario.setor_id}
              onChange={(e) => setFormulario({...formulario, setor_id: e.target.value})}
              disabled={carregando}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition disabled:opacity-50"
            >
              <option value="">Selecione</option>
              <option value="1">Administração</option>
              <option value="2">RH</option>
              <option value="3">TI</option>
              <option value="4">Vendas</option>
              <option value="5">Financeiro</option>
            </select>
          </div>

          {/* Cargo */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Cargo *
            </label>
            <select
              value={formulario.cargo}
              onChange={(e) => setFormulario({...formulario, cargo: e.target.value})}
              disabled={carregando}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition disabled:opacity-50"
            >
              <option value="">Selecione</option>
              <option value="Director">Director</option>
              <option value="Gestor">Gestor</option>
              <option value="Supervisor">Supervisor</option>
              <option value="Colaborador">Colaborador</option>
            </select>
          </div>

          {/* Upload de Foto */}
          <div className="col-span-1 sm:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Foto do Colaborador (opcional)
            </label>
            <div className="flex items-center gap-4">
              {formulario.foto_url && (
                <img 
                  src={formulario.foto_url} 
                  alt="Preview" 
                  className="h-20 w-20 object-cover rounded-full border-2 border-blue-500"
                />
              )}
              <label className="cursor-pointer px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition flex items-center gap-2">
                <Upload size={18} className="text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                  {formulario.foto_url ? 'Trocar Foto' : 'Carregar Foto'}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFotoUpload}
                  className="hidden"
                />
              </label>
              {formulario.foto_url && (
                <button
                  onClick={() => setFormulario(prev => ({ ...prev, foto_url: '' }))}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition"
                >
                  Remover
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Botão Salvar */}
        <button
          onClick={handleSubmit}
          disabled={carregando}
          style={{ backgroundColor: configuracao.corPrimaria }}
          className="mt-6 w-full px-6 py-3 text-white rounded-xl font-semibold hover:opacity-90 active:scale-98 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <CheckCircle size={20} />
          {carregando ? 'Processando...' : (editando ? 'Atualizar' : 'Cadastrar')}
        </button>
      </div>

      {/* Lista de Colaboradores */}
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-xl font-bold mb-4 text-gray-900">
          Cadastrados ({colaboradores.length})
        </h3>

        {carregando ? (
          <p className="text-center text-gray-500 py-4">Carregando...</p>
        ) : colaboradores.length === 0 ? (
          <p className="text-center text-gray-500 py-4">Nenhum colaborador cadastrado</p>
        ) : (
          <div className="space-y-3">
            {colaboradores.map((c) => (
              <div
                key={c.id}
                className="p-4 border border-gray-200 rounded-xl flex items-center gap-4 hover:bg-gray-50 transition"
              >
                {/* Foto ou Avatar */}
                {c.foto_url ? (
                  <img 
                    src={c.foto_url} 
                    alt={c.nome_completo}
                    className="h-14 w-14 object-cover rounded-full border-2 border-blue-500"
                  />
                ) : (
                  <div className="h-14 w-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {c.nome_completo.charAt(0).toUpperCase()}
                  </div>
                )}

                {/* Informações */}
                <div className="flex-1">
                  <p className="font-bold text-sm text-gray-900">{c.nome_completo}</p>
                  <p className="text-xs text-gray-600">
                    {c.cargo} • {c.setor_nome || 'Setor não definido'}
                  </p>
                </div>

                {/* Botão Editar */}
                <button
                  onClick={() => handleEditar(c)}
                  className="px-4 py-2 text-white rounded-lg text-sm hover:opacity-90 transition"
                  style={{ backgroundColor: configuracao.corPrimaria }}
                >
                  <Edit size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ColaboradoresView;