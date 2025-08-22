import React, { useState, useCallback } from 'react';
import { Plus, Trash2, Save } from 'lucide-react';
import Button from '../components/ui/Button';
import DataTable from '../components/shared/DataTable';
import Breadcrumbs from '../components/shared/Breadcrumbs';
import Modal from '../components/ui/Modal';

const Requisicoes = () => {
  const initialRow = { 
    id: 1, 
    material: 'CFBA0001', 
    cliente: '0000000001', 
    classe: 'Y', 
    quantidade: 1, 
    um: 'KG', 
    motivo: '000000000000588696', 
    observacoes: '' 
  };
  
  const [rows, setRows] = useState([initialRow]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const materialOptions = [
    { value: 'CFBA0001', label: 'CFBA0001 - Banana 4/6' },
    { value: 'CFBA0002', label: 'CFBA0002 - Maçã Golden' },
    { value: 'CFBA0003', label: 'CFBA0003 - Laranja Valencia' },
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

  const motivoOptions = [
    { value: '000000000000588696', label: 'Reposição de Stock' },
    { value: '000000000000588697', label: 'Pedido Especial' },
    { value: '000000000000588698', label: 'Urgência Operacional' },
  ];

  const handleAddRow = () => {
    const newId = rows.length > 0 ? Math.max(...rows.map(r => r.id)) + 1 : 1;
    setRows([...rows, { 
      id: newId, 
      material: '', 
      cliente: '', 
      classe: '', 
      quantidade: '', 
      um: '', 
      motivo: '', 
      observacoes: '' 
    }]);
  };

  const handleRemoveRow = useCallback((id) => {
    setRows(prevRows => prevRows.filter(row => row.id !== id));
  }, []);

  const handleUpdateRow = useCallback((id, field, value) => {
    setRows(prevRows => prevRows.map(row => {
      if (row.id === id) {
        const updatedRow = { ...row, [field]: value };
        // Auto-fill UM when material is selected
        if (field === 'material' && value) {
          updatedRow.um = 'KG'; // Default unit
        }
        return updatedRow;
      }
      return row;
    }));
  }, []);

  const handleCreateRequisition = async () => {
    setIsLoading(true);
    // Simular criação da requisição
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
    setShowConfirmModal(false);
    // Aqui você adicionaria a lógica para enviar para o backend
    alert('Requisição criada com sucesso!');
  };
  
  const columns = [
    { 
      key: 'actions', 
      header: '', 
      width: 'w-12', 
      render: (row) => (
        <button 
          onClick={() => handleRemoveRow(row.id)} 
          className="text-red-500 hover:text-red-700 transition-colors"
          title="Remover linha"
        >
          <Trash2 size={18} />
        </button>
      )
    },
    { 
      key: 'material', 
      header: 'Material', 
      width: 'w-1/4', 
      type: 'select', 
      options: materialOptions
    },
    { 
      key: 'cliente', 
      header: 'Cliente', 
      width: 'w-1/4', 
      type: 'select', 
      options: clienteOptions
    },
    { 
      key: 'classe', 
      header: 'Classe', 
      width: 'w-20', 
      type: 'select', 
      options: classeOptions
    },
    { 
      key: 'quantidade', 
      header: 'Quantidade', 
      width: 'w-24', 
      type: 'number'
    },
    { 
      key: 'um', 
      header: 'UM', 
      width: 'w-16', 
      type: 'label'
    },
    { 
      key: 'motivo', 
      header: 'Motivo', 
      width: 'w-1/4', 
      type: 'select', 
      options: motivoOptions
    },
    { 
      key: 'observacoes', 
      header: 'Observações', 
      width: 'w-1/4', 
      type: 'text'
    },
  ];

  const canCreateRequisition = rows.some(row => 
    row.material && row.cliente && row.classe && row.quantidade && row.motivo
  );

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[
        { label: 'Início', path: '/' }, 
        { label: 'Requisições sem Necessidades (RSN001)' }
      ]} />
      
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lista de Materiais</h1>
          <p className="text-gray-600">Adicione materiais à requisição</p>
        </div>
        
        <div className="flex space-x-3">
          <Button 
            onClick={handleAddRow} 
            icon={<Plus size={16} />}
            variant="secondary"
          >
            Nova Linha
          </Button>
          <Button 
            onClick={() => setShowConfirmModal(true)}
            icon={<Save size={16} />}
            disabled={!canCreateRequisition}
          >
            Criar Requisição
          </Button>
        </div>
      </div>

      <DataTable 
        columns={columns} 
        data={rows} 
        onUpdateRow={handleUpdateRow}
      />

      {rows.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">Nenhum item adicionado. Clique em "Nova Linha" para começar.</p>
        </div>
      )}

      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Confirmar Criação de Requisição"
      >
        <div className="space-y-4">
          <p>Deseja criar a requisição com {rows.length} item(ns)?</p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Resumo:</h4>
            <ul className="text-sm space-y-1">
              {rows.filter(row => row.material).map(row => (
                <li key={row.id}>
                  {row.material} - Qtd: {row.quantidade} {row.um}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex justify-end space-x-3">
            <Button 
              variant="secondary" 
              onClick={() => setShowConfirmModal(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleCreateRequisition}
              disabled={isLoading}
            >
              {isLoading ? 'Criando...' : 'Confirmar'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Requisicoes;
