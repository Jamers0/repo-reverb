import React, { useState, useEffect, useMemo } from 'react';
import { Search, Download, Upload, Filter, Calendar, FileText, AlertTriangle, TrendingUp, Package, Clock, Users, ArrowUpRight, ArrowDownRight, BarChart3, PieChart, RefreshCcw, Settings, X, Check, Plus, Edit, Trash2, Eye, ExternalLink, ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import Select from '../components/ui/Select';
import Modal from '../components/ui/Modal';
import DataTable from '../components/shared/DataTable';
import Breadcrumbs from '../components/shared/Breadcrumbs';
import { useData } from '../contexts/DataContextSimple';

const StockRupturesPage = () => {
  const { 
    rupturesData, 
    filteredData, 
    loading, 
    setRupturesData,
    setFilteredData,
    applyFilters,
    filters,
    setFilters
  } = useData();

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedRupture, setSelectedRupture] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Breadcrumbs 
        items={[
          { label: 'Início', path: '/' },
          { label: 'Análise', path: '/stock-ruptures' },
          { label: 'Rupturas de Stock' }
        ]} 
      />

      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Rupturas de Stock</h1>
              <p className="text-gray-600 mt-1">Análise e gestão de rupturas de stock</p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowFilterModal(true)}
                className="flex items-center gap-2"
              >
                <Filter size={16} />
                Filtros
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowUploadModal(true)}
                className="flex items-center gap-2"
              >
                <Upload size={16} />
                Importar
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="p-6">
        <Card>
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Gestão de Rupturas de Stock
            </h2>
            
            <div className="text-center py-12">
              <Package size={64} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                Sistema de Análise de Rupturas
              </h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Monitore e analise rupturas de stock para otimizar a gestão de inventário
              </p>
              <div className="flex gap-4 justify-center">
                <Button className="flex items-center gap-2">
                  <Upload size={16} />
                  Importar Dados
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <BarChart3 size={16} />
                  Ver Relatórios
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Modal de Upload */}
      <Modal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        title="Importar Dados de Rupturas"
      >
        <div className="p-6">
          <p className="text-gray-600 mb-4">
            Selecione um arquivo para importar dados de rupturas de stock.
          </p>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Upload size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 mb-2">Arraste arquivos aqui ou clique para selecionar</p>
            <p className="text-sm text-gray-500">Formatos suportados: CSV, Excel</p>
          </div>
          
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setShowUploadModal(false)}>
              Cancelar
            </Button>
            <Button>
              Importar
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal de Filtros */}
      <Modal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        title="Filtros Avançados"
      >
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Secção
              </label>
              <Select
                value={filters.section}
                onChange={(value) => setFilters({...filters, section: value})}
                options={[
                  { value: 'all', label: 'Todas as secções' },
                  { value: 'fresh', label: 'Frescos' },
                  { value: 'frozen', label: 'Congelados' },
                  { value: 'dry', label: 'Secos' }
                ]}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cliente
              </label>
              <Select
                value={filters.client}
                onChange={(value) => setFilters({...filters, client: value})}
                options={[
                  { value: 'all', label: 'Todos os clientes' },
                  { value: 'tap', label: 'TAP Portugal' },
                  { value: 'azul', label: 'Azul Airlines' },
                  { value: 'lufthansa', label: 'Lufthansa' }
                ]}
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setShowFilterModal(false)}>
              Cancelar
            </Button>
            <Button onClick={() => {
              applyFilters();
              setShowFilterModal(false);
            }}>
              Aplicar Filtros
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default StockRupturesPage;
