# Sistema de Dados de Referência - Documentação Completa

## Visão Geral

O sistema de dados de referência centraliza todas as informações de **clientes**, **secções** e **departamentos** da aplicação, proporcionando consistência e facilidade de manutenção em toda a aplicação.

## Estrutura dos Dados

### 🏢 **Secções (Sections)**

As secções representam as diferentes áreas operacionais da empresa, organizadas por categorias:

#### Categorias de Secções:
- **Produção**: CF, CQ, PAS, REF_PAS, RPA, RPL, RCQ, RCF
- **Refeitório**: RPA, RPL, RCQ, RCF
- **Operacional**: RP, TSU, WAP, CRC, NHU, OBR, OPS, COP, CRG
- **Armazém**: AC, CT, FF, GY, TP_AC
- **Estado Especial**: CT_CADUCAD, CT_CHARTER, FF_STANDBY, GY_QUARENT, etc.
- **Entreposto Aduaneiro**: EA_AEROFLO, EA_AMERICA, EA_ASIANA, etc.
- **Entreposto Fiscal**: EF_AMERICA, EF_AZUL, EF_DELTA, etc.
- **Serviços**: EM, EST, ESU, FARDAMENTO, TRP, DONATIVOS
- **OBR**: OBR_GR, OBR_S4, PIC
- **Localização**: SJT
- **Desenvolvimento**: TEST, TESTE
- **Genérico**: OUTROS

#### Estrutura do Objeto Secção:
```javascript
{
  code: 'CF',
  name: 'Cozinha Fria',
  category: 'Produção'
}
```

### 📦 **Departamentos (Departments)**

Os departamentos representam as diferentes tipologias de produtos e códigos de classe de armazém:

#### Categorias de Departamentos:
- **Congelados**: C1, C2, C3, C4
- **PRAÇA**: P, PRACA, F&V
- **Refrigerados**: R, R4
- **Secos**: S, Seco, Secos, AMB
- **Consumíveis**: DRG_AG, DRG_LIMP, FARDAMENTO, DRG_COPA, ECONOMATO

#### Estrutura do Objeto Departamento:
```javascript
{
  code: 'C1',
  name: 'Congelados C1',
  mainCategory: 'Congelados',
  description: 'Câmara de Congelados 1'
}
```

### 👥 **Clientes (Clients)**

Os clientes incluem companhias aéreas, empresas de serviços e clientes internos:

#### Tipos de Clientes:
- **Com Código**: Clientes que possuem código específico (ex: AC, AF, AA)
- **Sem Código**: Clientes que não possuem código (marcados com "-" no sistema original)

#### Estrutura do Objeto Cliente:
```javascript
{
  number: 'C000001',
  code: 'AC',
  name: 'Air Canada',
  hasCode: true
}
```

## Como Usar o Sistema

### 1. **Importação e Configuração**

No seu componente React:

```javascript
import { useReferenceData } from '../contexts/ReferenceDataContext';

const MeuComponente = () => {
  const {
    sections,
    departments,
    clients,
    formatSectionForDisplay,
    formatClientForDisplay,
    getMainAirlines
  } = useReferenceData();
  
  // Seu código aqui
};
```

### 2. **Funções de Formatação**

#### Formatação para Exibição:
```javascript
// Secção
formatSectionForDisplay('CF') // → "CF - Cozinha Fria"

// Departamento
formatDepartmentForDisplay('C1') // → "C1 - Congelados C1"

// Cliente
formatClientForDisplay('AC') // → "AC - Air Canada"
formatClientForDisplay('C000001') // → "AC - Air Canada"
```

### 3. **Funções de Busca**

#### Busca Individual:
```javascript
getSectionByCode('CF')        // Retorna objeto da secção
getDepartmentByCode('C1')     // Retorna objeto do departamento
getClientByNumber('C000001')  // Retorna objeto do cliente
getClientByCode('AC')         // Retorna objeto do cliente
```

#### Busca por Categoria:
```javascript
getSectionsByCategory('Produção')           // Secções de produção
getDepartmentsByMainCategory('Congelados')  // Departamentos de congelados
```

### 4. **Filtros Especializados**

#### Clientes Especiais:
```javascript
getMainAirlines()        // Principais companhias aéreas
getClientsWithCode()     // Clientes que têm código
getClientsWithoutCode()  // Clientes sem código
```

#### Secções Especiais:
```javascript
getProductionSections()  // Secções de produção
```

