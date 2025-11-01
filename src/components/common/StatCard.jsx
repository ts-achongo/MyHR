// ==========================================
// 📊 STAT CARD - Card de Estatística
// ==========================================
// Explicação para iniciantes:
// - Cards coloridos do dashboard
// - Suporta gradiente de cores
// - Ícone + número + descrição
// ==========================================

import React from 'react';

const StatCard = ({ 
  icon: Icon, 
  value, 
  label, 
  gradient,
  className = '' 
}) => (
  <div 
    className={`rounded-2xl p-6 shadow-lg text-white ${className}`}
    style={{ background: gradient }}
  >
    {Icon && <Icon size={28} className="mb-3 opacity-80" />}
    <div className="text-4xl font-bold mb-1">{value}</div>
    <p className="text-sm opacity-90">{label}</p>
  </div>
);

export default StatCard;