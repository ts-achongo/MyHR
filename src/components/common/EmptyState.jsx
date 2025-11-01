// ==========================================
// 🎭 EMPTY STATE - Tela Vazia
// ==========================================
// Explicação para iniciantes:
// - Aparece quando não há dados para mostrar
// - Ícone + mensagem + botão de ação (opcional)
// - Melhor UX do que "Nenhum dado encontrado"
// ==========================================

import React from 'react';

const EmptyState = ({ 
  icon: Icon, 
  title, 
  description, 
  action,
  className = '' 
}) => (
  <div className={`text-center py-12 ${className}`}>
    {Icon && (
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
        <Icon size={28} className="text-gray-400" />
      </div>
    )}
    <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
    {description && (
      <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">{description}</p>
    )}
    {action && action}
  </div>
);

export default EmptyState;