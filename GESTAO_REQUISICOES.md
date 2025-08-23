# Gestão de Requisições - Processamento de Arquivos Excel

## Visão Geral

A página de Gestão de Requisições foi completamente renovada para processar arquivos Excel conforme especificações detalhadas do sistema. O componente implementa processamento especializado para arquivos de requisições e stock, gerando relatórios de impressão organizados por secção.

## Funcionalidades Implementadas

### 1. Processamento de Arquivo de Requisições

#### Estrutura Esperada do Excel:
- **Linhas 1-4**: Informações irrelevantes (ignoradas)
- **Linha 5**: Cabeçalho das colunas
- **A partir da Linha 6**: Dados das requisições

#### Mapeamento de Colunas:
```
A5: S (ignorado)
B5: Código
C5: Criação
D5: Criado Por
E5: Planeada
F5: Estado
G5: Cliente
H5: Classe
I5: Unidade
J5: Material (Código + Descrição)
K5: Qtd Plan.
L5: Qtd Ex.
M5: UoM
N5: Dep
O5: Tipo Requisição
P5: Motivo
Q5: Observações
```

#### Processamento da Coluna J (Material):
A coluna J contém informações combinadas que precisam ser separadas:

**Exemplo**: `"CVAL0007 - Alface folha lavada"`

**Extração do Código do Produto**:
- Fórmula equivalente: `=ESQUERDA(J6;8)`
- Resultado: `"CVAL0007"`

**Extração da Descrição**:
- Fórmula equivalente: `=TEXTODEPOIS(J6; "- ")`
- Resultado: `"Alface folha lavada"`

### 2. Processamento de Arquivo de Stock

#### Estrutura Esperada do Excel:
- **Linha 3**: Cabeçalho
- **A partir da Linha 4**: Dados do stock

#### Mapeamento de Colunas:
```
A3: Nº (Código do produto)
B3: Nº Ref. Cruzada
C3: Descrição
D3: Inventário (Quantidade em stock)
E3: Unidade Medida Base
F3: Cód. Classe Armazém (Local de armazenamento)
G3: Cód. Categoria Produto
H3: Cód. Unid. Medida Arrumação
```

### 3. Geração de Relatórios por Secção

#### Estrutura do Arquivo de Impressão:
```
Linha 1-2: Nome da secção + Data atual
           Exemplo: "Cozinha Fria 30/07/2025"

Linha 3:   Cabeçalho
           A3=Código, B3=Material, C3=Qtd Plan., D3=Qtd Ex., E3=UoM, F3=Dep, G3=Fotostock

Linha 4+:  Dados processados
           A4: Código do produto (ex: CVAL0007)
           B4: Descrição do produto (ex: Alface folha lavada)
           C4: Soma das quantidades planejadas do produto
           D4: Espaço em branco (preenchimento manual)
           E4: Unidade de medida
           F4: Local de armazenamento (do arquivo de stock)
           G4: Quantidade em stock (do arquivo de stock)
```

#### Agrupamento de Dados:
- Os dados são agrupados por **secção** (coluna I do arquivo de requisições)
- Dentro de cada secção, os produtos são agrupados por **código**
- As quantidades são somadas para produtos duplicados
- Informações de stock são cruzadas usando o código do produto

### 4. Interface de Usuário

#### Navegação por Abas:
1. **Upload de Arquivos**: Upload separado para requisições e stock
2. **Requisições**: Visualização e filtros dos dados carregados
3. **Geração de Relatórios**: Relatórios organizados por secção

#### Filtros Disponíveis:
- **Secção**: Filtrar por unidade/secção
- **Cliente**: Filtrar por cliente
- **Estado**: Filtrar por estado da requisição
- **Data**: Filtrar por data de criação

#### Estatísticas em Tempo Real:
- Total de requisições
- Produtos únicos
- Quantidade total
- Número de secções

### 5. Funcionalidades Técnicas

#### Processamento Excel:
- Leitura de arquivos .xlsx/.xls
- Mapeamento automático de colunas
- Validação de dados
- Tratamento de células vazias

#### Cruzamento de Dados:
- Associação automática entre arquivos de requisições e stock
- Busca por código de produto
- Preservação de dados não encontrados

#### Geração de Relatórios:
- Criação automática de arquivos Excel
- Formatação conforme especificações
- Download direto pelo navegador
- Nomenclatura automática com data

## Códigos de Referência

### Secções Suportadas:
```javascript
const SECTIONS = {
  'CF': 'Cozinha Fria',
  'CQ': 'Cozinha Quente', 
  'PAS': 'Pastelaria',
  'TSU': 'Tray Setup',
  'RCF': 'Refeitório Cozinha Fria',
  'RCQ': 'Refeitório Cozinha Quente',
  'RP': 'Rouparia',
  'WAP': 'WASH & PACK',
  'OBR': 'Vending'
};
```

### Clientes Suportados:
```javascript
const CLIENTS = {
  'AC': 'Air Canada',
  'AF': 'Air France', 
  'AA': 'American Airlines',
  'EK': 'Emirates Airlines',
  'TP': 'TAP Portugal',
  'DL': 'Delta Airlines',
  'LH': 'Lufthansa',
  'BA': 'British Airways',
  'S4': 'Sata Internacional',
  'KE': 'Korean Airlines'
};
```

## Fluxo de Trabalho

### 1. Preparação:
1. Fazer upload do arquivo de requisições (.xlsx)
2. Fazer upload do arquivo de stock (.xlsx)
3. Verificar carregamento correto (contador de registros)

### 2. Verificação:
1. Ir para aba "Requisições"
2. Aplicar filtros conforme necessário
3. Verificar dados processados

### 3. Geração:
1. Ir para aba "Geração de Relatórios"
2. Visualizar produtos agrupados por secção
3. Clicar em "Gerar Excel" para cada secção desejada
4. Download automático do arquivo formatado

## Validações e Tratamento de Erros

### Validações Implementadas:
- Verificação de existência das colunas esperadas
- Tratamento de células vazias
- Validação de tipos de dados
- Verificação de códigos de produto

### Tratamento de Erros:
- Mensagens de erro específicas para problemas de upload
- Fallbacks para dados não encontrados
- Preservação de dados parcialmente válidos
- Logs detalhados para depuração

## Armazenamento Local

Os dados são automaticamente salvos no localStorage do navegador:
- `requisicoes_orders_new`: Dados das requisições
- `requisicoes_stock_new`: Dados do stock

Isso permite preservar os dados entre sessões do navegador.

## Tecnologias Utilizadas

- **React 18**: Componente funcional com hooks
- **SheetJS (XLSX)**: Processamento de arquivos Excel
- **TailwindCSS**: Estilização responsiva
- **Lucide React**: Ícones consistentes
- **JavaScript nativo**: Manipulação de arrays e objetos

## Acesso

A página está acessível através da rota:
`/requisicoes-management`

## Melhorias Futuras

1. **Validação de Schema**: Validação mais rigorosa da estrutura dos arquivos
2. **Templates**: Fornecimento de templates Excel para download
3. **Histórico**: Manutenção de histórico de processamentos
4. **Exportação**: Formatos adicionais de exportação (PDF, CSV)
5. **Automação**: Integração com APIs para carregamento automático
