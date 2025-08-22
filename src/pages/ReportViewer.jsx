import React, { useState } from 'react';
import { Search, Filter, Download, Calendar } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Breadcrumbs from '../components/shared/Breadcrumbs';
import Modal from '../components/ui/Modal';

const ReportViewer = () => {
  const [filters, setFilters] = useState({
    area: '',
    relatorio: '',
    materiais: '',
    cliente: '',
    classe: '',
    unidade: '',
    deposito: '',
    dataInicio: '',
    dataFim: ''
  });
  
  const [showFilters, setShowFilters] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showRequisitionForm, setShowRequisitionForm] = useState(false);

  const areaOptions = [
    { value: 'compras', label: 'Compras' },
    { value: 'estoque', label: 'Estoque' },
    { value: 'producao', label: 'Produção' },
  ];

  const relatorioOptions = [
    { value: 'materiais_disponveis', label: 'Materiais Disponíveis' },
    { value: 'necessidades_compra', label: 'Necessidades de Compra' },
    { value: 'movimentacao_estoque', label: 'Movimentação de Estoque' },
  ];

  const clienteOptions = [
    { value: '0000000001', label: '0000000001 - Supplier Principal' },
    { value: '0000000002', label: '0000000002 - Fornecedor Secundário' },
  ];

  const classeOptions = [
    { value: 'Y', label: 'Y - Classe Y' },
    { value: 'X', label: 'X - Classe X' },
    { value: 'Z', label: 'Z - Classe Z' },
  ];

  const unidadeOptions = [
    { value: 'KG', label: 'KG - Quilograma' },
    { value: 'UN', label: 'UN - Unidade' },
    { value: 'LT', label: 'LT - Litro' },
  ];

  const depositoOptions = [
    { value: 'DEP001', label: 'DEP001 - Depósito Principal' },
    { value: 'DEP002', label: 'DEP002 - Depósito Secundário' },
  ];

  const mockResults = [
    { id: 1, material: 'CFBA0001', descricao: 'Banana 4/6', estoque: 150, unidade: 'KG' },
    { id: 2, material: 'CFBA0002', descricao: 'Maçã Golden', estoque: 85, unidade: 'KG' },
    { id: 3, material: 'CFBA0003', descricao: 'Laranja Valencia', estoque: 230, unidade: 'KG' },
  ];

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearch = async () => {
    setIsSearching(true);
    // Simular busca
    await new Promise(resolve => setTimeout(resolve, 1500));
    setSearchResults(mockResults);
    setIsSearching(false);
  };

  const handleCreateRequisition = () => {
    setShowRequisitionForm(true);
  };

  const handleExportReport = () => {
    // Simular exportação
    alert('Relatório exportado com sucesso!');
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[
        { label: 'Início', path: '/' }, 
        { label: 'Report Viewer (SRP002)' }
      ]} />
      
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Report Viewer</h1>
          <p className="text-gray-600">Gere relatórios e crie requisições</p>
        </div>
        
        <div className="flex space-x-3">
          <Button 
            onClick={() => setShowFilters(!showFilters)}
            icon={<Filter size={16} />}
            variant="secondary"
          >
            {showFilters ? 'Ocultar' : 'Mostrar'} Filtros
          </Button>
          {searchResults.length > 0 && (
            <Button 
              onClick={handleExportReport}
              icon={<Download size={16} />}
              variant="secondary"
            >
              Exportar
            </Button>
          )}
        </div>
      </div>

      {/* Filtros Principais */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Select
            label="Área"
            value={filters.area}
            onChange={(e) => handleFilterChange('area', e.target.value)}
            options={areaOptions}
          />
          <Select
            label="Relatório"
            value={filters.relatorio}
            onChange={(e) => handleFilterChange('relatorio', e.target.value)}
            options={relatorioOptions}
          />
          <Input
            label="Materiais"
            placeholder="Digite código ou nome..."
            value={filters.materiais}
            onChange={(e) => handleFilterChange('materiais', e.target.value)}
          />
          <div className="flex items-end">
            <Button 
              onClick={handleSearch}
              icon={<Search size={16} />}
              disabled={!filters.area || !filters.relatorio}
              className="w-full"
            >
              {isSearching ? 'Pesquisando...' : 'Pesquisar'}
            </Button>
          </div>
        </div>
      </div>

      {/* Filtros Avançados */}
      {showFilters && (
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-medium mb-4">Filtros Avançados</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Select
              label="Cliente"
              value={filters.cliente}
              onChange={(e) => handleFilterChange('cliente', e.target.value)}
              options={clienteOptions}
            />
            <Select
              label="Classe"
              value={filters.classe}
              onChange={(e) => handleFilterChange('classe', e.target.value)}
              options={classeOptions}
            />
            <Select
              label="Unidade"
              value={filters.unidade}
              onChange={(e) => handleFilterChange('unidade', e.target.value)}
              options={unidadeOptions}
            />
            <Select
              label="Depósito"
              value={filters.deposito}
              onChange={(e) => handleFilterChange('deposito', e.target.value)}
              options={depositoOptions}
            />
            <Input
              label="Data Início"
              type="date"
              value={filters.dataInicio}
              onChange={(e) => handleFilterChange('dataInicio', e.target.value)}
            />
            <Input
              label="Data Fim"
              type="date"
              value={filters.dataFim}
              onChange={(e) => handleFilterChange('dataFim', e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Resultados */}
      {searchResults.length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Resultados da Pesquisa</h3>
              <Button 
                onClick={handleCreateRequisition}
                variant="secondary"
              >
                Criar Requisição
              </Button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Material
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descrição
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estoque
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unidade
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {searchResults.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.material}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.descricao}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.estoque}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.unidade}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {isSearching && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pw-green mx-auto"></div>
          <p className="text-gray-500 mt-4">Pesquisando...</p>
        </div>
      )}

      {/* Modal de Criação de Requisição */}
      <Modal
        isOpen={showRequisitionForm}
        onClose={() => setShowRequisitionForm(false)}
        title="Criar Nova Requisição"
        size="lg"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Preencha os dados para criar uma nova requisição baseada nos resultados da pesquisa.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Cliente"
              options={clienteOptions}
            />
            <Select
              label="Classe"
              options={classeOptions}
            />
            <Select
              label="Unidade"
              options={unidadeOptions}
            />
            <Select
              label="Depósito"
              options={depositoOptions}
            />
            <Input
              label="Data de Necessidade"
              type="date"
            />
            <Input
              label="Prioridade"
              placeholder="Normal"
            />
          </div>
          
          <div className="border-t pt-4">
            <h4 className="font-medium mb-2">Materiais Selecionados:</h4>
            <div className="max-h-32 overflow-y-auto">
              {searchResults.map(item => (
                <div key={item.id} className="flex justify-between items-center py-1 text-sm">
                  <span>{item.material} - {item.descricao}</span>
                  <span className="text-gray-500">{item.estoque} {item.unidade}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button 
              variant="secondary" 
              onClick={() => setShowRequisitionForm(false)}
            >
              Cancelar
            </Button>
            <Button onClick={() => {
              setShowRequisitionForm(false);
              alert('Requisição criada com sucesso!');
            }}>
              Criar Requisição
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ReportViewer;
