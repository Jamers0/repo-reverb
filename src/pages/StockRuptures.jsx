import React, { useState, useEffect } from 'react';
import { AlertTriangle, Calendar, Package, Truck, CheckCircle, XCircle, Clock, Filter, Search } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Select from '../components/ui/Select';
import Input from '../components/ui/Input';
import Breadcrumbs from '../components/shared/Breadcrumbs';
import Modal from '../components/ui/Modal';
import FileUploadSection from '../components/ruptures/FileUploadSection';
import RupturesDashboard from '../components/ruptures/RupturesDashboard';
import RuptureAnalyzer from '../components/ruptures/RuptureAnalyzer';
import ExportTools from '../components/ruptures/ExportTools';

const StockRuptures = () => {
  const [currentStep, setCurrentStep] = useState('upload'); // 'upload', 'analysis', 'results'
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [analysisData, setAnalysisData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Filtros
  const [filters, setFilters] = useState({
    section: 'all',
    ruptureType: 'all',
    client: 'all',
    search: ''
  });
  
  // Modais
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedRupture, setSelectedRupture] = useState(null);

  const sectionOptions = [
    { value: 'all', label: 'Todas as Secções' },
    { value: 'CF', label: 'CF - Cozinha Fria' },
    { value: 'CQ', label: 'CQ - Cozinha Quente' },
    { value: 'PAS', label: 'PAS - Pastelaria' },
    { value: 'RCF', label: 'RCF - Refeitório Cozinha Fria' },
    { value: 'RCQ', label: 'RCQ - Refeitório Cozinha Quente' },
    { value: 'RPL', label: 'RPL - Refeitório' },
    { value: 'RP', label: 'RP - Rouparia' },
    { value: 'RPA', label: 'RPA - Refeitório Pastelaria' },
    { value: 'TSU', label: 'TSU - Tray Setup' },
    { value: 'WAP', label: 'WAP - Wash & Pack' },
    { value: 'CRC', label: 'CRC - Cargas Consumíveis' },
    { value: 'NHU', label: 'NHU - NHUB' },
    { value: 'OBR', label: 'OBR - Vending' },
    { value: 'OPS', label: 'OPS - Operações' },
    { value: 'COP', label: 'COP - Copa' },
    { value: 'CRG', label: 'CRG - Cargas' }
  ];

  const ruptureTypeOptions = [
    { value: 'all', label: 'Todos os Tipos' },
    { value: 'total', label: 'Ruptura Total' },
    { value: 'parcial', label: 'Ruptura Parcial' }
  ];

  // Processar análise de rupturas
  const rupturesAnalysis = RuptureAnalyzer({
    pedidos: uploadedFiles.pedidos,
    stockCT: uploadedFiles.stockCT,
    stockFF: uploadedFiles.stockFF,
    transito: uploadedFiles.transito
  });

  // Listener para iniciar análise
  useEffect(() => {
    const handleStartAnalysis = () => {
      if (uploadedFiles.pedidos && uploadedFiles.stockCT) {
        setLoading(true);
        setTimeout(() => {
          setAnalysisData(rupturesAnalysis);
          setFilteredData(rupturesAnalysis);
          setCurrentStep('results');
          setLoading(false);
        }, 2000);
      }
    };

    window.addEventListener('startRuptureAnalysis', handleStartAnalysis);
    return () => window.removeEventListener('startRuptureAnalysis', handleStartAnalysis);
  }, [uploadedFiles, rupturesAnalysis]);

  // Aplicar filtros
  useEffect(() => {
    if (!analysisData.length) return;

    let filtered = [...analysisData];

    if (filters.section !== 'all') {
      filtered = filtered.filter(item => item.secao === filters.section);
    }

    if (filters.ruptureType !== 'all') {
      filtered = filtered.filter(item => item.tipoRuptura === filters.ruptureType);
    }

    if (filters.client !== 'all') {
      filtered = filtered.filter(item => item.cliente === filters.client);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(item => 
        item.codigo.toLowerCase().includes(searchLower) ||
        item.descricao.toLowerCase().includes(searchLower) ||
        item.clienteNome.toLowerCase().includes(searchLower)
      );
    }

    setFilteredData(filtered);
  }, [filters, analysisData]);

  const handleFilesUploaded = (files) => {
    setUploadedFiles(files);
  };

  const handleDashboardCardClick = (type) => {
    switch (type) {
      case 'total':
        setFilters(prev => ({ ...prev, ruptureType: 'total' }));
        break;
      case 'parcial':
        setFilters(prev => ({ ...prev, ruptureType: 'parcial' }));
        break;
      default:
        setFilters(prev => ({ ...prev, ruptureType: 'all' }));
    }
  };

  const handleRuptureAction = async (rupture, action) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const updatedData = analysisData.map(item => 
      item.id === rupture.id 
        ? { ...item, acaoTomada: action }
        : item
    );
    
    setAnalysisData(updatedData);
    setLoading(false);
    setShowAnalysisModal(false);
    
    const actionTexts = {
      'solicitado_secundario': 'Solicitado do Estoque Secundário',
      'compra_solicitada': 'Compra Externa Solicitada',
      'resolvido': 'Ruptura Resolvida'
    };
    
    alert(`Ação "${actionTexts[action]}" aplicada para ${rupture.codigo}`);
  };

  const getRuptureColor = (tipo) => {
    switch (tipo) {
      case 'total': return 'text-red-600 bg-red-100';
      case 'parcial': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getActionColor = (acao) => {
    switch (acao) {
      case 'pendente': return 'text-gray-600 bg-gray-100';
      case 'solicitado_secundario': return 'text-blue-600 bg-blue-100';
      case 'compra_solicitada': return 'text-purple-600 bg-purple-100';
      case 'resolvido': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getActionText = (acao) => {
    switch (acao) {
      case 'pendente': return 'Pendente';
      case 'solicitado_secundario': return 'Solicitado Secundário';
      case 'compra_solicitada': return 'Compra Solicitada';
      case 'resolvido': return 'Resolvido';
      default: return acao;
    }
  };

  // Obter opções de clientes dos dados
  const clientOptions = [
    { value: 'all', label: 'Todos os Clientes' },
    ...Array.from(new Set(analysisData.map(item => item.cliente)))
      .map(cliente => {
        const clienteData = analysisData.find(item => item.cliente === cliente);
        return { value: cliente, label: clienteData?.clienteNome || cliente };
      })
  ];

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[
        { label: 'Início', path: '/' }, 
        { label: 'Rupturas de Stock' }
      ]} />

      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Análise de Rupturas de Stock</h1>
          <p className="text-sm sm:text-base text-gray-600">
            Sistema avançado de análise combinada de estoques e detecção de rupturas
          </p>
        </div>
        
        {currentStep === 'results' && (
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Button 
              variant="outline"
              icon={<Filter className="w-4 h-4" />}
              onClick={() => setShowFilterModal(true)}
            >
              Filtros
            </Button>
            <ExportTools data={filteredData} filename="rupturas_stock_kibiona" />
            <Button 
              variant="outline"
              onClick={() => {
                setCurrentStep('upload');
                setAnalysisData([]);
                setFilteredData([]);
                setUploadedFiles({});
              }}
            >
              Nova Análise
            </Button>
          </div>
        )}
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center space-x-4 py-4">
        <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${
          currentStep === 'upload' ? 'bg-blue-100 text-blue-700' : 
          analysisData.length > 0 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
        }`}>
          <div className={`w-2 h-2 rounded-full ${
            currentStep === 'upload' ? 'bg-blue-600' : 
            analysisData.length > 0 ? 'bg-green-600' : 'bg-gray-400'
          }`} />
          <span className="text-sm font-medium">1. Upload de Arquivos</span>
        </div>
        
        <div className={`w-8 h-px ${analysisData.length > 0 ? 'bg-green-400' : 'bg-gray-300'}`} />
        
        <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${
          currentStep === 'results' ? 'bg-blue-100 text-blue-700' : 
          analysisData.length > 0 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
        }`}>
          <div className={`w-2 h-2 rounded-full ${
            currentStep === 'results' ? 'bg-blue-600' : 
            analysisData.length > 0 ? 'bg-green-600' : 'bg-gray-400'
          }`} />
          <span className="text-sm font-medium">2. Análise e Resultados</span>
        </div>
      </div>

      {loading && (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Processando Análise de Rupturas</h3>
          <p className="text-gray-600">
            Combinando estoques CT + FF + Trânsito e identificando rupturas...
          </p>
        </div>
      )}

      {/* Upload Section */}
      {currentStep === 'upload' && !loading && (
        <FileUploadSection onFilesUploaded={handleFilesUploaded} />
      )}

      {/* Results Section */}
      {currentStep === 'results' && !loading && (
        <div className="space-y-6">
          <RupturesDashboard 
            data={filteredData} 
            onCardClick={handleDashboardCardClick}
          />

          {/* Search Bar */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Buscar por código, descrição ou cliente..."
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Select
                  value={filters.section}
                  onChange={(e) => setFilters(prev => ({ ...prev, section: e.target.value }))}
                  options={sectionOptions}
                  className="w-48"
                />
                <Select
                  value={filters.ruptureType}
                  onChange={(e) => setFilters(prev => ({ ...prev, ruptureType: e.target.value }))}
                  options={ruptureTypeOptions}
                  className="w-40"
                />
              </div>
            </div>
          </div>

          {/* Results Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Rupturas Identificadas</h3>
                <p className="text-sm text-gray-600">
                  {filteredData.length} rupturas encontradas de {analysisData.length} total
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">
                  Fórmula: Total Disponível = Stock CT + Stock FF + TR
                </p>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Produto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Secção/Cliente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Planejado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock CT
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock FF
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trânsito
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Disp.
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ruptura
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredData.map((rupture) => (
                    <tr key={rupture.id} className={`hover:bg-gray-50 ${
                      rupture.tipoRuptura === 'total' ? 'bg-red-50' : 
                      rupture.tipoRuptura === 'parcial' ? 'bg-yellow-50' : ''
                    }`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{rupture.codigo}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">{rupture.descricao}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{rupture.secao}</div>
                          <div className="text-sm text-gray-500">{rupture.clienteNome}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {rupture.quantidadePlanejada} {rupture.unidade}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {rupture.stockCT}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {rupture.stockFF}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {rupture.transito}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {rupture.totalDisponivel}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">
                        -{rupture.quantidadeRuptura}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRuptureColor(rupture.tipoRuptura)}`}>
                          {rupture.tipoRuptura === 'total' ? 'Total' : 'Parcial'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getActionColor(rupture.acaoTomada)}`}>
                          {getActionText(rupture.acaoTomada)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Button 
                          size="xs" 
                          onClick={() => {
                            setSelectedRupture(rupture);
                            setShowAnalysisModal(true);
                          }}
                        >
                          Analisar
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredData.length === 0 && (
              <div className="p-8 text-center">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Nenhuma ruptura encontrada com os filtros aplicados</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal de Análise Detalhada */}
      <Modal
        isOpen={showAnalysisModal}
        onClose={() => setShowAnalysisModal(false)}
        title={`Análise Detalhada - ${selectedRupture?.codigo}`}
        size="lg"
      >
        {selectedRupture && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Informações do Produto</h4>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <p><strong>Código:</strong> {selectedRupture.codigo}</p>
                  <p><strong>Descrição:</strong> {selectedRupture.descricao}</p>
                  <p><strong>Secção:</strong> {selectedRupture.secao}</p>
                  <p><strong>Cliente:</strong> {selectedRupture.clienteNome}</p>
                  <p><strong>Documento:</strong> {selectedRupture.documento}</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Análise de Estoque</h4>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <p><strong>Quantidade Planejada:</strong> {selectedRupture.quantidadePlanejada} {selectedRupture.unidade}</p>
                  <div className="border-t pt-2 mt-2">
                    <p><strong>Stock CT:</strong> {selectedRupture.stockCT}</p>
                    <p><strong>Stock FF:</strong> {selectedRupture.stockFF}</p>
                    <p><strong>Em Trânsito:</strong> {selectedRupture.transito}</p>
                    <div className="border-t pt-2 mt-2">
                      <p><strong>Total Disponível:</strong> <span className="font-semibold">{selectedRupture.totalDisponivel}</span></p>
                      <p><strong>Ruptura:</strong> <span className="text-red-600 font-semibold">-{selectedRupture.quantidadeRuptura} {selectedRupture.unidade}</span></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Detalhes da Ruptura</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p><strong>Tipo:</strong> 
                      <span className={`ml-2 px-2 py-1 rounded text-xs ${getRuptureColor(selectedRupture.tipoRuptura)}`}>
                        {selectedRupture.tipoRuptura === 'total' ? 'Ruptura Total' : 'Ruptura Parcial'}
                      </span>
                    </p>
                    <p className="mt-2"><strong>Comentários:</strong> {selectedRupture.comentarios}</p>
                  </div>
                  <div>
                    <p><strong>Data da Análise:</strong> {new Date(selectedRupture.dataAnalise).toLocaleString('pt-PT')}</p>
                    <p><strong>Operador:</strong> {selectedRupture.operador}</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Ações Disponíveis</h4>
              <div className="grid grid-cols-1 gap-3">
                {selectedRupture.stockFF > 0 && (
                  <Button 
                    className="justify-start" 
                    variant="success"
                    icon={<Truck className="w-4 h-4" />}
                    onClick={() => handleRuptureAction(selectedRupture, 'solicitado_secundario')}
                  >
                    Solicitar do Estoque Secundário (FF: {selectedRupture.stockFF} disponíveis)
                  </Button>
                )}
                
                <Button 
                  className="justify-start" 
                  variant="warning"
                  icon={<Package className="w-4 h-4" />}
                  onClick={() => handleRuptureAction(selectedRupture, 'compra_solicitada')}
                >
                  Solicitar Compra Externa
                </Button>
                
                <Button 
                  className="justify-start" 
                  variant="outline"
                  icon={<CheckCircle className="w-4 h-4" />}
                  onClick={() => handleRuptureAction(selectedRupture, 'resolvido')}
                >
                  Marcar como Resolvido
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal de Filtros */}
      <Modal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        title="Filtros Avançados"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Secção</label>
            <Select
              value={filters.section}
              onChange={(e) => setFilters(prev => ({ ...prev, section: e.target.value }))}
              options={sectionOptions}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Ruptura</label>
            <Select
              value={filters.ruptureType}
              onChange={(e) => setFilters(prev => ({ ...prev, ruptureType: e.target.value }))}
              options={ruptureTypeOptions}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cliente</label>
            <Select
              value={filters.client}
              onChange={(e) => setFilters(prev => ({ ...prev, client: e.target.value }))}
              options={clientOptions}
            />
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button 
              variant="outline" 
              onClick={() => {
                setFilters({ section: 'all', ruptureType: 'all', client: 'all', search: '' });
                setShowFilterModal(false);
              }}
              className="flex-1"
            >
              Limpar Filtros
            </Button>
            <Button 
              onClick={() => setShowFilterModal(false)}
              className="flex-1"
            >
              Aplicar Filtros
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default StockRuptures;