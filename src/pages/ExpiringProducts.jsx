import React, { useState, useEffect } from 'react';
import { AlertTriangle, Calendar, Package, Clock, Trash2, Archive } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Select from '../components/ui/Select';
import Input from '../components/ui/Input';
import Breadcrumbs from '../components/shared/Breadcrumbs';
import Modal from '../components/ui/Modal';

const ExpiringProducts = () => {
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [daysToExpire, setDaysToExpire] = useState(2);
  const [expiringData, setExpiringData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

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

  // Mock data para demonstração
  const mockExpiringData = [
    {
      id: 1,
      artigo: 'CFBA0001',
      descricao: 'Banana 4/6',
      departamento: 'P',
      lote: 'L2025081501',
      quantidade: 25,
      unidade: 'KG',
      dataExpiracao: '2025-08-21',
      diasRestantes: 2,
      status: 'caducado', // D+2 = caducado
      localizacao: 'A1-B2-C3',
      valorUnitario: 1.50,
      valorTotal: 37.50,
      fornecedor: 'Greenyard'
    },
    {
      id: 2,
      artigo: 'CFBA0002',
      descricao: 'Iogurte Natural 125g',
      departamento: 'R',
      lote: 'L2025081502',
      quantidade: 50,
      unidade: 'UN',
      dataExpiracao: '2025-08-20',
      diasRestantes: 1,
      status: 'caducado',
      localizacao: 'R1-A1-B1',
      valorUnitario: 0.75,
      valorTotal: 37.50,
      fornecedor: 'Danone'
    },
    {
      id: 3,
      artigo: 'CFBA0003',
      descricao: 'Pão de Forma Integral',
      departamento: 'P',
      lote: 'L2025081503',
      quantidade: 15,
      unidade: 'UN',
      dataExpiracao: '2025-08-22',
      diasRestantes: 3,
      status: 'atencao', // D+3 ainda pode ser usado hoje
      localizacao: 'P1-A2-B1',
      valorUnitario: 2.20,
      valorTotal: 33.00,
      fornecedor: 'Panrico'
    },
    {
      id: 4,
      artigo: 'CFBA0004',
      descricao: 'Leite Meio Gordo 1L',
      departamento: 'R',
      lote: 'L2025081504',
      quantidade: 30,
      unidade: 'UN',
      dataExpiracao: '2025-08-20',
      diasRestantes: 1,
      status: 'caducado',
      localizacao: 'R1-B1-C2',
      valorUnitario: 0.89,
      valorTotal: 26.70,
      fornecedor: 'Lactogal'
    }
  ];

  useEffect(() => {
    loadExpiringProducts();
  }, [selectedDepartment, daysToExpire]);

  const loadExpiringProducts = async () => {
    setLoading(true);
    // Simular carregamento
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    let filteredData = mockExpiringData;
    
    if (selectedDepartment !== 'all') {
      filteredData = filteredData.filter(item => item.departamento === selectedDepartment);
    }
    
    // Filtrar por dias até expirar
    filteredData = filteredData.filter(item => item.diasRestantes <= daysToExpire);
    
    setExpiringData(filteredData);
    setLoading(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'caducado': return 'text-red-600 bg-red-100';
      case 'atencao': return 'text-yellow-600 bg-yellow-100';
      case 'ok': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'caducado': return 'Caducado (D+2)';
      case 'atencao': return 'Atenção';
      case 'ok': return 'OK';
      default: return status;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'caducado': return <AlertTriangle className="w-4 h-4" />;
      case 'atencao': return <Clock className="w-4 h-4" />;
      case 'ok': return <Package className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const handleProductAction = async (product, action) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simular ação
    let actionText = '';
    switch (action) {
      case 'descarte':
        actionText = 'Produto enviado para descarte';
        break;
      case 'doacao':
        actionText = 'Produto enviado para doação';
        break;
      case 'uso_prioritario':
        actionText = 'Produto marcado para uso prioritário';
        break;
      case 'promocao':
        actionText = 'Produto enviado para promoção';
        break;
      default:
        actionText = 'Ação aplicada';
    }
    
    // Remover produto da lista
    const updatedData = expiringData.filter(item => item.id !== product.id);
    setExpiringData(updatedData);
    
    setLoading(false);
    setShowActionModal(false);
    alert(`${actionText}: ${product.artigo} - ${product.descricao}`);
  };

  const totalItems = expiringData.length;
  const itemsCaducados = expiringData.filter(item => item.status === 'caducado').length;
  const itemsAtencao = expiringData.filter(item => item.status === 'atencao').length;

  const today = new Date();
  const todayString = today.toISOString().split('T')[0];

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[
        { label: 'Início', path: '/' }, 
        { label: 'Produtos Próximos do Vencimento' }
      ]} />

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Produtos Próximos do Vencimento</h1>
          <p className="text-gray-600">Gestão de produtos com data de expiração próxima (regra D+2)</p>
        </div>
        
        <div className="flex space-x-3">
          <Select
            value={daysToExpire}
            onChange={(e) => setDaysToExpire(Number(e.target.value))}
            options={[
              { value: 1, label: 'Próximos 1 dia' },
              { value: 2, label: 'Próximos 2 dias' },
              { value: 3, label: 'Próximos 3 dias' },
              { value: 7, label: 'Próximos 7 dias' },
            ]}
            className="w-40"
          />
          <Select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            options={departmentOptions}
            className="w-48"
          />
          <Button onClick={loadExpiringProducts} loading={loading}>
            Atualizar
          </Button>
        </div>
      </div>

      {/* Alerta sobre regra D+2 */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex">
          <AlertTriangle className="w-5 h-5 text-yellow-400 mr-3 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-yellow-800">Regra D+2 em Vigor</h3>
            <p className="text-sm text-yellow-700 mt-1">
              Produtos com data de expiração dentro de 2 dias (D+2) são considerados caducados e não podem ser enviados para as secções.
              Data atual: {new Date().toLocaleDateString('pt-PT')}
            </p>
          </div>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card onClick={() => {}}>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalItems}</p>
              <p className="text-sm text-gray-600">Total de Produtos</p>
            </div>
          </div>
        </Card>

        <Card onClick={() => {}}>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">{itemsCaducados}</p>
              <p className="text-sm text-gray-600">Caducados (D+2)</p>
            </div>
          </div>
        </Card>

        <Card onClick={() => {}}>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-600">{itemsAtencao}</p>
              <p className="text-sm text-gray-600">Atenção</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabela de Produtos */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Produtos Identificados</h3>
        </div>
        
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pw-green mx-auto"></div>
            <p className="text-gray-500 mt-4">Verificando datas de expiração...</p>
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
                    Lote/Localização
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantidade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data Expiração
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dias Restantes
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
                {expiringData.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{product.artigo}</div>
                        <div className="text-sm text-gray-500">{product.descricao}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm text-gray-900">Lote: {product.lote}</div>
                        <div className="text-sm text-gray-500">{product.localizacao}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.quantidade} {product.unidade}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(product.dataExpiracao).toLocaleDateString('pt-PT')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1 text-gray-400" />
                        <span className={`text-sm font-medium ${product.diasRestantes <= 2 ? 'text-red-600' : 'text-yellow-600'}`}>
                          {product.diasRestantes} dia{product.diasRestantes !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                        {getStatusIcon(product.status)}
                        <span className="ml-1">{getStatusText(product.status)}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <Button 
                        size="xs" 
                        onClick={() => {
                          setSelectedProduct(product);
                          setShowActionModal(true);
                        }}
                      >
                        Ações
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de Ações */}
      <Modal
        isOpen={showActionModal}
        onClose={() => setShowActionModal(false)}
        title={`Ações para ${selectedProduct?.artigo}`}
        size="lg"
      >
        {selectedProduct && (
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Informações do Produto</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Código:</strong> {selectedProduct.artigo}</p>
                  <p><strong>Descrição:</strong> {selectedProduct.descricao}</p>
                  <p><strong>Lote:</strong> {selectedProduct.lote}</p>
                  <p><strong>Localização:</strong> {selectedProduct.localizacao}</p>
                </div>
                <div>
                  <p><strong>Quantidade:</strong> {selectedProduct.quantidade} {selectedProduct.unidade}</p>
                  <p><strong>Data Expiração:</strong> {new Date(selectedProduct.dataExpiracao).toLocaleDateString('pt-PT')}</p>
                  <p><strong>Dias Restantes:</strong> {selectedProduct.diasRestantes}</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Selecione uma Ação</h4>
              <div className="space-y-3">
                {selectedProduct.status === 'caducado' ? (
                  <>
                    <Button 
                      className="w-full justify-start" 
                      variant="danger"
                      icon={<Trash2 className="w-4 h-4" />}
                      onClick={() => handleProductAction(selectedProduct, 'descarte')}
                    >
                      Enviar para Descarte (Produto Caducado - D+2)
                    </Button>
                    
                    <Button 
                      className="w-full justify-start" 
                      variant="warning"
                      icon={<Archive className="w-4 h-4" />}
                      onClick={() => handleProductAction(selectedProduct, 'doacao')}
                    >
                      Enviar para Doação (se ainda consumível)
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      className="w-full justify-start" 
                      variant="success"
                      icon={<Package className="w-4 h-4" />}
                      onClick={() => handleProductAction(selectedProduct, 'uso_prioritario')}
                    >
                      Marcar para Uso Prioritário
                    </Button>
                    
                    <Button 
                      className="w-full justify-start" 
                      variant="warning"
                      icon={<Calendar className="w-4 h-4" />}
                      onClick={() => handleProductAction(selectedProduct, 'promocao')}
                    >
                      Enviar para Promoção
                    </Button>
                    
                    <Button 
                      className="w-full justify-start" 
                      variant="outline"
                      icon={<Archive className="w-4 h-4" />}
                      onClick={() => handleProductAction(selectedProduct, 'doacao')}
                    >
                      Separar para Doação
                    </Button>
                  </>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button 
                variant="secondary" 
                onClick={() => setShowActionModal(false)}
              >
                Cancelar
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
            variant="danger" 
            icon={<Trash2 className="w-4 h-4" />}
            onClick={() => {
              const caducados = expiringData.filter(item => item.status === 'caducado');
              if (caducados.length > 0) {
                alert(`Enviando ${caducados.length} produtos caducados para descarte...`);
              } else {
                alert('Nenhum produto caducado encontrado.');
              }
            }}
          >
            Descartar Todos os Caducados
          </Button>
          <Button 
            variant="warning" 
            icon={<Archive className="w-4 h-4" />}
            onClick={() => alert('Separando produtos para doação...')}
          >
            Separar para Doação
          </Button>
          <Button 
            variant="outline" 
            onClick={() => alert('Exportando relatório de vencimentos...')}
          >
            Exportar Relatório
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExpiringProducts;
