import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Users, TrendingUp, Award, AlertTriangle, FileText, Download, Plus, Home, LogOut, MessageSquare, Settings, Menu, UserPlus, Upload, Edit, Bell, CheckCircle, ChevronLeft, ChevronRight, Sparkles, X, Lock, Mail, Eye, EyeOff, Calendar, Cake, ChevronDown, ChevronUp, Target, Coffee, Building2, MapPin, Phone, Briefcase, BookOpen, GraduationCap, ClipboardList, Umbrella, Clock, BarChart3, Star, Check, XCircle, User } from 'lucide-react';
import { authService, colaboradoresService, avaliacoesService, feriasService } from './services/api';

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

const onboardingContent = {
  admin: {
    titulo: 'Manual do Administrador',
    secoes: [
      { titulo: 'Visão Geral', conteudo: 'Como administrador, você tem acesso total ao sistema. Pode gerir todos os setores, colaboradores e configurações.' },
      { titulo: 'Responsabilidades', conteudo: 'Supervisionar todas as operações de RH, aprovar pedidos críticos, configurar a empresa e gerir utilizadores.' },
      { titulo: 'Recursos Disponíveis', conteudo: 'Dashboard completo, relatórios avançados, configurações da empresa, gestão de todos os colaboradores.' }
    ]
  },
  gestor: {
    titulo: 'Manual do Gestor',
    secoes: [
      { titulo: 'Conduta Profissional', conteudo: 'Manter postura profissional, respeito pela hierarquia, comunicação clara com a equipa.' },
      { titulo: 'Assiduidade', conteudo: 'Pontualidade é essencial. Horário: 08:00-17:00. Tolerância de 15 minutos. Justificar ausências com antecedência.' },
      { titulo: 'Avaliações', conteudo: 'Realizar avaliações mensais da equipa. Ser justo, construtivo e documentar bem cada avaliação.' },
      { titulo: 'Job Description', conteudo: 'Supervisionar equipa, aprovar férias, realizar avaliações, reportar ao director, gerir conflitos.' }
    ]
  },
  colaborador: {
    titulo: 'Manual do Colaborador',
    secoes: [
      { titulo: 'Bem-vindo', conteudo: 'Seja bem-vindo à nossa equipa! Este manual contém informações essenciais para o seu dia-a-dia.' },
      { titulo: 'Horário de Trabalho', conteudo: 'Segunda a Sexta: 08:00-17:00 (1h pausa). Sábado: 08:00-13:00. Domingo: Folga.' },
      { titulo: 'Conduta', conteudo: 'Respeito, pontualidade, trabalho em equipa, comunicação aberta, higiene pessoal adequada.' },
      { titulo: 'Recursos', conteudo: 'Sala de descanso, refeitório, material de escritório, apoio de RH sempre que necessário.' },
      { titulo: 'Pedidos', conteudo: 'Férias: 30 dias/ano (solicitar com 15 dias antecedência). Faltas justificadas: apresentar atestado médico.' }
    ]
  }
};

