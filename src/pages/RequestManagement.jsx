import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, Plus, Eye, Edit2, Trash2, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Select from '../components/ui/Select';
import Input from '../components/ui/Input';
import Breadcrumbs from '../components/shared/Breadcrumbs';
import Modal from '../components/ui/Modal';

const RequestManagement = () => {
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

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
  ];

  const statusOptions = [
    { value: 'all', label: 'Todos os Status' },
    { value: 'pendente', label: 'Pendente' },
    { value: 'aprovada', label: 'Aprovada' },
    { value: 'processando', label: 'Em Processamento' },
    { value: 'concluida', label: 'Concluída' },
    { value: 'cancelada', label: 'Cancelada' },
  ];

  // Mock data para demonstração
  const mockRequests = [
    {
      id: 'REQ001',
      numero: 'R2025-081901',
      solicitante: 'João Silva',
      departamento: 'C1',
      dataRequisicao: '2025-08-19',
      dataNecessidade: '2025-08-22',
      status: 'pendente',
      prioridade: 'alta',
      totalItens: 15,
      descricao: 'Requisição de produtos para reposição de estoque',
      observacoes: 'Urgente - Festival de Verão',
      artigos: [
        { codigo: 'CFBA0001', descricao: 'Banana 4/6', quantidade: 50, unidade: 'KG' },
        { codigo: 'CFMA0002', descricao: 'Maçã Gala', quantidade: 30, unidade: 'KG' },
        { codigo: 'CFLA0003', descricao: 'Laranja Valencia', quantidade: 25, unidade: 'KG' }
      ]
    },
    {
      id: 'REQ002',
      numero: 'R2025-081902',
      solicitante: 'Maria Santos',
      departamento: 'R',
      dataRequisicao: '2025-08-18',
      dataNecessidade: '2025-08-21',
      status: 'aprovada',
      prioridade: 'normal',
      totalItens: 8,
      descricao: 'Produtos lácteos para secção de refrigerados',
      observacoes: 'Verificar temperatura na entrega',
      artigos: [
        { codigo: 'RLEI0001', descricao: 'Leite UHT 1L', quantidade: 100, unidade: 'UN' },
        { codigo: 'RIOG0002', descricao: 'Iogurte Natural', quantidade: 50, unidade: 'UN' }
      ]
    },
    {
      id: 'REQ003',
      numero: 'R2025-081903',
      solicitante: 'Pedro Costa',
      departamento: 'S',
      dataRequisicao: '2025-08-17',
      dataNecessidade: '2025-08-20',
      status: 'processando',
      prioridade: 'baixa',
      totalItens: 12,
      descricao: 'Produtos secos diversos',
      observacoes: '',
      artigos: [
        { codigo: 'SARR0001', descricao: 'Arroz Carolino 1kg', quantidade: 25, unidade: 'UN' },
        { codigo: 'SMAS0002', descricao: 'Massa Esparguete 500g', quantidade: 40, unidade: 'UN' }
      ]
    },
    {
      id: 'REQ004',
      numero: 'R2025-081904',
      solicitante: 'Ana Lima',
      departamento: 'P',
      dataRequisicao: '2025-08-16',
      dataNecessidade: '2025-08-19',
      status: 'concluida',
      prioridade: 'alta',
      totalItens: 20,
      descricao: 'Reposição completa da praça',
      observacoes: 'Entregue conforme solicitado',
      artigos: [
        { codigo: 'PFRU0001', descricao: 'Mix Frutas Frescas', quantidade: 15, unidade: 'KG' },
        { codigo: 'PVER0002', descricao: 'Mix Vegetais', quantidade: 20, unidade: 'KG' }
      ]
    }
  ];

  useEffect(() => {
    setLoading(true);
    // Simular carregamento
    setTimeout(() => {
      setRequests(mockRequests);
      setLoading(false);
    }, 1000);
  }, [selectedDepartment, selectedStatus]);

  const filteredRequests = requests.filter(request => {
    const matchesDepartment = selectedDepartment === 'all' || request.departamento === selectedDepartment;
    const matchesStatus = selectedStatus === 'all' || request.status === selectedStatus;
    const matchesSearch = searchTerm === '' || 
      request.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.solicitante.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.descricao.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesDepartment && matchesStatus && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'pendente': return 'bg-yellow-100 text-yellow-800';
      case 'aprovada': return 'bg-blue-100 text-blue-800';
      case 'processando': return 'bg-orange-100 text-orange-800';
      case 'concluida': return 'bg-green-100 text-green-800';
      case 'cancelada': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pendente': return <Clock className="w-4 h-4" />;
      case 'aprovada': return <CheckCircle className="w-4 h-4" />;
      case 'processando': return <Clock className="w-4 h-4" />;
      case 'concluida': return <CheckCircle className="w-4 h-4" />;
      case 'cancelada': return <AlertTriangle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pendente': return 'Pendente';
      case 'aprovada': return 'Aprovada';
      case 'processando': return 'Processando';
      case 'concluida': return 'Concluída';
      case 'cancelada': return 'Cancelada';
      default: return 'Desconhecido';
    }
  };

  const getPriorityColor = (prioridade) => {
    switch (prioridade) {
      case 'alta': return 'text-red-600';
      case 'normal': return 'text-yellow-600';
      case 'baixa': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setShowModal(true);
  };

  const handleApproveRequest = (id) => {
    setRequests(prev => prev.map(req => 
      req.id === id ? { ...req, status: 'aprovada' } : req
    ));
  };

  const handleRejectRequest = (id) => {
    setRequests(prev => prev.map(req => 
      req.id === id ? { ...req, status: 'cancelada' } : req
    ));
  };

  const exportToExcel = () => {
    console.log('Exportando para Excel...');
  };

  const requestsStats = {
    total: requests.length,
    pendentes: requests.filter(r => r.status === 'pendente').length,
    aprovadas: requests.filter(r => r.status === 'aprovada').length,
    processando: requests.filter(r => r.status === 'processando').length,
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[
        { label: 'Início', path: '/' }, 
        { label: 'Gestão de Requisições (SGR003)' }
      ]} />
      
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestão de Requisições</h1>
          <p className="text-gray-600">Gestão completa de requisições de material</p>
        </div>
        <div className="flex space-x-3">
          <Button onClick={exportToExcel} className="flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Exportar Excel</span>
          </Button>
          <Button variant="primary" className="flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Nova Requisição</span>
          </Button>
        </div>
      </div>

      {/* Estatísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card onClick={() => {}}>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{requestsStats.total}</p>
              <p className="text-sm text-gray-600">Total de Requisições</p>
            </div>
          </div>
        </Card>

        <Card onClick={() => {}}>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-600">{requestsStats.pendentes}</p>
              <p className="text-sm text-gray-600">Pendentes</p>
            </div>
          </div>
        </Card>

        <Card onClick={() => {}}>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{requestsStats.aprovadas}</p>
              <p className="text-sm text-gray-600">Aprovadas</p>
            </div>
          </div>
        </Card>

        <Card onClick={() => {}}>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-600">{requestsStats.processando}</p>
              <p className="text-sm text-gray-600">Em Processamento</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Select
            value={selectedDepartment}
            onChange={setSelectedDepartment}
            options={departmentOptions}
            placeholder="Departamento"
          />
          <Select
            value={selectedStatus}
            onChange={setSelectedStatus}
            options={statusOptions}
            placeholder="Status"
          />
          <Input
            type="text"
            placeholder="Buscar por número, solicitante..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search className="w-4 h-4" />}
          />
          <Button variant="outline" className="flex items-center space-x-2">
            <Filter className="w-4 h-4" />
            <span>Filtros Avançados</span>
          </Button>
        </div>
      </div>

      {/* Tabela de Requisições */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Requisições ({filteredRequests.length})</h3>
        </div>
        
        {loading ? (
          <div className="p-6 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Carregando requisições...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Requisição
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Solicitante/Departamento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Datas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status/Prioridade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Itens
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{request.numero}</div>
                        <div className="text-sm text-gray-500">{request.id}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{request.solicitante}</div>
                        <div className="text-sm text-gray-500">{request.departamento}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm text-gray-900">Req: {new Date(request.dataRequisicao).toLocaleDateString('pt-PT')}</div>
                        <div className="text-sm text-gray-500">Necessidade: {new Date(request.dataNecessidade).toLocaleDateString('pt-PT')}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col space-y-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                          {getStatusIcon(request.status)}
                          <span className="ml-1">{getStatusText(request.status)}</span>
                        </span>
                        <span className={`text-xs font-medium ${getPriorityColor(request.prioridade)}`}>
                          Prioridade: {request.prioridade.charAt(0).toUpperCase() + request.prioridade.slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {request.totalItens} itens
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleViewDetails(request)}
                        className="flex items-center space-x-1"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Ver</span>
                      </Button>
                      {request.status === 'pendente' && (
                        <>
                          <Button 
                            size="sm" 
                            variant="success"
                            onClick={() => handleApproveRequest(request.id)}
                            className="flex items-center space-x-1"
                          >
                            <CheckCircle className="w-3 h-3" />
                            <span>Aprovar</span>
                          </Button>
                          <Button 
                            size="sm" 
                            variant="danger"
                            onClick={() => handleRejectRequest(request.id)}
                            className="flex items-center space-x-1"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Rejeitar</span>
                          </Button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de Detalhes */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={`Detalhes da Requisição ${selectedRequest?.numero}`}
        size="lg"
      >
        {selectedRequest && (
          <div className="space-y-6">
            {/* Informações Gerais */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Informações da Requisição</h4>
                <div className="space-y-1 text-sm">
                  <p><span className="text-gray-600">Número:</span> {selectedRequest.numero}</p>
                  <p><span className="text-gray-600">Solicitante:</span> {selectedRequest.solicitante}</p>
                  <p><span className="text-gray-600">Departamento:</span> {selectedRequest.departamento}</p>
                  <p><span className="text-gray-600">Data Requisição:</span> {selectedRequest.dataRequisicao}</p>
                  <p><span className="text-gray-600">Data Necessidade:</span> {selectedRequest.dataNecessidade}</p>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Status e Prioridade</h4>
                <div className="space-y-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedRequest.status)}`}>
                    {getStatusIcon(selectedRequest.status)}
                    <span className="ml-1">{getStatusText(selectedRequest.status)}</span>
                  </span>
                  <p className={`text-sm font-medium ${getPriorityColor(selectedRequest.prioridade)}`}>
                    Prioridade: {selectedRequest.prioridade.charAt(0).toUpperCase() + selectedRequest.prioridade.slice(1)}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Descrição:</span> {selectedRequest.descricao}
                  </p>
                  {selectedRequest.observacoes && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Observações:</span> {selectedRequest.observacoes}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Artigos */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Artigos Solicitados</h4>
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
                    {selectedRequest.artigos.map((artigo, index) => (
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
          </div>
        )}
      </Modal>
    </div>
  );
};

export default RequestManagement;
