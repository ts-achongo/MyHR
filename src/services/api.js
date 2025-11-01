// ==========================================
// 🔌 SERVICES/API.JS - Conexão com Backend
// ==========================================
// Explicação para iniciantes:
// Este arquivo é a "ponte" entre o frontend (interface) e o backend (Supabase)
// Ele contém todas as funções que fazem pedidos ao banco de dados
// ==========================================

import { supabase } from '../supabaseClient';

// ==========================================
// 🔐 AUTH SERVICE - Serviço de Autenticação
// ==========================================
// O que faz: Login, Logout, Verificar se está logado
// ==========================================

export const authService = {
  /**
   * 🔑 LOGIN - Fazer login no sistema
   * @param {string} email - Email do usuário
   * @param {string} password - Senha do usuário
   * @returns {Promise} - Retorna dados do usuário ou erro
   */
  login: async (email, password) => {
    try {
      // 1. Tentar fazer login no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) throw authError;

      // 2. Buscar dados completos do usuário na tabela 'profiles'
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (profileError) throw profileError;

      // 3. Criar objeto de usuário completo
      const utilizador = {
        id: profile.id,
        email: profile.email,
        nome: profile.nome,
        tipo: profile.tipo, // admin, gestor, colaborador
        ativo: profile.ativo
      };

      // 4. Salvar no localStorage (para manter login)
      localStorage.setItem('myhr_user', JSON.stringify(utilizador));
      localStorage.setItem('myhr_token', authData.session.access_token);

      return { utilizador, session: authData.session };
    } catch (error) {
      console.error('Erro no login:', error);
      throw { error: error.message || 'Erro ao fazer login' };
    }
  },

  /**
   * 🚪 LOGOUT - Sair do sistema
   */
  logout: async () => {
    try {
      // 1. Fazer logout no Supabase
      await supabase.auth.signOut();

      // 2. Limpar localStorage
      localStorage.removeItem('myhr_user');
      localStorage.removeItem('myhr_token');

      return { success: true };
    } catch (error) {
      console.error('Erro no logout:', error);
      throw { error: error.message || 'Erro ao fazer logout' };
    }
  },

  /**
   * ✅ Verificar se está autenticado
   * @returns {boolean} - true se está logado
   */
  isAuthenticated: () => {
    const user = localStorage.getItem('myhr_user');
    const token = localStorage.getItem('myhr_token');
    return !!(user && token);
  },

  /**
   * 👤 Obter usuário atual
   * @returns {Object|null} - Dados do usuário ou null
   */
  getCurrentUser: () => {
    const user = localStorage.getItem('myhr_user');
    return user ? JSON.parse(user) : null;
  }
};

// ==========================================
// 👥 COLABORADORES SERVICE
// ==========================================
// O que faz: Gerenciar colaboradores (listar, criar, editar)
// ==========================================

