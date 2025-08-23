import React, { useState, useEffect, useMemo } from 'react';
import { 
  AlertTriangle, 
  FileText, 
  Download,
  Upload,
  Filter,
  Search,
  Eye,
  Plus,
  Minus,
  RefreshCw,
  BarChart3,
  Package2,
  TrendingDown,
  X,
  Check
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import Select from '../components/ui/Select';
import Breadcrumbs from '../components/shared/Breadcrumbs';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const RuptureAnalysis = () => {
  // Estados dos dados
  const [ordersData, setOrdersData] = useState([]);
  const [stockCTData, setStockCTData] = useState([]);
  const [stockFFData, setStockFFData] = useState([]);
  const [transitData, setTransitData] = useState([]);
  const [transitInput, setTransitInput] = useState('');
  
  // Estados de filtros
  const [filters, setFilters] = useState({
    client: '',
    section: '',
    department: '',
    ruptureType: 'all',
    searchTerm: ''
  });
  
  // Estados da UI
  const [showTransitData, setShowTransitData] = useState(false);
  const [showModal, setShowModal] = useState('');
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  // Carregar dados salvos
  useEffect(() => {
    const savedOrders = localStorage.getItem('requisicoes_orders');
    const savedStockCT = localStorage.getItem('requisicoes_stockCT');
    const savedStockFF = localStorage.getItem('requisicoes_stockFF');
    const savedTransit = localStorage.getItem('requisicoes_transit');
    
    if (savedOrders) setOrdersData(JSON.parse(savedOrders));
    if (savedStockCT) setStockCTData(JSON.parse(savedStockCT));
    if (savedStockFF) setStockFFData(JSON.parse(savedStockFF));
    if (savedTransit) setTransitData(JSON.parse(savedTransit));
  }, []);

  // Processar dados de trânsito do textarea
  const processTransitInput = () => {
    if (!transitInput.trim()) return;
    
    const lines = transitInput.trim().split('\n');
    const newTransitData = [];
    
    lines.forEach((line, index) => {
      const parts = line.split('\t').map(part => part.trim());
      if (parts.length >= 2) {
        const code = parts[0];
        const quantity = parseFloat(parts[1]) || 0;
        const description = parts[2] || '';
        
        // Verificar se já existe no transit data
        const existingIndex = newTransitData.findIndex(item => item.code === code);
        if (existingIndex >= 0) {
          newTransitData[existingIndex].quantity += quantity;
        } else {
          newTransitData.push({
            id: `transit_${index}`,
            code,
            quantity,
            description,
            source: 'manual'
          });
        }
      }
    });
    
    // Combinar com dados existentes
    const combinedTransit = [...transitData];
    newTransitData.forEach(newItem => {
      const existingIndex = combinedTransit.findIndex(item => item.code === newItem.code);
      if (existingIndex >= 0) {
        combinedTransit[existingIndex].quantity += newItem.quantity;
      } else {
        combinedTransit.push(newItem);
      }
    });
    
    setTransitData(combinedTransit);
    localStorage.setItem('requisicoes_transit', JSON.stringify(combinedTransit));
    setTransitInput('');
  };

  // Análise completa de rupturas
  const ruptureAnalysis = useMemo(() => {
    if (ordersData.length === 0) return [];
    
    const stockCTMap = new Map();
    const stockFFMap = new Map();
    const transitMap = new Map();
    
    // Criar mapas de estoque
    stockCTData.forEach(item => {
      stockCTMap.set(item.code, item.inventory);
    });
    
    stockFFData.forEach(item => {
      stockFFMap.set(item.code, item.inventory);
    });
    
    transitData.forEach(item => {
      if (transitMap.has(item.code)) {
        transitMap.set(item.code, transitMap.get(item.code) + item.quantity);
      } else {
        transitMap.set(item.code, item.quantity);
      }
    });
    
    return ordersData.map(order => {
      const stockCT = stockCTMap.get(order.material) || 0;
      const stockFF = stockFFMap.get(order.material) || 0;
      const transit = transitMap.get(order.material) || 0;
      const totalAvailable = stockCT + stockFF + transit;
      const missing = Math.max(0, order.quantity - totalAvailable);
      
      let ruptureType = 'none';
      let comment = 'Stock Suficiente';
      let priority = 'low';
      
      if (totalAvailable === 0) {
        ruptureType = 'total';
        comment = 'Rutura Total';
        priority = 'high';
      } else if (totalAvailable < order.quantity) {
        ruptureType = 'partial';
        comment = stockCT === 0 
          ? `Pedido à FF com Rutura Parcial (Falta: ${missing})`
          : `Rutura Parcial (Falta: ${missing})`;
        priority = 'medium';
      }
      
      return {
        ...order,
        stockCT,
        stockFF,
        transit,
        totalAvailable,
        missing,
        ruptureType,
        comment,
        priority
      };
    });
  }, [ordersData, stockCTData, stockFFData, transitData]);

  // Dados filtrados
  const filteredData = useMemo(() => {
    return ruptureAnalysis.filter(item => {
      const matchesClient = !filters.client || item.client.toLowerCase().includes(filters.client.toLowerCase());
      const matchesSection = !filters.section || item.section.toLowerCase().includes(filters.section.toLowerCase());
      const matchesRupture = filters.ruptureType === 'all' || item.ruptureType === filters.ruptureType;
      const matchesSearch = !filters.searchTerm || 
        item.material.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(filters.searchTerm.toLowerCase());
      
      return matchesClient && matchesSection && matchesRupture && matchesSearch;
    });
  }, [ruptureAnalysis, filters]);

  // Agrupamento de dados
  const groupedData = useMemo(() => {
    const groups = {};
    
    filteredData.forEach(item => {
      const key = `${item.section}_${item.client}`;
      if (!groups[key]) {
        groups[key] = {
          section: item.section,
          client: item.client,
          items: [],
          totalItems: 0,
          totalRuptures: 0,
          criticalRuptures: 0
        };
      }
      
      groups[key].items.push(item);
      groups[key].totalItems++;
      
      if (item.ruptureType !== 'none') {
        groups[key].totalRuptures++;
      }
      
      if (item.ruptureType === 'total') {
        groups[key].criticalRuptures++;
      }
    });
    
    return Object.values(groups);
  }, [filteredData]);

  // Estatísticas
  const statistics = useMemo(() => {
    const totalItems = ruptureAnalysis.length;
    const totalRuptures = ruptureAnalysis.filter(item => item.ruptureType === 'total').length;
    const partialRuptures = ruptureAnalysis.filter(item => item.ruptureType === 'partial').length;
    const okItems = ruptureAnalysis.filter(item => item.ruptureType === 'none').length;
    
    return {
      totalItems,
      totalRuptures,
      partialRuptures,
      okItems,
      ruptureRate: totalItems > 0 ? (((totalRuptures + partialRuptures) / totalItems) * 100).toFixed(1) : 0
    };
  }, [ruptureAnalysis]);

  // Exportar para Excel
  const exportToExcel = (data, filename) => {
    setIsExporting(true);
    try {
      const ws = XLSX.utils.json_to_sheet(data.map(item => ({
        'Secção': item.section,
        'Cliente': item.client,
        'Nº Material': item.material,
        'Descrição': item.description,
        'Qtd Planejada': item.quantity,
        'UoM': item.uom,
        'Stock CT': item.stockCT,
        'Stock FF': item.stockFF,
        'Em Trânsito': item.transit,
        'Total Disponível': item.totalAvailable,
        'Falta': item.missing,
        'Tipo Ruptura': item.ruptureType,
        'Comentário': item.comment,
        'Data': item.date,
        'Hora': item.time
      })));
      
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Análise de Rupturas');
      XLSX.writeFile(wb, `${filename}.xlsx`);
    } catch (error) {
      console.error('Erro na exportação:', error);
    } finally {
      setIsExporting(false);
    }
  };

  // Exportar para PDF
  const exportToPDF = (data, filename) => {
    setIsExporting(true);
    try {
      const doc = new jsPDF('l', 'mm', 'a4');
      
      doc.setFontSize(16);
      doc.text('Análise de Rupturas de Stock', 14, 15);
      
      doc.setFontSize(10);
      doc.text(`Data: ${new Date().toLocaleDateString()}`, 14, 25);
      doc.text(`Total de itens: ${data.length}`, 14, 30);
      
      const tableData = data.map(item => [
        item.section,
        item.client,
        item.material,
        item.quantity,
        item.stockCT,
        item.stockFF,
        item.transit,
        item.totalAvailable,
        item.ruptureType === 'total' ? 'Total' : 
        item.ruptureType === 'partial' ? 'Parcial' : 'OK'
      ]);
      
      doc.autoTable({
        head: [['Secção', 'Cliente', 'Material', 'Qtd', 'CT', 'FF', 'TR', 'Total', 'Status']],
        body: tableData,
        startY: 35,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [66, 139, 202] }
      });
      
      doc.save(`${filename}.pdf`);
    } catch (error) {
      console.error('Erro na exportação PDF:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Breadcrumbs 
        items={[
          { label: 'Início', path: '/' },
          { label: 'Gestão Logística', path: '/requisicoes-management' },
          { label: 'Análise de Rupturas' }
        ]} 
      />

      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Análise de Rupturas</h1>
              <p className="text-gray-600 mt-1">Análise detalhada de rupturas de stock com múltiplas fontes</p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => exportToExcel(filteredData, 'analise-rupturas')}
                disabled={isExporting}
                className="flex items-center gap-2"
              >
                <Download size={16} />
                Excel
              </Button>
              <Button
                onClick={() => exportToPDF(filteredData, 'analise-rupturas')}
                disabled={isExporting}
                className="flex items-center gap-2"
              >
                <FileText size={16} />
                PDF
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Itens</p>
                <p className="text-2xl font-bold text-blue-600">{statistics.totalItems}</p>
              </div>
              <Package2 className="h-8 w-8 text-blue-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rupturas Totais</p>
                <p className="text-2xl font-bold text-red-600">{statistics.totalRuptures}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rupturas Parciais</p>
                <p className="text-2xl font-bold text-yellow-600">{statistics.partialRuptures}</p>
              </div>
              <TrendingDown className="h-8 w-8 text-yellow-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Taxa de Rupturas</p>
                <p className="text-2xl font-bold text-purple-600">{statistics.ruptureRate}%</p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-600" />
            </div>
          </Card>
        </div>

        {/* Dados em Trânsito */}
        <Card className="p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-blue-600" />
              Dados em Trânsito (TR)
            </h3>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowTransitData(!showTransitData)}
                className="flex items-center gap-2"
              >
                <Eye size={16} />
                {showTransitData ? 'Ocultar' : 'Mostrar'} Dados
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setTransitData([]);
                  localStorage.removeItem('requisicoes_transit');
                }}
                className="flex items-center gap-2"
              >
                <X size={16} />
                Limpar
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Inserir Dados (Código | Quantidade | Descrição)
              </label>
              <textarea
                value={transitInput}
                onChange={(e) => setTransitInput(e.target.value)}
                rows={8}
                className="w-full p-3 border border-gray-300 rounded-md text-sm"
                placeholder="Exemplo:&#10;MAT001	10	Produto A&#10;MAT002	5	Produto B"
              />
              <div className="flex gap-2 mt-3">
                <Button
                  onClick={processTransitInput}
                  disabled={!transitInput.trim()}
                  className="flex items-center gap-2"
                >
                  <Plus size={16} />
                  Adicionar Dados
                </Button>
              </div>
            </div>

            {showTransitData && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Dados Acumulados ({transitData.length} itens)
                </h4>
                <div className="bg-gray-50 border rounded-md p-3 max-h-64 overflow-y-auto">
                  {transitData.length > 0 ? (
                    <div className="space-y-2">
                      {transitData.map((item, index) => (
                        <div key={index} className="flex justify-between items-center text-sm bg-white p-2 rounded border">
                          <div>
                            <span className="font-medium">{item.code}</span>
                            <span className="text-gray-600 ml-2">Qtd: {item.quantity}</span>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const newData = transitData.filter((_, i) => i !== index);
                              setTransitData(newData);
                              localStorage.setItem('requisicoes_transit', JSON.stringify(newData));
                            }}
                          >
                            <Minus size={14} />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">Nenhum dado em trânsito</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Filtros */}
        <Card className="p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Filter className="h-5 w-5 text-blue-600" />
            Filtros
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
              <Input
                type="text"
                placeholder="Material ou descrição"
                value={filters.searchTerm}
                onChange={(e) => setFilters({...filters, searchTerm: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
              <Input
                type="text"
                placeholder="Filtrar por cliente"
                value={filters.client}
                onChange={(e) => setFilters({...filters, client: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Seção</label>
              <Input
                type="text"
                placeholder="Filtrar por seção"
                value={filters.section}
                onChange={(e) => setFilters({...filters, section: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Ruptura</label>
              <Select
                value={filters.ruptureType}
                onChange={(value) => setFilters({...filters, ruptureType: value})}
                options={[
                  { value: 'all', label: 'Todos' },
                  { value: 'total', label: 'Rupturas Totais' },
                  { value: 'partial', label: 'Rupturas Parciais' },
                  { value: 'none', label: 'Sem Rupturas' }
                ]}
              />
            </div>
          </div>
        </Card>

        {/* Agrupamento por Seção e Cliente */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            Análise por Seção e Cliente
          </h3>
          
          {groupedData.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {groupedData.map((group, index) => (
                <div 
                  key={index}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => {
                    setSelectedGroup(group);
                    setShowModal('groupDetails');
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-gray-800">{group.section}</h4>
                      <p className="text-sm text-gray-600">{group.client}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Total</p>
                      <p className="font-semibold text-blue-600">{group.totalItems}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-red-50 p-2 rounded text-center">
                      <p className="text-red-600 font-medium">{group.criticalRuptures}</p>
                      <p className="text-red-500 text-xs">Rupturas Totais</p>
                    </div>
                    <div className="bg-yellow-50 p-2 rounded text-center">
                      <p className="text-yellow-600 font-medium">{group.totalRuptures - group.criticalRuptures}</p>
                      <p className="text-yellow-500 text-xs">Rupturas Parciais</p>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full flex items-center justify-center gap-2"
                    >
                      <Download size={14} />
                      Gerar Relatório
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BarChart3 className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">Nenhum dado para análise</h3>
              <p className="text-gray-500">
                Carregue os arquivos de pedidos e estoque na página de Gestão de Requisições
              </p>
            </div>
          )}
        </Card>
      </div>

      {/* Modal de detalhes do grupo */}
      <Modal
        isOpen={showModal === 'groupDetails'}
        onClose={() => setShowModal('')}
        title={selectedGroup ? `${selectedGroup.section} - ${selectedGroup.client}` : ''}
      >
        {selectedGroup && (
          <div className="p-6">
            <div className="mb-4 grid grid-cols-3 gap-4 text-center">
              <div className="bg-blue-50 p-3 rounded">
                <p className="text-lg font-bold text-blue-600">{selectedGroup.totalItems}</p>
                <p className="text-sm text-blue-600">Total</p>
              </div>
              <div className="bg-red-50 p-3 rounded">
                <p className="text-lg font-bold text-red-600">{selectedGroup.criticalRuptures}</p>
                <p className="text-sm text-red-600">Críticas</p>
              </div>
              <div className="bg-yellow-50 p-3 rounded">
                <p className="text-lg font-bold text-yellow-600">{selectedGroup.totalRuptures - selectedGroup.criticalRuptures}</p>
                <p className="text-sm text-yellow-600">Parciais</p>
              </div>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              <div className="space-y-3">
                {selectedGroup.items.map((item, index) => (
                  <div 
                    key={index} 
                    className={`p-3 rounded border-l-4 ${
                      item.ruptureType === 'total' ? 'border-red-500 bg-red-50' :
                      item.ruptureType === 'partial' ? 'border-yellow-500 bg-yellow-50' :
                      'border-green-500 bg-green-50'
                    }`}
                  >
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Material:</span> {item.material}
                      </div>
                      <div>
                        <span className="font-medium">Qtd:</span> {item.quantity}
                      </div>
                      <div>
                        <span className="font-medium">CT:</span> {item.stockCT}
                      </div>
                      <div>
                        <span className="font-medium">FF:</span> {item.stockFF}
                      </div>
                      <div className="col-span-2">
                        <span className="font-medium">Status:</span> {item.comment}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-6 flex gap-3">
              <Button
                onClick={() => exportToExcel(selectedGroup.items, `${selectedGroup.section}-${selectedGroup.client}`)}
                className="flex items-center gap-2"
              >
                <Download size={16} />
                Exportar Excel
              </Button>
              <Button
                variant="outline"
                onClick={() => exportToPDF(selectedGroup.items, `${selectedGroup.section}-${selectedGroup.client}`)}
                className="flex items-center gap-2"
              >
                <FileText size={16} />
                Exportar PDF
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default RuptureAnalysis;
