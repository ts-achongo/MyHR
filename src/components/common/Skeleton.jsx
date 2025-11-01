// ==========================================
// 💀 SKELETON - Loading Animado
// ==========================================
// Explicação para iniciantes:
// - Skeleton: "esqueleto" que aparece enquanto carrega
// - Efeito de pulsar (animate-pulse)
// - Usado enquanto busca dados da API
// ==========================================

import React from 'react';

export const Skeleton = ({ width = 'w-full', height = 'h-4', className = '' }) => (
  <div className={`${width} ${height} bg-gray-200 rounded animate-pulse ${className}`} />
);

export const CardSkeleton = () => (
  <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
    <div className="flex items-center gap-3">
      <Skeleton width="w-12" height="h-12" className="rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton width="w-3/4" height="h-4" />
        <Skeleton width="w-1/2" height="h-3" />
      </div>
    </div>
  </div>
);

export const StatCardSkeleton = () => (
  <div className="bg-gray-100 rounded-2xl p-6 animate-pulse">
    <Skeleton width="w-8" height="h-8" className="mb-3" />
    <Skeleton width="w-16" height="h-10" className="mb-2" />
    <Skeleton width="w-24" height="h-4" />
  </div>
);

export const TableSkeleton = ({ rows = 5 }) => (
  <div className="space-y-3">
    {Array.from({ length: rows }).map((_, i) => (
      <CardSkeleton key={i} />
    ))}
  </div>
);

export default Skeleton;