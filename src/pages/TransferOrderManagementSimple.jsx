import React, { useState } from 'react';
import { Plus, ArrowLeftRight } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Breadcrumbs from '../components/shared/Breadcrumbs';

const TransferOrderManagement = () => {
  const [activeTab, setActiveTab] = useState('orders');

  return (
    <div className="min-h-screen bg-white">
      <Breadcrumbs 
        items={[
          { label: 'Início', path: '/' },
          { label: 'Gestão Logística', path: '/not001' },
          { label: 'Nova Ordem de Transferência' }
        ]} 
      />

      {/* Abas principais */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 px-6">
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'orders'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Ordens de Transferência
          </button>
          <button
            onClick={() => setActiveTab('shipments')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'shipments'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Envios
          </button>
          <button
            onClick={() => setActiveTab('collections')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'collections'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Recolhas
          </button>
        </nav>
      </div>

      {/* Toolbar simples */}
      <div className="bg-gray-50 border-b border-gray-200 p-4">
        <div className="flex gap-4">
          <Button className="flex items-center gap-2">
            <Plus size={16} />
            Novo
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeftRight size={16} />
            Transferir
          </Button>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="p-6">
        {activeTab === 'orders' && (
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                CT Geral - Ordens de Transferência
              </h2>
              
              <div className="text-center py-8">
                <ArrowLeftRight size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">
                  Sistema de Gestão de Transferências
                </h3>
                <p className="text-gray-500 mb-6">
                  Gerencie ordens de transferência entre armazéns de forma eficiente
                </p>
                <Button className="flex items-center gap-2 mx-auto">
                  <Plus size={16} />
                  Criar Nova Ordem
                </Button>
              </div>

              {/* Tabela de exemplo */}
              <div className="mt-8">
                <table className="min-w-full bg-white">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nº Ordem
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        De
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Para
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cliente
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        OT25063263
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        CT
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        CF
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          Liberto
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        TAP Portugal
                      </td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        OT25063264
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        CF
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        CD
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Aberto
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        Air Canada
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        )}

        {activeTab === 'shipments' && (
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Envios de Armazém
              </h2>
              <div className="text-center py-8">
                <p className="text-gray-600">
                  Esta secção será desenvolvida quando uma ordem for libertada e um envio for criado.
                </p>
              </div>
            </div>
          </Card>
        )}

        {activeTab === 'collections' && (
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Recolhas de Armazém
              </h2>
              <div className="text-center py-8">
                <p className="text-gray-600">
                  Esta secção será desenvolvida quando um documento de recolha for criado.
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TransferOrderManagement;
