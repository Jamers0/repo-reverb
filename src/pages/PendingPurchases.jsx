import React, { useState } from 'react';
import { 
  Package, 
  Calendar, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  Eye,
  Download,
  Filter,
  Search,
  Phone,
  Mail,
  FileText
} from 'lucide-react';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';

const PendingPurchases = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

  // Dados mockados das compras pendentes
  const pendingPurchases = [
    {
      id: 'COMP-2024-001',
      fornecedor: 'FreshMarket Lda',
      departamento: 'Congelados C1',
      dataCompra: '2024-01-10',
      dataPrevisao: '2024-01-18',
      status: 'Confirmada',
      prioridade: 'Alta',
      valorTotal: 2850.75,
      contacto: {
        telefone: '+351 21 123 4567',
        email: 'vendas@freshmarket.pt',
        responsavel: 'João Silva'
      },
      artigos: [
        { codigo: 'FC001', descricao: 'Salmão Norueguês 2kg', quantidade: 50, precoUnitario: 28.50, total: 1425.00 },
        { codigo: 'FC002', descricao: 'Bacalhau do Atlântico 1kg', quantidade: 35, precoUnitario: 22.75, total: 796.25 },
        { codigo: 'FC003', descricao: 'Camarão Tigre 500g', quantidade: 25, precoUnitario: 25.50, total: 637.50 }
      ],
      observacoes: 'Entrega confirmada para manhã de 18/01. Produto de alta rotação.',
      numeroEncomenda: 'ENC-2024-0045',
      diasAtraso: 0
    },
    {
      id: 'COMP-2024-002',
      fornecedor: 'Lacticínios Central',
      departamento: 'Refrigerados R2',
      dataCompra: '2024-01-08',
      dataPrevisao: '2024-01-16',
      status: 'Atrasada',
      prioridade: 'Crítica',
      valorTotal: 1240.30,
      contacto: {
        telefone: '+351 22 987 6543',
        email: 'encomendas@lacticinios.pt',
        responsavel: 'Maria Santos'
      },
      artigos: [
        { codigo: 'LAC001', descricao: 'Leite Pasteurizado 1L', quantidade: 100, precoUnitario: 0.85, total: 85.00 },
        { codigo: 'LAC002', descricao: 'Queijo Mozarela 200g', quantidade: 80, precoUnitario: 3.25, total: 260.00 },
        { codigo: 'LAC003', descricao: 'Iogurte Natural 125g', quantidade: 150, precoUnitario: 0.45, total: 67.50 },
        { codigo: 'LAC004', descricao: 'Manteiga Extra 250g', quantidade: 60, precoUnitario: 4.55, total: 273.00 },
        { codigo: 'LAC005', descricao: 'Natas Culinária 200ml', quantidade: 120, precoUnitario: 0.75, total: 90.00 }
      ],
      observacoes: 'ATENÇÃO: Compra atrasada em 2 dias. Fornecedor reporta problemas logísticos.',
      numeroEncomenda: 'ENC-2024-0042',
      diasAtraso: 2
    },
    {
      id: 'COMP-2024-003',
      fornecedor: 'Padaria Moderna',
      departamento: 'Praça P1',
      dataCompra: '2024-01-12',
      dataPrevisao: '2024-01-19',
      status: 'Processando',
      prioridade: 'Média',
      valorTotal: 680.50,
      contacto: {
        telefone: '+351 21 555 7890',
        email: 'comercial@padariamoderna.pt',
        responsavel: 'Carlos Pereira'
      },
      artigos: [
        { codigo: 'PAD001', descricao: 'Pão de Forma Integral', quantidade: 40, precoUnitario: 1.25, total: 50.00 },
        { codigo: 'PAD002', descricao: 'Croissant Congelado', quantidade: 200, precoUnitario: 0.35, total: 70.00 },
        { codigo: 'PAD003', descricao: 'Massa Folhada 500g', quantidade: 25, precoUnitario: 4.50, total: 112.50 }
      ],
      observacoes: 'Encomenda regular mensal. Entrega dentro do prazo previsto.',
      numeroEncomenda: 'ENC-2024-0048',
      diasAtraso: 0
    }
  ];

  const departments = [
    { value: '', label: 'Todos os Departamentos' },
    { value: 'Congelados C1', label: 'Congelados C1' },
    { value: 'Congelados C2', label: 'Congelados C2' },
    { value: 'Refrigerados R1', label: 'Refrigerados R1' },
    { value: 'Refrigerados R2', label: 'Refrigerados R2' },
    { value: 'Praça P1', label: 'Praça P1' },
    { value: 'Praça P2', label: 'Praça P2' }
  ];

  const statusOptions = [
    { value: '', label: 'Todos os Status' },
    { value: 'Processando', label: 'Processando' },
    { value: 'Confirmada', label: 'Confirmada' },
    { value: 'Atrasada', label: 'Atrasada' },
    { value: 'Cancelada', label: 'Cancelada' }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Processando':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'Confirmada':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'Atrasada':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'Cancelada':
        return <Package className="w-4 h-4 text-gray-500" />;
      default:
        return <Package className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Processando':
        return 'bg-blue-100 text-blue-800';
      case 'Confirmada':
        return 'bg-green-100 text-green-800';
      case 'Atrasada':
        return 'bg-red-100 text-red-800';
      case 'Cancelada':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (prioridade) => {
    switch (prioridade) {
      case 'Crítica':
        return 'bg-red-500 text-white';
      case 'Alta':
        return 'bg-orange-500 text-white';
      case 'Média':
        return 'bg-yellow-500 text-black';
      case 'Baixa':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const filteredPurchases = pendingPurchases.filter(purchase => {
    const matchesSearch = purchase.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         purchase.fornecedor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         purchase.numeroEncomenda.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = !selectedDepartment || purchase.departamento === selectedDepartment;
    const matchesStatus = !selectedStatus || purchase.status === selectedStatus;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const handleViewDetails = (purchase) => {
    setSelectedPurchase(purchase);
    setShowDetailsModal(true);
  };

  const handleContactSupplier = (purchase) => {
    setSelectedPurchase(purchase);
    setShowContactModal(true);
  };

  const handleMarkAsReceived = (purchaseId) => {
    alert(`Compra ${purchaseId} marcada como recebida`);
  };

  const handleCancelPurchase = (purchaseId) => {
    if (confirm('Tem certeza que deseja cancelar esta compra?')) {
      alert(`Compra ${purchaseId} cancelada`);
    }
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
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Compras Pendentes</h1>
          <p className="text-sm sm:text-base text-gray-600">Acompanhamento de compras realizadas aguardando entrega</p>
        </div>
        <Button onClick={exportToExcel} className="flex items-center justify-center space-x-2 w-full lg:w-auto">
          <Download className="w-4 h-4" />
          <span>Exportar Excel</span>
        </Button>
      </div>

      {/* Estatísticas Rápidas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
          <div className="flex items-center">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 mr-3" />
            <div>
              <h3 className="text-xs sm:text-sm font-medium text-blue-800">Processando</h3>
              <p className="text-lg sm:text-2xl font-bold text-blue-600">
                {pendingPurchases.filter(p => p.status === 'Processando').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
          <div className="flex items-center">
            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 mr-3" />
            <div>
              <h3 className="text-xs sm:text-sm font-medium text-green-800">Confirmadas</h3>
              <p className="text-lg sm:text-2xl font-bold text-green-600">
                {pendingPurchases.filter(p => p.status === 'Confirmada').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4">
          <div className="flex items-center">
            <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 mr-3" />
            <div>
              <h3 className="text-xs sm:text-sm font-medium text-red-800">Atrasadas</h3>
              <p className="text-lg sm:text-2xl font-bold text-red-600">
                {pendingPurchases.filter(p => p.status === 'Atrasada').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="relative sm:col-span-2 lg:col-span-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Pesquisar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 text-sm"
            />
          </div>
          <Select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            options={departments}
            className="text-sm"
          />
          <Select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            options={statusOptions}
            className="text-sm"
          />
          <Button variant="outline" className="flex items-center justify-center space-x-2 text-sm">
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Filtros Avançados</span>
            <span className="sm:hidden">Filtros</span>
          </Button>
        </div>
      </div>

      {/* Lista de Compras */}
      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Compra
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Fornecedor
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                  Previsão
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPurchases.map((purchase) => {
                const daysUntilDelivery = calculateDaysUntilDelivery(purchase.dataPrevisao);
                return (
                  <tr key={purchase.id} className="hover:bg-gray-50">
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-xs sm:text-sm font-medium text-gray-900">{purchase.id}</div>
                        <div className="text-xs text-gray-500">#{purchase.numeroEncomenda}</div>
                        <div className="text-xs text-gray-500 md:hidden">{purchase.fornecedor}</div>
                        <div className="text-xs text-gray-500">{purchase.departamento}</div>
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap hidden md:table-cell">
                      <div className="text-sm font-medium text-gray-900">{purchase.fornecedor}</div>
                      <div className="text-sm text-gray-500">{purchase.contacto.responsavel}</div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col space-y-1">
                        <div className="flex items-center">
                          {getStatusIcon(purchase.status)}
                          <span className={`ml-1 px-1.5 py-0.5 text-xs font-semibold rounded-full ${getStatusColor(purchase.status)}`}>
                            <span className="hidden sm:inline">{purchase.status}</span>
                            <span className="sm:hidden">{purchase.status.charAt(0)}</span>
                          </span>
                        </div>
                        <span className={`px-1.5 py-0.5 text-xs font-semibold rounded-full ${getPriorityColor(purchase.prioridade)} inline-block w-fit`}>
                          <span className="hidden sm:inline">{purchase.prioridade}</span>
                          <span className="sm:hidden">{purchase.prioridade.charAt(0)}</span>
                        </span>
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                      <div>
                        <div className="text-sm text-gray-900">{purchase.dataPrevisao}</div>
                        <div className={`text-sm ${purchase.diasAtraso > 0 ? 'text-red-600' : daysUntilDelivery === 0 ? 'text-yellow-600' : 'text-gray-500'}`}>
                          {purchase.diasAtraso > 0 ? `${purchase.diasAtraso} dias atrasado` :
                           daysUntilDelivery === 0 ? 'Hoje' :
                           daysUntilDelivery < 0 ? `${Math.abs(daysUntilDelivery)} dias atrasado` :
                           `${daysUntilDelivery} dias`}
                        </div>
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(purchase)}
                          className="flex items-center justify-center space-x-1 text-xs"
                        >
                          <Eye className="w-3 h-3" />
                          <span className="hidden sm:inline">Ver</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleContactSupplier(purchase)}
                          className="flex items-center justify-center space-x-1 text-xs"
                        >
                          <Phone className="w-3 h-3" />
                          <span className="hidden sm:inline">Contactar</span>
                        </Button>
                        {purchase.status === 'Confirmada' && (
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() => handleMarkAsReceived(purchase.id)}
                            className="flex items-center justify-center space-x-1 text-xs"
                          >
                            <CheckCircle className="w-3 h-3" />
                            <span className="hidden sm:inline">Recebido</span>
                          </Button>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 mt-1 sm:hidden">
                        {purchase.dataPrevisao} - {purchase.diasAtraso > 0 ? `${purchase.diasAtraso}d atraso` : `${daysUntilDelivery}d`}
                      </div>
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
        title={`Detalhes da Compra ${selectedPurchase?.id}`}
      >
        {selectedPurchase && (
          <div className="space-y-6">
            {/* Informações Gerais */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Informações da Compra</h4>
                <div className="space-y-1 text-sm">
                  <p><span className="text-gray-600">ID:</span> {selectedPurchase.id}</p>
                  <p><span className="text-gray-600">Nº Encomenda:</span> {selectedPurchase.numeroEncomenda}</p>
                  <p><span className="text-gray-600">Departamento:</span> {selectedPurchase.departamento}</p>
                  <p><span className="text-gray-600">Data Compra:</span> {selectedPurchase.dataCompra}</p>
                  <p><span className="text-gray-600">Previsão:</span> {selectedPurchase.dataPrevisao}</p>
                  <p><span className="text-gray-600">Prioridade:</span> 
                    <span className={`ml-1 px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(selectedPurchase.prioridade)}`}>
                      {selectedPurchase.prioridade}
                    </span>
                  </p>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Fornecedor</h4>
                <div className="space-y-1 text-sm">
                  <p><span className="text-gray-600">Empresa:</span> {selectedPurchase.fornecedor}</p>
                  <p><span className="text-gray-600">Responsável:</span> {selectedPurchase.contacto.responsavel}</p>
                  <p><span className="text-gray-600">Telefone:</span> {selectedPurchase.contacto.telefone}</p>
                  <p><span className="text-gray-600">Email:</span> {selectedPurchase.contacto.email}</p>
                  <p><span className="text-gray-600">Status:</span> 
                    <span className={`ml-1 px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedPurchase.status)}`}>
                      {selectedPurchase.status}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Artigos */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Artigos da Compra</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Código</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Descrição</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Quantidade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {selectedPurchase.artigos.map((artigo, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 text-sm text-gray-900">{artigo.codigo}</td>
                        <td className="px-4 py-2 text-sm text-gray-900">{artigo.descricao}</td>
                        <td className="px-4 py-2 text-sm text-gray-900">{artigo.quantidade}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Observações */}
            {selectedPurchase.observacoes && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Observações</h4>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                  {selectedPurchase.observacoes}
                </p>
              </div>
            )}

            {/* Ações */}
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowDetailsModal(false)}>
                Fechar
              </Button>
              <Button variant="outline" onClick={() => handleContactSupplier(selectedPurchase)}>
                Contactar Fornecedor
              </Button>
              {selectedPurchase.status !== 'Cancelada' && (
                <Button variant="danger" onClick={() => handleCancelPurchase(selectedPurchase.id)}>
                  Cancelar Compra
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Modal de Contacto */}
      <Modal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
        title={`Contactar ${selectedPurchase?.fornecedor}`}
      >
        {selectedPurchase && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded">
                <Phone className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Telefone</p>
                  <p className="text-sm text-gray-600">{selectedPurchase.contacto.telefone}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded">
                <Mail className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Email</p>
                  <p className="text-sm text-gray-600">{selectedPurchase.contacto.email}</p>
                </div>
              </div>
            </div>
            
            <div className="p-3 bg-blue-50 rounded">
              <p className="text-sm font-medium text-blue-900">Responsável: {selectedPurchase.contacto.responsavel}</p>
              <p className="text-sm text-blue-700">Compra: {selectedPurchase.id} | Encomenda: {selectedPurchase.numeroEncomenda}</p>
            </div>

            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowContactModal(false)}>
                Fechar
              </Button>
              <Button 
                onClick={() => window.open(`tel:${selectedPurchase.contacto.telefone}`)}
                className="flex items-center space-x-2"
              >
                <Phone className="w-4 h-4" />
                <span>Ligar</span>
              </Button>
              <Button 
                onClick={() => window.open(`mailto:${selectedPurchase.contacto.email}?subject=Compra ${selectedPurchase.id}`)}
                className="flex items-center space-x-2"
              >
                <Mail className="w-4 h-4" />
                <span>Email</span>
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PendingPurchases;
