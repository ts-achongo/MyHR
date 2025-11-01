// ==========================================
// 🎯 ONBOARDING SLIDES
// ==========================================
// Explicação para iniciantes:
// - Slides de boas-vindas (só aparece 1 vez)
// - 3 slides explicando o sistema
// - Salva no localStorage para não aparecer de novo
// ==========================================

import React, { useState } from 'react';
import {
  Users,
  Target,
  Bell,
  Calendar,
  Coffee,
  MessageSquare,
  TrendingUp,
  FileText,
  Award,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const LogoSVG = ({ size = 80, color = '#007AFF' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    <circle cx="50" cy="50" r="48" fill={color} opacity="0.1" />
    <circle cx="50" cy="35" r="8" fill={color} />
    <path
      d="M 50 45 Q 40 50 40 60 L 40 70 Q 40 75 45 75 L 55 75 Q 60 75 60 70 L 60 60 Q 60 50 50 45 Z"
      fill={color}
    />
    <circle cx="25" cy="45" r="6" fill={color} opacity="0.7" />
    <path
      d="M 25 52 Q 18 55 18 62 L 18 68 Q 18 72 22 72 L 28 72 Q 32 72 32 68 L 32 62 Q 32 55 25 52 Z"
      fill={color}
      opacity="0.7"
    />
    <circle cx="75" cy="45" r="6" fill={color} opacity="0.7" />
    <path
      d="M 75 52 Q 68 55 68 62 L 68 68 Q 68 72 72 72 L 78 72 Q 82 72 82 68 L 82 62 Q 82 55 75 52 Z"
      fill={color}
      opacity="0.7"
    />
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

const OnboardingSlides = ({ onComplete }) => {
  const [slideAtual, setSlideAtual] = useState(0);
  const slide = slides[slideAtual];

  const proximoSlide = () => {
    if (slideAtual < slides.length - 1) {
      setSlideAtual(slideAtual + 1);
    } else {
      // Marcar como visto e fechar
      localStorage.setItem('myhr_onboarding_visto', 'true');
      onComplete?.();
    }
  };

  const slideAnterior = () => {
    if (slideAtual > 0) setSlideAtual(slideAtual - 1);
  };

  const pular = () => {
    localStorage.setItem('myhr_onboarding_visto', 'true');
    onComplete?.();
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: slide.cor }}
    >
      <div className="w-full max-w-2xl">
        <div className="text-center mb-6 animate-fade-in">
          {/* Logo */}
          <div className="flex justify-center mb-4">
            <div className="bg-white/20 backdrop-blur-xl rounded-3xl p-4 shadow-2xl">
              <LogoSVG size={60} color="#FFFFFF" />
            </div>
          </div>

          {/* Títulos */}
          <h1 className="text-4xl font-bold text-white mb-2">{slide.titulo}</h1>
          <p className="text-xl text-white/90 font-semibold mb-4">
            {slide.subtitulo}
          </p>
          <p className="text-white/80 text-lg mb-6 px-4">{slide.descricao}</p>

          {/* Features */}
          <div className="space-y-3 mb-6">
            {slide.features.map((f, i) => (
              <div
                key={i}
                className="bg-white/20 backdrop-blur-xl rounded-2xl p-4 flex items-center gap-3 text-white"
              >
                <div className="bg-white/30 p-2 rounded-xl">{f.icone}</div>
                <span className="font-medium">{f.texto}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Indicadores */}
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

        {/* Navegação */}
        <div className="flex justify-between items-center">
          {/* Botão Anterior */}
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

          {/* Botão Pular */}
          <button
            onClick={pular}
            className="text-white text-sm hover:text-white/80 transition"
          >
            Pular
          </button>

          {/* Botão Próximo */}
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
};

export default OnboardingSlides;