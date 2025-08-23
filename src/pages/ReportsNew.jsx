import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Download, 
  Calendar, 
  Filter,
  Printer,
  Mail,
  Share2,
  BarChart3,
  TrendingUp,
  Target,
  Package,
  Users,
  DollarSign,
  Clock,
  CheckCircle,
  AlertTriangle,
  Eye,
  Settings,
  Search,
  RefreshCw,
  Plus
} from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Select from '../components/ui/Select';
import Input from '../components/ui/Input';
import Breadcrumbs from '../components/shared/Breadcrumbs';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ReportsPage = () => {
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'templates', 'custom', 'scheduled'
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [dateRange, setDateRange] = useState('month');
  const [customDateStart, setCustomDateStart] = useState('');
  const [customDateEnd, setCustomDateEnd] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Dados de exemplo para relatórios
  const sampleData = [
    { id: 1, tipo: 'Ruptura', secao: 'CF', item: 'Banana 4/6', data: '2024-01-20', status: 'Crítico' },
    { id: 2, tipo: 'Transferência', secao: 'CQ', item: 'Peito Frango', data: '2024-01-21', status: 'Normal' },
    { id: 3, tipo: 'Requisição', secao: 'PAS', item: 'Croissant', data: '2024-01-22', status: 'Pendente' }
  ];

  // Templates de relatórios
  const reportTemplates = [
    {
      id: 'ruptures-summary',
      name: 'Resumo de Rupturas',
      description: 'Relatório consolidado de todas as rupturas por período',
      category: 'Operacional',
      icon: AlertTriangle,
      fields: ['Data', 'Seção', 'Material', 'Tipo de Ruptura', 'Status']
    },
    {
      id: 'transfer-orders',
      name: 'Ordens de Transferência',
      description: 'Relatório detalhado de ordens de transferência',
      category: 'Logística',
      icon: Package,
      fields: ['ID Ordem', 'Origem', 'Destino', 'Cliente', 'Status', 'Data']
    },
    {
      id: 'performance-kpis',
      name: 'Indicadores de Performance',
      description: 'KPIs operacionais e métricas de eficiência',
      category: 'Gestão',
      icon: TrendingUp,
      fields: ['Período', 'Taxa de Ruptura', 'Tempo Médio', 'Eficiência']
    },
    {
      id: 'client-analysis',
      name: 'Análise por Cliente',
      description: 'Relatório de performance por cliente',
      category: 'Comercial',
      icon: Users,
      fields: ['Cliente', 'Volume', 'Frequência', 'Satisfação']
    },
    {
      id: 'inventory-status',
      name: 'Status de Inventário',
      description: 'Relatório de status atual do inventário',
      category: 'Estoque',
      icon: Package,
      fields: ['Material', 'Stock CT', 'Stock FF', 'Em Trânsito', 'Status']
    },
    {
      id: 'financial-summary',
      name: 'Resumo Financeiro',
      description: 'Impacto financeiro das operações',
      category: 'Financeiro',
      icon: DollarSign,
      fields: ['Período', 'Custo Total', 'Economia', 'ROI']
    }
  ];

  // Opções de período
  const dateRangeOptions = [
    { value: 'today', label: 'Hoje' },
    { value: 'yesterday', label: 'Ontem' },
    { value: 'week', label: 'Esta Semana' },
    { value: 'month', label: 'Este Mês' },
    { value: 'quarter', label: 'Este Trimestre' },
    { value: 'year', label: 'Este Ano' },
    { value: 'custom', label: 'Período Personalizado' }
  ];

  // Métricas do dashboard
  const dashboardMetrics = {
    totalReports: 156,
    generatedToday: 12,
    scheduledReports: 8,
    activeTemplates: 6
  };

  // Filtrar templates
  const filteredTemplates = reportTemplates.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Gerar relatório em Excel
  const generateExcelReport = (template) => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(sampleData);
    XLSX.utils.book_append_sheet(wb, ws, 'Relatório');
    XLSX.writeFile(wb, `${template.name.replace(/\s+/g, '_')}.xlsx`);
  };

  // Gerar relatório em PDF
  const generatePDFReport = (template) => {
    const doc = new jsPDF();
    
    // Cabeçalho
    doc.setFontSize(18);
    doc.text(template.name, 20, 20);
    
    doc.setFontSize(12);
    doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, 20, 30);
    doc.text(`Período: ${dateRange}`, 20, 40);
    
    // Tabela
    const tableData = sampleData.map(item => [
      item.id,
      item.tipo,
      item.secao,
      item.item,
      item.data,
      item.status
    ]);
    
    doc.autoTable({
      head: [['ID', 'Tipo', 'Seção', 'Item', 'Data', 'Status']],
      body: tableData,
      startY: 50,
    });
    
    doc.save(`${template.name.replace(/\s+/g, '_')}.pdf`);
  };

  // Renderizar Dashboard
  const renderDashboard = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Dashboard de Relatórios</h2>
        <p className="text-gray-600">Visão geral da atividade de relatórios</p>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Relatórios</p>
              <p className="text-3xl font-bold text-gray-900">{dashboardMetrics.totalReports}</p>
            </div>
            <FileText className="h-10 w-10 text-blue-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Gerados Hoje</p>
              <p className="text-3xl font-bold text-gray-900">{dashboardMetrics.generatedToday}</p>
            </div>
            <Clock className="h-10 w-10 text-green-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Agendados</p>
              <p className="text-3xl font-bold text-gray-900">{dashboardMetrics.scheduledReports}</p>
            </div>
            <Calendar className="h-10 w-10 text-purple-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Templates Ativos</p>
              <p className="text-3xl font-bold text-gray-900">{dashboardMetrics.activeTemplates}</p>
            </div>
            <Target className="h-10 w-10 text-orange-600" />
          </div>
        </Card>
      </div>

      {/* Relatórios Recentes */}
      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Relatórios Recentes</h3>
        <div className="space-y-3">
          {sampleData.slice(0, 5).map((item) => (
            <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium text-gray-900">{item.tipo} - {item.item}</p>
                  <p className="text-sm text-gray-600">{item.secao} • {item.data}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  item.status === 'Crítico' ? 'bg-red-100 text-red-800' :
                  item.status === 'Normal' ? 'bg-green-100 text-green-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {item.status}
                </span>
                <Button variant="outline" size="sm">
                  <Eye size={14} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  // Renderizar Templates
  const renderTemplates = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Templates de Relatórios</h2>
          <p className="text-gray-600">Escolha um template e configure os parâmetros</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus size={16} />
          Novo Template
        </Button>
      </div>

      {/* Filtros */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Buscar templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select
            value={dateRange}
            onChange={setDateRange}
            options={dateRangeOptions}
          />
          {dateRange === 'custom' && (
            <div className="flex gap-2">
              <Input
                type="date"
                value={customDateStart}
                onChange={(e) => setCustomDateStart(e.target.value)}
                placeholder="Data início"
              />
              <Input
                type="date"
                value={customDateEnd}
                onChange={(e) => setCustomDateEnd(e.target.value)}
                placeholder="Data fim"
              />
            </div>
          )}
        </div>
      </Card>

      {/* Grid de Templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => {
          const IconComponent = template.icon;
          return (
            <Card key={template.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <IconComponent className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{template.name}</h3>
                      <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                        {template.category}
                      </span>
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600">{template.description}</p>
                
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-2">Campos inclusos:</p>
                  <div className="flex flex-wrap gap-1">
                    {template.fields.slice(0, 3).map((field, index) => (
                      <span key={index} className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded">
                        {field}
                      </span>
                    ))}
                    {template.fields.length > 3 && (
                      <span className="text-xs px-2 py-1 bg-gray-50 text-gray-600 rounded">
                        +{template.fields.length - 3}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2 pt-2">
                  <Button 
                    size="sm" 
                    onClick={() => generateExcelReport(template)}
                    className="flex items-center gap-1 flex-1"
                  >
                    <Download size={14} />
                    Excel
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => generatePDFReport(template)}
                    className="flex items-center gap-1 flex-1"
                  >
                    <FileText size={14} />
                    PDF
                  </Button>
                  <Button size="sm" variant="outline" className="px-3">
                    <Settings size={14} />
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );

  // Renderizar Relatórios Personalizados
  const renderCustomReports = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Relatórios Personalizados</h2>
        <p className="text-gray-600">Crie relatórios sob medida com campos específicos</p>
      </div>

      <Card className="p-6">
        <div className="text-center py-12">
          <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Construtor de Relatórios</h3>
          <p className="text-gray-600 mb-6">
            Esta funcionalidade permite criar relatórios completamente personalizados.<br/>
            Em desenvolvimento para próxima versão.
          </p>
          <Button variant="outline">
            Solicitar Acesso Beta
          </Button>
        </div>
      </Card>
    </div>
  );

  // Renderizar Relatórios Agendados
  const renderScheduledReports = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Relatórios Agendados</h2>
          <p className="text-gray-600">Geração automática de relatórios em horários programados</p>
        </div>
        <Button className="flex items-center gap-2">
          <Clock size={16} />
          Novo Agendamento
        </Button>
      </div>

      <Card className="p-6">
        <div className="text-center py-12">
          <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Agendamento Automático</h3>
          <p className="text-gray-600 mb-6">
            Configure relatórios para serem gerados automaticamente.<br/>
            Funcionalidade em desenvolvimento.
          </p>
          <Button variant="outline">
            Configurar Agendamentos
          </Button>
        </div>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs 
          items={[
            { label: 'Sistema', href: '#' },
            { label: 'Relatórios', href: '#' }
          ]} 
        />

        {/* Navegação por Abas */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
                { id: 'templates', label: 'Templates', icon: FileText },
                { id: 'custom', label: 'Personalizados', icon: Settings },
                { id: 'scheduled', label: 'Agendados', icon: Calendar }
              ].map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm
                      ${activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }
                    `}
                  >
                    <IconComponent size={16} />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Conteúdo das Abas */}
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'templates' && renderTemplates()}
        {activeTab === 'custom' && renderCustomReports()}
        {activeTab === 'scheduled' && renderScheduledReports()}
      </div>
    </div>
  );
};

export default ReportsPage;
