import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Save, 
  Trash2, 
  ArrowLeftRight, 
  Package, 
  Search,
  CheckCircle,
  AlertCircle,
  Edit3,
  Eye,
  Filter,
  ArrowLeft,
  X
} from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Modal from '../components/ui/Modal';
import Breadcrumbs from '../components/shared/Breadcrumbs';

const TransferOrderManagement = () => {
  // Estados principais
  const [activeView, setActiveView] = useState('list'); // 'list', 'new', 'edit', 'view'
  const [transferOrders, setTransferOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Estados do formulário
  const [orderForm, setOrderForm] = useState({
    id: '',
    transferFrom: '',
    transferTo: '',
    registrationDate: new Date().toISOString().split('T')[0],
    documentDate: new Date().toISOString().split('T')[0],
    clientCode: '',
    clientName: '',
    status: 'Rascunho',
    items: []
  });

  const [newItem, setNewItem] = useState({
    productCode: '',
    description: '',
    unit: '',
    quantity: 0
  });

  // Estados para modais
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);

  // Dados de exemplo
  const warehouses = [
    { value: 'CT', label: 'CT - Centro de Transferência' },
    { value: 'CF', label: 'CF - Centro de Fulfillment' },
    { value: 'CD', label: 'CD - Centro de Distribuição' },
    { value: 'AR', label: 'AR - Armazém Regional' }
  ];

  const clients = [
    { value: 'TAP001', label: 'TAP001 - TAP Portugal' },
    { value: 'AC002', label: 'AC002 - Air Canada' },
    { value: 'LH003', label: 'LH003 - Lufthansa' },
    { value: 'AF004', label: 'AF004 - Air France' }
  ];

  const products = [
    { code: 'CFBA0001', description: 'Banana 4/6', unit: 'KG' },
    { code: 'CFAP0002', description: 'Maçã Gala', unit: 'KG' },
    { code: 'CFLA0003', description: 'Laranja Valencia', unit: 'KG' },
    { code: 'CQPF0001', description: 'Peito de Frango', unit: 'KG' },
    { code: 'PAS0001', description: 'Croissant', unit: 'UN' }
  ];

  const statusOptions = [
    { value: 'all', label: 'Todos os Status' },
    { value: 'Rascunho', label: 'Rascunho' },
    { value: 'Aprovado', label: 'Aprovado' },
    { value: 'Em Trânsito', label: 'Em Trânsito' },
    { value: 'Entregue', label: 'Entregue' },
    { value: 'Cancelado', label: 'Cancelado' }
  ];

  // Gerar ID único para nova ordem
  const generateOrderId = () => {
    const timestamp = Date.now().toString().slice(-6);
    return `OT${timestamp}`;
  };

  // Inicializar dados de exemplo
  useEffect(() => {
    const sampleOrders = [
      {
        id: 'OT250823',
        transferFrom: 'CT',
        transferTo: 'CF',
        registrationDate: '2024-01-15',
        documentDate: '2024-01-15',
        clientCode: 'TAP001',
        clientName: 'TAP Portugal',
        status: 'Aprovado',
        items: [
          { productCode: 'CFBA0001', description: 'Banana 4/6', unit: 'KG', quantity: 50 },
          { productCode: 'CFAP0002', description: 'Maçã Gala', unit: 'KG', quantity: 30 }
        ]
      },
      {
        id: 'OT250824',
        transferFrom: 'CF',
        transferTo: 'CD',
        registrationDate: '2024-01-16',
        documentDate: '2024-01-16',
        clientCode: 'AC002',
        clientName: 'Air Canada',
        status: 'Rascunho',
        items: [
          { productCode: 'CQPF0001', description: 'Peito de Frango', unit: 'KG', quantity: 100 }
        ]
      }
    ];
    setTransferOrders(sampleOrders);
  }, []);

  // Filtrar ordens
  const filteredOrders = transferOrders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.clientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Funções de manipulação
  const handleNewOrder = () => {
    setOrderForm({
      id: generateOrderId(),
      transferFrom: '',
      transferTo: '',
      registrationDate: new Date().toISOString().split('T')[0],
      documentDate: new Date().toISOString().split('T')[0],
      clientCode: '',
      clientName: '',
      status: 'Rascunho',
      items: []
    });
    setActiveView('new');
  };

  const handleEditOrder = (order) => {
    setOrderForm(order);
    setSelectedOrder(order);
    setActiveView('edit');
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setActiveView('view');
  };

  const handleSaveOrder = () => {
    if (!orderForm.transferFrom || !orderForm.transferTo || !orderForm.clientCode) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    // Encontrar o nome do cliente
    const client = clients.find(c => c.value === orderForm.clientCode);
    const updatedOrder = {
      ...orderForm,
      clientName: client ? client.label.split(' - ')[1] : orderForm.clientName
    };

    if (selectedOrder) {
      setTransferOrders(prev => prev.map(order => 
        order.id === selectedOrder.id ? updatedOrder : order
      ));
    } else {
      setTransferOrders(prev => [...prev, updatedOrder]);
    }

    setActiveView('list');
    setSelectedOrder(null);
  };

  const handleDeleteOrder = (order) => {
    setOrderToDelete(order);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setTransferOrders(prev => prev.filter(order => order.id !== orderToDelete.id));
    setShowDeleteModal(false);
    setOrderToDelete(null);
  };

  const handleAddItem = () => {
    if (!newItem.productCode || !newItem.quantity) {
      alert('Por favor, preencha o código do produto e quantidade.');
      return;
    }

    const product = products.find(p => p.code === newItem.productCode);
    if (product) {
      setOrderForm(prev => ({
        ...prev,
        items: [...prev.items, {
          ...newItem,
          description: product.description,
          unit: product.unit
        }]
      }));
      setNewItem({ productCode: '', description: '', unit: '', quantity: 0 });
    }
  };

  const handleRemoveItem = (index) => {
    setOrderForm(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Rascunho': return 'bg-gray-100 text-gray-800';
      case 'Aprovado': return 'bg-green-100 text-green-800';
      case 'Em Trânsito': return 'bg-blue-100 text-blue-800';
      case 'Entregue': return 'bg-purple-100 text-purple-800';
      case 'Cancelado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Aprovado': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'Em Trânsito': return <Package className="h-4 w-4 text-blue-600" />;
      case 'Entregue': return <CheckCircle className="h-4 w-4 text-purple-600" />;
      case 'Cancelado': return <AlertCircle className="h-4 w-4 text-red-600" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  // Renderizar lista de ordens
  const renderOrdersList = () => (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ordens de Transferência</h1>
          <p className="text-gray-600 mt-1">Gerencie suas ordens de transferência entre armazéns</p>
        </div>
        <Button onClick={handleNewOrder} className="flex items-center gap-2">
          <Plus size={16} />
          Nova Ordem
        </Button>
      </div>

      {/* Filtros */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Buscar por ID ou cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            options={statusOptions}
          />
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              {filteredOrders.length} ordem(ns) encontrada(s)
            </span>
          </div>
        </div>
      </Card>

      {/* Lista de Ordens */}
      <div className="grid gap-4">
        {filteredOrders.length === 0 ? (
          <Card className="p-8 text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma ordem encontrada</h3>
            <p className="text-gray-600 mb-4">Não há ordens que correspondam aos filtros aplicados.</p>
            <Button onClick={handleNewOrder} variant="outline">
              <Plus size={16} className="mr-2" />
              Criar Nova Ordem
            </Button>
          </Card>
        ) : (
          filteredOrders.map(order => (
            <Card key={order.id} className="p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">{order.id}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      {order.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <ArrowLeftRight className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">
                        {order.transferFrom} → {order.transferTo}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">{order.clientName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">
                        {order.items.length} item(ns)
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-2 text-xs text-gray-500">
                    Data: {new Date(order.documentDate).toLocaleDateString('pt-BR')}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewOrder(order)}
                    className="flex items-center gap-1"
                  >
                    <Eye size={14} />
                    Ver
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditOrder(order)}
                    className="flex items-center gap-1"
                  >
                    <Edit3 size={14} />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteOrder(order)}
                    className="flex items-center gap-1 text-red-600 hover:text-red-700"
                  >
                    <Trash2 size={14} />
                    Excluir
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );

  // Renderizar formulário de ordem (novo/editar)
  const renderOrderForm = () => (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          onClick={() => setActiveView('list')}
          className="flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Voltar
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {activeView === 'new' ? 'Nova Ordem de Transferência' : 'Editar Ordem'}
          </h1>
          <p className="text-gray-600 mt-1">
            {activeView === 'new' ? 'Criar uma nova ordem de transferência' : `Editando ordem ${orderForm.id}`}
          </p>
        </div>
      </div>

      {/* Formulário */}
      <Card className="p-6">
        <div className="space-y-6">
          {/* Informações Básicas */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Informações Básicas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ID da Ordem
                </label>
                <Input
                  type="text"
                  value={orderForm.id}
                  disabled
                  className="bg-gray-50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Origem *
                </label>
                <Select
                  value={orderForm.transferFrom}
                  onChange={(value) => setOrderForm(prev => ({ ...prev, transferFrom: value }))}
                  options={warehouses}
                  placeholder="Selecionar origem"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Destino *
                </label>
                <Select
                  value={orderForm.transferTo}
                  onChange={(value) => setOrderForm(prev => ({ ...prev, transferTo: value }))}
                  options={warehouses}
                  placeholder="Selecionar destino"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data de Registro
                </label>
                <Input
                  type="date"
                  value={orderForm.registrationDate}
                  onChange={(e) => setOrderForm(prev => ({ ...prev, registrationDate: e.target.value }))}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data do Documento
                </label>
                <Input
                  type="date"
                  value={orderForm.documentDate}
                  onChange={(e) => setOrderForm(prev => ({ ...prev, documentDate: e.target.value }))}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cliente *
                </label>
                <Select
                  value={orderForm.clientCode}
                  onChange={(value) => setOrderForm(prev => ({ ...prev, clientCode: value }))}
                  options={clients}
                  placeholder="Selecionar cliente"
                />
              </div>
            </div>
          </div>

          {/* Itens da Ordem */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Itens da Ordem</h3>
            
            {/* Adicionar Item */}
            <Card className="p-4 bg-gray-50 mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Adicionar Item</h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <Select
                  value={newItem.productCode}
                  onChange={(value) => setNewItem(prev => ({ ...prev, productCode: value }))}
                  options={products.map(p => ({ value: p.code, label: `${p.code} - ${p.description}` }))}
                  placeholder="Produto"
                />
                <Input
                  type="number"
                  placeholder="Quantidade"
                  value={newItem.quantity || ''}
                  onChange={(e) => setNewItem(prev => ({ ...prev, quantity: parseInt(e.target.value) || 0 }))}
                />
                <Button onClick={handleAddItem} className="flex items-center gap-2">
                  <Plus size={14} />
                  Adicionar
                </Button>
              </div>
            </Card>

            {/* Lista de Itens */}
            {orderForm.items.length === 0 ? (
              <Card className="p-6 text-center">
                <Package className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Nenhum item adicionado</p>
              </Card>
            ) : (
              <Card>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Código</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descrição</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unidade</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantidade</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {orderForm.items.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.productCode}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{item.description}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{item.unit}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{item.quantity}</td>
                          <td className="px-4 py-3">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRemoveItem(index)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 size={14} />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}
          </div>

          {/* Ações */}
          <div className="flex gap-3 pt-4 border-t">
            <Button onClick={handleSaveOrder} className="flex items-center gap-2">
              <Save size={16} />
              Salvar Ordem
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setActiveView('list')}
              className="flex items-center gap-2"
            >
              <X size={16} />
              Cancelar
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );

  // Renderizar visualização de ordem
  const renderOrderView = () => (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          onClick={() => setActiveView('list')}
          className="flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Voltar
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ordem {selectedOrder?.id}</h1>
          <p className="text-gray-600 mt-1">Detalhes da ordem de transferência</p>
        </div>
      </div>

      {selectedOrder && (
        <>
          {/* Informações da Ordem */}
          <Card className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Status</h3>
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.status)}`}>
                  {getStatusIcon(selectedOrder.status)}
                  {selectedOrder.status}
                </span>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Transferência</h3>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{selectedOrder.transferFrom}</span>
                  <ArrowLeftRight className="h-4 w-4 text-gray-400" />
                  <span className="font-medium">{selectedOrder.transferTo}</span>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Cliente</h3>
                <p className="font-medium">{selectedOrder.clientName}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Data de Registro</h3>
                <p className="font-medium">{new Date(selectedOrder.registrationDate).toLocaleDateString('pt-BR')}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Data do Documento</h3>
                <p className="font-medium">{new Date(selectedOrder.documentDate).toLocaleDateString('pt-BR')}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Total de Itens</h3>
                <p className="font-medium">{selectedOrder.items.length} item(ns)</p>
              </div>
            </div>
          </Card>

          {/* Itens da Ordem */}
          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Itens da Ordem</h3>
            {selectedOrder.items.length === 0 ? (
              <p className="text-gray-600 text-center py-8">Nenhum item na ordem</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Código</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descrição</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unidade</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantidade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {selectedOrder.items.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.productCode}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{item.description}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{item.unit}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{item.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs 
          items={[
            { label: 'Gestão Logística', href: '#' },
            { label: 'Ordens de Transferência', href: '#' }
          ]} 
        />
        
        {activeView === 'list' && renderOrdersList()}
        {(activeView === 'new' || activeView === 'edit') && renderOrderForm()}
        {activeView === 'view' && renderOrderView()}
        
        {/* Modal de Confirmação de Exclusão */}
        <Modal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title="Confirmar Exclusão"
        >
          <div className="space-y-4">
            <p className="text-gray-700">
              Tem certeza que deseja excluir a ordem <strong>{orderToDelete?.id}</strong>?
            </p>
            <p className="text-sm text-gray-500">
              Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-3">
              <Button 
                onClick={confirmDelete}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Sim, Excluir
              </Button>
              <Button 
                variant="outline"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default TransferOrderManagement;
