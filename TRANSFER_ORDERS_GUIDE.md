# 📦 Sistema de Gestão de Transferências de Armazém

## 🎯 Visão Geral

O **Sistema de Gestão de Transferências de Armazém** é uma aplicação web completa que replica fielmente as funcionalidades demonstradas no vídeo de referência. O sistema organiza-se em três abas principais para gerir todo o fluxo de transferência de produtos entre armazéns.

## 📋 Funcionalidades Principais

### 🔄 **Aba 1: Ordens de Transferência**

#### **Lista Principal (CT Geral)**
- Visualização de todas as ordens de transferência existentes
- Colunas informativas: Nº, Transf.-de Cód., Transf.-para Cód., Estado, etc.
- Estados visuais: **Aberto** (amarelo) e **Liberto** (verde)
- Ações disponíveis: Criar nova ordem, Editar ordens existentes

#### **Criação/Edição de Ordens**
- **ID automático**: Sistema gera automaticamente IDs únicos (ex: OT25063263)
- **Secção Geral**: Configuração básica da transferência
- **Secção Linhas**: Adição de produtos à transferência

### 📦 **Aba 2: Envios de Armazém**
- Gestão de envios criados a partir de ordens libertadas
- Interface preparada para expansão futura

### 🔄 **Aba 3: Recolhas de Armazém**
- Gestão de documentos de recolha
- Tarefas de "Retirar" e "Colocar" produtos
- Interface preparada para expansão futura

## 🎨 Design e Interface

### **Paleta de Cores Microsoft Fluent UI**
- **Azul Principal**: #0078D4 (cabeçalhos, links, elementos ativos)
- **Fundo Branco**: #FFFFFF (áreas principais)
- **Cinza Claro**: #F3F3F3 (cabeçalhos de secções)
- **Texto Escuro**: #333333 (texto principal)
- **Bordas Suaves**: #D1D1D1 (separadores)

### **Componentes Especializados**

#### **Ribbon Toolbar**
```
BASE              AÇÕES           FUNÇÕES
┌─────────┐      ┌─────────┐     ┌─────────┐
│ [+] Novo│      │ [✓] Lib.│     │ [📦] Cri│
│ [💾] Grd│      │ [!] Reab│     │ Envio   │
└─────────┘      │ [🗑] Elm│     └─────────┘
                 └─────────┘
```

#### **Calendário Personalizado**
- Navegação por meses com setas
- Destaque do dia atual (borda azul)
- Seleção com fundo azul sólido
- Botão "Hoje" para seleção rápida

## 🚀 Como Usar

### **1. Criar Nova Ordem**

1. **Clique em "Novo"** na barra de ferramentas
2. **Preencha os campos obrigatórios** (*):
   - Transf.-de Cód.: Selecione o armazém origem (ex: CT)
   - Transf.-para Cód.: Selecione o armazém destino (ex: CF)
   - Nº Cliente: Digite para pesquisar (ex: "tap" → TAP Portugal)

3. **Configure as datas**:
   - Clique nos campos de data para abrir o calendário
   - Navegue pelos meses e selecione a data desejada

4. **Adicione produtos**:
   - Digite o código do produto (ex: CFBA0001)
   - Sistema preenche automaticamente descrição e unidade
   - Insira a quantidade desejada
   - Clique "Adicionar" para incluir na lista

### **2. Libertar Ordem**

1. **Depois de preencher** todos os dados necessários
2. **Clique em "Guardar"** para salvar a ordem
3. **Clique em "Libertar"** para mudar o estado
4. **Confirme a ação** no modal que aparece
5. **Estado muda** de "Aberto" para "Liberto"

### **3. Gerir Fluxo de Armazém**

#### **Criar Envio** (Funcionalidade futura)
- No ribbon, grupo "FUNÇÕES" → "Criar Envio"
- Pop-up de confirmação: "1 Cabeçalho Envio Armazém foi criado"
- Navegação para aba "Envios"

