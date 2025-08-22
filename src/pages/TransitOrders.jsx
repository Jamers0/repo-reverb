import React, { useState } from 'react';
import { 
  Truck, 
  Calendar, 
  MapPin, 
  Package, 
  Clock,
  AlertCircle,
  CheckCircle,
  Eye,
  Download,
  Filter,
  Search
} from 'lucide-react';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';

const TransitOrders = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Dados mockados dos pedidos em trânsito
  const transitOrders = [
    {
      id: 'PED-2024-001',
      solicitante: 'CF - Cozinha Fria',
      departamento: 'Congelados C1',
      dataEnvio: '2024-01-15',
      dataPrevisao: '2024-01-17',
      status: 'Em Trânsito',
      transportadora: 'TransLog Express',
      numeroRastreio: 'TL240115001',
      valorTotal: 1250.50,
      artigos: [
        { codigo: 'ART001', descricao: 'Salmão Congelado 2kg', quantidade: 25, unidade: 'UN' },
        { codigo: 'ART002', descricao: 'Camarão Descascado 1kg', quantidade: 15, unidade: 'UN' },
        { codigo: 'ART003', descricao: 'Polvo Congelado 500g', quantidade: 30, unidade: 'UN' }
      ],
      observacoes: 'Pedido urgente para reposição de stock crítico'
    },
    {
      id: 'PED-2024-002',
      solicitante: 'CQ - Cozinha Quente',
      departamento: 'Refrigerados R2',
      dataEnvio: '2024-01-16',
      dataPrevisao: '2024-01-18',
      status: 'Processando',
      transportadora: 'CargoFast',
      numeroRastreio: 'CF240116002',
      valorTotal: 850.75,
      artigos: [
        { codigo: 'ART004', descricao: 'Queijo Mozarela 200g', quantidade: 50, unidade: 'UN' },
        { codigo: 'ART005', descricao: 'Presunto Fatiado 100g', quantidade: 40, unidade: 'UN' }
      ],
      observacoes: 'Entrega programada para manhã'
    },
    {
      id: 'PED-2024-003',
      solicitante: 'PAS - Pastelaria',
      departamento: 'Praça P1',
      dataEnvio: '2024-01-14',
      dataPrevisao: '2024-01-16',
      status: 'Atrasado',
      transportadora: 'QuickDelivery',
      numeroRastreio: 'QD240114003',
      valorTotal: 645.25,
      artigos: [
        { codigo: 'ART006', descricao: 'Farinha Tipo 65 1kg', quantidade: 20, unidade: 'UN' },
        { codigo: 'ART007', descricao: 'Açúcar Refinado 1kg', quantidade: 15, unidade: 'UN' },
        { codigo: 'ART008', descricao: 'Ovos Frescos (dúzia)', quantidade: 30, unidade: 'DZ' }
      ],
      observacoes: 'ATENÇÃO: Pedido com atraso de 1 dia'
    }
  ];

  const sections = [
    { value: '', label: 'Todas as Secções' },
    { value: 'CF', label: 'CF - Cozinha Fria' },
    { value: 'CQ', label: 'CQ - Cozinha Quente' },
    { value: 'PAS', label: 'PAS - Pastelaria' },
    { value: 'BAR', label: 'BAR - Bar/Bebidas' }
  ];

  const statusOptions = [
    { value: '', label: 'Todos os Status' },
    { value: 'Processando', label: 'Processando' },
    { value: 'Em Trânsito', label: 'Em Trânsito' },
    { value: 'Atrasado', label: 'Atrasado' },
    { value: 'Entregue', label: 'Entregue' }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Processando':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'Em Trânsito':
        return <Truck className="w-4 h-4 text-yellow-500" />;
      case 'Atrasado':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'Entregue':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <Package className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Processando':
        return 'bg-blue-100 text-blue-800';
      case 'Em Trânsito':
        return 'bg-yellow-100 text-yellow-800';
      case 'Atrasado':
        return 'bg-red-100 text-red-800';
      case 'Entregue':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredOrders = transitOrders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.solicitante.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.numeroRastreio.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSection = !selectedSection || order.solicitante.includes(selectedSection);
    const matchesStatus = !selectedStatus || order.status === selectedStatus;
    
    return matchesSearch && matchesSection && matchesStatus;
  });

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  const handleTrackOrder = (rastreio) => {
    // Simular abertura de página de rastreamento
    alert(`Redirecionando para rastreamento: ${rastreio}`);
  };

  const handleMarkAsReceived = (orderId) => {
    alert(`Pedido ${orderId} marcado como recebido`);
  };

  const exportToExcel = () => {
    alert('Exportando dados para Excel...');
  };

  const calculateDaysUntilDelivery = (dataPrevisao) => {
    const today = new Date();
    const deliveryDate = new Date(dataPrevisao);
    const diffTime = deliveryDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pedidos em Trânsito</h1>
          <p className="text-gray-600">Acompanhamento de pedidos do estoque secundário</p>
        </div>
        <Button onClick={exportToExcel} className="flex items-center space-x-2">
          <Download className="w-4 h-4" />
          <span>Exportar Excel</span>
        </Button>
      </div>

      {/* Estatísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <Clock className="w-5 h-5 text-blue-400 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-blue-800">Processando</h3>
              <p className="text-2xl font-bold text-blue-600">
                {transitOrders.filter(o => o.status === 'Processando').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <Truck className="w-5 h-5 text-yellow-400 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-yellow-800">Em Trânsito</h3>
              <p className="text-2xl font-bold text-yellow-600">
                {transitOrders.filter(o => o.status === 'Em Trânsito').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-400 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Atrasados</h3>
              <p className="text-2xl font-bold text-red-600">
                {transitOrders.filter(o => o.status === 'Atrasado').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Pesquisar por ID, secção ou rastreio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            options={sections}
          />
          <Select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            options={statusOptions}
          />
          <Button variant="outline" className="flex items-center space-x-2">
            <Filter className="w-4 h-4" />
            <span>Filtros Avançados</span>
          </Button>
        </div>
      </div>

      {/* Lista de Pedidos */}
      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pedido
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Solicitante
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Previsão Entrega
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => {
                const daysUntilDelivery = calculateDaysUntilDelivery(order.dataPrevisao);
                return (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{order.id}</div>
                        <div className="text-sm text-gray-500">#{order.numeroRastreio}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{order.solicitante}</div>
                        <div className="text-sm text-gray-500">{order.departamento}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(order.status)}
                        <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm text-gray-900">{order.dataPrevisao}</div>
                        <div className={`text-sm ${daysUntilDelivery < 0 ? 'text-red-600' : daysUntilDelivery === 0 ? 'text-yellow-600' : 'text-gray-500'}`}>
                          {daysUntilDelivery < 0 ? `${Math.abs(daysUntilDelivery)} dias atrasado` :
                           daysUntilDelivery === 0 ? 'Hoje' :
                           `${daysUntilDelivery} dias`}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(order)}
                        className="flex items-center space-x-1"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Ver</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTrackOrder(order.numeroRastreio)}
                        className="flex items-center space-x-1"
                      >
                        <MapPin className="w-3 h-3" />
                        <span>Rastrear</span>
                      </Button>
                      {order.status === 'Em Trânsito' && (
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => handleMarkAsReceived(order.id)}
                          className="flex items-center space-x-1"
                        >
                          <CheckCircle className="w-3 h-3" />
                          <span>Recebido</span>
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Detalhes */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title={`Detalhes do Pedido ${selectedOrder?.id}`}
      >
        {selectedOrder && (
          <div className="space-y-6">
            {/* Informações Gerais */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Informações do Pedido</h4>
                <div className="space-y-1 text-sm">
                  <p><span className="text-gray-600">ID:</span> {selectedOrder.id}</p>
                  <p><span className="text-gray-600">Solicitante:</span> {selectedOrder.solicitante}</p>
                  <p><span className="text-gray-600">Departamento:</span> {selectedOrder.departamento}</p>
                  <p><span className="text-gray-600">Data Envio:</span> {selectedOrder.dataEnvio}</p>
                  <p><span className="text-gray-600">Previsão:</span> {selectedOrder.dataPrevisao}</p>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Transporte</h4>
                <div className="space-y-1 text-sm">
                  <p><span className="text-gray-600">Transportadora:</span> {selectedOrder.transportadora}</p>
                  <p><span className="text-gray-600">Nº Rastreio:</span> {selectedOrder.numeroRastreio}</p>
                  <p><span className="text-gray-600">Status:</span> 
                    <span className={`ml-1 px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedOrder.status)}`}>
                      {selectedOrder.status}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Artigos */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Artigos do Pedido</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Código</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Descrição</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Quantidade</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Unidade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {selectedOrder.artigos.map((artigo, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 text-sm text-gray-900">{artigo.codigo}</td>
                        <td className="px-4 py-2 text-sm text-gray-900">{artigo.descricao}</td>
                        <td className="px-4 py-2 text-sm text-gray-900">{artigo.quantidade}</td>
                        <td className="px-4 py-2 text-sm text-gray-900">{artigo.unidade}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Observações */}
            {selectedOrder.observacoes && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Observações</h4>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                  {selectedOrder.observacoes}
                </p>
              </div>
            )}

            {/* Ações */}
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowDetailsModal(false)}>
                Fechar
              </Button>
              <Button onClick={() => handleTrackOrder(selectedOrder.numeroRastreio)}>
                Rastrear Pedido
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default TransitOrders;
