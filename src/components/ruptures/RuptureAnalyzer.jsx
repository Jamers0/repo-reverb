import React, { useMemo } from 'react';

const RuptureAnalyzer = ({ pedidos, stockCT, stockFF, transito }) => {
  
  const processTransitData = (transitText) => {
    if (!transitText) return {};
    
    const lines = transitText.split('\n').filter(line => line.trim());
    const transitMap = {};
    
    lines.forEach(line => {
      const parts = line.split(/[,;\t]/).map(p => p.trim());
      if (parts.length >= 2) {
        const codigo = parts[0];
        const quantidade = parseFloat(parts[1]) || 0;
        transitMap[codigo] = (transitMap[codigo] || 0) + quantidade;
      }
    });
    
    return transitMap;
  };

  const processExcelData = (file, keyColumn = 'codigo', quantityColumn = 'quantidade') => {
    // Simular processamento de arquivo Excel
    // Em uma implementação real, usaria uma biblioteca como xlsx
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        // Mock data para demonstração
        const mockData = {
          'CFBA0001': 100,
          'CFBA0002': 50,
          'CFBA0003': 75,
          'CFBA0004': 0,
          'CFBA0005': 25
        };
        resolve(mockData);
      };
      reader.readAsArrayBuffer(file);
    });
  };

  const analyzeRuptures = useMemo(() => {
    if (!pedidos || !stockCT) return [];

    // Mock data para demonstração
    const mockPedidos = [
      { 
        id: 1, 
        codigo: 'CFBA0001', 
        descricao: 'Banana 4/6', 
        secao: 'CF', 
        cliente: 'C000001', 
        clienteNome: 'Air Canada',
        quantidadePlanejada: 120,
        unidade: 'KG',
        dataEnvio: '2025-08-23',
        documento: 'DOC001',
        valorUnitario: 2.50
      },
      { 
        id: 2, 
        codigo: 'CFBA0002', 
        descricao: 'Maçã Golden', 
        secao: 'CQ', 
        cliente: 'C000029', 
        clienteNome: 'TAP Portugal',
        quantidadePlanejada: 80,
        unidade: 'KG',
        dataEnvio: '2025-08-23',
        documento: 'DOC002',
        valorUnitario: 3.20
      },
      { 
        id: 3, 
        codigo: 'CFBA0003', 
        descricao: 'Leite Integral 1L', 
        secao: 'PAS', 
        cliente: 'C000006', 
        clienteNome: 'British Airways',
        quantidadePlanejada: 60,
        unidade: 'UN',
        dataEnvio: '2025-08-23',
        documento: 'DOC003',
        valorUnitario: 1.80
      },
      { 
        id: 4, 
        codigo: 'CFBA0004', 
        descricao: 'Pão de Forma', 
        secao: 'CF', 
        cliente: 'C000001', 
        clienteNome: 'Air Canada',
        quantidadePlanejada: 40,
        unidade: 'UN',
        dataEnvio: '2025-08-23',
        documento: 'DOC004',
        valorUnitario: 4.50
      },
      { 
        id: 5, 
        codigo: 'CFBA0005', 
        descricao: 'Queijo Cheddar', 
        secao: 'CQ', 
        cliente: 'C000029', 
        clienteNome: 'TAP Portugal',
        quantidadePlanejada: 30,
        unidade: 'KG',
        dataEnvio: '2025-08-23',
        documento: 'DOC005',
        valorUnitario: 8.90
      }
    ];

    const mockStockCT = {
      'CFBA0001': 100,
      'CFBA0002': 0,
      'CFBA0003': 45,
      'CFBA0004': 0,
      'CFBA0005': 15
    };

    const mockStockFF = {
      'CFBA0001': 0,
      'CFBA0002': 0,
      'CFBA0003': 20,
      'CFBA0004': 0,
      'CFBA0005': 10
    };

    const transitData = processTransitData(transito);

    const rupturesAnalysis = mockPedidos.map(pedido => {
      const stockCTQty = mockStockCT[pedido.codigo] || 0;
      const stockFFQty = mockStockFF[pedido.codigo] || 0;
      const transitQty = transitData[pedido.codigo] || 0;
      
      // Fórmula: Total Disponível = Stock CT + Stock FF + TR
      const totalDisponivel = stockCTQty + stockFFQty + transitQty;
      
      let tipoRuptura = null;
      let quantidadeRuptura = 0;
      let comentarios = '';
      
      if (totalDisponivel < pedido.quantidadePlanejada) {
        quantidadeRuptura = pedido.quantidadePlanejada - totalDisponivel;
        
        if (totalDisponivel === 0) {
          tipoRuptura = 'total';
          comentarios = 'Stock zerado em todas as fontes';
        } else {
          tipoRuptura = 'parcial';
          comentarios = `Faltam ${quantidadeRuptura} ${pedido.unidade}`;
        }
      }

      return {
        ...pedido,
        stockCT: stockCTQty,
        stockFF: stockFFQty,
        transito: transitQty,
        totalDisponivel,
        quantidadeRuptura,
        tipoRuptura,
        comentarios,
        acaoTomada: tipoRuptura ? 'pendente' : 'ok',
        dataAnalise: new Date().toISOString(),
        operador: 'Sistema Automático'
      };
    }).filter(item => item.tipoRuptura); // Só retorna itens com ruptura

    // Ordenar: Rupturas totais primeiro, depois parciais
    return rupturesAnalysis.sort((a, b) => {
      if (a.tipoRuptura === 'total' && b.tipoRuptura === 'parcial') return -1;
      if (a.tipoRuptura === 'parcial' && b.tipoRuptura === 'total') return 1;
      return a.codigo.localeCompare(b.codigo);
    });

  }, [pedidos, stockCT, stockFF, transito]);

  return analyzeRuptures;
};

export default RuptureAnalyzer;