export const colaboradoresService = {
  /**
   * 📋 LISTAR - Buscar todos os colaboradores
   * @returns {Promise} - Lista de colaboradores
   */
  listar: async () => {
    try {
      const { data, error } = await supabase
        .from('colaboradores')
        .select(`
          *,
          setor:setores(id, nome)
        `)
        .eq('status', 'ativo')
        .order('nome_completo', { ascending: true });

      if (error) throw error;

      // Formatar dados para o frontend
      const colaboradores = data.map(col => ({
        ...col,
        setor_nome: col.setor?.nome || 'Sem setor'
      }));

      return { colaboradores };
    } catch (error) {
      console.error('Erro ao listar colaboradores:', error);
      throw { error: error.message || 'Erro ao carregar colaboradores' };
    }
  },

  /**
   * ➕ CRIAR - Cadastrar novo colaborador
   * @param {Object} dados - Dados do colaborador
   * @returns {Promise} - Colaborador criado
   */
  criar: async (dados) => {
    try {
      const { data, error } = await supabase
        .from('colaboradores')
        .insert([{
          nome_completo: dados.nome_completo,
          email: dados.email,
          cargo: dados.cargo,
          setor_id: dados.setor_id,
          cv_url: dados.cv_url || null,
          foto_url: dados.foto_url || null,
          status: dados.status || 'ativo'
        }])
        .select() // ESSENCIAL: Retorna o objeto criado
        .single();

      if (error) throw error;

      return { colaborador: data }; // Retorna o colaborador para uso no frontend (notificação)
    } catch (error) {
      console.error('Erro ao criar colaborador:', error);
      throw { error: error.message || 'Erro ao cadastrar colaborador' };
    }
  },

  /**
   * ✏️ ATUALIZAR - Editar colaborador existente
   * @param {number} id - ID do colaborador
   * @param {Object} dados - Novos dados
   * @returns {Promise} - Colaborador atualizado
   */
  atualizar: async (id, dados) => {
    try {
      const { data, error } = await supabase
        .from('colaboradores')
        .update({
          nome_completo: dados.nome_completo,
          email: dados.email,
          cargo: dados.cargo,
          setor_id: dados.setor_id,
          cv_url: dados.cv_url,
          foto_url: dados.foto_url,
          status: dados.status
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return { colaborador: data };
    } catch (error) {
      console.error('Erro ao atualizar colaborador:', error);
      throw { error: error.message || 'Erro ao atualizar colaborador' };
    }
  }
};

// ==========================================
// ⭐ AVALIAÇÕES SERVICE
// ==========================================
// O que faz: Gerenciar avaliações de desempenho
// ==========================================

export const avaliacoesService = {
  /**
   * 📋 LISTAR - Buscar todas as avaliações
   * @returns {Promise} - Lista de avaliações
   */
  listar: async () => {
    try {
      const { data, error } = await supabase
        .from('avaliacoes')
        .select(`
          *,
          colaborador:colaboradores(id, nome_completo, cargo, foto_url),
          avaliador:profiles(id, nome)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { avaliacoes: data };
    } catch (error) {
      console.error('Erro ao listar avaliações:', error);
      throw { error: error.message || 'Erro ao carregar avaliações' };
    }
  },

  /**
   * ➕ CRIAR - Registrar nova avaliação
   * @param {Object} dados - Dados da avaliação
   * @returns {Promise} - Avaliação criada
   */
  criar: async (dados) => {
    try {
      // Calcular média geral
      const criterios = [
        dados.assiduidade,
        dados.pontualidade,
        dados.postura,
        dados.disponibilidade,
        dados.comprometimento,
        dados.honestidade,
        dados.higiene_sector,
        dados.higiene_pessoal,
        dados.trabalho_equipa,
        dados.respeito
      ];
      const media_geral = (criterios.reduce((a, b) => a + b, 0) / criterios.length).toFixed(1);

      const { data, error } = await supabase
        .from('avaliacoes')
        .insert([{
          ...dados,
          media_geral: parseFloat(media_geral)
        }])
        .select(`
          *,
          colaborador:colaboradores(id, nome_completo, cargo, foto_url),
          avaliador:profiles(id, nome)
        `)
        .single();

      if (error) throw error;

      return { avaliacao: data };
    } catch (error) {
      console.error('Erro ao criar avaliação:', error);
      throw { error: error.message || 'Erro ao registrar avaliação' };
    }
  },

  /**
   * 📊 OBTER ESTATÍSTICAS - Calcular médias e totais
   * @returns {Promise} - Estatísticas das avaliações
   */
  obterEstatisticas: async () => {
    try {
      const { data, error } = await supabase
        .from('avaliacoes')
        .select('media_geral');

      if (error) throw error;

      const totalAvaliacoes = data.length;
      const mediaGeral = totalAvaliacoes > 0
        ? (data.reduce((sum, av) => sum + parseFloat(av.media_geral), 0) / totalAvaliacoes).toFixed(1)
        : 0;

      return {
        mediaGeral: parseFloat(mediaGeral),
        totalAvaliacoes
      };
    } catch (error) {
      console.error('Erro ao obter estatísticas:', error);
      return { mediaGeral: 0, totalAvaliacoes: 0 };
    }
  }
};

// ==========================================
// 🏖️ FÉRIAS SERVICE
// ==========================================
// O que faz: Gerenciar pedidos de férias
// ==========================================

export const feriasService = {
  /**
   * 📋 LISTAR - Buscar todos os pedidos de férias
   * @returns {Promise} - Lista de férias
   */
  listar: async () => {
    try {
      const { data, error } = await supabase
        .from('ferias')
        .select(`
          *,
          colaborador:colaboradores(id, nome_completo, cargo, foto_url),
          aprovador:profiles(id, nome)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { ferias: data };
    } catch (error) {
      console.error('Erro ao listar férias:', error);
      throw { error: error.message || 'Erro ao carregar férias' };
    }
  },

  /**
   * ➕ CRIAR - Solicitar férias
   * @param {Object} dados - Dados do pedido
   * @returns {Promise} - Pedido criado
   */
  criar: async (dados) => {
    try {
      const { data, error } = await supabase
        .from('ferias')
        .insert([{
          colaborador_id: dados.colaborador_id,
          data_inicio: dados.data_inicio,
          data_fim: dados.data_fim,
          dias_solicitados: dados.dias_solicitados,
          motivo: dados.motivo || null,
          status: 'pendente'
        }])
        .select(`
          *,
          colaborador:colaboradores(id, nome_completo, cargo, foto_url)
        `)
        .single();

      if (error) throw error;

      return { ferias: data };
    } catch (error) {
      console.error('Erro ao solicitar férias:', error);
      throw { error: error.message || 'Erro ao solicitar férias' };
    }
  },

  /**
   * ✅ APROVAR - Aprovar pedido de férias
   * @param {number} id - ID do pedido
   * @param {number} aprovadorId - ID de quem aprova
   * @returns {Promise} - Pedido atualizado
   */
  aprovar: async (id, aprovadorId) => {
    try {
      const { data, error } = await supabase
        .from('ferias')
        .update({
          status: 'aprovado',
          aprovador_id: aprovadorId,
          data_aprovacao: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return { ferias: data };
    } catch (error) {
      console.error('Erro ao aprovar férias:', error);
      throw { error: error.message || 'Erro ao aprovar férias' };
    }
  },

  /**
   * ❌ REJEITAR - Rejeitar pedido de férias
   * @param {number} id - ID do pedido
   * @param {number} aprovadorId - ID de quem rejeita
   * @returns {Promise} - Pedido atualizado
   */
  rejeitar: async (id, aprovadorId) => {
    try {
      const { data, error } = await supabase
        .from('ferias')
        .update({
          status: 'rejeitado',
          aprovador_id: aprovadorId,
          data_aprovacao: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return { ferias: data };
    } catch (error) {
      console.error('Erro ao rejeitar férias:', error);
      throw { error: error.message || 'Erro ao rejeitar férias' };
    }
  },

  /**
   * 📊 OBTER ESTATÍSTICAS - Calcular totais por status
   * @returns {Promise} - Estatísticas de férias
   */
  obterEstatisticas: async () => {
    try {
      const { data, error } = await supabase
        .from('ferias')
        .select('status, dias_solicitados');

      if (error) throw error;

      const stats = {
        pendentes: data.filter(f => f.status === 'pendente').length,
        aprovados: data.filter(f => f.status === 'aprovado').length,
        rejeitados: data.filter(f => f.status === 'rejeitado').length,
        diasTotal: data.reduce((sum, f) => sum + (f.dias_solicitados || 0), 0),
        total: data.length
      };

      return stats;
    } catch (error) {
      console.error('Erro ao obter estatísticas de férias:', error);
      return { pendentes: 0, aprovados: 0, rejeitados: 0, diasTotal: 0, total: 0 };
    }
  }
};

// ==========================================
// 🛡️ PERMISSIONS SERVICE (para protectedRoute)
// ==========================================

export const checkPermission = (userType, requiredPermission) => {
  const permissions = {
    admin: ['create', 'read', 'update', 'delete', 'approve'],
    gestor: ['create', 'read', 'update', 'approve'],
    colaborador: ['read']
  };

  return permissions[userType]?.includes(requiredPermission) || false;
};

// ==========================================
// 📤 EXPORTAÇÕES
// ==========================================
// Tudo que foi criado acima fica disponível
// para ser usado em outros arquivos
// ==========================================

export default {
  authService,
  colaboradoresService,
  avaliacoesService,
  feriasService,
  checkPermission
};
