// ==========================================
// 🏢 EMPRESA VIEW - Minha Empresa
// ==========================================
// Explicação para iniciantes:
// - Página para configurar logo, cores e dados da empresa
// - Upload de logo converte imagem para base64
// - Color picker: seletor de cores nativo do HTML
// ==========================================

import React from 'react';
import { Building2, Upload, CheckCircle } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';

const EmpresaView = ({ mostrarNotificacao }) => {
  const { configuracao, empresa, atualizarConfiguracao, atualizarEmpresa } = useTheme();

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      mostrarNotificacao?.('Selecione uma imagem válida', 'error');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      mostrarNotificacao?.('Imagem muito grande! Máximo 2MB', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      atualizarConfiguracao({ logo: reader.result });
      mostrarNotificacao?.('Logo atualizado!', 'success');
    };
    reader.readAsDataURL(file);
  };

  const handleSalvar = () => {
    mostrarNotificacao?.('Configurações salvas com sucesso!', 'success');
  };

  return (
    <div className="pb-24 max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 text-blue-600">
          <Building2 size={24} />
          Minha Empresa
        </h3>

        {/* Identidade Visual */}
        <div className="mb-6 p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
          <h4 className="font-bold mb-4 text-gray-800">Identidade Visual</h4>

          {/* Logo */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Logotipo
            </label>
            <div className="flex items-center gap-4">
              {configuracao.logo ? (
                <img
                  src={configuracao.logo}
                  alt="Logo"
                  className="h-20 w-20 object-contain border-2 rounded-xl p-2 bg-white"
                />
              ) : (
                <div className="h-20 w-20 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center bg-white">
                  <Upload size={24} className="text-gray-400" />
                </div>
              )}

              <label className="cursor-pointer px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
                Carregar Logo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
              </label>

              {configuracao.logo && (
                <button
                  onClick={() => {
                    atualizarConfiguracao({ logo: null });
                    mostrarNotificacao?.('Logo removido', 'success');
                  }}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  Remover
                </button>
              )}
            </div>
          </div>

          {/* Cores */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Cor Primária */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Cor Primária
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={configuracao.corPrimaria}
                  onChange={(e) =>
                    atualizarConfiguracao({ corPrimaria: e.target.value })
                  }
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

            {/* Cor Secundária */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Cor Secundária
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={configuracao.corSecundaria}
                  onChange={(e) =>
                    atualizarConfiguracao({ corSecundaria: e.target.value })
                  }
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

        {/* Informações da Empresa */}
        <div className="mb-6">
          <h4 className="font-bold mb-4 text-gray-800">Informações da Empresa</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Nome da Empresa */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nome da Empresa
              </label>
              <input
                type="text"
                value={empresa.nome}
                onChange={(e) =>
                  atualizarEmpresa({ nome: e.target.value })
                }
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                placeholder="Nome da sua empresa"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={empresa.email}
                onChange={(e) =>
                  atualizarEmpresa({ email: e.target.value })
                }
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                placeholder="contato@empresa.com"
              />
            </div>

            {/* Endereço */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Endereço
              </label>
              <input
                type="text"
                value={empresa.endereco}
                onChange={(e) =>
                  atualizarEmpresa({ endereco: e.target.value })
                }
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                placeholder="Rua, número, bairro"
              />
            </div>

            {/* Telefone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Telefone
              </label>
              <input
                type="tel"
                value={empresa.telefone}
                onChange={(e) =>
                  atualizarEmpresa({ telefone: e.target.value })
                }
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                placeholder="+258 XX XXX XXXX"
              />
            </div>
          </div>
        </div>

        {/* Botão Salvar */}
        <button
          onClick={handleSalvar}
          style={{ backgroundColor: configuracao.corPrimaria }}
          className="mt-6 w-full px-6 py-3 text-white rounded-xl font-semibold hover:opacity-90 active:scale-98 transition-all shadow-lg flex items-center justify-center gap-2"
        >
          <CheckCircle size={20} />
          Salvar Configurações
        </button>
      </div>
    </div>
  );
};

export default EmpresaView;