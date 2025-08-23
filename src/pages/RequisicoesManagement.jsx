import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Upload, 
  FileText, 
  BarChart3, 
  AlertTriangle,
  CheckCircle,
  FileSpreadsheet,
  Download,
  Filter,
  Search,
  Calendar,
  Clock,
  Users,
  Package,
  TrendingUp,
  RefreshCw,
  Eye,
  X,
  Plus
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Breadcrumbs from '../components/shared/Breadcrumbs';
import * as XLSX from 'xlsx';

// Dados de referência do sistema
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

const DEPARTMENTS = {
  'C1': 'Congelados C1',
  'C2': 'Congelados C2', 
  'C3': 'Congelados C3',
  'C4': 'Congelados C4',
  'P': 'PRAÇA',
  'R': 'Refrigerados',
  'R4': 'Refrigerados R4',
  'S': 'Secos',
  'DRG_AG': 'Consumíveis DRG_AG',
  'DRG_LIMP': 'Consumíveis DRG_LIMP'
};

const RequisicoesManagement = () => {
  // Estados principais
  const [ordersData, setOrdersData] = useState([]);
  const [stockCTData, setStockCTData] = useState([]);
  const [stockFFData, setStockFFData] = useState([]);
  const [transitData, setTransitData] = useState([]);
  const [processedData, setProcessedData] = useState([]);
  
  // Estados da UI
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showModal, setShowModal] = useState('');
  const [selectedData, setSelectedData] = useState([]);
  const [filters, setFilters] = useState({
    date: '',
    time: '',
    client: 'todos',
    section: 'todos',
    department: 'todos'
  });

  // Carregar dados do localStorage na inicialização
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

  // Salvar dados no localStorage sempre que mudarem
  useEffect(() => {
    if (ordersData.length > 0) {
      localStorage.setItem('requisicoes_orders', JSON.stringify(ordersData));
    }
  }, [ordersData]);

  useEffect(() => {
    if (stockCTData.length > 0) {
      localStorage.setItem('requisicoes_stockCT', JSON.stringify(stockCTData));
    }
  }, [stockCTData]);

  useEffect(() => {
    if (stockFFData.length > 0) {
      localStorage.setItem('requisicoes_stockFF', JSON.stringify(stockFFData));
    }
  }, [stockFFData]);

  useEffect(() => {
    if (transitData.length > 0) {
      localStorage.setItem('requisicoes_transit', JSON.stringify(transitData));
    }
  }, [transitData]);

  // Processar arquivos Excel
  const processExcelFile = useCallback((file, type) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          
          // Normalizar dados baseado no tipo
          const normalizedData = jsonData.map((row, index) => {
            if (type === 'orders') {
              return {
                id: `order_${index}`,
                material: row.Material || row.Codigo || row.Code || '',
                description: row.Descrição || row.Description || row.Descricao || '',
                quantity: parseFloat(row['Qtd Plan'] || row.Quantidade || row.Qty || 0),
                uom: row.UoM || row.Unidade || row.Unit || 'UN',
                client: row.Cliente || row.Client || '',
                section: row.Secção || row.Section || row.Seccao || '',
                date: row.Data || row.Date || '',
                time: row.Hora || row.Time || '',
                observations: row.Observações || row.Observations || row.Obs || ''
              };
            } else if (type === 'stockCT' || type === 'stockFF') {
              return {
                id: `${type}_${index}`,
                code: row.Código || row.Code || row.Material || '',
                description: row.Descrição || row.Description || row.Descricao || '',
                inventory: parseFloat(row.Inventário || row.Inventory || row.Stock || 0),
                class: row.Classe || row.Class || row.Department || ''
              };
            }
            return row;
          });
          
          resolve(normalizedData);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  }, []);

  // Handler de upload de arquivos
  const handleFileUpload = async (files, type) => {
    if (!files || files.length === 0) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const data = await processExcelFile(file, type);
        
        if (type === 'orders') {
          setOrdersData(data);
        } else if (type === 'stockCT') {
          setStockCTData(data);
        } else if (type === 'stockFF') {
          setStockFFData(data);
        }
        
        setUploadProgress(((i + 1) / files.length) * 100);
      }
    } catch (error) {
      console.error('Erro no upload:', error);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Análise de rupturas
  const ruptureAnalysis = useMemo(() => {
    if (ordersData.length === 0) return { total: [], partial: [], none: [] };
    
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
    
    const analysis = { total: [], partial: [], none: [] };
    
    ordersData.forEach(order => {
      const stockCT = stockCTMap.get(order.material) || 0;
      const stockFF = stockFFMap.get(order.material) || 0;
      const transit = transitMap.get(order.material) || 0;
      const totalAvailable = stockCT + stockFF + transit;
      
      const analysisItem = {
        ...order,
        stockCT,
        stockFF,
        transit,
        totalAvailable,
        missing: Math.max(0, order.quantity - totalAvailable)
      };
      
      if (totalAvailable === 0) {
        analysisItem.ruptureType = 'total';
        analysisItem.comment = 'Rutura Total';
        analysis.total.push(analysisItem);
      } else if (totalAvailable < order.quantity) {
        analysisItem.ruptureType = 'partial';
        analysisItem.comment = `Rutura Parcial (Falta: ${analysisItem.missing})`;
        analysis.partial.push(analysisItem);
      } else {
        analysisItem.ruptureType = 'none';
        analysisItem.comment = 'Stock Suficiente';
        analysis.none.push(analysisItem);
      }
    });
    
    return analysis;
  }, [ordersData, stockCTData, stockFFData, transitData]);

  // Estatísticas
  const statistics = useMemo(() => {
    const totalOrders = ordersData.length;
    const totalRuptures = ruptureAnalysis.total.length + ruptureAnalysis.partial.length;
    const ruptureRate = totalOrders > 0 ? ((totalRuptures / totalOrders) * 100).toFixed(1) : 0;
    
    return {
      totalOrders,
      totalRuptures,
      totalRupturesComplete: ruptureAnalysis.total.length,
      partialRuptures: ruptureAnalysis.partial.length,
      ruptureRate,
      clients: [...new Set(ordersData.map(order => order.client))].length,
      sections: [...new Set(ordersData.map(order => order.section))].length
    };
  }, [ordersData, ruptureAnalysis]);

  // Limpar todos os dados
  const clearAllData = () => {
    setOrdersData([]);
    setStockCTData([]);
    setStockFFData([]);
    setTransitData([]);
    localStorage.removeItem('requisicoes_orders');
    localStorage.removeItem('requisicoes_stockCT');
    localStorage.removeItem('requisicoes_stockFF');
    localStorage.removeItem('requisicoes_transit');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Breadcrumbs 
        items={[
          { label: 'Início', path: '/' },
          { label: 'Gestão Logística', path: '/requisicoes-management' },
          { label: 'Gestão de Requisições' }
        ]} 
      />

      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gestão de Requisições</h1>
              <p className="text-gray-600 mt-1">Sistema de análise de requisições e rupturas de stock</p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={clearAllData}
                className="flex items-center gap-2"
              >
                <RefreshCw size={16} />
                Processar Novos Arquivos
              </Button>
              <Button className="flex items-center gap-2">
                <Download size={16} />
                Exportar Relatório
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard de Estatísticas */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card 
            className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => {
              setSelectedData(ordersData);
              setShowModal('orders');
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Requisições</p>
                <p className="text-2xl font-bold text-blue-600">{statistics.totalOrders}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </Card>

          <Card 
            className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => {
              setSelectedData(ruptureAnalysis.total);
              setShowModal('rupturesTotal');
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rupturas Totais</p>
                <p className="text-2xl font-bold text-red-600">{statistics.totalRupturesComplete}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </Card>

          <Card 
            className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => {
              setSelectedData(ruptureAnalysis.partial);
              setShowModal('rupturesPartial');
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rupturas Parciais</p>
                <p className="text-2xl font-bold text-yellow-600">{statistics.partialRuptures}</p>
              </div>
              <Package className="h-8 w-8 text-yellow-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Taxa de Rupturas</p>
                <p className="text-2xl font-bold text-purple-600">{statistics.ruptureRate}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </Card>
        </div>

        {/* Seção de Upload */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Upload de Pedidos */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-blue-600" />
              Arquivo de Pedidos
            </h3>
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer"
              onDrop={(e) => {
                e.preventDefault();
                handleFileUpload(e.dataTransfer.files, 'orders');
              }}
              onDragOver={(e) => e.preventDefault()}
            >
              <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600 mb-2">
                Arraste o arquivo Excel aqui ou clique para selecionar
              </p>
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={(e) => handleFileUpload(e.target.files, 'orders')}
                className="hidden"
                id="orders-upload"
              />
              <label
                htmlFor="orders-upload"
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
              >
                Selecionar Arquivo
              </label>
            </div>
            {ordersData.length > 0 && (
              <div className="mt-3 text-sm text-green-600 flex items-center gap-1">
                <CheckCircle size={16} />
                {ordersData.length} registros carregados
              </div>
            )}
          </Card>

          {/* Upload de Stock CT */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Package className="h-5 w-5 text-green-600" />
              Stock CT (Principal)
            </h3>
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors cursor-pointer"
              onDrop={(e) => {
                e.preventDefault();
                handleFileUpload(e.dataTransfer.files, 'stockCT');
              }}
              onDragOver={(e) => e.preventDefault()}
            >
              <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600 mb-2">
                Arquivo de estoque principal
              </p>
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={(e) => handleFileUpload(e.target.files, 'stockCT')}
                className="hidden"
                id="stockCT-upload"
              />
              <label
                htmlFor="stockCT-upload"
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
              >
                Selecionar Arquivo
              </label>
            </div>
            {stockCTData.length > 0 && (
              <div className="mt-3 text-sm text-green-600 flex items-center gap-1">
                <CheckCircle size={16} />
                {stockCTData.length} itens carregados
              </div>
            )}
          </Card>

          {/* Upload de Stock FF */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Package className="h-5 w-5 text-purple-600" />
              Stock FF (Secundário)
            </h3>
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors cursor-pointer"
              onDrop={(e) => {
                e.preventDefault();
                handleFileUpload(e.target.files, 'stockFF');
              }}
              onDragOver={(e) => e.preventDefault()}
            >
              <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600 mb-2">
                Arquivo de estoque secundário
              </p>
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={(e) => handleFileUpload(e.target.files, 'stockFF')}
                className="hidden"
                id="stockFF-upload"
              />
              <label
                htmlFor="stockFF-upload"
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
              >
                Selecionar Arquivo
              </label>
            </div>
            {stockFFData.length > 0 && (
              <div className="mt-3 text-sm text-green-600 flex items-center gap-1">
                <CheckCircle size={16} />
                {stockFFData.length} itens carregados
              </div>
            )}
          </Card>
        </div>

        {/* Resumo de Análise */}
        {ordersData.length > 0 && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              Resumo da Análise de Rupturas
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <h4 className="font-medium text-red-800">Rupturas Totais</h4>
                <p className="text-2xl font-bold text-red-600">{ruptureAnalysis.total.length}</p>
                <p className="text-sm text-red-600">Produtos sem stock</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <h4 className="font-medium text-yellow-800">Rupturas Parciais</h4>
                <p className="text-2xl font-bold text-yellow-600">{ruptureAnalysis.partial.length}</p>
                <p className="text-sm text-yellow-600">Stock insuficiente</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="font-medium text-green-800">Stock Suficiente</h4>
                <p className="text-2xl font-bold text-green-600">{ruptureAnalysis.none.length}</p>
                <p className="text-sm text-green-600">Sem rupturas</p>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Progress Bar durante upload */}
      {isUploading && (
        <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border">
          <div className="flex items-center gap-3">
            <RefreshCw className="h-5 w-5 animate-spin text-blue-600" />
            <div>
              <p className="text-sm font-medium">Processando arquivo...</p>
              <div className="w-48 bg-gray-200 rounded-full h-2 mt-1">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modais para detalhes */}
      <Modal
        isOpen={showModal !== ''}
        onClose={() => setShowModal('')}
        title={
          showModal === 'orders' ? 'Detalhes das Requisições' :
          showModal === 'rupturesTotal' ? 'Rupturas Totais' :
          showModal === 'rupturesPartial' ? 'Rupturas Parciais' : ''
        }
      >
        <div className="p-6 max-h-96 overflow-y-auto">
          {selectedData.length > 0 ? (
            <div className="space-y-3">
              {selectedData.map((item, index) => (
                <div key={index} className="border-b pb-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Material:</span> {item.material}
                    </div>
                    <div>
                      <span className="font-medium">Cliente:</span> {item.client}
                    </div>
                    <div>
                      <span className="font-medium">Quantidade:</span> {item.quantity}
                    </div>
                    <div>
                      <span className="font-medium">Seção:</span> {item.section}
                    </div>
                    {item.comment && (
                      <div className="col-span-2">
                        <span className="font-medium">Status:</span> {item.comment}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">Nenhum dado disponível</p>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default RequisicoesManagement;
