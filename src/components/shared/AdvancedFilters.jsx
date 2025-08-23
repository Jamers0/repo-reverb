import React, { useState, useEffect } from 'react';
import { Search, Filter, Calendar, Save, FolderOpen, X, ChevronDown, Plus } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Modal from '../ui/Modal';
import { useData } from '../../contexts/DataContext';

const AdvancedFilters = ({ onFiltersChange, data = [] }) => {
  const { filters, setFilters, savedViews, saveView, loadView } = useData();
  const [isOpen, setIsOpen] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showLoadModal, setShowLoadModal] = useState(false);
  const [viewName, setViewName] = useState('');
  const [customFilters, setCustomFilters] = useState([]);
  const [tempFilters, setTempFilters] = useState(filters);

  // Available filter options
  const filterOptions = {
    section: {
      label: 'Secção',
      options: [
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
      ]
    },
    ruptureType: {
      label: 'Tipo de Ruptura',
      options: [
        { value: 'all', label: 'Todos os Tipos' },
        { value: 'total', label: 'Ruptura Total' },
        { value: 'parcial', label: 'Ruptura Parcial' }
      ]
    },
    priority: {
      label: 'Prioridade',
      options: [
        { value: 'all', label: 'Todas as Prioridades' },
        { value: 'critica', label: 'Crítica' },
        { value: 'alta', label: 'Alta' },
        { value: 'media', label: 'Média' },
        { value: 'baixa', label: 'Baixa' }
      ]
    },
    status: {
      label: 'Status',
      options: [
        { value: 'all', label: 'Todos os Status' },
        { value: 'pendente', label: 'Pendente' },
        { value: 'em_andamento', label: 'Em Andamento' },
        { value: 'resolvido', label: 'Resolvido' },
        { value: 'cancelado', label: 'Cancelado' }
      ]
    },
    client: {
      label: 'Cliente',
      options: [
        { value: 'all', label: 'Todos os Clientes' },
        ...getUniqueValues(data, 'cliente').map(client => ({
          value: client,
          label: client
        }))
      ]
    },
    dateRange: {
      label: 'Período',
      options: [
        { value: 'all', label: 'Todos os Períodos' },
        { value: 'today', label: 'Hoje' },
        { value: 'yesterday', label: 'Ontem' },
        { value: 'week', label: 'Esta Semana' },
        { value: 'month', label: 'Este Mês' },
        { value: 'quarter', label: 'Este Trimestre' },
        { value: 'custom', label: 'Período Customizado' }
      ]
    }
  };

  // Update temp filters when main filters change
  useEffect(() => {
    setTempFilters(filters);
  }, [filters]);

  // Apply filters
  const applyFilters = () => {
    setFilters(tempFilters);
    setIsOpen(false);
    if (onFiltersChange) {
      onFiltersChange(tempFilters);
    }
  };

  // Reset filters
  const resetFilters = () => {
    const defaultFilters = {
      section: 'all',
      ruptureType: 'all',
      client: 'all',
      priority: 'all',
      status: 'all',
      dateRange: 'all',
      search: '',
      customFilters: {}
    };
    setTempFilters(defaultFilters);
    setCustomFilters([]);
  };

  // Handle filter change
  const handleFilterChange = (key, value) => {
    setTempFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Add custom filter
  const addCustomFilter = () => {
    const newFilter = {
      id: Date.now().toString(),
      field: '',
      operator: 'equals',
      value: ''
    };
    setCustomFilters(prev => [...prev, newFilter]);
  };

  // Update custom filter
  const updateCustomFilter = (id, key, value) => {
    setCustomFilters(prev => 
      prev.map(filter => 
        filter.id === id ? { ...filter, [key]: value } : filter
      )
    );
  };

  // Remove custom filter
  const removeCustomFilter = (id) => {
    setCustomFilters(prev => prev.filter(filter => filter.id !== id));
  };

  // Save view
  const handleSaveView = () => {
    if (!viewName.trim()) return;
    
    saveView(viewName, {
      filters: tempFilters,
      customFilters,
      createdBy: 'user',
      description: `Vista personalizada criada em ${new Date().toLocaleDateString()}`
    });
    
    setShowSaveModal(false);
    setViewName('');
  };

  // Load view
  const handleLoadView = (viewId) => {
    const view = savedViews.find(v => v.id === viewId);
    if (view) {
      setTempFilters(view.filters);
      setCustomFilters(view.config?.customFilters || []);
      loadView(viewId);
      setShowLoadModal(false);
    }
  };

  // Get active filters count
  const getActiveFiltersCount = () => {
    let count = 0;
    Object.entries(filters).forEach(([key, value]) => {
      if (key !== 'search' && key !== 'customFilters' && value !== 'all' && value !== '') {
        count++;
      }
    });
    if (filters.search) count++;
    count += Object.keys(filters.customFilters || {}).length;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <div className="mb-6">
      {/* Quick Search and Filter Toggle */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Buscar por código, descrição, cliente..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filtros Avançados
            {activeFiltersCount > 0 && (
              <span className="bg-pw-green text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </Button>

          {savedViews.length > 0 && (
            <Button
              variant="outline"
              onClick={() => setShowLoadModal(true)}
              className="flex items-center gap-2"
            >
              <FolderOpen className="w-4 h-4" />
              Vistas Salvas
            </Button>
          )}
        </div>
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-2">
        <Select
          value={filters.section}
          onChange={(value) => handleFilterChange('section', value)}
          options={filterOptions.section.options}
          placeholder="Secção"
          className="min-w-[150px]"
        />
        
        <Select
          value={filters.ruptureType}
          onChange={(value) => handleFilterChange('ruptureType', value)}
          options={filterOptions.ruptureType.options}
          placeholder="Tipo"
          className="min-w-[120px]"
        />
        
        <Select
          value={filters.priority}
          onChange={(value) => handleFilterChange('priority', value)}
          options={filterOptions.priority.options}
          placeholder="Prioridade"
          className="min-w-[120px]"
        />

        <Select
          value={filters.dateRange}
          onChange={(value) => handleFilterChange('dateRange', value)}
          options={filterOptions.dateRange.options}
          placeholder="Período"
          className="min-w-[120px]"
        />

        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-4 h-4 mr-1" />
            Limpar
          </Button>
        )}
      </div>

      {/* Advanced Filters Modal */}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Filtros Avançados"
        size="lg"
      >
        <div className="space-y-6">
          {/* Standard Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(filterOptions).map(([key, config]) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {config.label}
                </label>
                <Select
                  value={tempFilters[key]}
                  onChange={(value) => handleFilterChange(key, value)}
                  options={config.options}
                  placeholder={`Selecionar ${config.label}`}
                />
              </div>
            ))}
          </div>

          {/* Custom Date Range */}
          {tempFilters.dateRange === 'custom' && (
            <div className="border rounded-lg p-4 bg-gray-50">
              <h4 className="font-medium mb-3">Período Customizado</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data Inicial
                  </label>
                  <Input
                    type="date"
                    value={tempFilters.startDate || ''}
                    onChange={(e) => handleFilterChange('startDate', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data Final
                  </label>
                  <Input
                    type="date"
                    value={tempFilters.endDate || ''}
                    onChange={(e) => handleFilterChange('endDate', e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Custom Filters */}
          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium">Filtros Personalizados</h4>
              <Button
                variant="outline"
                size="sm"
                onClick={addCustomFilter}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Adicionar Filtro
              </Button>
            </div>

            {customFilters.map((filter, index) => (
              <div key={filter.id} className="flex gap-2 mb-3">
                <Select
                  value={filter.field}
                  onChange={(value) => updateCustomFilter(filter.id, 'field', value)}
                  options={[
                    { value: 'codigo', label: 'Código' },
                    { value: 'descricao', label: 'Descrição' },
                    { value: 'quantidade', label: 'Quantidade' },
                    { value: 'cliente', label: 'Cliente' },
                    { value: 'fornecedor', label: 'Fornecedor' },
                    { value: 'semana', label: 'Semana' }
                  ]}
                  placeholder="Campo"
                  className="min-w-[120px]"
                />
                
                <Select
                  value={filter.operator}
                  onChange={(value) => updateCustomFilter(filter.id, 'operator', value)}
                  options={[
                    { value: 'equals', label: 'Igual a' },
                    { value: 'contains', label: 'Contém' },
                    { value: 'starts', label: 'Inicia com' },
                    { value: 'ends', label: 'Termina com' },
                    { value: 'greater', label: 'Maior que' },
                    { value: 'less', label: 'Menor que' },
                    { value: 'between', label: 'Entre' }
                  ]}
                  placeholder="Operador"
                  className="min-w-[120px]"
                />
                
                <Input
                  value={filter.value}
                  onChange={(e) => updateCustomFilter(filter.id, 'value', e.target.value)}
                  placeholder="Valor"
                  className="flex-1"
                />
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeCustomFilter(filter.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowSaveModal(true)}
                className="flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Salvar Vista
              </Button>
            </div>

            <div className="flex gap-2">
              <Button
                variant="ghost"
                onClick={resetFilters}
              >
                Limpar Tudo
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                Cancelar
              </Button>
              <Button onClick={applyFilters}>
                Aplicar Filtros
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Save View Modal */}
      <Modal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        title="Salvar Vista Personalizada"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome da Vista
            </label>
            <Input
              value={viewName}
              onChange={(e) => setViewName(e.target.value)}
              placeholder="Digite um nome para esta vista..."
              autoFocus
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setShowSaveModal(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSaveView}
              disabled={!viewName.trim()}
            >
              Salvar
            </Button>
          </div>
        </div>
      </Modal>

      {/* Load View Modal */}
      <Modal
        isOpen={showLoadModal}
        onClose={() => setShowLoadModal(false)}
        title="Carregar Vista Salva"
      >
        <div className="space-y-3">
          {savedViews.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              Nenhuma vista salva encontrada
            </p>
          ) : (
            savedViews.map((view) => (
              <div
                key={view.id}
                className="border rounded-lg p-3 hover:bg-gray-50 cursor-pointer"
                onClick={() => handleLoadView(view.id)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{view.name}</h4>
                    <p className="text-sm text-gray-500">
                      {view.config?.description || 'Vista personalizada'}
                    </p>
                    <p className="text-xs text-gray-400">
                      Criada em {new Date(view.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400 rotate-[-90deg]" />
                </div>
              </div>
            ))
          )}
        </div>
      </Modal>
    </div>
  );
};

// Helper function to get unique values from data
const getUniqueValues = (data, field) => {
  if (!data || !Array.isArray(data)) return [];
  
  const values = data
    .map(item => item[field])
    .filter(value => value && value !== '')
    .filter((value, index, self) => self.indexOf(value) === index);
  
  return values.sort();
};

export default AdvancedFilters;