const MyHRApp = () => {
  const [mostrarOnboarding, setMostrarOnboarding] = useState(true);
  const [slideAtual, setSlideAtual] = useState(0);
  const [usuario, setUsuario] = useState(null);
  const [modo, setModo] = useState('login');
  const [colaboradoresCadastrados, setColaboradoresCadastrados] = useState([]);
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [ferias, setFerias] = useState([]);
  const [estatisticas, setEstatisticas] = useState({ mediaGeral: 0, totalAvaliacoes: 0 });
  const [estatisticasFerias, setEstatisticasFerias] = useState({ pendentes: 0, aprovados: 0, rejeitados: 0, diasTotal: 0, total: 0 });
  const [loginEmail, setLoginEmail] = useState('');
  const [loginSenha, setLoginSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [notificacao, setNotificacao] = useState(null);
  const [editandoColaborador, setEditandoColaborador] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [mostrarNotificacoes, setMostrarNotificacoes] = useState(false);
  const [mostrarPerfilDropdown, setMostrarPerfilDropdown] = useState(false);
  
  // Novo estado para controlar qual submenu está aberto
  const [submenuAberto, setSubmenuAberto] = useState(null);
  
  const [notificacoes, setNotificacoes] = useState([
    { id: 1, mensagem: 'Nova avaliação pendente', lida: false, data: '2025-10-28' },
    { id: 2, mensagem: 'Férias aprovadas', lida: false, data: '2025-10-27' },
    { id: 3, mensagem: 'Novo colaborador cadastrado', lida: true, data: '2025-10-26' }
  ]);
  
  const [configuracao, setConfiguracao] = useState({
    logo: null,
    corPrimaria: '#3B82F6',
    corSecundaria: '#8B5CF6',
    corTexto: '#FFFFFF'
  });

  const [empresa, setEmpresa] = useState({
    nome: 'Minha Empresa',
    endereco: '',
    telefone: '',
    email: ''
  });

  const [novoColaborador, setNovoColaborador] = useState({
    nome_completo: '', 
    cargo: '', 
    email: '', 
    setor_id: '', 
    cv_url: '',
    foto_url: '',
    status: 'ativo'
  });

  const [novaAvaliacao, setNovaAvaliacao] = useState({
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

  const [novasFerias, setNovasFerias] = useState({
    colaborador_id: '',
    data_inicio: '',
    data_fim: '',
    dias_solicitados: 0,
    motivo: ''
  });

  // Logo MyHR - AUMENTADO (60px)
  const LogoMyHR = ({ size = 60 }) => (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Pessoa central (azul) */}
      <circle cx="50" cy="30" r="10" fill="#3B82F6"/>
      <path d="M 50 42 L 44 54 L 44 70 L 56 70 L 56 54 L 50 42 Z" fill="#3B82F6"/>
      
      {/* Pessoa esquerda (roxo) */}
      <circle cx="28" cy="36" r="8" fill="#A855F7"/>
      <path d="M 28 46 L 23 56 L 23 68 L 33 68 L 33 56 L 28 46 Z" fill="#A855F7"/>
      
      {/* Pessoa direita (rosa) */}
      <circle cx="72" cy="36" r="8" fill="#EC4899"/>
      <path d="M 72 46 L 67 56 L 67 68 L 77 68 L 77 56 L 72 46 Z" fill="#EC4899"/>
      
      {/* Linhas conectando (mais grossas) */}
      <line x1="36" y1="52" x2="44" y2="56" stroke="#8B5CF6" strokeWidth="3"/>
      <line x1="64" y1="52" x2="56" y2="56" stroke="#8B5CF6" strokeWidth="3"/>
      
      {/* Círculo de fundo */}
      <circle cx="50" cy="50" r="45" stroke="#E0E7FF" strokeWidth="2" fill="none" opacity="0.3"/>
    </svg>
  );

  const LogoSVG = ({ size = 80, color = "#3B82F6" }) => (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <circle cx="50" cy="50" r="48" fill={color} opacity="0.1"/>
      <circle cx="50" cy="35" r="8" fill={color}/>
      <path d="M 50 45 Q 40 50 40 60 L 40 70 Q 40 75 45 75 L 55 75 Q 60 75 60 70 L 60 60 Q 60 50 50 45 Z" fill={color}/>
      <circle cx="25" cy="45" r="6" fill={color} opacity="0.7"/>
      <path d="M 25 52 Q 18 55 18 62 L 18 68 Q 18 72 22 72 L 28 72 Q 32 72 32 68 L 32 62 Q 32 55 25 52 Z" fill={color} opacity="0.7"/>
      <circle cx="75" cy="45" r="6" fill={color} opacity="0.7"/>
      <path d="M 75 52 Q 68 55 68 62 L 68 68 Q 68 72 72 72 L 78 72 Q 82 72 82 68 L 82 62 Q 82 55 75 52 Z" fill={color} opacity="0.7"/>
    </svg>
  );

  const slides = [
    {
      cor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      titulo: 'Gerir Talentos',
      subtitulo: 'Gestão de Pessoas Simplificada',
      descricao: 'Sistema completo de RH que simplifica a gestão da sua equipa',
      features: [
        { icone: <Users size={20} />, texto: 'Gestão Completa de Pessoal' },
        { icone: <Target size={20} />, texto: 'Avaliações de Desempenho' },
        { icone: <Bell size={20} />, texto: 'Notificações Automáticas' }
      ]
    },
    {
      cor: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      titulo: 'Evolução Clara',
      subtitulo: 'Férias, Ausências, Transferências',
      descricao: 'Visualize o progresso dos colaboradores com dashboards intuitivos',
      features: [
        { icone: <Calendar size={20} />, texto: 'Gestão de férias e ausências' },
        { icone: <Coffee size={20} />, texto: 'Transferências entre setores' },
        { icone: <MessageSquare size={20} />, texto: 'Comunicação interna' }
      ]
    },
    {
      cor: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      titulo: 'Insights Poderosos',
      subtitulo: 'Decisões Baseadas em Dados',
      descricao: 'Identifique e valorize os melhores desempenhos com analytics',
      features: [
        { icone: <TrendingUp size={20} />, texto: 'Analytics em tempo real' },
        { icone: <FileText size={20} />, texto: 'Relatórios automáticos' },
        { icone: <Award size={20} />, texto: 'Identificação de talentos' }
      ]
    }
  ];

  useEffect(() => {
    const jaVisto = localStorage.getItem('myhr_onboarding_visto');
    if (jaVisto) setMostrarOnboarding(false);

    if (authService.isAuthenticated()) {
      const user = authService.getCurrentUser();
      setUsuario(user);
      setModo('dashboard');
      carregarDados();
    }

    const configStorage = localStorage.getItem('myhr_config');
    if (configStorage) setConfiguracao(JSON.parse(configStorage));

    const empresaStorage = localStorage.getItem('myhr_empresa');
    if (empresaStorage) setEmpresa(JSON.parse(empresaStorage));
  }, []);

  useEffect(() => {
    if (usuario) {
      if (modo === 'cadastro' || modo === 'avaliacoes' || modo === 'ferias') {
        carregarDados();
      }
    }
  }, [modo]);

  useEffect(() => {
    localStorage.setItem('myhr_config', JSON.stringify(configuracao));
  }, [configuracao]);

  useEffect(() => {
    localStorage.setItem('myhr_empresa', JSON.stringify(empresa));
  }, [empresa]);

  useEffect(() => {
    if (novasFerias.data_inicio && novasFerias.data_fim) {
      const inicio = new Date(novasFerias.data_inicio);
      const fim = new Date(novasFerias.data_fim);
      const diffTime = Math.abs(fim - inicio);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      setNovasFerias(prev => ({ ...prev, dias_solicitados: diffDays }));
    }
  }, [novasFerias.data_inicio, novasFerias.data_fim]);

  // Fechar dropdowns ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mostrarNotificacoes && !event.target.closest('.notificacoes-container')) {
        setMostrarNotificacoes(false);
      }
      if (mostrarPerfilDropdown && !event.target.closest('.perfil-container')) {
        setMostrarPerfilDropdown(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [mostrarNotificacoes, mostrarPerfilDropdown]);

  const carregarDados = async () => {
    await carregarColaboradores();
    await carregarAvaliacoes();
    await carregarEstatisticas();
    await carregarFerias();
    await carregarEstatisticasFerias();
  };

  const carregarColaboradores = async () => {
    try {
      const response = await colaboradoresService.listar();
      setColaboradoresCadastrados(response.colaboradores || []);
    } catch (error) {
      console.error('Erro ao carregar colaboradores:', error);
    }
  };

  const carregarAvaliacoes = async () => {
    try {
      const response = await avaliacoesService.listar();
      setAvaliacoes(response.avaliacoes || []);
    } catch (error) {
      console.error('Erro ao carregar avaliações:', error);
    }
  };

  const carregarEstatisticas = async () => {
    try {
      const stats = await avaliacoesService.obterEstatisticas();
      setEstatisticas(stats);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  const carregarFerias = async () => {
    try {
      const response = await feriasService.listar();
      setFerias(response.ferias || []);
    } catch (error) {
      console.error('Erro ao carregar férias:', error);
    }
  };

  const carregarEstatisticasFerias = async () => {
    try {
      const stats = await feriasService.obterEstatisticas();
      setEstatisticasFerias(stats);
    } catch (error) {
      console.error('Erro ao carregar estatísticas de férias:', error);
    }
  };

  const mostrarNotificacao = (mensagem, tipo = 'info') => {
    setNotificacao({ mensagem, tipo });
    setTimeout(() => setNotificacao(null), 3000);
  };

  const marcarComoLida = (id) => {
    setNotificacoes(prev =>
      prev.map(n => n.id === id ? { ...n, lida: true } : n)
    );
  };

  const notificacoesNaoLidas = notificacoes.filter(n => !n.lida).length;

  const proximoSlide = () => {
    if (slideAtual < slides.length - 1) {
      setSlideAtual(slideAtual + 1);
    } else {
      localStorage.setItem('myhr_onboarding_visto', 'true');
      setMostrarOnboarding(false);
    }
  };

  const slideAnterior = () => {
    if (slideAtual > 0) setSlideAtual(slideAtual - 1);
  };

  const pularOnboarding = () => {
    localStorage.setItem('myhr_onboarding_visto', 'true');
    setMostrarOnboarding(false);
  };

  const fazerLogin = async () => {
    if (!loginEmail || !loginSenha) {
      mostrarNotificacao('Preencha email e senha', 'error');
      return;
    }

    try {
      setCarregando(true);
      const response = await authService.login(loginEmail.trim(), loginSenha.trim());
      
      setUsuario(response.utilizador);
      setModo('dashboard');
      mostrarNotificacao(`Bem-vindo, ${response.utilizador.nome}!`, 'success');
      
      await carregarDados();
      
      setLoginEmail('');
      setLoginSenha('');
    } catch (error) {
      console.error('Erro no login:', error);
      mostrarNotificacao(error.error || 'Erro ao fazer login', 'error');
    } finally {
      setCarregando(false);
    }
  };

  const handleFotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      mostrarNotificacao('Por favor, selecione uma imagem válida', 'error');
      return;
    }
    
    if (file.size > 2 * 1024 * 1024) {
      mostrarNotificacao('Imagem muito grande! Máximo 2MB', 'error');
      return;
    }
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setNovoColaborador(prev => ({ ...prev, foto_url: reader.result }));
      mostrarNotificacao('Foto carregada!', 'success');
    };
    reader.readAsDataURL(file);
  };

  const cadastrarColaborador = async () => {
    if (!novoColaborador.nome_completo || !novoColaborador.cargo || 
        !novoColaborador.email || !novoColaborador.setor_id) {
      mostrarNotificacao('Preencha todos os campos obrigatórios', 'error');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(novoColaborador.email)) {
      mostrarNotificacao('Email inválido', 'error');
      return;
    }

    try {
      setCarregando(true);
      
      const dados = {
        ...novoColaborador,
        setor_id: parseInt(novoColaborador.setor_id)
      };

      if (editandoColaborador) {
        await colaboradoresService.atualizar(editandoColaborador.id, dados);
        mostrarNotificacao('Colaborador atualizado!', 'success');
        setEditandoColaborador(null);
      } else {
        const response = await colaboradoresService.criar(dados);
        mostrarNotificacao('Colaborador cadastrado com sucesso!', 'success');
        
        // Adicionar notificação para o sininho
        setNotificacoes(prev => [
            {
                id: Date.now(), // ID único
                mensagem: `Novo colaborador(a) '${response.colaborador.nome_completo}' cadastrado.`,
                lida: false,
                data: new Date().toISOString().split('T')[0]
            },
            ...prev // Mantém as notificações antigas
        ]);
      }

      await carregarColaboradores();

      setNovoColaborador({
        nome_completo: '', 
        cargo: '', 
        email: '', 
        setor_id: '', 
        cv_url: '',
        foto_url: '',
        status: 'ativo'
      });
    } catch (error) {
      console.error('Erro ao cadastrar colaborador:', error);
      mostrarNotificacao(error.error || 'Erro ao cadastrar colaborador', 'error');
    } finally {
      setCarregando(false);
    }
  };

  const cadastrarAvaliacao = async () => {
    if (!novaAvaliacao.colaborador_id || !novaAvaliacao.periodo) {
      mostrarNotificacao('Selecione o colaborador e o período', 'error');
      return;
    }

    try {
      setCarregando(true);
      
      const dados = {
        ...novaAvaliacao,
        colaborador_id: parseInt(novaAvaliacao.colaborador_id),
        avaliador_id: usuario.id
      };

      await avaliacoesService.criar(dados);
      mostrarNotificacao('Avaliação registrada com sucesso!', 'success');

      await carregarAvaliacoes();
      await carregarEstatisticas();

      setNovaAvaliacao({
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
      console.error('Erro ao cadastrar avaliação:', error);
      mostrarNotificacao(error.error || 'Erro ao cadastrar avaliação', 'error');
    } finally {
      setCarregando(false);
    }
  };

  const solicitarFerias = async () => {
    if (!novasFerias.colaborador_id || !novasFerias.data_inicio || !novasFerias.data_fim) {
      mostrarNotificacao('Preencha todos os campos obrigatórios', 'error');
      return;
    }

    if (new Date(novasFerias.data_inicio) >= new Date(novasFerias.data_fim)) {
      mostrarNotificacao('Data de fim deve ser posterior à data de início', 'error');
      return;
    }

    try {
      setCarregando(true);
      
      const dados = {
        ...novasFerias,
        colaborador_id: parseInt(novasFerias.colaborador_id),
        status: 'pendente'
      };

      await feriasService.criar(dados);
      mostrarNotificacao('Pedido de férias enviado com sucesso!', 'success');

      await carregarFerias();
      await carregarEstatisticasFerias();

      setNovasFerias({
        colaborador_id: '',
        data_inicio: '',
        data_fim: '',
        dias_solicitados: 0,
        motivo: ''
      });
    } catch (error) {
      console.error('Erro ao solicitar férias:', error);
      mostrarNotificacao(error.error || 'Erro ao solicitar férias', 'error');
    } finally {
      setCarregando(false);
    }
  };

  const aprovarFerias = async (id) => {
    try {
      setCarregando(true);
      await feriasService.aprovar(id, usuario.id);
      mostrarNotificacao('Férias aprovadas!', 'success');
      await carregarFerias();
      await carregarEstatisticasFerias();
    } catch (error) {
      console.error('Erro ao aprovar férias:', error);
      mostrarNotificacao(error.error || 'Erro ao aprovar férias', 'error');
    } finally {
      setCarregando(false);
    }
  };

  const rejeitarFerias = async (id) => {
    try {
      setCarregando(true);
      await feriasService.rejeitar(id, usuario.id);
      mostrarNotificacao('Férias rejeitadas!', 'success');
      await carregarFerias();
      await carregarEstatisticasFerias();
    } catch (error) {
      console.error('Erro ao rejeitar férias:', error);
      mostrarNotificacao(error.error || 'Erro ao rejeitar férias', 'error');
    } finally {
      setCarregando(false);
    }
  };

  const handleFileUpload = (e, tipo) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (tipo === 'logo') {
        setConfiguracao(prev => ({ ...prev, logo: reader.result }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleLogout = async () => {
    await authService.logout();
    setUsuario(null);
    setModo('login');
    setMostrarOnboarding(true);
    setSlideAtual(0);
    localStorage.removeItem('myhr_onboarding_visto');
    mostrarNotificacao('Sessão encerrada', 'info');
  };

  const handleMenuClick = (novoModo) => {
    setModo(novoModo);
    // Não fecha submenus automaticamente
  };

  const toggleSubmenu = (menu) => {
    setSubmenuAberto(submenuAberto === menu ? null : menu);
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

  // ONBOARDING SCREEN
  if (mostrarOnboarding) {
    const slide = slides[slideAtual];
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: slide.cor }}>
        <div className="w-full max-w-2xl">
          <div className="text-center mb-6 animate-fade-in">
            <div className="flex justify-center mb-4">
              <div className="bg-white/20 backdrop-blur-xl rounded-3xl p-4 shadow-2xl">
                <LogoSVG size={60} color="#FFFFFF" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">{slide.titulo}</h1>
            <p className="text-xl text-white/90 font-semibold mb-4">{slide.subtitulo}</p>
            <p className="text-white/80 text-lg mb-6 px-4">{slide.descricao}</p>

            <div className="space-y-3 mb-6">
              {slide.features.map((f, i) => (
                <div key={i} className="bg-white/20 backdrop-blur-xl rounded-2xl p-4 flex items-center gap-3 text-white">
                  <div className="bg-white/30 p-2 rounded-xl">{f.icone}</div>
                  <span className="font-medium">{f.texto}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center gap-2 mb-6">
            {slides.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === slideAtual ? 'w-8 bg-white' : 'w-2 bg-white/40'
                }`}
              />
            ))}
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={slideAnterior}
              disabled={slideAtual === 0}
              className={`p-3 rounded-full transition-all ${
                slideAtual === 0
                  ? 'text-white/30 cursor-not-allowed'
                  : 'text-white bg-white/20 hover:bg-white/30 active:scale-95'
              }`}
            >
              <ChevronLeft size={28} />
            </button>

            <button
              onClick={pularOnboarding}
              className="text-white text-sm hover:text-white/80 transition"
            >
              Pular
            </button>

            <button
              onClick={proximoSlide}
              className="p-3 rounded-full bg-white text-blue-600 hover:bg-white/90 active:scale-95 transition-all shadow-xl"
            >
              <ChevronRight size={28} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // LOGIN SCREEN
  if (!usuario) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl p-4 shadow-2xl">
                <LogoSVG size={60} color="#FFFFFF" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">MyHR</h1>
            <p className="text-gray-600">Gestão de Recursos Humanos</p>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Entrar</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && fazerLogin()}
                    placeholder="seu@email.com"
                    disabled={carregando}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition disabled:opacity-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Senha</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type={mostrarSenha ? 'text' : 'password'}
                    value={loginSenha}
                    onChange={(e) => setLoginSenha(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && fazerLogin()}
                    placeholder="••••••••"
                    disabled={carregando}
                    className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition disabled:opacity-50"
                  />
                  <button
                    onClick={() => setMostrarSenha(!mostrarSenha)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                    disabled={carregando}
                  >
                    {mostrarSenha ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                onClick={fazerLogin}
                disabled={carregando}
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 active:scale-98 transition-all shadow-lg disabled:opacity-50"
              >
                {carregando ? 'Entrando...' : 'Entrar'}
              </button>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
              <p className="text-xs text-gray-600 text-center mb-2 font-semibold">Credenciais de Teste:</p>
              <p className="text-xs text-gray-600 text-center">
                <strong>Admin:</strong> admin@myhr.com / admin123
              </p>
              <p className="text-xs text-gray-600 text-center">
                <strong>Gestor:</strong> gestor@myhr.com / gestor123
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // RENDERIZAR PÁGINAS
  const renderDashboard = () => {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-gray-600 mt-1">Visão geral do sistema</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 border-2 border-green-500 shadow-sm hover:shadow-lg hover:border-green-600 transition-all duration-200">
            <Users size={32} className="mb-4 text-green-500" />
            <div className="text-4xl font-bold text-gray-900">{colaboradoresCadastrados.length}</div>
            <p className="text-sm text-gray-600 mt-1">Colaboradores</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border-2 border-orange-500 shadow-sm hover:shadow-lg hover:border-orange-600 transition-all duration-200">
            <Calendar size={32} className="mb-4 text-orange-500" />
            <div className="text-4xl font-bold text-gray-900">{estatisticasFerias.pendentes}</div>
            <p className="text-sm text-gray-600 mt-1">Férias Pendentes</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border-2 border-purple-500 shadow-sm hover:shadow-lg hover:border-purple-600 transition-all duration-200">
            <FileText size={32} className="mb-4 text-purple-500" />
            <div className="text-4xl font-bold text-gray-900">{estatisticas.totalAvaliacoes}</div>
            <p className="text-sm text-gray-600 mt-1">Avaliações</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border-2 border-blue-500 shadow-sm hover:shadow-lg hover:border-blue-600 transition-all duration-200">
            <Award size={32} className="mb-4 text-blue-500" />
            <div className="text-4xl font-bold text-gray-900">{estatisticas.mediaGeral}</div>
            <p className="text-sm text-gray-600 mt-1">Média Geral</p>
          </div>
        </div>

        {avaliacoes.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-6 border-2 border-gray-200">
            <h3 className="text-xl font-bold mb-4 text-gray-900 flex items-center gap-2">
              <BarChart3 size={24} className="text-blue-600" />
              Desempenho por Colaborador
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={avaliacoes.slice(0, 5).map(a => ({
                nome: a.colaborador?.nome_completo?.split(' ')[0] || 'N/A',
                media: parseFloat(a.media_geral)
              }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nome" />
                <YAxis domain={[0, 5]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="media" fill="#3B82F6" name="Média de Desempenho" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    );
  };

  const renderCadastro = () => {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Meu Pessoal</h2>
          <p className="text-gray-600 mt-1">Gestão de colaboradores</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 border-2 border-gray-200">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-blue-600">
            <UserPlus size={24} />
            {editandoColaborador ? 'Editar' : 'Cadastrar'} Colaborador
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Nome Completo *</label>
              <input
                type="text"
                value={novoColaborador.nome_completo}
                onChange={(e) => setNovoColaborador({...novoColaborador, nome_completo: e.target.value})}
                disabled={carregando}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition disabled:opacity-50"
                placeholder="João Silva"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
              <input
                type="email"
                value={novoColaborador.email}
                onChange={(e) => setNovoColaborador({...novoColaborador, email: e.target.value})}
                disabled={carregando}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition disabled:opacity-50"
                placeholder="joao@empresa.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Setor *</label>
              <select
                value={novoColaborador.setor_id}
                onChange={(e) => setNovoColaborador({...novoColaborador, setor_id: e.target.value})}
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

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Cargo *</label>
              <select
                value={novoColaborador.cargo}
                onChange={(e) => setNovoColaborador({...novoColaborador, cargo: e.target.value})}
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

            <div className="col-span-1 sm:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Foto do Colaborador (opcional)
              </label>
              <div className="flex items-center gap-4">
                {novoColaborador.foto_url && (
                  <img 
                    src={novoColaborador.foto_url} 
                    alt="Preview" 
                    className="h-20 w-20 object-cover rounded-full border-2 border-blue-500"
                  />
                )}
                <label className="cursor-pointer px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition flex items-center gap-2">
                  <Upload size={18} className="text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">
                    {novoColaborador.foto_url ? 'Trocar Foto' : 'Carregar Foto'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFotoUpload}
                    className="hidden"
                  />
                </label>
                {novoColaborador.foto_url && (
                  <button
                    onClick={() => setNovoColaborador(prev => ({ ...prev, foto_url: '' }))}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition"
                  >
                    Remover
                  </button>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={cadastrarColaborador}
            disabled={carregando}
            style={{ backgroundColor: configuracao.corPrimaria }}
            className="mt-6 w-full px-6 py-3 text-white rounded-xl font-semibold hover:opacity-90 active:scale-98 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <CheckCircle size={20} />
            {carregando ? 'Processando...' : (editandoColaborador ? 'Atualizar' : 'Cadastrar')}
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 border-2 border-gray-200">
          <h3 className="text-xl font-bold mb-4 text-gray-900">
            Cadastrados ({colaboradoresCadastrados.length})
          </h3>
          
          {carregando ? (
            <p className="text-center text-gray-500 py-4">Carregando...</p>
          ) : colaboradoresCadastrados.length === 0 ? (
            <p className="text-center text-gray-500 py-4">Nenhum colaborador cadastrado</p>
          ) : (
            <div className="space-y-3">
              {colaboradoresCadastrados.map((c) => (
                <div key={c.id} className="p-4 border-2 border-gray-200 rounded-xl flex items-center gap-4 hover:border-blue-500 hover:shadow-md transition-all duration-200">
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
                  <div className="flex-1">
                    <p className="font-bold text-sm text-gray-900">{c.nome_completo}</p>
                    <p className="text-xs text-gray-600">{c.cargo} • {c.setor_nome || 'Setor não definido'}</p>
                  </div>
                  <button
                    onClick={() => {
                      setEditandoColaborador(c);
                      setNovoColaborador({
                        nome_completo: c.nome_completo,
                        email: c.email,
                        cargo: c.cargo,
                        setor_id: c.setor_id?.toString() || '',
                        cv_url: c.cv_url || '',
                        foto_url: c.foto_url || '',
                        status: c.status || 'ativo'
                      });
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
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

  const renderAvaliacoes = () => {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Avaliações</h2>
          <p className="text-gray-600 mt-1">Gestão de desempenho dos colaboradores</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 border-2 border-gray-200">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-blue-600">
            <Star size={24} />
            Nova Avaliação de Desempenho
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Colaborador *</label>
              <select
                value={novaAvaliacao.colaborador_id}
                onChange={(e) => setNovaAvaliacao({...novaAvaliacao, colaborador_id: e.target.value})}
                disabled={carregando}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition disabled:opacity-50"
              >
                <option value="">Selecione o colaborador</option>
                {colaboradoresCadastrados.map(c => (
                  <option key={c.id} value={c.id}>{c.nome_completo} - {c.cargo}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Período *</label>
              <input
                type="text"
                value={novaAvaliacao.periodo}
                onChange={(e) => setNovaAvaliacao({...novaAvaliacao, periodo: e.target.value})}
                disabled={carregando}
                placeholder="Ex: Janeiro 2025"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition disabled:opacity-50"
              />
            </div>
          </div>

          <div className="mb-6">
            <h4 className="font-bold text-lg mb-4 text-gray-800">Critérios de Avaliação (1 a 5 estrelas)</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {criteriosData.map((criterio) => (
                <div key={criterio.campo} className="p-4 bg-gray-50 rounded-xl border-2 border-gray-200 hover:border-blue-500 transition-all duration-200">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {criterio.nome}
                    <span className="text-xs text-gray-500 ml-2">({criterio.descricao})</span>
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(nota => (
                      <button
                        key={nota}
                        onClick={() => setNovaAvaliacao({...novaAvaliacao, [criterio.campo]: nota})}
                        className={`p-2 rounded-lg transition-all duration-200 ${
                          novaAvaliacao[criterio.campo] >= nota 
                            ? 'text-yellow-500 scale-110' 
                            : 'text-gray-300 hover:text-yellow-400 hover:scale-105'
                        }`}
                      >
                        <Star size={24} fill={novaAvaliacao[criterio.campo] >= nota ? 'currentColor' : 'none'} />
                      </button>
                    ))}
                    <span className="ml-2 flex items-center font-bold text-lg text-gray-700">
                      {novaAvaliacao[criterio.campo]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Observações</label>
            <textarea
              value={novaAvaliacao.observacoes}
              onChange={(e) => setNovaAvaliacao({...novaAvaliacao, observacoes: e.target.value})}
              disabled={carregando}
              rows={4}
              placeholder="Comentários adicionais sobre o desempenho..."
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition disabled:opacity-50"
            />
          </div>

          <button
            onClick={cadastrarAvaliacao}
            disabled={carregando}
            style={{ backgroundColor: configuracao.corPrimaria }}
            className="w-full px-6 py-3 text-white rounded-xl font-semibold hover:opacity-90 active:scale-98 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <CheckCircle size={20} />
            {carregando ? 'Salvando...' : 'Salvar Avaliação'}
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 border-2 border-gray-200">
          <h3 className="text-xl font-bold mb-4 text-gray-900">
            Histórico de Avaliações ({avaliacoes.length})
          </h3>
          
          {avaliacoes.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Nenhuma avaliação cadastrada ainda</p>
          ) : (
            <div className="space-y-4">
              {avaliacoes.map((av) => (
                <div key={av.id} className="p-4 border-2 border-gray-200 rounded-xl hover:border-purple-500 hover:shadow-md transition-all duration-200">
                  <div className="flex items-center gap-4 mb-3">
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
                    <div className="flex-1">
                      <p className="font-bold text-gray-900">{av.colaborador?.nome_completo}</p>
                      <p className="text-sm text-gray-600">{av.periodo} • Avaliado por: {av.avaliador?.nome}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-yellow-500">
                        <Star size={20} fill="currentColor" />
                        <span className="font-bold text-2xl text-gray-900">{av.media_geral}</span>
                      </div>
                      <p className="text-xs text-gray-500">Média Geral</p>
                    </div>
                  </div>
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

  const renderFerias = () => {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Férias</h2>
          <p className="text-gray-600 mt-1">Gestão de pedidos de férias</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 border-2 border-gray-200">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-blue-600">
            <Umbrella size={24} />
            Solicitar Férias
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Colaborador *</label>
              <select
                value={novasFerias.colaborador_id}
                onChange={(e) => setNovasFerias({...novasFerias, colaborador_id: e.target.value})}
                disabled={carregando}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition disabled:opacity-50"
              >
                <option value="">Selecione o colaborador</option>
                {colaboradoresCadastrados.map(c => (
                  <option key={c.id} value={c.id}>{c.nome_completo} - {c.cargo}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Dias Solicitados</label>
              <input
                type="text"
                value={novasFerias.dias_solicitados}
                readOnly
                className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl outline-none text-center font-bold text-lg"
                placeholder="0 dias"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Data de Início *</label>
              <input
                type="date"
                value={novasFerias.data_inicio}
                onChange={(e) => setNovasFerias({...novasFerias, data_inicio: e.target.value})}
                disabled={carregando}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Data de Fim *</label>
              <input
                type="date"
                value={novasFerias.data_fim}
                onChange={(e) => setNovasFerias({...novasFerias, data_fim: e.target.value})}
                disabled={carregando}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition disabled:opacity-50"
              />
            </div>

            <div className="col-span-1 sm:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Motivo</label>
              <textarea
                value={novasFerias.motivo}
                onChange={(e) => setNovasFerias({...novasFerias, motivo: e.target.value})}
                disabled={carregando}
                rows={3}
                placeholder="Ex: Férias de verão, viagem familiar..."
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition disabled:opacity-50"
              />
            </div>
          </div>

          <button
            onClick={solicitarFerias}
            disabled={carregando}
            style={{ backgroundColor: configuracao.corPrimaria }}
            className="w-full px-6 py-3 text-white rounded-xl font-semibold hover:opacity-90 active:scale-98 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <CheckCircle size={20} />
            {carregando ? 'Enviando...' : 'Solicitar Férias'}
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 border-2 border-gray-200">
          <h3 className="text-xl font-bold mb-4 text-gray-900">
            Pedidos de Férias ({ferias.length})
          </h3>
          
          {ferias.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Nenhum pedido de férias cadastrado</p>
          ) : (
            <div className="space-y-4">
              {ferias.map((f) => (
                <div key={f.id} className="p-4 border-2 border-gray-200 rounded-xl hover:border-orange-500 hover:shadow-md transition-all duration-200">
                  <div className="flex items-center gap-4 mb-3">
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
                    <div className="flex-1">
                      <p className="font-bold text-gray-900">{f.colaborador?.nome_completo}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(f.data_inicio).toLocaleDateString('pt-BR')} até {new Date(f.data_fim).toLocaleDateString('pt-BR')}
                        {' '} • {f.dias_solicitados} dias
                      </p>
                      {f.motivo && <p className="text-sm text-gray-500 mt-1">{f.motivo}</p>}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-white text-xs font-bold ${getStatusColor(f.status)}`}>
                        {getStatusText(f.status)}
                      </span>
                    </div>
                  </div>

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

                  {f.status !== 'pendente' && f.aprovador && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-600">
                        <strong>{f.status === 'aprovado' ? 'Aprovado' : 'Rejeitado'}</strong> por {f.aprovador.nome} em{' '}
                        {new Date(f.data_aprovacao).toLocaleDateString('pt-BR')}
                      </p>
                      {f.observacoes_aprovador && (
                        <p className="text-xs text-gray-600 mt-1">{f.observacoes_aprovador}</p>
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

  const renderMinhaEmpresa = () => {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Minha Empresa</h2>
          <p className="text-gray-600 mt-1">Configurações da organização</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 border-2 border-gray-200">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-blue-600">
            <Building2 size={24} />
            Configurações
          </h3>

          <div className="mb-6 p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
            <h4 className="font-bold mb-4 text-gray-800">Identidade Visual</h4>
            
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Logotipo</label>
              <div className="flex items-center gap-4">
                {configuracao.logo ? (
                  <img src={configuracao.logo} alt="Logo" className="h-20 w-20 object-contain border-2 rounded-xl p-2 bg-white" />
                ) : (
                  <div className="h-20 w-20 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center bg-white">
                    <Upload size={24} className="text-gray-400" />
                  </div>
                )}
                <label className="cursor-pointer px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
                  Carregar Logo
                  <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'logo')} className="hidden" />
                </label>
                {configuracao.logo && (
                  <button
                    onClick={() => {
                      setConfiguracao(prev => ({ ...prev, logo: null }));
                      mostrarNotificacao('Logo removido', 'success');
                    }}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                  >
                    Remover
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Cor Primária</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={configuracao.corPrimaria}
                    onChange={(e) => setConfiguracao(prev => ({ ...prev, corPrimaria: e.target.value }))}
                    className="h-10 w-20 rounded-lg border-2 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={configuracao.corPrimaria}
                    readOnly
                    className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Cor Secundária</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={configuracao.corSecundaria}
                    onChange={(e) => setConfiguracao(prev => ({ ...prev, corSecundaria: e.target.value }))}
                    className="h-10 w-20 rounded-lg border-2 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={configuracao.corSecundaria}
                    readOnly
                    className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="font-bold mb-4 text-gray-800">Informações da Empresa</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nome da Empresa</label>
                <input
                  type="text"
                  value={empresa.nome}
                  onChange={(e) => setEmpresa({...empresa, nome: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                  placeholder="Nome da sua empresa"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={empresa.email}
                  onChange={(e) => setEmpresa({...empresa, email: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                  placeholder="contato@empresa.com"
                />
              </div>
            </div>
          </div>

          <button
            onClick={() => mostrarNotificacao('Configurações salvas!', 'success')}
            style={{ backgroundColor: configuracao.corPrimaria }}
            className="w-full px-6 py-3 text-white rounded-xl font-semibold hover:opacity-90 active:scale-98 transition-all shadow-lg"
          >
            Salvar Configurações
          </button>
        </div>
      </div>
    );
  };

  const renderOnboardingManual = () => {
    const conteudo = onboardingContent[usuario.tipo] || onboardingContent.colaborador;

    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Onboarding</h2>
          <p className="text-gray-600 mt-1">Guia de integração e boas-vindas</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 border-2 border-gray-200">
          <h3 className="text-2xl font-bold mb-2 flex items-center gap-2 text-blue-600">
            <BookOpen size={24} />
            {conteudo.titulo}
          </h3>
          <p className="text-sm text-gray-600 mb-6">Nível de acesso: <strong className="text-blue-600">{usuario.tipo}</strong></p>

          <div className="space-y-6">
            {conteudo.secoes.map((secao, i) => (
              <div key={i} className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border-2 border-blue-200 hover:border-blue-400 transition-all duration-200">
                <h4 className="font-bold text-lg mb-3 text-gray-900 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">
                    {i + 1}
                  </div>
                  {secao.titulo}
                </h4>
                <p className="text-gray-700 leading-relaxed">{secao.conteudo}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // LAYOUT PRINCIPAL COM SIDEBAR FIXA
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* SIDEBAR FIXA */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col fixed h-screen">
        {/* HEADER DA SIDEBAR - Altura alinhada (h-14 = 56px) */}
        <div className="h-14 border-b border-gray-200 flex items-center px-4 gap-3">
          <LogoMyHR size={48} />
          <div>
            <h1 className="text-lg font-bold text-gray-900">MyHR</h1>
          </div>
        </div>

        {/* MENU NAVEGAÇÃO */}
        <nav className="flex-1 overflow-y-auto p-3">
          {/* PRINCIPAL */}
          <div className="mb-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider px-3 mb-2">Principal</p>
            <button
              onClick={() => handleMenuClick('dashboard')}
              className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all duration-200 text-sm ${
                modo === 'dashboard' 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-gray-700 hover:bg-gray-100 hover:translate-x-1'
              }`}
            >
              <Home size={18} />
              <span>Dashboard</span>
            </button>
          </div>

          {/* GESTÃO */}
          <div className="mb-4">
            <div className="h-px bg-gray-200 my-3"></div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider px-3 mb-2">Gestão</p>
            
            {/* Meu Pessoal COM SUBMENU */}
            <div>
              <button
                onClick={() => toggleSubmenu('pessoal')}
                className={`w-full text-left flex items-center justify-between px-3 py-2.5 rounded-lg font-medium transition-all duration-200 text-sm ${
                  modo === 'cadastro' 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-700 hover:bg-gray-100 hover:translate-x-1'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Users size={18} />
                  <span>Meu Pessoal</span>
                </div>
                <ChevronDown 
                  size={16} 
                  className={`transition-transform duration-200 ${submenuAberto === 'pessoal' ? 'rotate-180' : ''}`}
                />
              </button>
              
              {/* Submenu */}
              {submenuAberto === 'pessoal' && (
                <div className="ml-9 mt-1 space-y-1">
                  <button
                    onClick={() => handleMenuClick('cadastro')}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
                  >
                    Ver Todos
                  </button>
                  <button
                    onClick={() => handleMenuClick('cadastro')}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
                  >
                    Adicionar Novo
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => handleMenuClick('avaliacoes')}
              className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all duration-200 text-sm ${
                modo === 'avaliacoes' 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-gray-700 hover:bg-gray-100 hover:translate-x-1'
              }`}
            >
              <Star size={18} />
              <span>Avaliações</span>
            </button>

            <button
              onClick={() => handleMenuClick('ferias')}
              className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all duration-200 text-sm ${
                modo === 'ferias' 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-gray-700 hover:bg-gray-100 hover:translate-x-1'
              }`}
            >
              <Umbrella size={18} />
              <span>Férias</span>
            </button>
          </div>

          {/* SISTEMA */}
          <div>
            <div className="h-px bg-gray-200 my-3"></div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider px-3 mb-2">Sistema</p>
            
            <button
              onClick={() => handleMenuClick('minha_empresa')}
              className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all duration-200 text-sm ${
                modo === 'minha_empresa' 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-gray-700 hover:bg-gray-100 hover:translate-x-1'
              }`}
            >
              <Building2 size={18} />
              <span>Minha Empresa</span>
            </button>

            <button
              onClick={() => handleMenuClick('onboarding')}
              className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all duration-200 text-sm ${
                modo === 'onboarding' 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-gray-700 hover:bg-gray-100 hover:translate-x-1'
              }`}
            >
              <BookOpen size={18} />
              <span>Onboarding</span>
            </button>
          </div>
        </nav>
      </div>

      {/* CONTEÚDO PRINCIPAL (com margin-left para compensar sidebar fixa) */}
      <div className="flex-1 flex flex-col ml-64">
        {/* HEADER FINO - Altura alinhada (h-14 = 56px) */}
        <div className="h-14 bg-white border-b border-gray-200 px-6 flex items-center justify-end gap-3 sticky top-0 z-10">
          {/* Notificações */}
          <div className="relative notificacoes-container">
            <button
              onClick={() => setMostrarNotificacoes(!mostrarNotificacoes)}
              className="p-2 rounded-lg hover:bg-gray-100 transition relative"
            >
              <Bell size={18} className="text-gray-700" />
              {notificacoesNaoLidas > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {notificacoesNaoLidas}
                </span>
              )}
            </button>

            {mostrarNotificacoes && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-200">
                  <h3 className="font-bold text-gray-900">Notificações</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notificacoes.map(n => (
                    <button
                      key={n.id}
                      onClick={() => marcarComoLida(n.id)}
                      className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition border-b border-gray-100 ${
                        !n.lida ? 'bg-blue-50' : ''
                      }`}
                    >
                      <p className={`text-sm ${!n.lida ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                        {n.mensagem}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{n.data}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Avatar/Perfil */}
          <div className="relative perfil-container">
            <button
              onClick={() => setMostrarPerfilDropdown(!mostrarPerfilDropdown)}
              className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-gray-100 transition"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {usuario.nome.charAt(0).toUpperCase()}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-sm font-semibold text-gray-900 leading-tight">{usuario.nome}</p>
                <p className="text-xs text-gray-500 leading-tight">{usuario.email}</p>
              </div>
              <ChevronDown size={14} className="text-gray-500" />
            </button>

            {mostrarPerfilDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                <div className="px-4 py-3 border-b border-gray-200">
                  <p className="font-semibold text-gray-900">{usuario.nome}</p>
                  <p className="text-xs text-gray-500 mt-1">{usuario.email}</p>
                  <p className="text-xs text-blue-600 mt-1 font-medium">{usuario.tipo}</p>
                </div>
                <button
                  onClick={() => {
                    handleMenuClick('minha_empresa');
                    setMostrarPerfilDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 transition flex items-center gap-2 text-gray-700"
                >
                  <Settings size={16} />
                  <span className="text-sm">Configurações</span>
                </button>
                <button
                  onClick={() => {
                    setMostrarPerfilDropdown(false);
                    handleLogout();
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-red-50 transition flex items-center gap-2 text-red-600"
                >
                  <LogOut size={16} />
                  <span className="text-sm">Sair</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* CONTEÚDO DAS PÁGINAS */}
        <div className="flex-1 overflow-y-auto p-6">
          {modo === 'dashboard' && renderDashboard()}
          {modo === 'cadastro' && renderCadastro()}
          {modo === 'avaliacoes' && renderAvaliacoes()}
          {modo === 'ferias' && renderFerias()}
          {modo === 'minha_empresa' && renderMinhaEmpresa()}
          {modo === 'onboarding' && renderOnboardingManual()}
        </div>
      </div>

      {/* NOTIFICAÇÃO TOAST */}
      {notificacao && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-slide-in ${
          notificacao.tipo === 'success' ? 'bg-green-500' :
          notificacao.tipo === 'error' ? 'bg-red-500' : 'bg-blue-500'
        } text-white`}>
          <Bell size={18} />
          <span className="font-medium">{notificacao.mensagem}</span>
        </div>
      )}

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
      `}</style>
    </div>
  );
};

export default MyHRApp;