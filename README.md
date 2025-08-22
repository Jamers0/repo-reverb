# Sistema de Gestão Logística - Aplicação Web Moderna

Uma aplicação web moderna desenvolvida em React + Vite que oferece um sistema corporativo completo, incluindo sistema de autenticação, dashboard, gestão de requisições e visualização de relatórios.

## 🚀 Tecnologias Utilizadas

- **React 18** - Biblioteca JavaScript para interfaces de usuário
- **Vite** - Build tool rápida e moderna
- **React Router DOM** - Roteamento para SPA
- **TailwindCSS** - Framework CSS utility-first para estilização responsiva
- **Lucide React** - Biblioteca de ícones moderna
- **Axios** - Cliente HTTP para requisições à API

## 📁 Estrutura do Projeto

```text
src/
├── components/          # Componentes reutilizáveis
│   ├── ui/             # Componentes básicos de UI
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── Input.jsx
│   │   ├── Select.jsx
│   │   └── Modal.jsx
│   ├── layout/         # Componentes de layout
│   │   ├── Header.jsx
│   │   ├── Sidebar.jsx
│   │   └── MainLayout.jsx
│   └── shared/         # Componentes compartilhados
│       ├── Breadcrumbs.jsx
│       └── DataTable.jsx
├── pages/              # Páginas principais
│   ├── Login.jsx
│   ├── Home.jsx
│   ├── Requisicoes.jsx
│   └── ReportViewer.jsx
├── services/           # Serviços e integrações
│   └── api.js
├── styles/             # Estilos globais
│   └── index.css
├── App.jsx             # Componente principal
└── main.jsx           # Ponto de entrada
```

## 🛠️ Instalação e Configuração

### Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn

### Passos de Instalação

1. **Clone ou baixe o projeto**

   ```bash
   # Se usando Git
   git clone <url-do-repositorio>
   cd sistema-gestao-logistica
   ```

2. **Instale as dependências**

   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente (opcional)**

   Crie um arquivo `.env` na raiz do projeto:

   ```env
   REACT_APP_API_URL=http://localhost:3001/api
   REACT_APP_ENV=development
   ```

4. **Execute a aplicação em modo de desenvolvimento**

   ```bash
   npm run dev
   ```

5. **Acesse a aplicação**

   Abra [http://localhost:5173](http://localhost:5173) no seu navegador

## 🔧 Scripts Disponíveis

- `npm run dev` - Executa a aplicação em modo de desenvolvimento
- `npm run build` - Constrói a aplicação para produção
- `npm run preview` - Visualiza a build de produção localmente

## 🎯 Funcionalidades Implementadas

### ✅ Sistema de Autenticação

- Tela de login em duas etapas (usuário → senha)
- Validação de campos obrigatórios
- Interface responsiva e moderna

### ✅ Dashboard Principal

- Cards de acesso rápido aos módulos
- Layout responsivo (mobile, tablet, desktop)
- Indicadores de status do sistema

### ✅ Requisições sem Necessidades (RSN001)

- Tabela dinâmica para adicionar/remover itens
- Dropdowns com dados mockados (Material, Cliente, Classe, Motivo)
- Campos de quantidade e observações
- Auto-preenchimento de unidade de medida
- Modal de confirmação para criação de requisição
- Validação de dados obrigatórios

### ✅ Report Viewer (SRP002)

- Sistema de filtros básicos e avançados
- Pesquisa de materiais com resultados em tabela
- Filtros por área, relatório, datas, etc.
- Exportação de relatórios
- Criação de requisições baseadas nos resultados
- Estados de carregamento e feedback visual

### ✅ Componentes Reutilizáveis

- Sistema de design consistente
- Componentes de UI padronizados (Button, Input, Select, Modal, Card)
- Layout responsivo com sidebar expansível
- Breadcrumbs para navegação
- DataTable com suporte a diferentes tipos de células

## 🎨 Design System

### Cores Personalizadas

- `pw-green`: #00A99D (Cor principal Kibiona Logistics)
- `pw-dark-blue`: #2b2b38 (Azul escuro)
- `pw-gold`: #B7760C (Dourado)
- `pw-sidebar-bg`: #F8F9FA (Fundo da sidebar)
- `pw-text-secondary`: #6c757d (Texto secundário)

### Responsividade

- **Mobile First**: Design otimizado para dispositivos móveis
- **Breakpoints Tailwind**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Layout Adaptativo**: Sidebar recolhível, grids responsivos

## 🔌 Integração com API

### Estrutura de Serviços

O arquivo `src/services/api.js` contém:

- **Configuração Axios** com interceptors para autenticação
- **Serviços organizados por módulo**: auth, materials, requisitions, reports, config
- **Mock data** para desenvolvimento sem backend
- **Tratamento de erros** centralizado

### Como Integrar com API Real

1. **Configure a URL da API** no arquivo `.env`:

   ```env
   REACT_APP_API_URL=https://sua-api.com/api
   ```

2. **Substitua os mock data** pelas chamadas reais no arquivo `api.js`

3. **Atualize os componentes** para usar os serviços:

   ```javascript
   import { materialService } from '../services/api';
   
   const loadMaterials = async () => {
     const result = await materialService.getAll();
     if (result.success) {
       setMaterials(result.data);
     }
   };
   ```

## 📱 Responsividade

A aplicação é totalmente responsiva e se adapta automaticamente a diferentes tamanhos de tela:

- **Desktop** (≥1024px): Layout completo com sidebar expandida
- **Tablet** (768px-1023px): Layout adaptado com sidebar recolhível
- **Mobile** (≤767px): Layout otimizado para touch, sidebar overlay

## 🔒 Segurança

- **Autenticação JWT**: Token armazenado no localStorage
- **Interceptors**: Adiciona automaticamente o token às requisições
- **Redirecionamento**: Logout automático em caso de token inválido
- **Validação**: Campos obrigatórios e validação de formulários

## 🚀 Deploy para Produção

### Build de Produção

```bash
npm run build
```

Os arquivos otimizados serão gerados na pasta `dist/`.

### Opções de Deploy

1. **Netlify/Vercel** - Para hospedagem estática
2. **AWS S3 + CloudFront** - Para aplicações empresariais
3. **Docker** - Para containerização

### Exemplo Dockerfile

```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 🐛 Resolução de Problemas

### Problemas Comuns

1. **Erro de CORS**
   - Configure o backend para aceitar requisições do frontend
   - Adicione proxy no `vite.config.js` se necessário

2. **Componentes não renderizam**
   - Verifique se todas as dependências estão instaladas
   - Confirme se os imports estão corretos

3. **Estilos não aplicam**
   - Verifique se o TailwindCSS está configurado corretamente
   - Confirme se o `postcss.config.js` está presente

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é propriedade da empresa e está sob licença restrita.

## 📞 Suporte

Para suporte técnico ou dúvidas sobre a implementação:

- **Email**: [kibiona@logiticas.imigrante.pt](mailto:kibiona@logiticas.imigrante.pt)
- **Documentação**: Consulte os comentários no código
- **Issues**: Use o sistema de issues do repositório

---

## Desenvolvido com React + Vite + TailwindCSS
