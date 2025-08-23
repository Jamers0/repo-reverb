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
  Plus,
  Info,
  FileCheck
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Breadcrumbs from '../components/shared/Breadcrumbs';
import { useReferenceData } from '../contexts/ReferenceDataContext';
import * as XLSX from 'xlsx';

// Guia de processamento dos arquivos Excel
const EXCEL_GUIDE = {
  orders: {
    title: "Arquivo de Requisições (.xlsx)",
    description: "Estrutura esperada do arquivo de requisições:",
    structure: {
      irrelevantRows: "Linhas 1-4: Informações irrelevantes para operação",
      headerRow: "Linha 5: Cabeçalho das informações",
      dataRows: "A partir da linha 6: Dados das requisições",
      columns: {
        A5: "S (Ignorar)",
        B5: "Código",
        C5: "Criação", 
        D5: "Criado Por",
        E5: "Planeada",
        F5: "Estado",
        G5: "Cliente",
        H5: "Classe",
        I5: "Unidade",
        J5: "Material (Código + Descrição)",
        K5: "Qtd Plan.",
        L5: "Qtd Ex.",
        M5: "UoM",
        N5: "Dep",
        O5: "Tipo Requisição",
        P5: "Motivo",
        Q5: "Observações"
      }
    },
    processing: {
      materialColumn: "Coluna J: Contém 'CÓDIGO - DESCRIÇÃO' (ex: 'CVAL0007 - Alface folha lavada')",
      codeExtraction: "Código: =ESQUERDA(J6;8) → 'CVAL0007'",
      descriptionExtraction: "Descrição: =TEXTODEPOIS(J6; '- ') → 'Alface folha lavada'"
    }
  },
  stock: {
    title: "Arquivo de Stock/Inventário (.xlsx)",
    description: "Estrutura do arquivo de banco de dados de stock:",
    structure: {
      headerRow: "Linha 3: Cabeçalho",
      dataRows: "A partir da linha 4: Dados do stock",
      columns: {
        A3: "Nº (Código do produto)",
        B3: "Nº Ref. Cruzada",
        C3: "Descrição",
        D3: "Inventário (Quantidade em stock)",
        E3: "Unidade Medida Base",
        F3: "Cód. Classe Armazém (Local)",
        G3: "Cód. Categoria Produto",
        H3: "Cód. Unid. Medida Arrumação"
      }
    }
  },
  output: {
    title: "Arquivo de Impressão Gerado",
    description: "Estrutura do arquivo final para impressão:",
    structure: {
      header: "Linhas 1-2: Nome da secção + Data atual",
      columns: "Linha 3: A3=Código, B3=Material, C3=Qtd Plan., D3=Qtd Ex., E3=UoM, F3=Dep, G3=Fotostock",
      data: "A partir da linha 4: Dados processados e agrupados por produto"
    }
  }
};

// Dados de referência do sistema - agora serão obtidos do contexto
// Mantidos como fallback para compatibilidade
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

