# Sistema de Gestão Logística - Kibiona Logistics

Sistema moderno de gestão logística desenvolvido com React + Vite para análise de demanda, controle de estoque e gestão de compras.

## 🚀 Características Principais

### Módulos Logísticos Avançados

#### 1. **Análise de Demanda** 📈
- **Previsão 5-7 dias**: Análise preditiva das necessidades futuras
- **Gestão por Secções**: CF (Cozinha Fria), CQ (Cozinha Quente), PAS (Pastelaria), BAR
- **Departamentos**: Congelados (C1-C4), Refrigerados (R1-R3), Praça (P1-P2)
- **Clientes**: Air Canada, TAP Portugal, Lufthansa, British Airways
- **Ações Automáticas**: Solicitação de compras, transferências internas

#### 2. **Rupturas de Stock** ⚠️
- **Análise Pré-Picking**: Identificação antecipada de rupturas
- **Análise Pós-Picking**: Controle após processamento
- **Priorização**: Crítica, Alta, Média, Baixa
- **Soluções Integradas**: Compra externa, transferência do secundário

#### 3. **Produtos Vencendo** 📅
- **Regra D+2**: Gestão automática de produtos próximos ao vencimento
- **Ações de Descarte**: Workflow de aprovação e descarte
- **Controle de Perdas**: Relatórios de impacto financeiro
- **Notificações**: Alertas automáticos por departamento

#### 4. **Pedidos em Trânsito** 🚛
- **Rastreamento**: Acompanhamento em tempo real
- **Previsões de Entrega**: Cálculo de dias até chegada
- **Status Múltiplos**: Processando, Em Trânsito, Atrasado
- **Transportadoras**: Integração com múltiplos fornecedores

#### 5. **Compras Pendentes** 📦
- **Controle Financeiro**: Acompanhamento de valores
- **Gestão de Fornecedores**: Contactos diretos integrados
- **Priorização**: Sistema de criticidade
- **Prazos**: Monitoramento de atrasos

### Módulos O2P Original

#### 6. **Gestão de Requisições** (PR007)
- Criação e acompanhamento de requisições
- Workflow de aprovação
- Histórico completo

#### 7. **Report Viewer** (SRP002)
- Visualização de relatórios
- Exportação para múltiplos formatos
- Dashboards personalizados

#### 8. **Requisições sem Necessidades** (RSN001)
- Requisições diretas
- Bypass do sistema de necessidades
- Controle especial

## 🛠️ Stack Tecnológica

- **Frontend**: React 18 + Vite
- **Styling**: TailwindCSS
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Build Tool**: Vite

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── layout/           # Layout components
│   │   ├── Header.jsx
│   │   ├── Sidebar.jsx
│   │   └── MainLayout.jsx
│   ├── shared/           # Shared components
│   │   ├── Breadcrumbs.jsx
│   │   └── DataTable.jsx
│   └── ui/               # UI components
│       ├── Button.jsx
│       ├── Card.jsx
│       ├── Input.jsx
│       ├── Modal.jsx
│       └── Select.jsx
├── pages/                # Application pages
│   ├── Home.jsx          # Dashboard principal
│   ├── Login.jsx         # Autenticação
│   ├── DemandAnalysis.jsx    # Análise de demanda
│   ├── StockRuptures.jsx     # Rupturas de stock
│   ├── ExpiringProducts.jsx  # Produtos vencendo
│   ├── TransitOrders.jsx     # Pedidos em trânsito
│   ├── PendingPurchases.jsx  # Compras pendentes
│   ├── Requisicoes.jsx       # Gestão de requisições
│   └── ReportViewer.jsx      # Visualizador de relatórios
├── services/             # API services
│   └── api.js
└── styles/              # Global styles
    └── index.css
