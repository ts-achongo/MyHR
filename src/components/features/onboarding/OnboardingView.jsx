// ==========================================
// 📚 ONBOARDING VIEW - Manual do Usuário
// ==========================================
// Explicação para iniciantes:
// - Manual personalizado por tipo de usuário
// - Admin: vê manual do admin
// - Gestor: vê manual do gestor
// - Colaborador: vê manual do colaborador
// ==========================================

import React from 'react';
import { BookOpen } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';

const onboardingContent = {
  admin: {
    titulo: 'Manual do Administrador',
    secoes: [
      {
        titulo: 'Visão Geral',
        conteudo:
          'Como administrador, você tem acesso total ao sistema. Pode gerir todos os setores, colaboradores e configurações.'
      },
      {
        titulo: 'Responsabilidades',
        conteudo:
          'Supervisionar todas as operações de RH, aprovar pedidos críticos, configurar a empresa e gerir utilizadores.'
      },
      {
        titulo: 'Recursos Disponíveis',
        conteudo:
          'Dashboard completo, relatórios avançados, configurações da empresa, gestão de todos os colaboradores.'
      }
    ]
  },
  gestor: {
    titulo: 'Manual do Gestor',
    secoes: [
      {
        titulo: 'Conduta Profissional',
        conteudo:
          'Manter postura profissional, respeito pela hierarquia, comunicação clara com a equipa.'
      },
      {
        titulo: 'Assiduidade',
        conteudo:
          'Pontualidade é essencial. Horário: 08:00-17:00. Tolerância de 15 minutos. Justificar ausências com antecedência.'
      },
      {
        titulo: 'Avaliações',
        conteudo:
          'Realizar avaliações mensais da equipa. Ser justo, construtivo e documentar bem cada avaliação.'
      },
      {
        titulo: 'Job Description',
        conteudo:
          'Supervisionar equipa, aprovar férias, realizar avaliações, reportar ao director, gerir conflitos.'
      }
    ]
  },
  colaborador: {
    titulo: 'Manual do Colaborador',
    secoes: [
      {
        titulo: 'Bem-vindo',
        conteudo:
          'Seja bem-vindo à nossa equipa! Este manual contém informações essenciais para o seu dia-a-dia.'
      },
      {
        titulo: 'Horário de Trabalho',
        conteudo:
          'Segunda a Sexta: 08:00-17:00 (1h pausa). Sábado: 08:00-13:00. Domingo: Folga.'
      },
      {
        titulo: 'Conduta',
        conteudo:
          'Respeito, pontualidade, trabalho em equipa, comunicação aberta, higiene pessoal adequada.'
      },
      {
        titulo: 'Recursos',
        conteudo:
          'Sala de descanso, refeitório, material de escritório, apoio de RH sempre que necessário.'
      },
      {
        titulo: 'Pedidos',
        conteudo:
          'Férias: 30 dias/ano (solicitar com 15 dias antecedência). Faltas justificadas: apresentar atestado médico.'
      }
    ]
  }
};

const OnboardingView = () => {
  const { usuario } = useAuth();

  // Pegar conteúdo baseado no tipo de usuário
  const conteudo =
    onboardingContent[usuario?.tipo] || onboardingContent.colaborador;

  return (
    <div className="pb-24 max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-2xl font-bold mb-2 flex items-center gap-2 text-blue-600">
          <BookOpen size={24} />
          {conteudo.titulo}
        </h3>
        <p className="text-sm text-gray-600 mb-6">
          Nível de acesso:{' '}
          <strong className="text-blue-600">{usuario?.tipo}</strong>
        </p>

        <div className="space-y-6">
          {conteudo.secoes.map((secao, i) => (
            <div
              key={i}
              className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-100"
            >
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

export default OnboardingView;