#### Departamentos Especiais:
```javascript
getStorageDepartments()     // Departamentos de armazenamento
getConsumableDepartments()  // Departamentos de consumíveis
```

### 5. **Validadores**

```javascript
isValidSectionCode('CF')      // true/false
isValidDepartmentCode('C1')   // true/false
isValidClientNumber('C000001') // true/false
isValidClientCode('AC')       // true/false
```

### 6. **Arrays para Dropdowns**

```javascript
sectionOptions     // Array formatado para select de secções
departmentOptions  // Array formatado para select de departamentos
clientOptions      // Array formatado para select de clientes
```

#### Exemplo de Uso em Select:
```jsx
<select value={selectedSection} onChange={handleChange}>
  <option value="">Selecione uma secção</option>
  {sectionOptions.map(option => (
    <option key={option.value} value={option.value}>
      {option.label}
    </option>
  ))}
</select>
```

## Exemplos Práticos

### Exemplo 1: Filtros em Tabela
```jsx
const FiltroSecoes = () => {
  const { sectionOptions, formatSectionForDisplay } = useReferenceData();
  const [selectedSection, setSelectedSection] = useState('');
  
  return (
    <div>
      <select 
        value={selectedSection} 
        onChange={(e) => setSelectedSection(e.target.value)}
      >
        <option value="">Todas as Secções</option>
        {sectionOptions.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      {selectedSection && (
        <p>Secção selecionada: {formatSectionForDisplay(selectedSection)}</p>
      )}
    </div>
  );
};
```

### Exemplo 2: Validação de Dados
```jsx
const ValidadorDados = () => {
  const { isValidSectionCode, isValidClientCode } = useReferenceData();
  
  const validarRequisicao = (dados) => {
    if (!isValidSectionCode(dados.secao)) {
      return 'Código de secção inválido';
    }
    
    if (!isValidClientCode(dados.cliente)) {
      return 'Código de cliente inválido';
    }
    
    return 'Dados válidos';
  };
  
  return (
    // Seu componente de validação
  );
};
```

### Exemplo 3: Dashboard com Estatísticas
```jsx
const Dashboard = () => {
  const { 
    sections, 
    getMainAirlines, 
    getProductionSections,
    getSectionsByCategory 
  } = useReferenceData();
  
  const stats = {
    totalSections: Object.keys(sections).length,
    mainAirlines: getMainAirlines().length,
    productionSections: getProductionSections().length,
    warehouseSections: getSectionsByCategory('Armazém').length
  };
  
  return (
    <div className="grid grid-cols-4 gap-4">
      <div>Total de Secções: {stats.totalSections}</div>
      <div>Principais Aéreas: {stats.mainAirlines}</div>
      <div>Secções Produção: {stats.productionSections}</div>
      <div>Armazéns: {stats.warehouseSections}</div>
    </div>
  );
};
```

## Manutenção e Atualizações

### Adicionar Nova Secção:
1. Edite o arquivo `src/data/referenceData.js`
2. Adicione o novo objeto no SECTIONS
3. Inclua a categoria apropriada

### Adicionar Novo Cliente:
1. Edite o arquivo `src/data/referenceData.js`
2. Adicione o novo objeto no CLIENTS
3. Configure `hasCode: true/false` conforme apropriado

### Adicionar Novo Departamento:
1. Edite o arquivo `src/data/referenceData.js`
2. Adicione o novo objeto no DEPARTMENTS
3. Configure a `mainCategory` apropriada

## Acesso à Demonstração

Para ver o sistema em funcionamento, acesse:
`/reference-data`

Esta página demonstra:
- Navegação entre diferentes tipos de dados
- Filtros por categoria
- Busca por texto
- Estatísticas em tempo real
- Exemplos de formatação
- Filtros especializados

## Benefícios do Sistema

1. **Centralização**: Todos os dados em um local
2. **Consistência**: Formatação padronizada em toda aplicação
3. **Manutenção**: Fácil atualização de dados
4. **Validação**: Verificação automática de códigos
5. **Filtros**: Funções especializadas para diferentes cenários
6. **Performance**: Dados carregados uma única vez
7. **Tipagem**: IntelliSense completo no desenvolvimento

## Arquivos do Sistema

- `src/data/referenceData.js` - Dados e funções utilitárias
- `src/contexts/ReferenceDataContext.jsx` - Contexto React
- `src/pages/ReferenceDataDemo.jsx` - Página de demonstração
- `DADOS_REFERENCIA.md` - Esta documentação
