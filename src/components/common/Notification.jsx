// ==========================================
// 🔔 NOTIFICATION - Notificações Toast
// ==========================================
// Explicação para iniciantes:
// - Toast: mensagem que aparece no canto da tela
// - Tipos: success (verde), error (vermelho), info (azul)
// - Desaparece sozinha após 3 segundos
// ==========================================

import React from 'react';
import { Bell, CheckCircle, XCircle, Info } from 'lucide-react';

const Notification = ({ mensagem, tipo = 'info', onClose }) => {
  // Definir cor e ícone baseado no tipo
  const configs = {
    success: {
      bg: 'bg-green-500',
      icon: CheckCircle
    },
    error: {
      bg: 'bg-red-500',
      icon: XCircle
    },
    info: {
      bg: 'bg-blue-500',
      icon: Info
    }
  };

  const config = configs[tipo] || configs.info;
  const Icon = config.icon;

  return (
    <div
      className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-slide-in ${config.bg} text-white`}
    >
      <Icon size={18} />
      <span className="font-medium">{mensagem}</span>
    </div>
  );
};

export default Notification;