/**
 * Dados de exemplo para demonstração das funcionalidades
 * Estes dados simulam rupturas reais para testar o sistema
 */

export const sampleRuptureData = [
  {
    id: 1,
    item: "PARACETAMOL 500MG",
    codigo: "PAR500",
    secao: "Farmácia",
    cliente: "Hospital Central",
    tipo_ruptura: "Stock Zero",
    data_ruptura: "2024-01-15",
    quantidade_solicitada: 1000,
    quantidade_disponivel: 0,
    fornecedor: "FarmaDistribuidora Lda",
    prioridade: "Alta",
    status: "Pendente",
    data_prevista: "2024-01-20",
    observacoes: "Medicamento essencial - urgente",
    responsavel: "Dr. Silva",
    custo_unitario: 0.25,
    categoria: "Medicamentos",
    localizacao: "A1-B2-C3"
  },
  {
    id: 2,
    item: "SERINGAS 10ML",
    codigo: "SER10",
    secao: "Material Médico",
    cliente: "Clínica Norte",
    tipo_ruptura: "Stock Baixo",
    data_ruptura: "2024-01-14",
    quantidade_solicitada: 500,
    quantidade_disponivel: 45,
    fornecedor: "MedSupply Corp",
    prioridade: "Média",
    status: "Em Andamento",
    data_prevista: "2024-01-18",
    observacoes: "Reposição semanal",
    responsavel: "Enf. Costa",
    custo_unitario: 0.15,
    categoria: "Material Descartável",
    localizacao: "B2-C1-D4"
  },
  {
    id: 3,
    item: "AMOXICILINA 250MG",
    codigo: "AMX250",
    secao: "Farmácia",
    cliente: "Hospital Sul",
    tipo_ruptura: "Produto Vencido",
    data_ruptura: "2024-01-13",
    quantidade_solicitada: 200,
    quantidade_disponivel: 150,
    fornecedor: "FarmaDistribuidora Lda",
    prioridade: "Alta",
    status: "Resolvido",
    data_prevista: "2024-01-16",
    observacoes: "Lote substituído",
    responsavel: "Farm. Oliveira",
    custo_unitario: 0.45,
    categoria: "Antibióticos",
    localizacao: "A2-B1-C2"
  },
  {
    id: 4,
    item: "LUVAS NITRILO M",
    codigo: "LUV-NIT-M",
    secao: "EPI",
    cliente: "Laboratório Central",
    tipo_ruptura: "Stock Zero",
    data_ruptura: "2024-01-12",
    quantidade_solicitada: 2000,
    quantidade_disponivel: 0,
    fornecedor: "ProtecionMed",
    prioridade: "Crítica",
    status: "Pendente",
    data_prevista: "2024-01-22",
    observacoes: "Aumento súbito da demanda",
    responsavel: "Téc. Santos",
    custo_unitario: 0.08,
    categoria: "EPI",
    localizacao: "C1-D2-E3"
  },
  {
    id: 5,
    item: "INSULINA REGULAR",
    codigo: "INS-REG",
    secao: "Farmácia",
    cliente: "Centro Diabetes",
    tipo_ruptura: "Fornecedor Indisponível",
    data_ruptura: "2024-01-11",
    quantidade_solicitada: 100,
    quantidade_disponivel: 25,
    fornecedor: "BioFarma Internacional",
    prioridade: "Crítica",
    status: "Em Andamento",
    data_prevista: "2024-01-25",
    observacoes: "Procurar fornecedor alternativo",
    responsavel: "Dr. Mendes",
    custo_unitario: 25.50,
    categoria: "Medicamentos Especiais",
    localizacao: "A1-B1-C1"
  },
  {
    id: 6,
    item: "ÁLCOOL GEL 70%",
    codigo: "ALC-GEL-70",
    secao: "Higienização",
    cliente: "Múltiplos Clientes",
    tipo_ruptura: "Stock Baixo",
    data_ruptura: "2024-01-10",
    quantidade_solicitada: 1000,
    quantidade_disponivel: 150,
    fornecedor: "HigieneMax",
    prioridade: "Média",
    status: "Resolvido",
    data_prevista: "2024-01-17",
    observacoes: "Reposição realizada",
    responsavel: "Aux. Ferreira",
    custo_unitario: 2.30,
    categoria: "Higiene",
    localizacao: "D1-E2-F3"
  },
  {
    id: 7,
    item: "TERMÔMETRO DIGITAL",
    codigo: "TERM-DIG",
    secao: "Equipamentos",
    cliente: "Hospital Pediátrico",
    tipo_ruptura: "Equipamento Avariado",
    data_ruptura: "2024-01-09",
    quantidade_solicitada: 50,
    quantidade_disponivel: 12,
    fornecedor: "TecnoMed Solutions",
    prioridade: "Alta",
    status: "Pendente",
    data_prevista: "2024-01-19",
    observacoes: "Substituição necessária",
    responsavel: "Eng. Rocha",
    custo_unitario: 15.80,
    categoria: "Equipamentos Médicos",
    localizacao: "E1-F2-G3"
  },
  {
    id: 8,
    item: "OMEPRAZOL 20MG",
    codigo: "OME20",
    secao: "Farmácia",
    cliente: "Clínica Gástrica",
    tipo_ruptura: "Stock Zero",
    data_ruptura: "2024-01-08",
    quantidade_solicitada: 500,
    quantidade_disponivel: 0,
    fornecedor: "FarmaDistribuidora Lda",
    prioridade: "Média",
    status: "Em Andamento",
    data_prevista: "2024-01-21",
    observacoes: "Pedido em processamento",
    responsavel: "Farm. Pereira",
    custo_unitario: 0.35,
    categoria: "Gastroenterologia",
    localizacao: "A3-B2-C1"
  }
];

