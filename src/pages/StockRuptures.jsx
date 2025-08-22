import React, { useState, useEffect } from 'react';
import { AlertTriangle, Calendar, Package, Truck, CheckCircle, XCircle, Clock } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Select from '../components/ui/Select';
import Input from '../components/ui/Input';
import Breadcrumbs from '../components/shared/Breadcrumbs';
import Modal from '../components/ui/Modal';

const StockRuptures = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSection, setSelectedSection] = useState('all');
  const [ruptureType, setRuptureType] = useState('all');
  const [rupturesData, setRupturesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
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
    { value: 'CRG', label: 'CRG - Cargas' },
  ];

  const ruptureTypeOptions = [
    { value: 'all', label: 'Todos os Tipos' },
    { value: 'total', label: 'Ruptura Total' },
    { value: 'parcial', label: 'Ruptura Parcial' },
    { value: 'pre_picking', label: 'Pré-Picking' },
    { value: 'pos_picking', label: 'Pós-Picking' },
  ];

  // Mock data para demonstração
  const mockRupturesData = [
    {
      id: 1,
      artigo: 'CFBA0001',
      descricao: 'Banana 4/6',
      secao: 'CF',
      cliente: 'C000001',
      clienteNome: 'Air Canada',
      quantidadeSolicitada: 50,
      quantidadeDisponivel: 20,
      quantidadeRuptura: 30,
      tipoRuptura: 'parcial',
      fase: 'pre_picking',
      estoqueSecundario: 100,
      acaoTomada: 'pendente',
      observacoes: 'Cliente prioritário',
      dataHora: '2025-08-19 08:30',
      operador: 'João Silva'
    },
    {
      id: 2,
      artigo: 'CFBA0002',
      descricao: 'Maçã Golden',
      secao: 'CQ',
      cliente: 'C000029',
      clienteNome: 'TAP Portugal',
      quantidadeSolicitada: 80,
      quantidadeDisponivel: 0,
      quantidadeRuptura: 80,
      tipoRuptura: 'total',
      fase: 'pos_picking',
      estoqueSecundario: 0,
      acaoTomada: 'compra_solicitada',
      observacoes: 'Urgente - voo hoje',
      dataHora: '2025-08-19 09:15',
      operador: 'Maria Santos'
    },
    {
      id: 3,
      artigo: 'CFBA0003',
      descricao: 'Leite Integral 1L',
      secao: 'PAS',
      cliente: 'C000006',
      clienteNome: 'British Airways',
      quantidadeSolicitada: 25,
      quantidadeDisponivel: 15,
      quantidadeRuptura: 10,
      tipoRuptura: 'parcial',
      fase: 'pre_picking',
      estoqueSecundario: 50,
      acaoTomada: 'solicitado_secundario',
      observacoes: '',
      dataHora: '2025-08-19 10:00',
      operador: 'Carlos Ferreira'
    }
  ];

  useEffect(() => {
    loadRuptures();
  }, [selectedDate, selectedSection, ruptureType]);

  const loadRuptures = async () => {
    setLoading(true);
    // Simular carregamento
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    let filteredData = mockRupturesData;
    
    if (selectedSection !== 'all') {
      filteredData = filteredData.filter(item => item.secao === selectedSection);
    }
    
    if (ruptureType !== 'all') {
      if (ruptureType === 'pre_picking' || ruptureType === 'pos_picking') {
        filteredData = filteredData.filter(item => item.fase === ruptureType);
      } else {
        filteredData = filteredData.filter(item => item.tipoRuptura === ruptureType);
      }
    }
    
    setRupturesData(filteredData);
    setLoading(false);
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

  const handleRuptureAction = async (rupture, action) => {
    // Simular ação
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const updatedRuptures = rupturesData.map(item => 
      item.id === rupture.id 
        ? { ...item, acaoTomada: action }
        : item
    );
    
    setRupturesData(updatedRuptures);
    setLoading(false);
    setShowAnalysisModal(false);
    
    const actionText = getActionText(action);
    alert(`Ação "${actionText}" aplicada para ${rupture.artigo}`);
  };

  const totalRuptures = rupturesData.length;
  const rupturesTotal = rupturesData.filter(item => item.tipoRuptura === 'total').length;
  const rupturesParcial = rupturesData.filter(item => item.tipoRuptura === 'parcial').length;
  const rupturesPendentes = rupturesData.filter(item => item.acaoTomada === 'pendente').length;

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[
        { label: 'Início', path: '/' }, 
        { label: 'Rupturas de Stock' }
      ]} />

      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Rupturas de Stock</h1>
          <p className="text-sm sm:text-base text-gray-600">Análise de rupturas diárias - pré e pós picking</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full sm:w-auto"
          />
          <Select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            options={sectionOptions}
            className="w-full sm:w-48"
          />
          <Select
            value={ruptureType}
            onChange={(e) => setRuptureType(e.target.value)}
            options={ruptureTypeOptions}
            className="w-full sm:w-48"
          />
          <Button onClick={loadRuptures} loading={loading} className="w-full sm:w-auto">
            <span className="hidden sm:inline">Atualizar Dados</span>
            <span className="sm:hidden">Atualizar</span>
          </Button>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card onClick={() => {}}>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalRuptures}</p>
              <p className="text-sm text-gray-600">Total Rupturas</p>
            </div>
          </div>
        </Card>

        <Card onClick={() => {}}>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">{rupturesTotal}</p>
              <p className="text-sm text-gray-600">Rupturas Totais</p>
            </div>
          </div>
        </Card>

        <Card onClick={() => {}}>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-600">{rupturesParcial}</p>
              <p className="text-sm text-gray-600">Rupturas Parciais</p>
            </div>
          </div>
        </Card>

        <Card onClick={() => {}}>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Clock className="w-6 h-6 text-gray-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-600">{rupturesPendentes}</p>
              <p className="text-sm text-gray-600">Pendentes</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabela de Rupturas */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Rupturas Identificadas</h3>
        </div>
        
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pw-green mx-auto"></div>
            <p className="text-gray-500 mt-4">Carregando rupturas...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Artigo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Secção/Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Solicitado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Disponível
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ruptura
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Est. Secundário
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
                {rupturesData.map((rupture) => (
                  <tr key={rupture.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{rupture.artigo}</div>
                        <div className="text-sm text-gray-500">{rupture.descricao}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{rupture.secao}</div>
                        <div className="text-sm text-gray-500">{rupture.clienteNome}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {rupture.quantidadeSolicitada}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {rupture.quantidadeDisponivel}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">
                      {rupture.quantidadeRuptura}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRuptureColor(rupture.tipoRuptura)}`}>
                        {rupture.tipoRuptura === 'total' ? 'Total' : 'Parcial'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {rupture.estoqueSecundario}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getActionColor(rupture.acaoTomada)}`}>
                        {getActionText(rupture.acaoTomada)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
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
        )}
      </div>

      {/* Modal de Análise */}
      <Modal
        isOpen={showAnalysisModal}
        onClose={() => setShowAnalysisModal(false)}
        title={`Análise de Ruptura - ${selectedRupture?.artigo}`}
        size="lg"
      >
        {selectedRupture && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Informações do Artigo</h4>
                <div className="bg-gray-50 p-3 rounded">
                  <p><strong>Código:</strong> {selectedRupture.artigo}</p>
                  <p><strong>Descrição:</strong> {selectedRupture.descricao}</p>
                  <p><strong>Secção:</strong> {selectedRupture.secao}</p>
                  <p><strong>Cliente:</strong> {selectedRupture.clienteNome}</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Quantidades</h4>
                <div className="bg-gray-50 p-3 rounded">
                  <p><strong>Solicitado:</strong> {selectedRupture.quantidadeSolicitada}</p>
                  <p><strong>Disponível:</strong> {selectedRupture.quantidadeDisponivel}</p>
                  <p><strong>Ruptura:</strong> <span className="text-red-600 font-medium">{selectedRupture.quantidadeRuptura}</span></p>
                  <p><strong>Estoque Secundário:</strong> {selectedRupture.estoqueSecundario}</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Detalhes da Ruptura</h4>
              <div className="bg-gray-50 p-3 rounded">
                <p><strong>Tipo:</strong> {selectedRupture.tipoRuptura === 'total' ? 'Ruptura Total' : 'Ruptura Parcial'}</p>
                <p><strong>Fase:</strong> {selectedRupture.fase === 'pre_picking' ? 'Pré-Picking' : 'Pós-Picking'}</p>
                <p><strong>Operador:</strong> {selectedRupture.operador}</p>
                <p><strong>Data/Hora:</strong> {selectedRupture.dataHora}</p>
                {selectedRupture.observacoes && (
                  <p><strong>Observações:</strong> {selectedRupture.observacoes}</p>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Ações Disponíveis</h4>
              <div className="space-y-2">
                {selectedRupture.estoqueSecundario > 0 && (
                  <Button 
                    className="w-full justify-start" 
                    variant="success"
                    icon={<Truck className="w-4 h-4" />}
                    onClick={() => handleRuptureAction(selectedRupture, 'solicitado_secundario')}
                  >
                    Solicitar do Estoque Secundário ({selectedRupture.estoqueSecundario} disponíveis)
                  </Button>
                )}
                
                <Button 
                  className="w-full justify-start" 
                  variant="warning"
                  icon={<Package className="w-4 h-4" />}
                  onClick={() => handleRuptureAction(selectedRupture, 'compra_solicitada')}
                >
                  Solicitar Compra ao Setor de Compras
                </Button>
                
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  icon={<CheckCircle className="w-4 h-4" />}
                  onClick={() => handleRuptureAction(selectedRupture, 'resolvido')}
                >
                  Marcar como Resolvido
                </Button>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button 
                variant="secondary" 
                onClick={() => setShowAnalysisModal(false)}
              >
                Fechar
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Ações em Massa */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Ações em Massa</h3>
        <div className="flex flex-wrap gap-3">
          <Button 
            variant="success" 
            icon={<Truck className="w-4 h-4" />}
            onClick={() => alert('Solicitando todos os itens com estoque secundário...')}
          >
            Solicitar Itens com Estoque Secundário
          </Button>
          <Button 
            variant="warning" 
            icon={<Package className="w-4 h-4" />}
            onClick={() => alert('Enviando lista para compras...')}
          >
            Enviar Lista para Compras
          </Button>
          <Button 
            variant="outline" 
            onClick={() => alert('Exportando relatório de rupturas...')}
          >
            Exportar Relatório
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StockRuptures;
