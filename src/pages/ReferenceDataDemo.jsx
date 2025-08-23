import React, { useState } from 'react';
import { useReferenceData } from '../contexts/ReferenceDataContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { 
  Users, 
  Building2, 
  Package, 
  Search,
  Filter,
  Eye,
  MapPin,
  Truck
} from 'lucide-react';

const ReferenceDataDemo = () => {
  const {
    sections,
    departments,
    clients,
    sectionOptions,
    departmentOptions,
    clientOptions,
    sectionCategories,
    departmentCategories,
    formatSectionForDisplay,
    formatDepartmentForDisplay,
    formatClientForDisplay,
    getMainAirlines,
    getProductionSections,
    getStorageDepartments,
    getConsumableDepartments,
    getSectionsByCategory,
    getDepartmentsByMainCategory,
    getClientsWithCode,
    getClientsWithoutCode
  } = useReferenceData();

  const [activeTab, setActiveTab] = useState('sections');
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrar dados baseado na categoria e termo de busca
  const getFilteredData = () => {
    switch (activeTab) {
      case 'sections':
        let filteredSections = selectedCategory === 'todos' 
          ? Object.values(sections)
          : getSectionsByCategory(selectedCategory);
        
        if (searchTerm) {
          filteredSections = filteredSections.filter(section =>
            section.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            section.code.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        return filteredSections;

      case 'departments':
        let filteredDepts = selectedCategory === 'todos'
          ? Object.values(departments)
          : getDepartmentsByMainCategory(selectedCategory);
        
        if (searchTerm) {
          filteredDepts = filteredDepts.filter(dept =>
            dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            dept.code.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        return filteredDepts;

      case 'clients':
        let filteredClients = selectedCategory === 'todos'
          ? Object.values(clients)
          : selectedCategory === 'com_codigo'
          ? getClientsWithCode()
          : getClientsWithoutCode();
        
        if (searchTerm) {
          filteredClients = filteredClients.filter(client =>
            client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (client.code && client.code.toLowerCase().includes(searchTerm.toLowerCase())) ||
            client.number.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        return filteredClients;

      default:
        return [];
    }
  };

  const getCategoryOptions = () => {
    switch (activeTab) {
      case 'sections':
        return [
          { value: 'todos', label: 'Todas as Categorias' },
          ...sectionCategories.map(cat => ({ value: cat, label: cat }))
        ];
      case 'departments':
        return [
          { value: 'todos', label: 'Todas as Categorias' },
          ...departmentCategories.map(cat => ({ value: cat, label: cat }))
        ];
      case 'clients':
        return [
          { value: 'todos', label: 'Todos os Clientes' },
          { value: 'com_codigo', label: 'Com Código' },
          { value: 'sem_codigo', label: 'Sem Código' }
        ];
      default:
        return [];
    }
  };

  const getStatsCards = () => {
    const data = getFilteredData();
    const totalCount = data.length;
    
    switch (activeTab) {
      case 'sections':
        const categoriesCount = [...new Set(data.map(s => s.category))].length;
        return [
          { title: 'Total de Secções', value: totalCount, icon: Building2, color: 'blue' },
          { title: 'Categorias', value: categoriesCount, icon: Filter, color: 'green' }
        ];
      case 'departments':
        const mainCategoriesCount = [...new Set(data.map(d => d.mainCategory))].length;
        return [
          { title: 'Total de Departamentos', value: totalCount, icon: Package, color: 'purple' },
          { title: 'Categorias Principais', value: mainCategoriesCount, icon: Filter, color: 'orange' }
        ];
      case 'clients':
        const withCodeCount = data.filter(c => c.hasCode).length;
        return [
          { title: 'Total de Clientes', value: totalCount, icon: Users, color: 'indigo' },
          { title: 'Com Código', value: withCodeCount, icon: Eye, color: 'green' }
        ];
      default:
        return [];
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Sistema de Dados de Referência
          </h1>
          <p className="text-gray-600">
            Demonstração dos dados centralizados de clientes, secções e departamentos
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {getStatsCards().map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className={`text-2xl font-bold text-${stat.color}-600`}>{stat.value}</p>
                  </div>
                  <Icon className={`w-8 h-8 text-${stat.color}-600`} />
                </div>
              </Card>
            );
          })}
        </div>

        {/* Navegação e Filtros */}
        <Card className="p-6">
          {/* Abas */}
          <div className="flex space-x-1 mb-6">
            {[
              { key: 'sections', label: 'Secções', icon: Building2 },
              { key: 'departments', label: 'Departamentos', icon: Package },
              { key: 'clients', label: 'Clientes', icon: Users }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => {
                    setActiveTab(tab.key);
                    setSelectedCategory('todos');
                    setSearchTerm('');
                  }}
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

          {/* Filtros */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                {getCategoryOptions().map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por código ou nome..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>

          {/* Lista de Dados */}
          <div className="bg-white rounded-lg border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Código</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Nome</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Categoria</th>
                    {activeTab === 'clients' && (
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Número</th>
                    )}
                    {activeTab === 'departments' && (
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Descrição</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {getFilteredData().map((item, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-4 py-3 text-sm font-medium text-blue-600">
                        {item.code || item.number}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{item.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                          {item.category || item.mainCategory || (item.hasCode ? 'Com Código' : 'Sem Código')}
                        </span>
                      </td>
                      {activeTab === 'clients' && (
                        <td className="px-4 py-3 text-sm text-gray-600">{item.number}</td>
                      )}
                      {activeTab === 'departments' && (
                        <td className="px-4 py-3 text-sm text-gray-600">{item.description}</td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {getFilteredData().length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Nenhum resultado encontrado
              </div>
            )}
          </div>
        </Card>

        {/* Seção de Exemplos de Uso */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Exemplos de Uso</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-800">Funções de Formatação</h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div>
                  <strong>Secção CF:</strong> {formatSectionForDisplay('CF')}
                </div>
                <div>
                  <strong>Departamento C1:</strong> {formatDepartmentForDisplay('C1')}
                </div>
                <div>
                  <strong>Cliente AC:</strong> {formatClientForDisplay('AC')}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-800">Filtros Especializados</h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div>
                  <strong>Principais Companhias Aéreas:</strong> {getMainAirlines().length} clientes
                </div>
                <div>
                  <strong>Secções de Produção:</strong> {getProductionSections().length} secções
                </div>
                <div>
                  <strong>Departamentos de Armazenamento:</strong> {getStorageDepartments().length} departamentos
                </div>
                <div>
                  <strong>Departamentos de Consumíveis:</strong> {getConsumableDepartments().length} departamentos
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ReferenceDataDemo;
