// ==========================================
// 🔐 LOGIN VIEW
// ==========================================
// Explicação para iniciantes:
// - Tela de login com email e senha
// - Validação de campos
// - Botão para mostrar/ocultar senha
// - Credenciais de teste para facilitar
// ==========================================

import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';

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

const LoginView = ({ mostrarNotificacao }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const handleLogin = async () => {
    if (!email || !senha) {
      mostrarNotificacao?.('Preencha email e senha', 'error');
      return;
    }

    try {
      setCarregando(true);
      await login(email.trim(), senha.trim());
      mostrarNotificacao?.('Login realizado com sucesso!', 'success');
    } catch (error) {
      console.error('Erro no login:', error);
      mostrarNotificacao?.(error.error || 'Erro ao fazer login', 'error');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="w-full max-w-md">
        {/* Logo e Título */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl p-4 shadow-2xl">
              <LogoSVG size={60} color="#FFFFFF" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">MyHR</h1>
          <p className="text-gray-600">Gestão de Recursos Humanos</p>
        </div>

        {/* Formulário */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            Entrar
          </h2>

          <div className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                  placeholder="seu@email.com"
                  disabled={carregando}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition disabled:opacity-50"
                />
              </div>
            </div>

            {/* Senha */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  type={mostrarSenha ? 'text' : 'password'}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
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

            {/* Botão Entrar */}
            <button
              onClick={handleLogin}
              disabled={carregando}
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 active:scale-98 transition-all shadow-lg disabled:opacity-50"
            >
              {carregando ? 'Entrando...' : 'Entrar'}
            </button>
          </div>

          {/* Credenciais de Teste */}
          <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
            <p className="text-xs text-gray-600 text-center mb-2 font-semibold">
              Credenciais de Teste:
            </p>
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
};

export default LoginView;