```

## 🎯 Funcionalidades por Módulo

### Dashboard Principal
- **Visão Geral**: Métricas em tempo real
- **Alertas Críticos**: Rupturas e vencimentos
- **KPIs Operacionais**: Taxa de cobertura, valor total
- **Acesso Rápido**: Links diretos para módulos

### Análise de Demanda
- **Filtros Avançados**: Por secção, departamento, cliente
- **Visualização**: Tabelas interativas com ordenação
- **Ações**: Solicitar compra, transferir estoque
- **Exportação**: Excel, PDF, email

### Rupturas de Stock
- **Monitoramento**: Pré e pós-picking
- **Categorização**: Por criticidade e urgência
- **Soluções**: Fluxos automatizados de resolução
- **Histórico**: Tracking completo de resoluções

### Produtos Vencendo
- **Detecção Automática**: Regra D+2 implementada
- **Workflow**: Aprovação de descartes
- **Controle**: Valores de perda por período
- **Relatórios**: Impacto por departamento

### Pedidos em Trânsito
- **Rastreamento**: Integração com transportadoras
- **Status**: Acompanhamento detalhado
- **Alertas**: Notificações de atrasos
- **Recepção**: Marcação de recebimentos

### Compras Pendentes
- **Gestão**: Controle financeiro completo
- **Fornecedores**: Contactos integrados
- **Prazos**: Monitoramento de cumprimento
- **Comunicação**: Email/telefone diretos

## 🔧 Instalação

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### Passos
1. **Clonar o repositório**
```bash
git clone [url-do-repositorio]
cd sistema-logistico
```

2. **Instalar dependências**
```bash
npm install
```

3. **Iniciar desenvolvimento**
```bash
npm run dev
```

4. **Compilar para produção**
```bash
npm run build
```

## 🎨 Sistema de Design

### Cores Personalizadas
- **pw-green**: #10B981 (Sucesso, confirmações)
- **pw-dark-blue**: #1E40AF (Primário, navegação)
- **pw-light-blue**: #3B82F6 (Secundário, links)
- **pw-sidebar-bg**: #F8FAFC (Background da sidebar)

### Componentes UI
- **Buttons**: 6 variantes (primary, secondary, danger, warning, success, outline)
- **Cards**: Layout responsivo com hover effects
- **Modals**: Sistema de diálogos centralizado
- **Forms**: Inputs e selects padronizados

## 📊 Dados e Mock Services

### Estrutura de Dados
- **Secções**: CF, CQ, PAS, BAR
- **Departamentos**: C1-C4, R1-R3, P1-P2
- **Clientes**: Companhias aéreas principais
- **Status**: Processando, Confirmado, Atrasado, etc.

### Mock Data
- Dados realistas para demonstração
- Relacionamentos entre entidades
- Simulação de APIs futuras

## 🔮 Roadmap

### Próximas Funcionalidades
- [ ] **API Real**: Integração com backend
- [ ] **Autenticação**: JWT e controle de acesso
- [ ] **Notificações**: Push notifications
- [ ] **Teams Integration**: Exportação para Microsoft Teams
- [ ] **Mobile App**: Versão mobile nativa
- [ ] **Analytics**: Dashboards avançados
- [ ] **BI Integration**: Power BI / Tableau

### Melhorias Técnicas
- [ ] **TypeScript**: Migração completa
- [ ] **Testing**: Jest + React Testing Library
- [ ] **PWA**: Progressive Web App
- [ ] **Performance**: Lazy loading e otimizações
- [ ] **Accessibility**: WCAG 2.1 compliance

## 👥 Equipe e Contribuição

### Estrutura Organizacional
- **Kibiona Logistics**: Empresa responsável pela logística
- **Estoque Principal**: Gestão direta dos departamentos
- **Estoque Secundário**: Fornecimento de backup
- **Fornecedores**: Rede de parceiros externos

### Como Contribuir
1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📞 Suporte

Para suporte técnico ou dúvidas sobre o sistema:
- **Email**: kibiona@logiticas.imigrante.pt
- **Telefone**: +351 21 123 4567
- **Documentação**: [Link para docs]

## 📝 Licença

Este projeto é propriedade da Kibiona Logistics e está licenciado sob termos proprietários.

---

**Kibiona Logistics Sistema de Gestão Logística v2.0.0**  
*Developed with ❤️ for efficient warehouse management*
