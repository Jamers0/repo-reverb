/**
 * Script para inicializar o sistema com dados de exemplo
 * Execute este código no console do navegador para carregar dados de teste
 */

// Função para carregar dados de exemplo
function loadSampleData() {
  const sampleData = [
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
    }
  ];

  // Salvar no localStorage
  localStorage.setItem('stockRuptures', JSON.stringify(sampleData));
  
  // Configurações de exemplo
  const sampleSettings = {
    notifications: {
      browser: true,
      sound: true,
      email: false,
      whatsapp: false,
      frequency: 5
    },
    dashboard: {
      defaultView: 'dashboard',
      autoRefresh: true,
      chartType: 'line'
    },
    filters: {
      savedViews: [
        {
          id: 1,
          name: "Rupturas Críticas",
          filters: { prioridade: "Crítica", status: "Pendente" }
        },
        {
          id: 2,
          name: "Farmácia - Stock Zero",
          filters: { secao: "Farmácia", tipo_ruptura: "Stock Zero" }
        }
      ]
    }
  };
  
  localStorage.setItem('appSettings', JSON.stringify(sampleSettings));
  
  console.log('✅ Dados de exemplo carregados com sucesso!');
  console.log('📊 Dados carregados:', sampleData.length, 'rupturas');
  console.log('🔄 Recarregue a página para ver os dados');
  
  return sampleData;
}

// Função para limpar todos os dados
function clearAllData() {
  localStorage.removeItem('stockRuptures');
  localStorage.removeItem('appSettings');
  localStorage.removeItem('dataContext');
  console.log('🗑️ Todos os dados foram limpos');
  console.log('🔄 Recarregue a página');
}

// Função para verificar dados atuais
function checkCurrentData() {
  const ruptures = JSON.parse(localStorage.getItem('stockRuptures') || '[]');
  const settings = JSON.parse(localStorage.getItem('appSettings') || '{}');
  
  console.log('📊 Status atual dos dados:');
  console.log('- Rupturas:', ruptures.length);
  console.log('- Configurações:', Object.keys(settings).length);
  
  return { ruptures, settings };
}

// Expor funções globalmente para uso no console
window.loadSampleData = loadSampleData;
window.clearAllData = clearAllData;
window.checkCurrentData = checkCurrentData;

console.log('🚀 Utilitários de dados carregados!');
console.log('📝 Comandos disponíveis:');
console.log('  - loadSampleData()    // Carregar dados de exemplo');
console.log('  - clearAllData()      // Limpar todos os dados');
console.log('  - checkCurrentData()  // Verificar dados atuais');