const RequisicoesManagementNew = () => {
  // Hook para dados de referência centralizados
  const {
    sections,
    departments,
    clients,
    sectionOptions,
    departmentOptions,
    clientOptions,
    formatSectionForDisplay,
    formatDepartmentForDisplay,
    formatClientForDisplay,
    isValidSectionCode,
    isValidDepartmentCode,
    isValidClientNumber,
    getMainAirlines,
    getProductionSections,
    getStorageDepartments
  } = useReferenceData();
  // Estados principais
  const [ordersData, setOrdersData] = useState([]);
  const [stockData, setStockData] = useState([]);
  const [processedOrders, setProcessedOrders] = useState([]);
  
  // Estados da UI
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showModal, setShowModal] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [activeTab, setActiveTab] = useState('upload');
  const [showGuide, setShowGuide] = useState(false);
  
  // Estados de filtros
  const [filters, setFilters] = useState({
    section: 'todos',
    client: 'todos',
    date: '',
    status: 'todos'
  });

  // Carregar dados do localStorage na inicialização
  useEffect(() => {
    const savedOrders = localStorage.getItem('requisicoes_orders_new');
    const savedStock = localStorage.getItem('requisicoes_stock_new');
    
    if (savedOrders) setOrdersData(JSON.parse(savedOrders));
    if (savedStock) setStockData(JSON.parse(savedStock));
  }, []);

  // Salvar dados no localStorage sempre que mudarem
  useEffect(() => {
    if (ordersData.length > 0) {
      localStorage.setItem('requisicoes_orders_new', JSON.stringify(ordersData));
    }
  }, [ordersData]);

  useEffect(() => {
    if (stockData.length > 0) {
      localStorage.setItem('requisicoes_stock_new', JSON.stringify(stockData));
    }
  }, [stockData]);

  // Função para extrair código do produto da coluna Material
  const extractProductCode = (materialText) => {
    if (!materialText || typeof materialText !== 'string') return '';
    // Equivalente a =ESQUERDA(J6;8)
    return materialText.substring(0, 8).trim();
  };

  // Função para extrair descrição do produto da coluna Material
  const extractProductDescription = (materialText) => {
    if (!materialText || typeof materialText !== 'string') return '';
    // Equivalente a =TEXTODEPOIS(J6; "- ")
    const parts = materialText.split(' - ');
    return parts.length > 1 ? parts.slice(1).join(' - ').trim() : '';
  };

  // Processar arquivo Excel de requisições
  const processOrdersFile = useCallback((file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          setIsUploading(true);
          setUploadProgress(30);
          
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          
          setUploadProgress(60);
          
          // Converter para array, começando da linha 6 (índice 5)
          const range = XLSX.utils.decode_range(worksheet['!ref']);
          const orders = [];
          
          for (let row = 5; row <= range.e.r; row++) { // Começar da linha 6 (índice 5)
            const rowData = {};
            
            // Mapear colunas conforme especificação
            const cellS = worksheet[XLSX.utils.encode_cell({r: row, c: 0})]; // A - S (ignorar)
            const cellCodigo = worksheet[XLSX.utils.encode_cell({r: row, c: 1})]; // B - Código
            const cellCriacao = worksheet[XLSX.utils.encode_cell({r: row, c: 2})]; // C - Criação
            const cellCriadoPor = worksheet[XLSX.utils.encode_cell({r: row, c: 3})]; // D - Criado Por
            const cellPlaneada = worksheet[XLSX.utils.encode_cell({r: row, c: 4})]; // E - Planeada
            const cellEstado = worksheet[XLSX.utils.encode_cell({r: row, c: 5})]; // F - Estado
            const cellCliente = worksheet[XLSX.utils.encode_cell({r: row, c: 6})]; // G - Cliente
            const cellClasse = worksheet[XLSX.utils.encode_cell({r: row, c: 7})]; // H - Classe
            const cellUnidade = worksheet[XLSX.utils.encode_cell({r: row, c: 8})]; // I - Unidade
            const cellMaterial = worksheet[XLSX.utils.encode_cell({r: row, c: 9})]; // J - Material
            const cellQtdPlan = worksheet[XLSX.utils.encode_cell({r: row, c: 10})]; // K - Qtd Plan
            const cellQtdEx = worksheet[XLSX.utils.encode_cell({r: row, c: 11})]; // L - Qtd Ex
            const cellUoM = worksheet[XLSX.utils.encode_cell({r: row, c: 12})]; // M - UoM
            const cellDep = worksheet[XLSX.utils.encode_cell({r: row, c: 13})]; // N - Dep
            const cellTipoReq = worksheet[XLSX.utils.encode_cell({r: row, c: 14})]; // O - Tipo Requisição
            const cellMotivo = worksheet[XLSX.utils.encode_cell({r: row, c: 15})]; // P - Motivo
            const cellObs = worksheet[XLSX.utils.encode_cell({r: row, c: 16})]; // Q - Observações
            
            // Se não há material, pular esta linha
            if (!cellMaterial || !cellMaterial.v) continue;
            
            const materialText = cellMaterial.v.toString();
            const productCode = extractProductCode(materialText);
            const productDescription = extractProductDescription(materialText);
            
            if (!productCode) continue;
            
            orders.push({
              id: `order_${row}`,
              rowNumber: row + 1,
              codigo: cellCodigo?.v || '',
              criacao: cellCriacao?.v || '',
              criadoPor: cellCriadoPor?.v || '',
              planeada: cellPlaneada?.v || '',
              estado: cellEstado?.v || '',
              cliente: cellCliente?.v || '',
              classe: cellClasse?.v || '',
              unidade: cellUnidade?.v || '',
              materialOriginal: materialText,
              productCode: productCode,
              productDescription: productDescription,
              qtdPlan: parseFloat(cellQtdPlan?.v || 0),
              qtdEx: cellQtdEx?.v || '',
              uom: cellUoM?.v || 'UN',
              dep: cellDep?.v || '',
              tipoRequisicao: cellTipoReq?.v || '',
              motivo: cellMotivo?.v || '',
              observacoes: cellObs?.v || ''
            });
          }
          
          setUploadProgress(90);
          setOrdersData(orders);
          setUploadProgress(100);
          
          setTimeout(() => {
            setIsUploading(false);
            setUploadProgress(0);
          }, 1000);
          
          resolve(orders);
        } catch (error) {
          setIsUploading(false);
          setUploadProgress(0);
          reject(error);
        }
      };
      reader.readAsArrayBuffer(file);
    });
  }, []);

  // Processar arquivo Excel de stock
  const processStockFile = useCallback((file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          setIsUploading(true);
          setUploadProgress(30);
          
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          
          setUploadProgress(60);
          
          // Converter para array, começando da linha 4 (índice 3)
          const range = XLSX.utils.decode_range(worksheet['!ref']);
          const stock = [];
          
          for (let row = 3; row <= range.e.r; row++) { // Começar da linha 4 (índice 3)
            // Mapear colunas conforme especificação
            const cellNum = worksheet[XLSX.utils.encode_cell({r: row, c: 0})]; // A - Nº
            const cellRefCruzada = worksheet[XLSX.utils.encode_cell({r: row, c: 1})]; // B - Nº Ref. Cruzada
            const cellDescricao = worksheet[XLSX.utils.encode_cell({r: row, c: 2})]; // C - Descrição
            const cellInventario = worksheet[XLSX.utils.encode_cell({r: row, c: 3})]; // D - Inventário
            const cellUnidadeMedida = worksheet[XLSX.utils.encode_cell({r: row, c: 4})]; // E - Unidade Medida Base
            const cellClasseArmazem = worksheet[XLSX.utils.encode_cell({r: row, c: 5})]; // F - Cód. Classe Armazém
            const cellCategoriaProduto = worksheet[XLSX.utils.encode_cell({r: row, c: 6})]; // G - Cód. Categoria Produto
            const cellUnidadeArrumacao = worksheet[XLSX.utils.encode_cell({r: row, c: 7})]; // H - Cód. Unid. Medida Arrumação
            
            // Se não há número do produto, pular esta linha
            if (!cellNum || !cellNum.v) continue;
            
            stock.push({
              id: `stock_${row}`,
              numero: cellNum.v.toString(),
              refCruzada: cellRefCruzada?.v || '',
              descricao: cellDescricao?.v || '',
              inventario: parseFloat(cellInventario?.v || 0),
              unidadeMedida: cellUnidadeMedida?.v || '',
              classeArmazem: cellClasseArmazem?.v || '',
              categoriaProduto: cellCategoriaProduto?.v || '',
              unidadeArrumacao: cellUnidadeArrumacao?.v || ''
            });
          }
          
          setUploadProgress(90);
          setStockData(stock);
          setUploadProgress(100);
          
          setTimeout(() => {
            setIsUploading(false);
            setUploadProgress(0);
          }, 1000);
          
          resolve(stock);
        } catch (error) {
          setIsUploading(false);
          setUploadProgress(0);
          reject(error);
        }
      };
      reader.readAsArrayBuffer(file);
    });
  }, []);

  // Processar dados e agrupar por produto e secção
  const processDataForPrint = useCallback(() => {
    if (ordersData.length === 0) return {};
    
    const groupedBySection = {};
    
    ordersData.forEach(order => {
      const section = order.unidade || 'Sem Secção';
      
      if (!groupedBySection[section]) {
        groupedBySection[section] = {};
      }
      
      const productCode = order.productCode;
      
      if (!groupedBySection[section][productCode]) {
        groupedBySection[section][productCode] = {
          productCode: productCode,
          productDescription: order.productDescription,
          totalQuantity: 0,
          uom: order.uom,
          orders: [],
          stockInfo: null
        };
        
        // Buscar informações de stock
        const stockItem = stockData.find(stock => stock.numero === productCode);
        if (stockItem) {
          groupedBySection[section][productCode].stockInfo = {
            location: stockItem.classeArmazem,
            quantity: stockItem.inventario
          };
        }
      }
      
      groupedBySection[section][productCode].totalQuantity += order.qtdPlan;
      groupedBySection[section][productCode].orders.push(order);
    });
    
    setProcessedOrders(groupedBySection);
    return groupedBySection;
  }, [ordersData, stockData]);

  // Executar processamento quando dados mudarem
  useEffect(() => {
    processDataForPrint();
  }, [processDataForPrint]);

  // Gerar arquivo Excel para impressão por secção
  const generatePrintFile = useCallback((sectionKey) => {
    const processed = processedOrders[sectionKey];
    if (!processed) return;
    
    const sectionName = formatSectionForDisplay(sectionKey);
    const currentDate = new Date().toLocaleDateString('pt-BR');
    
    // Criar workbook
    const wb = XLSX.utils.book_new();
    
    // Dados para o Excel
    const excelData = [];
    
    // Linha 1: Nome da secção e data
    excelData.push([`${sectionName} ${currentDate}`]);
    excelData.push([]); // Linha vazia
    
    // Linha 3: Cabeçalho
    excelData.push(['Codigo', 'Material', 'Qtd Plan.', 'Qtd Ex.', 'UoM', 'Dep', 'Fotostock']);
    
    // Dados dos produtos
    Object.values(processed).forEach(product => {
      excelData.push([
        product.productCode, // A - Código
        product.productDescription, // B - Material/Descrição
        product.totalQuantity, // C - Quantidade total planejada
        '', // D - Espaço para preenchimento manual (até 8 caracteres)
        product.uom, // E - Unidade de medida
        product.stockInfo?.location || '', // F - Local de armazenamento
        product.stockInfo?.quantity || 0 // G - Quantidade em stock
      ]);
    });
    
    // Criar worksheet
    const ws = XLSX.utils.aoa_to_sheet(excelData);
    
    // Adicionar worksheet ao workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Requisicoes');
    
    // Download do arquivo
    XLSX.writeFile(wb, `Requisicoes_${sectionKey}_${currentDate.replace(/\//g, '-')}.xlsx`);
  }, [processedOrders]);

  // Manipulador de upload de arquivos
  const handleFileUpload = useCallback(async (event, type) => {
    const file = event.target.files[0];
    if (!file) return;
    
    try {
      if (type === 'orders') {
        await processOrdersFile(file);
      } else if (type === 'stock') {
        await processStockFile(file);
      }
    } catch (error) {
      console.error(`Erro ao processar arquivo ${type}:`, error);
      alert(`Erro ao processar arquivo: ${error.message}`);
    }
    
    // Limpar o input
    event.target.value = '';
  }, [processOrdersFile, processStockFile]);

  // Dados filtrados para exibição
  const filteredOrders = useMemo(() => {
    return ordersData.filter(order => {
      if (filters.section !== 'todos' && order.unidade !== filters.section) return false;
      if (filters.client !== 'todos' && order.cliente !== filters.client) return false;
      if (filters.status !== 'todos' && order.estado !== filters.status) return false;
      if (filters.date && !order.criacao?.toString().includes(filters.date)) return false;
      return true;
    });
  }, [ordersData, filters]);

  // Estatísticas
  const stats = useMemo(() => {
    const totalOrders = filteredOrders.length;
    const uniqueProducts = new Set(filteredOrders.map(o => o.productCode)).size;
    const totalQuantity = filteredOrders.reduce((sum, o) => sum + o.qtdPlan, 0);
    const sections = new Set(filteredOrders.map(o => o.unidade)).size;
    
    return {
      totalOrders,
      uniqueProducts,
      totalQuantity,
      sections
    };
  }, [filteredOrders]);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Breadcrumbs */}
        <Breadcrumbs 
          items={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Gestão de Requisições', href: '/requisicoes' }
          ]} 
        />

        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestão de Requisições</h1>
            <p className="text-gray-600 mt-2">
              Processamento de arquivos Excel para gestão de requisições e geração de relatórios de impressão
            </p>
          </div>
          <Button
            onClick={() => setShowGuide(true)}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <Info className="w-4 h-4" />
            <span>Guia de Uso</span>
          </Button>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Requisições</p>
                <p className="text-2xl font-bold text-blue-600">{stats.totalOrders}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Produtos Únicos</p>
                <p className="text-2xl font-bold text-green-600">{stats.uniqueProducts}</p>
              </div>
              <Package className="w-8 h-8 text-green-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Quantidade Total</p>
                <p className="text-2xl font-bold text-purple-600">{stats.totalQuantity.toFixed(2)}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Secções</p>
                <p className="text-2xl font-bold text-orange-600">{stats.sections}</p>
              </div>
              <Users className="w-8 h-8 text-orange-600" />
            </div>
          </Card>
        </div>

        {/* Navegação por Abas */}
        <Card className="p-6">
          <div className="flex space-x-1 mb-6">
            {[
              { key: 'upload', label: 'Upload de Arquivos', icon: Upload },
              { key: 'orders', label: 'Requisições', icon: FileText },
              { key: 'print', label: 'Geração de Relatórios', icon: Download }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === tab.key
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Conteúdo das Abas */}
          {activeTab === 'upload' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Upload de Arquivos Excel</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Upload de Requisições */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <FileSpreadsheet className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Arquivo de Requisições
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Upload do arquivo Excel com as requisições (estrutura conforme guia)
                  </p>
                  <input
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={(e) => handleFileUpload(e, 'orders')}
                    className="hidden"
                    id="orders-upload"
                  />
                  <label
                    htmlFor="orders-upload"
                    className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Selecionar Arquivo
                  </label>
                  {ordersData.length > 0 && (
                    <div className="mt-3 flex items-center justify-center text-green-600">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      <span className="text-sm">{ordersData.length} requisições carregadas</span>
                    </div>
                  )}
                </div>

                {/* Upload de Stock */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Arquivo de Stock
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Upload do arquivo Excel com os dados de stock/inventário
                  </p>
                  <input
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={(e) => handleFileUpload(e, 'stock')}
                    className="hidden"
                    id="stock-upload"
                  />
                  <label
                    htmlFor="stock-upload"
                    className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                  >
                    Selecionar Arquivo
                  </label>
                  {stockData.length > 0 && (
                    <div className="mt-3 flex items-center justify-center text-green-600">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      <span className="text-sm">{stockData.length} produtos de stock carregados</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              {isUploading && (
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Requisições Carregadas</h2>
                <Button
                  onClick={processDataForPrint}
                  className="flex items-center space-x-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Reprocessar Dados</span>
                </Button>
              </div>

              {/* Filtros */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Secção</label>
                  <select
                    value={filters.section}
                    onChange={(e) => setFilters({...filters, section: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="todos">Todas as Secções</option>
                    {sectionOptions.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
                  <select
                    value={filters.client}
                    onChange={(e) => setFilters({...filters, client: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="todos">Todos os Clientes</option>
                    {clientOptions.filter(client => client.hasCode).map((client) => (
                      <option key={client.value} value={client.code}>{client.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters({...filters, status: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="todos">Todos os Estados</option>
                    <option value="aberta">Aberta</option>
                    <option value="fechada">Fechada</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
                  <input
                    type="date"
                    value={filters.date}
                    onChange={(e) => setFilters({...filters, date: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              {/* Lista de Requisições */}
              <div className="bg-white rounded-lg border">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Código Req.</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Produto</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Descrição</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Qtd Plan.</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">UoM</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Secção</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Cliente</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map((order, index) => (
                        <tr key={order.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-4 py-3 text-sm text-gray-900">{order.codigo}</td>
                          <td className="px-4 py-3 text-sm font-medium text-blue-600">{order.productCode}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{order.productDescription}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{order.qtdPlan}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{order.uom}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {formatSectionForDisplay(order.unidade) || order.unidade}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {formatClientForDisplay(order.cliente) || order.cliente}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              order.estado?.toLowerCase() === 'aberta' 
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {order.estado}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {filteredOrders.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    Nenhuma requisição encontrada
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'print' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Geração de Relatórios por Secção</h2>
              
              {Object.keys(processedOrders).length === 0 ? (
                <div className="text-center py-8">
                  <FileCheck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Nenhum dado processado
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Faça upload dos arquivos de requisições e stock para gerar relatórios
                  </p>
                  <Button onClick={() => setActiveTab('upload')}>
                    Ir para Upload
                  </Button>
                </div>
              ) : (
                <div className="grid gap-6">
                  {Object.entries(processedOrders).map(([sectionKey, products]) => (
                    <Card key={sectionKey} className="p-6">
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {formatSectionForDisplay(sectionKey)}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {Object.keys(products).length} produtos únicos
                          </p>
                        </div>
                        <Button
                          onClick={() => generatePrintFile(sectionKey)}
                          className="flex items-center space-x-2"
                        >
                          <Download className="w-4 h-4" />
                          <span>Gerar Excel</span>
                        </Button>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b border-gray-200">
                                <th className="text-left py-2">Código</th>
                                <th className="text-left py-2">Material</th>
                                <th className="text-left py-2">Qtd Plan.</th>
                                <th className="text-left py-2">UoM</th>
                                <th className="text-left py-2">Local</th>
                                <th className="text-left py-2">Stock</th>
                              </tr>
                            </thead>
                            <tbody>
                              {Object.values(products).map((product, index) => (
                                <tr key={index} className="border-b border-gray-100">
                                  <td className="py-2 font-medium text-blue-600">{product.productCode}</td>
                                  <td className="py-2">{product.productDescription}</td>
                                  <td className="py-2">{product.totalQuantity.toFixed(3)}</td>
                                  <td className="py-2">{product.uom}</td>
                                  <td className="py-2">{product.stockInfo?.location || '-'}</td>
                                  <td className="py-2">{product.stockInfo?.quantity || 0}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Modal do Guia */}
        <Modal
          isOpen={showGuide}
          onClose={() => setShowGuide(false)}
          title="Guia de Uso - Gestão de Requisições"
          size="lg"
        >
          <div className="space-y-6">
            {Object.entries(EXCEL_GUIDE).map(([key, guide]) => (
              <div key={key} className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900">{guide.title}</h3>
                <p className="text-gray-600">{guide.description}</p>
                
                {guide.structure && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Estrutura:</h4>
                    <ul className="space-y-1 text-sm text-gray-700">
                      {Object.entries(guide.structure).map(([structKey, structValue]) => {
                        if (typeof structValue === 'object') {
                          return (
                            <li key={structKey}>
                              <strong>{structKey}:</strong>
                              <ul className="ml-4 mt-1 space-y-1">
                                {Object.entries(structValue).map(([subKey, subValue]) => (
                                  <li key={subKey}><em>{subKey}:</em> {subValue}</li>
                                ))}
                              </ul>
                            </li>
                          );
                        }
                        return (
                          <li key={structKey}><strong>{structKey}:</strong> {structValue}</li>
                        );
                      })}
                    </ul>
                  </div>
                )}
                
                {guide.processing && (
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">Processamento:</h4>
                    <ul className="space-y-1 text-sm text-blue-800">
                      {Object.entries(guide.processing).map(([procKey, procValue]) => (
                        <li key={procKey}><strong>{procKey}:</strong> {procValue}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default RequisicoesManagementNew;
