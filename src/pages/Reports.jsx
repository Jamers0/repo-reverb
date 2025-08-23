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
  CheckCircle
} from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Select from '../components/ui/Select';
import Input from '../components/ui/Input';
import Breadcrumbs from '../components/shared/Breadcrumbs';
import InteractiveDashboard from '../components/shared/InteractiveDashboard';
import { useData } from '../contexts/DataContextSimple';
import { calculateKPIs, analyzePatterns } from '../utils/analytics';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ReportsPage = () => {
  const { rupturesData, filters } = useData();
  const [selectedTemplate, setSelectedTemplate] = useState('performance');
  const [dateRange, setDateRange] = useState('month');
  const [customDateStart, setCustomDateStart] = useState('');
  const [customDateEnd, setCustomDateEnd] = useState('');
  const [reportFilters, setReportFilters] = useState({
    section: 'all',
    priority: 'all',
    status: 'all',
    client: 'all'
  });
  const [showPreview, setShowPreview] = useState(true);

  // Filter data based on date range and filters
  const filteredData = useMemo(() => {
    let filtered = [...rupturesData];
    
    // Apply date filter
    const now = new Date();
    let startDate, endDate = now;
    
    switch (dateRange) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'quarter':
        startDate = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      case 'custom':
        startDate = customDateStart ? new Date(customDateStart) : new Date(0);
        endDate = customDateEnd ? new Date(customDateEnd) : now;
        break;
      default:
        startDate = new Date(0);
    }
    
    filtered = filtered.filter(item => {
      const itemDate = new Date(item.data);
      return itemDate >= startDate && itemDate <= endDate;
    });
    
    // Apply other filters
    Object.entries(reportFilters).forEach(([key, value]) => {
      if (value !== 'all') {
        filtered = filtered.filter(item => item[key] === value);
      }
    });
    
    return filtered;
  }, [rupturesData, dateRange, customDateStart, customDateEnd, reportFilters]);

  // Calculate metrics
  const metrics = useMemo(() => {
    return calculateKPIs(filteredData);
  }, [filteredData]);

  const patterns = useMemo(() => {
    return analyzePatterns(filteredData);
  }, [filteredData]);

  // Report templates
  const reportTemplates = [
    {
      id: 'performance',
      name: 'Relatório de Performance',
      description: 'Análise geral de rupturas e indicadores de performance',
      icon: TrendingUp,
      sections: ['kpis', 'trends', 'topProducts', 'recommendations']
    },
    {
      id: 'financial',
      name: 'Relatório Financeiro',
      description: 'Impacto financeiro das rupturas e custos associados',
      icon: DollarSign,
      sections: ['financialKpis', 'costAnalysis', 'impactBySection', 'savings']
    },
    {
      id: 'operational',
      name: 'Relatório Operacional',
      description: 'Análise operacional detalhada por seção e produto',
      icon: Target,
      sections: ['operationalKpis', 'sectionAnalysis', 'productDetails', 'timeAnalysis']
    },
    {
      id: 'management',
      name: 'Relatório Executivo',
      description: 'Resumo executivo com insights estratégicos',
      icon: BarChart3,
      sections: ['executiveKpis', 'strategicInsights', 'actionPlan', 'nextSteps']
    }
  ];

  // Date range options
  const dateRangeOptions = [
    { value: 'today', label: 'Hoje' },
    { value: 'week', label: 'Esta Semana' },
    { value: 'month', label: 'Este Mês' },
    { value: 'quarter', label: 'Este Trimestre' },
    { value: 'year', label: 'Este Ano' },
    { value: 'custom', label: 'Período Personalizado' }
  ];

  // Export to Excel
  const exportToExcel = async () => {
    const workbook = XLSX.utils.book_new();
    
    // Summary sheet
    const summaryData = [
      ['Relatório de Rupturas de Stock'],
      ['Período:', `${dateRange === 'custom' ? `${customDateStart} a ${customDateEnd}` : dateRangeOptions.find(opt => opt.value === dateRange)?.label}`],
      ['Gerado em:', new Date().toLocaleString('pt-PT')],
      [''],
      ['INDICADORES PRINCIPAIS'],
      ['Total de Rupturas', metrics.totalRuptures?.value || 0],
      ['Rupturas Críticas', metrics.criticalRuptures?.value || 0],
      ['Taxa de Resolução (%)', metrics.resolutionRate?.value || 0],
      ['Tempo Médio de Resolução (h)', metrics.avgResolutionTime?.value || 0],
      ['Impacto Financeiro (€)', metrics.financialImpact?.value || 0],
    ];
    
    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Resumo');
    
    // Data sheet
    const dataSheet = XLSX.utils.json_to_sheet(filteredData.map(item => ({
      'Código': item.codigo,
      'Descrição': item.descricao,
      'Secção': item.secao,
      'Cliente': item.cliente,
      'Data': item.data,
      'Quantidade Faltante': item.quantidadeFaltante,
      'Prioridade': item.prioridade,
      'Status': item.status,
      'Tipo Ruptura': item.tipoRuptura,
      'Impacto Financeiro': item.impactoFinanceiro,
      'Semana': item.semana
    })));
    
    XLSX.utils.book_append_sheet(workbook, dataSheet, 'Dados Detalhados');
    
    // Top products sheet
    if (patterns.topProducts.length > 0) {
      const topProductsSheet = XLSX.utils.json_to_sheet(patterns.topProducts.map(product => ({
        'Código': product.codigo,
        'Descrição': product.descricao,
        'Ocorrências': product.occurrences,
        'Quantidade Média': product.avgQuantity
      })));
      
      XLSX.utils.book_append_sheet(workbook, topProductsSheet, 'Top Produtos');
    }
    
    // Critical sections sheet
    if (patterns.criticalSections.length > 0) {
      const sectionsSheet = XLSX.utils.json_to_sheet(patterns.criticalSections.map(section => ({
        'Secção': section.secao,
        'Ocorrências': section.occurrences,
        'Percentual (%)': section.percentage
      })));
      
      XLSX.utils.book_append_sheet(workbook, sectionsSheet, 'Secções Críticas');
    }
    
    // Generate filename
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `relatorio-rupturas-${selectedTemplate}-${timestamp}.xlsx`;
    
    // Download file
    XLSX.writeFile(workbook, filename);
  };

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    let yPosition = 20;
    
    // Header
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('Relatório de Rupturas de Stock', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 15;
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Template: ${reportTemplates.find(t => t.id === selectedTemplate)?.name}`, 20, yPosition);
    yPosition += 8;
    doc.text(`Período: ${dateRange === 'custom' ? `${customDateStart} a ${customDateEnd}` : dateRangeOptions.find(opt => opt.value === dateRange)?.label}`, 20, yPosition);
    yPosition += 8;
    doc.text(`Gerado em: ${new Date().toLocaleString('pt-PT')}`, 20, yPosition);
    yPosition += 15;
    
    // KPIs Table
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Indicadores Principais', 20, yPosition);
    yPosition += 10;
    
    const kpiData = [
      ['Indicador', 'Valor', 'Variação'],
      ['Total de Rupturas', (metrics.totalRuptures?.value || 0).toString(), `${(metrics.totalRuptures?.change || 0).toFixed(1)}%`],
      ['Rupturas Críticas', (metrics.criticalRuptures?.value || 0).toString(), `${(metrics.criticalRuptures?.change || 0).toFixed(1)}%`],
      ['Taxa de Resolução', `${(metrics.resolutionRate?.value || 0).toFixed(1)}%`, `${(metrics.resolutionRate?.change || 0).toFixed(1)}%`],
      ['Tempo Médio Resolução', `${metrics.avgResolutionTime?.value || 0}h`, '-'],
      ['Impacto Financeiro', `€${(metrics.financialImpact?.value || 0).toLocaleString('pt-PT')}`, `${(metrics.financialImpact?.change || 0).toFixed(1)}%`]
    ];
    
    doc.autoTable({
      head: [kpiData[0]],
      body: kpiData.slice(1),
      startY: yPosition,
      theme: 'grid',
      styles: { fontSize: 10 },
      headStyles: { fillColor: [0, 169, 157] }
    });
    
    yPosition = doc.lastAutoTable.finalY + 20;
    
    // Top Products
    if (patterns.topProducts.length > 0) {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Top 10 Produtos Mais Afetados', 20, yPosition);
      yPosition += 10;
      
      const productData = [
        ['Código', 'Descrição', 'Ocorrências', 'Qtd. Média'],
        ...patterns.topProducts.slice(0, 10).map(product => [
          product.codigo,
          product.descricao.substring(0, 30) + (product.descricao.length > 30 ? '...' : ''),
          product.occurrences.toString(),
          product.avgQuantity.toFixed(0)
        ])
      ];
      
      doc.autoTable({
        head: [productData[0]],
        body: productData.slice(1),
        startY: yPosition,
        theme: 'grid',
        styles: { fontSize: 9 },
        headStyles: { fillColor: [0, 169, 157] },
        columnStyles: {
          1: { cellWidth: 60 }
        }
      });
      
      yPosition = doc.lastAutoTable.finalY + 20;
    }
    
    // Recommendations
    if (patterns.recommendations.length > 0) {
      if (yPosition > 200) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Recomendações Estratégicas', 20, yPosition);
      yPosition += 10;
      
      patterns.recommendations.slice(0, 5).forEach((rec, index) => {
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text(`${index + 1}. ${rec.title}`, 20, yPosition);
        yPosition += 6;
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        const lines = doc.splitTextToSize(rec.description, pageWidth - 40);
        doc.text(lines, 20, yPosition);
        yPosition += lines.length * 5 + 8;
        
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }
      });
    }
    
    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text(`Página ${i} de ${pageCount}`, pageWidth - 30, doc.internal.pageSize.height - 10);
      doc.text('Sistema de Gestão Logística - Kibiona', 20, doc.internal.pageSize.height - 10);
    }
    
    // Generate filename and download
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `relatorio-rupturas-${selectedTemplate}-${timestamp}.pdf`;
    doc.save(filename);
  };

  // Send report by email
  const sendByEmail = () => {
    const subject = encodeURIComponent(`Relatório de Rupturas - ${reportTemplates.find(t => t.id === selectedTemplate)?.name}`);
    const body = encodeURIComponent(`
Relatório de Rupturas de Stock

Template: ${reportTemplates.find(t => t.id === selectedTemplate)?.name}
Período: ${dateRange === 'custom' ? `${customDateStart} a ${customDateEnd}` : dateRangeOptions.find(opt => opt.value === dateRange)?.label}
Gerado em: ${new Date().toLocaleString('pt-PT')}

Resumo dos Indicadores:
- Total de Rupturas: ${metrics.totalRuptures?.value || 0}
- Rupturas Críticas: ${metrics.criticalRuptures?.value || 0}
- Taxa de Resolução: ${(metrics.resolutionRate?.value || 0).toFixed(1)}%
- Impacto Financeiro: €${(metrics.financialImpact?.value || 0).toLocaleString('pt-PT')}

Este relatório foi gerado automaticamente pelo Sistema de Gestão Logística.
    `);
    
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
  };

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Relatórios', href: '/relatorios' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Breadcrumbs items={breadcrumbItems} />
        <div className="mt-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Relatórios</h1>
            <p className="text-gray-600">Gere relatórios profissionais de análise de rupturas</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              {showPreview ? 'Ocultar' : 'Mostrar'} Prévia
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration Panel */}
        <div className="lg:col-span-1">
          <Card className="p-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Configuração do Relatório</h3>
              
              {/* Template Selection */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Template do Relatório
                </label>
                <div className="space-y-2">
                  {reportTemplates.map((template) => (
                    <div
                      key={template.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedTemplate === template.id
                          ? 'border-pw-green bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedTemplate(template.id)}
                    >
                      <div className="flex items-center gap-3">
                        <template.icon className={`w-5 h-5 ${
                          selectedTemplate === template.id ? 'text-pw-green' : 'text-gray-400'
                        }`} />
                        <div>
                          <h4 className="font-medium text-sm">{template.name}</h4>
                          <p className="text-xs text-gray-500">{template.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Date Range */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Período do Relatório
                </label>
                <Select
                  value={dateRange}
                  onChange={setDateRange}
                  options={dateRangeOptions}
                />
                
                {dateRange === 'custom' && (
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="date"
                      value={customDateStart}
                      onChange={(e) => setCustomDateStart(e.target.value)}
                      placeholder="Data inicial"
                    />
                    <Input
                      type="date"
                      value={customDateEnd}
                      onChange={(e) => setCustomDateEnd(e.target.value)}
                      placeholder="Data final"
                    />
                  </div>
                )}
              </div>

              {/* Filters */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Filtros Adicionais
                </label>
                
                <Select
                  value={reportFilters.section}
                  onChange={(value) => setReportFilters(prev => ({ ...prev, section: value }))}
                  options={[
                    { value: 'all', label: 'Todas as Secções' },
                    { value: 'CF', label: 'CF - Cozinha Fria' },
                    { value: 'CQ', label: 'CQ - Cozinha Quente' },
                    { value: 'PAS', label: 'PAS - Pastelaria' }
                  ]}
                  placeholder="Secção"
                />
                
                <Select
                  value={reportFilters.priority}
                  onChange={(value) => setReportFilters(prev => ({ ...prev, priority: value }))}
                  options={[
                    { value: 'all', label: 'Todas as Prioridades' },
                    { value: 'critica', label: 'Crítica' },
                    { value: 'alta', label: 'Alta' },
                    { value: 'media', label: 'Média' },
                    { value: 'baixa', label: 'Baixa' }
                  ]}
                  placeholder="Prioridade"
                />
              </div>
            </div>

            {/* Export Actions */}
            <div className="space-y-3 pt-4 border-t">
              <h4 className="font-medium text-sm text-gray-700">Exportar Relatório</h4>
              
              <div className="space-y-2">
                <Button
                  onClick={exportToExcel}
                  className="w-full flex items-center justify-center gap-2"
                  disabled={filteredData.length === 0}
                >
                  <Download className="w-4 h-4" />
                  Exportar Excel
                </Button>
                
                <Button
                  variant="outline"
                  onClick={exportToPDF}
                  className="w-full flex items-center justify-center gap-2"
                  disabled={filteredData.length === 0}
                >
                  <FileText className="w-4 h-4" />
                  Exportar PDF
                </Button>
                
                <Button
                  variant="outline"
                  onClick={sendByEmail}
                  className="w-full flex items-center justify-center gap-2"
                  disabled={filteredData.length === 0}
                >
                  <Mail className="w-4 h-4" />
                  Enviar por Email
                </Button>
              </div>
            </div>

            {/* Data Summary */}
            <div className="pt-4 border-t">
              <h4 className="font-medium text-sm text-gray-700 mb-2">Resumo dos Dados</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p>Total de registros: {filteredData.length}</p>
                <p>Período selecionado: {
                  dateRange === 'custom' 
                    ? `${customDateStart} a ${customDateEnd}`
                    : dateRangeOptions.find(opt => opt.value === dateRange)?.label
                }</p>
                <p>Template: {reportTemplates.find(t => t.id === selectedTemplate)?.name}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Preview Panel */}
        {showPreview && (
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Prévia do Relatório</h3>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.print()}
                    className="flex items-center gap-1"
                  >
                    <Printer className="w-4 h-4" />
                    Imprimir
                  </Button>
                </div>
              </div>

              {filteredData.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhum dado encontrado para o período selecionado</p>
                  <p className="text-sm">Ajuste os filtros para ver o relatório</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Report Header */}
                  <div className="text-center pb-4 border-b">
                    <h2 className="text-xl font-bold text-gray-900">
                      {reportTemplates.find(t => t.id === selectedTemplate)?.name}
                    </h2>
                    <p className="text-gray-600 mt-2">
                      Período: {dateRange === 'custom' 
                        ? `${customDateStart} a ${customDateEnd}`
                        : dateRangeOptions.find(opt => opt.value === dateRange)?.label
                      }
                    </p>
                    <p className="text-sm text-gray-500">
                      Gerado em: {new Date().toLocaleString('pt-PT')}
                    </p>
                  </div>

                  {/* Dashboard Preview */}
                  <InteractiveDashboard
                    data={filteredData}
                    className="bg-gray-50 rounded-lg p-4"
                  />
                </div>
              )}
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;
