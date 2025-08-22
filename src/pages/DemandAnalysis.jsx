import React, { useState, useEffect } from 'react';
import { Calendar, TrendingUp, AlertTriangle, Package, Truck, Clock } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Select from '../components/ui/Select';
import Breadcrumbs from '../components/shared/Breadcrumbs';

const DemandAnalysis = () => {
  const [selectedDays, setSelectedDays] = useState(5);
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [demandData, setDemandData] = useState([]);
  const [loading, setLoading] = useState(false);

  const departmentOptions = [
    { value: 'all', label: 'Todos os Departamentos' },
    { value: 'C1', label: 'Congelados - C1' },
    { value: 'C2', label: 'Congelados - C2' },
    { value: 'C3', label: 'Congelados - C3' },
    { value: 'C4', label: 'Congelados - C4' },
    { value: 'P', label: 'Praça' },
    { value: 'R', label: 'Refrigerados' },
    { value: 'R4', label: 'Refrigerados - R4' },
    { value: 'S', label: 'Secos' },
    { value: 'DRG_AG', label: 'Consumíveis - DRG_AG' },
    { value: 'DRG_LIMP', label: 'Consumíveis - DRG_LIMP' },
    { value: 'FARDAMENTO', label: 'Consumíveis - Fardamento' },
    { value: 'DRG_COPA', label: 'Consumíveis - DRG_COPA' },
    { value: 'ECONOMATO', label: 'Consumíveis - Economato' },
  ];

  const daysOptions = [
    { value: 3, label: '3 dias' },
    { value: 5, label: '5 dias' },
    { value: 7, label: '7 dias' },
  ];

  // Mock data para demonstração
  const mockDemandData = [
    {
      id: 1,
      artigo: 'CFBA0001',
      descricao: 'Banana 4/6',
      departamento: 'P',
      estoquePrincipal: 150,
      estoqueSecundario: 300,
      demandaDiaria: [25, 30, 28, 35, 22, 40, 30],
      necessidadeTotal: 210,
      status: 'ok',
      diasDisponiveis: 6,
      accaoRequerida: 'nenhuma'
    },
    {
      id: 2,
      artigo: 'CFBA0002',
      descricao: 'Maçã Golden',
      departamento: 'P',
      estoquePrincipal: 45,
      estoqueSecundario: 100,
      demandaDiaria: [20, 25, 22, 30, 18, 25, 20],
      necessidadeTotal: 140,
      status: 'atencao',
      diasDisponiveis: 2,
      accaoRequerida: 'solicitar_secundario'
    },
    {
      id: 3,
      artigo: 'CFBA0003',
      descricao: 'Leite Integral 1L',
      departamento: 'R',
      estoquePrincipal: 12,
      estoqueSecundario: 0,
      demandaDiaria: [15, 18, 20, 15, 22, 18, 15],
      necessidadeTotal: 123,
      status: 'critico',
      diasDisponiveis: 0,
      accaoRequerida: 'comprar'
    }
  ];

  useEffect(() => {
    loadDemandAnalysis();
  }, [selectedDays, selectedDepartment]);

  const loadDemandAnalysis = async () => {
    setLoading(true);
    // Simular carregamento
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    let filteredData = mockDemandData;
    if (selectedDepartment !== 'all') {
      filteredData = mockDemandData.filter(item => item.departamento === selectedDepartment);
    }
    
    setDemandData(filteredData);
    setLoading(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ok': return 'text-green-600 bg-green-100';
      case 'atencao': return 'text-yellow-600 bg-yellow-100';
      case 'critico': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ok': return <Package className="w-4 h-4" />;
      case 'atencao': return <AlertTriangle className="w-4 h-4" />;
      case 'critico': return <AlertTriangle className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const getActionText = (action) => {
    switch (action) {
      case 'nenhuma': return 'Nenhuma ação necessária';
      case 'solicitar_secundario': return 'Solicitar do estoque secundário';
      case 'comprar': return 'Necessário comprar';
      default: return action;
    }
  };

  const totalItems = demandData.length;
  const itemsOk = demandData.filter(item => item.status === 'ok').length;
  const itemsAtencao = demandData.filter(item => item.status === 'atencao').length;
  const itemsCriticos = demandData.filter(item => item.status === 'critico').length;

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[
        { label: 'Início', path: '/' }, 
        { label: 'Análise de Demanda' }
      ]} />

      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Análise de Demanda</h1>
          <p className="text-sm sm:text-base text-gray-600">Previsão de necessidades para os próximos {selectedDays} dias</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <Select
            value={selectedDays}
            onChange={(e) => setSelectedDays(Number(e.target.value))}
            options={daysOptions}
            className="w-full sm:w-32"
          />
          <Select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            options={departmentOptions}
            className="w-full sm:w-64"
          />
          <Button onClick={loadDemandAnalysis} loading={loading} className="w-full sm:w-auto">
            <span className="hidden sm:inline">Atualizar Análise</span>
            <span className="sm:hidden">Atualizar</span>
          </Button>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card onClick={() => {}} className="hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{totalItems}</p>
              <p className="text-xs sm:text-sm text-gray-600">Total de Artigos</p>
            </div>
          </div>
        </Card>

        <Card onClick={() => {}} className="hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Package className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold text-green-600">{itemsOk}</p>
              <p className="text-xs sm:text-sm text-gray-600">Estoque OK</p>
            </div>
          </div>
        </Card>

        <Card onClick={() => {}} className="hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold text-yellow-600">{itemsAtencao}</p>
              <p className="text-xs sm:text-sm text-gray-600">Requer Atenção</p>
            </div>
          </div>
        </Card>

        <Card onClick={() => {}} className="hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold text-red-600">{itemsCriticos}</p>
              <p className="text-xs sm:text-sm text-gray-600">Críticos</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabela de Análise */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
          <h3 className="text-base sm:text-lg font-medium text-gray-900">Análise Detalhada</h3>
        </div>
        
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pw-green mx-auto"></div>
            <p className="text-gray-500 mt-4">Calculando demanda...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Artigo
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                    Dept.
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Estoque Principal
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    Estoque Secundário
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Demanda {selectedDays}d
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                    Dias Disponíveis
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    Ação Requerida
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {demandData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-xs sm:text-sm font-medium text-gray-900">{item.artigo}</div>
                        <div className="text-xs text-gray-500 truncate max-w-32 sm:max-w-full">{item.descricao}</div>
                        <div className="text-xs text-gray-500 sm:hidden">Dept: {item.departamento}</div>
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900 hidden sm:table-cell">
                      {item.departamento}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900 hidden md:table-cell">
                      {item.estoquePrincipal}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900 hidden lg:table-cell">
                      {item.estoqueSecundario}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                      <div className="font-medium">{item.necessidadeTotal}</div>
                      <div className="text-xs text-gray-500 md:hidden">Est: {item.estoquePrincipal}</div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-gray-400" />
                        <span className="text-xs sm:text-sm text-gray-900">{item.diasDisponiveis}</span>
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                        {getStatusIcon(item.status)}
                        <span className="ml-1 capitalize hidden sm:inline">{item.status}</span>
                      </span>
                      <div className="text-xs text-gray-500 mt-1 sm:hidden">
                        {item.diasDisponiveis}d
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900 hidden lg:table-cell">
                      {getActionText(item.accaoRequerida)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Ações em Massa */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
        <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-4">Ações Rápidas</h3>
        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3">
          <Button 
            variant="warning" 
            icon={<Truck className="w-4 h-4" />}
            onClick={() => alert('Solicitando itens em atenção do estoque secundário...')}
            className="w-full sm:w-auto"
          >
            <span className="hidden sm:inline">Solicitar Itens em Atenção</span>
            <span className="sm:hidden">Solicitar Atenção</span>
          </Button>
          <Button 
            variant="danger" 
            icon={<AlertTriangle className="w-4 h-4" />}
            onClick={() => alert('Criando pedidos de compra para itens críticos...')}
            className="w-full sm:w-auto"
          >
            <span className="hidden sm:inline">Comprar Itens Críticos</span>
            <span className="sm:hidden">Comprar Críticos</span>
          </Button>
          <Button 
            variant="outline" 
            icon={<TrendingUp className="w-4 h-4" />}
            onClick={() => alert('Exportando relatório de demanda...')}
            className="w-full sm:w-auto"
          >
            Exportar Relatório
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DemandAnalysis;
