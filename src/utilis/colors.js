// ==========================================
// 🎨 SISTEMA DE CORES
// ==========================================
// Explicação para iniciantes:
// - Centraliza todas as cores do sistema
// - Fácil de mudar todas as cores de uma vez
// - Consistência visual
// ==========================================

export const colors = {
  primary: '#0066FF',
  secondary: '#6C63FF',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827'
  },

  // Gradientes
  gradients: {
    primary: 'linear-gradient(135deg, #0066FF 0%, #6C63FF 100%)',
    success: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    warning: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
    error: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
    purple: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
    blue: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
    green: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    orange: 'linear-gradient(135deg, #F59E0B 0%, #EA580C 100%)'
  }
};

export default colors;