export const sampleKPIs = {
  totalRuptures: 8,
  criticalRuptures: 2,
  resolvedRuptures: 2,
  pendingRuptures: 4,
  avgResolutionTime: 4.5,
  totalCost: 45230.50,
  predictedRuptures: 12,
  preventionRate: 15.5
};

export const sampleChartData = [
  { month: 'Jan', rupturas: 45, previstas: 52, resolvidas: 38 },
  { month: 'Fev', rupturas: 38, previstas: 42, resolvidas: 35 },
  { month: 'Mar', rupturas: 52, previstas: 58, resolvidas: 48 },
  { month: 'Abr', rupturas: 41, previstas: 45, resolvidas: 39 },
  { month: 'Mai', rupturas: 35, previstas: 38, resolvidas: 33 },
  { month: 'Jun', rupturas: 48, previstas: 52, resolvidas: 45 }
];

export const samplePieData = [
  { name: 'Stock Zero', value: 35, color: '#ef4444' },
  { name: 'Stock Baixo', value: 25, color: '#f97316' },
  { name: 'Produto Vencido', value: 20, color: '#eab308' },
  { name: 'Fornecedor Indisponível', value: 15, color: '#8b5cf6' },
  { name: 'Equipamento Avariado', value: 5, color: '#6b7280' }
];

/**
 * Função para gerar dados aleatórios para demonstração
 */
export const generateRandomData = (count = 50) => {
  const items = [
    'PARACETAMOL 500MG', 'SERINGAS 10ML', 'AMOXICILINA 250MG', 
    'LUVAS NITRILO M', 'INSULINA REGULAR', 'ÁLCOOL GEL 70%',
    'TERMÔMETRO DIGITAL', 'OMEPRAZOL 20MG', 'IBUPROFENO 600MG',
    'DIPIRONA 500MG', 'CAPTOPRIL 25MG', 'LOSARTANA 50MG'
  ];
  
  const secoes = ['Farmácia', 'Material Médico', 'EPI', 'Equipamentos', 'Higienização'];
  const clientes = ['Hospital Central', 'Clínica Norte', 'Hospital Sul', 'Laboratório Central', 'Centro Diabetes'];
  const tiposRuptura = ['Stock Zero', 'Stock Baixo', 'Produto Vencido', 'Fornecedor Indisponível', 'Equipamento Avariado'];
  const status = ['Pendente', 'Em Andamento', 'Resolvido'];
  const prioridades = ['Baixa', 'Média', 'Alta', 'Crítica'];
  
  return Array.from({ length: count }, (_, index) => ({
    id: index + 9,
    item: items[Math.floor(Math.random() * items.length)],
    codigo: `COD${(index + 9).toString().padStart(3, '0')}`,
    secao: secoes[Math.floor(Math.random() * secoes.length)],
    cliente: clientes[Math.floor(Math.random() * clientes.length)],
    tipo_ruptura: tiposRuptura[Math.floor(Math.random() * tiposRuptura.length)],
    data_ruptura: new Date(2024, 0, Math.floor(Math.random() * 30) + 1).toISOString().split('T')[0],
    quantidade_solicitada: Math.floor(Math.random() * 2000) + 100,
    quantidade_disponivel: Math.floor(Math.random() * 100),
    fornecedor: `Fornecedor ${index + 1}`,
    prioridade: prioridades[Math.floor(Math.random() * prioridades.length)],
    status: status[Math.floor(Math.random() * status.length)],
    data_prevista: new Date(2024, 0, Math.floor(Math.random() * 30) + 15).toISOString().split('T')[0],
    observacoes: `Observação para item ${index + 9}`,
    responsavel: `Responsável ${index + 1}`,
    custo_unitario: (Math.random() * 50).toFixed(2),
    categoria: `Categoria ${Math.floor(Math.random() * 5) + 1}`,
    localizacao: `${String.fromCharCode(65 + Math.floor(Math.random() * 5))}${Math.floor(Math.random() * 5) + 1}-${String.fromCharCode(66 + Math.floor(Math.random() * 5))}${Math.floor(Math.random() * 5) + 1}`
  }));
};