#### **Criar Recolha** (Funcionalidade futura)
- No ecrã de Envio → "Ações" → "Recolhas" → "Criar Documento Recolha"
- Confirmação: "Recolha atividade nº [ID] foi criada"
- Navegação para aba "Recolhas"

### **4. Eliminar/Cancelar**

#### **Ordem Aberta**
- **Eliminar diretamente**: Botão "Eliminar" ativo
- **Confirmação obrigatória** antes da eliminação

#### **Ordem Liberta**
1. **Primeiro reabrir**: Clique em "Reabrir"
2. **Depois eliminar**: Botão "Eliminar" fica ativo
3. **Confirmação obrigatória** em ambos os passos

## 📊 Dados de Exemplo

### **Armazéns Disponíveis**
| Código | Nome                    |
|--------|-------------------------|
| CT     | Centro de Transferência |
| CF     | Centro de Fulfillment   |
| CD     | Centro de Distribuição  |

### **Clientes de Teste**
| Código | Nome         |
|--------|--------------|
| C00029 | TAP Portugal |
| C00015 | Air Canada   |
| C00033 | Lufthansa    |

### **Produtos de Exemplo**
| Código   | Descrição    | Unidade |
|----------|--------------|---------|
| CFBA0001 | Banana 4/6   | KG      |
| CFAP0002 | Maçã Gala    | KG      |
| CFLA0003 | Laranja Valencia | KG  |

## 🔧 Funcionalidades Técnicas

### **Validações Automáticas**
- ✅ Campos obrigatórios marcados com *
- ✅ Pesquisa inteligente de clientes
- ✅ Auto-preenchimento de produtos
- ✅ Cálculo automático de quantidades

### **Estados e Fluxos**
```
┌─────────┐    Libertar    ┌─────────┐
│ Aberto  │ ──────────────→│ Liberto │
│         │←────────────── │         │
└─────────┘    Reabrir     └─────────┘
     │                          │
     │ Eliminar                 │ Criar Envio
     ↓                          ↓
┌─────────┐                ┌─────────┐
│Eliminado│                │  Envio  │
└─────────┘                └─────────┘
```

### **Responsividade**
- ✅ Design adaptável para desktop e mobile
- ✅ Ribbon collapsa em dispositivos pequenos
- ✅ Tabelas com scroll horizontal
- ✅ Modais centrados e responsivos

## 🎯 Roadmap de Desenvolvimento

### **Fase 1** ✅ **Concluída**
- [x] Interface principal com abas
- [x] CRUD de ordens de transferência
- [x] Ribbon toolbar funcional
- [x] Calendário personalizado
- [x] Sistema de validações
- [x] Estados e fluxos básicos

### **Fase 2** 🔄 **Em Planejamento**
- [ ] Implementação completa de Envios
- [ ] Sistema de Recolhas com tarefas
- [ ] Integração entre abas
- [ ] Relatórios de transferência
- [ ] Histórico de ações

### **Fase 3** 📋 **Futuro**
- [ ] Integração com sistemas ERP
- [ ] Notificações em tempo real
- [ ] Dashboard executivo
- [ ] API REST completa
- [ ] Aplicação mobile

## 🔗 Navegação Rápida

### **Acesso ao Sistema**
1. **Menu Principal**: Gestão Logística
2. **Submenu**: Nova Ordem de Transferência (NOT001)
3. **URL Direta**: `/not001`

### **Atalhos de Teclado** (Futuros)
- `Ctrl + N`: Nova ordem
- `Ctrl + S`: Guardar
- `Ctrl + L`: Libertar ordem
- `Esc`: Fechar modais

## 📞 Suporte e Ajuda

### **Para Dúvidas Técnicas**
- Consulte este guia primeiro
- Verifique os tooltips nos campos
- Use os dados de exemplo para testar

### **Reportar Problemas**
1. Descreva o problema detalhadamente
2. Inclua passos para reproduzir
3. Anexe screenshots se necessário
4. Indique dados utilizados no teste

---

**Sistema desenvolvido seguindo especificações de UI/UX Microsoft Fluent UI**  
**Versão**: 1.0.0 | **Data**: Janeiro 2024 | **Status**: ✅ Produção
