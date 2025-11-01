# MyHR - Sistema de Gestão de Recursos Humanos

![MyHR Logo](https://img.shields.io/badge/MyHR-Sistema_de_RH-blue)
![React](https://img.shields.io/badge/React-19.1.1-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-7.1.7-646CFF?logo=vite)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4.1.14-38B2AC?logo=tailwind-css)

## 📋 Sobre o Projeto

MyHR é um sistema completo de gestão de recursos humanos desenvolvido em React, que permite às empresas:

- ✅ Gerir colaboradores e seus dados
- ⭐ Realizar avaliações de desempenho
- 🏖️ Controlar férias e ausências
- 📊 Visualizar estatísticas e relatórios
- 🎨 Personalizar a identidade visual da empresa

## 🚀 Tecnologias Utilizadas

- **React 19.1.1** - Biblioteca JavaScript para construção de interfaces
- **Vite** - Build tool rápido e moderno
- **Tailwind CSS 4** - Framework CSS utility-first
- **Recharts** - Biblioteca de gráficos para React
- **Lucide React** - Ícones modernos
- **Capacitor** - Para criar aplicações móveis nativas

## 📦 Instalação

### Pré-requisitos

- Node.js (versão 16 ou superior)
- npm ou yarn

### Passos para instalar

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/myhr.git
cd myhr
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

4. Abra o navegador em `http://localhost:5173`

## 🔧 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria a versão de produção
- `npm run preview` - Visualiza a versão de produção localmente
- `npm run lint` - Verifica o código com ESLint

## 👥 Credenciais de Teste

Para testar o sistema, use as seguintes credenciais:

**Administrador:**
- Email: `admin@myhr.com`
- Senha: `admin123`

**Gestor:**
- Email: `gestor@myhr.com`
- Senha: `gestor123`

## 🎯 Funcionalidades

### Dashboard
- Visão geral de colaboradores
- Estatísticas de férias
- Métricas de avaliações
- Gráficos de desempenho

### Gestão de Colaboradores
- Cadastro completo com foto
- Edição de informações
- Organização por setores
- Status ativos/inativos

### Avaliações de Desempenho
- Sistema de avaliação por critérios (1-5 estrelas)
- 10 critérios predefinidos
- Observações personalizadas
- Histórico completo de avaliações

### Gestão de Férias
- Solicitação de férias
- Aprovação/rejeição (Gestor/Admin)
- Controle de dias solicitados
- Estatísticas de férias

### Personalização
- Logo da empresa
- Cores primária e secundária
- Informações da empresa

## 📱 Versão Mobile

O projeto está configurado com Capacitor para gerar aplicações móveis nativas:

```bash
# Adicionar plataforma Android
npx cap add android

# Sincronizar código
npx cap sync

# Abrir no Android Studio
npx cap open android
```

## 🏗️ Estrutura do Projeto

```
myhr/
├── src/
│   ├── App.jsx              # Componente principal
│   ├── MyHRApp.jsx          # Aplicação MyHR
│   ├── main.jsx             # Entry point
│   ├── index.css            # Estilos globais
│   └── services/
│       └── api.js           # Serviços de API
├── public/                  # Arquivos públicos
├── capacitor.config.json    # Configuração Capacitor
├── package.json             # Dependências
└── vite.config.js          # Configuração Vite
```

## 🤝 Contribuindo

Contribuições são sempre bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📧 Contato

Para dúvidas ou sugestões, entre em contato:

- Email: seu-email@exemplo.com
- GitHub: [@seu-usuario](https://github.com/seu-usuario)

## 🙏 Agradecimentos

- Comunidade React
- Equipe Tailwind CSS
- Todos os contribuidores

---

Desenvolvido com ❤️ por [Seu Nome]

