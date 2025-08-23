import React, { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  DollarSign,
  Package,
  Users,
  Calendar,
  Target,
  Activity,
  BarChart3,
  Eye,
  EyeOff
} from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Select from '../ui/Select';
import { calculateKPIs, analyzePatterns } from '../../utils/analytics';

const InteractiveDashboard = ({ 
  data = [], 
  previousData = [],
  onChartClick,
  onKPIClick,
  className = ""
}) => {
  const [timeRange, setTimeRange] = useState('7days');
  const [selectedMetric, setSelectedMetric] = useState('ruptures');
  const [visibleCharts, setVisibleCharts] = useState(new Set(['kpis', 'trends', 'distribution', 'patterns']));

  // Calculate KPIs
  const kpis = useMemo(() => {
    return calculateKPIs(data, previousData);
  }, [data, previousData]);

  // Analyze patterns
  const patterns = useMemo(() => {
    return analyzePatterns(data);
  }, [data]);

  // Prepare chart data
  const chartData = useMemo(() => {
    // Group data by date for trend analysis
    const dateGroups = {};
    data.forEach(item => {
      if (!item.data) return;
      
      const date = item.data.split('T')[0]; // Get just the date part
      if (!dateGroups[date]) {
        dateGroups[date] = {
          date,
          total: 0,
          critical: 0,
          resolved: 0,
          pending: 0,
          impact: 0
        };
      }
      
      dateGroups[date].total += 1;
      if (item.prioridade === 'critica') dateGroups[date].critical += 1;
      if (item.status === 'resolvido') dateGroups[date].resolved += 1;
      if (item.status === 'pendente') dateGroups[date].pending += 1;
      dateGroups[date].impact += item.impactoFinanceiro || 0;
    });

    return Object.values(dateGroups).sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [data]);

  // Section distribution data
  const sectionData = useMemo(() => {
    const sections = {};
    data.forEach(item => {
      const section = item.secao || 'Sem Classificação';
      sections[section] = (sections[section] || 0) + 1;
    });

    return Object.entries(sections).map(([name, value]) => ({
      name,
      value,
      percentage: ((value / data.length) * 100).toFixed(1)
    }));
  }, [data]);

  // Priority distribution data
  const priorityData = useMemo(() => {
    const priorities = { critica: 0, alta: 0, media: 0, baixa: 0 };
    data.forEach(item => {
      const priority = item.prioridade || 'baixa';
      priorities[priority] = (priorities[priority] || 0) + 1;
    });

    return Object.entries(priorities).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
      color: {
        critica: '#ef4444',
        alta: '#f97316',
        media: '#eab308',
        baixa: '#22c55e'
      }[name.toLowerCase()]
    }));
  }, [data]);

  // Time range options
  const timeRangeOptions = [
    { value: '7days', label: 'Últimos 7 dias' },
    { value: '30days', label: 'Últimos 30 dias' },
    { value: '90days', label: 'Últimos 90 dias' },
    { value: 'custom', label: 'Personalizado' }
  ];

  // Chart visibility toggle
  const toggleChartVisibility = (chartId) => {
    const newVisible = new Set(visibleCharts);
    if (newVisible.has(chartId)) {
      newVisible.delete(chartId);
    } else {
      newVisible.add(chartId);
    }
    setVisibleCharts(newVisible);
  };

  // KPI Card Component
  const KPICard = ({ title, value, change, trend, icon: Icon, onClick, format = 'number' }) => {
    const formatValue = (val) => {
      switch (format) {
        case 'currency':
          return new Intl.NumberFormat('pt-PT', {
            style: 'currency',
            currency: 'EUR'
          }).format(val);
        case 'percentage':
          return `${val.toFixed(1)}%`;
        case 'hours':
          return `${val}h`;
        default:
          return val.toLocaleString('pt-PT');
      }
    };

    return (
      <Card 
        className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
        onClick={() => onClick && onClick(title, value)}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatValue(value)}
            </p>
            {change !== undefined && (
              <div className={`flex items-center mt-1 text-sm ${
                trend === 'up' ? 'text-red-500' : 'text-green-500'
              }`}>
                {trend === 'up' ? (
                  <TrendingUp className="w-4 h-4 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 mr-1" />
                )}
                {Math.abs(change).toFixed(1)}%
              </div>
            )}
          </div>
          <div className={`p-3 rounded-full ${
            trend === 'up' ? 'bg-red-100' : 'bg-green-100'
          }`}>
            <Icon className={`w-6 h-6 ${
              trend === 'up' ? 'text-red-600' : 'text-green-600'
            }`} />
          </div>
        </div>
      </Card>
    );
  };

  // Custom Tooltip Component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const colors = {
    primary: '#00A99D',
    secondary: '#B7760C',
    danger: '#ef4444',
    warning: '#f97316',
    success: '#22c55e',
    info: '#3b82f6'
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Dashboard Controls */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard de Rupturas</h2>
        <div className="flex items-center gap-4">
          <Select
            value={timeRange}
            onChange={setTimeRange}
            options={timeRangeOptions}
            className="min-w-[150px]"
          />
          
          <div className="flex items-center gap-2">
            {[
              { id: 'kpis', label: 'KPIs', icon: Target },
              { id: 'trends', label: 'Tendências', icon: TrendingUp },
              { id: 'distribution', label: 'Distribuição', icon: BarChart3 },
              { id: 'patterns', label: 'Padrões', icon: Activity }
            ].map(({ id, label, icon: Icon }) => (
              <Button
                key={id}
                variant={visibleCharts.has(id) ? 'default' : 'ghost'}
                size="sm"
                onClick={() => toggleChartVisibility(id)}
                className="flex items-center gap-1"
              >
                {visibleCharts.has(id) ? (
                  <Eye className="w-3 h-3" />
                ) : (
                  <EyeOff className="w-3 h-3" />
                )}
                {label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* KPIs Section */}
      {visibleCharts.has('kpis') && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard
            title="Total de Rupturas"
            value={kpis.totalRuptures.value}
            change={kpis.totalRuptures.change}
            trend={kpis.totalRuptures.trend}
            icon={Package}
            onClick={onKPIClick}
          />
          
          <KPICard
            title="Rupturas Críticas"
            value={kpis.criticalRuptures.value}
            change={kpis.criticalRuptures.change}
            trend={kpis.criticalRuptures.trend}
            icon={AlertTriangle}
            onClick={onKPIClick}
          />
          
          <KPICard
            title="Taxa de Resolução"
            value={kpis.resolutionRate.value}
            change={kpis.resolutionRate.change}
            trend={kpis.resolutionRate.trend}
            icon={CheckCircle}
            format="percentage"
            onClick={onKPIClick}
          />
          
          <KPICard
            title="Tempo Médio de Resolução"
            value={kpis.avgResolutionTime.value}
            icon={Clock}
            format="hours"
            onClick={onKPIClick}
          />
        </div>
      )}

      {/* Trends Section */}
      {visibleCharts.has('trends') && chartData.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Trend Line Chart */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Tendência de Rupturas</h3>
              <Select
                value={selectedMetric}
                onChange={setSelectedMetric}
                options={[
                  { value: 'total', label: 'Total' },
                  { value: 'critical', label: 'Críticas' },
                  { value: 'resolved', label: 'Resolvidas' },
                  { value: 'pending', label: 'Pendentes' }
                ]}
                className="min-w-[120px]"
              />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString('pt-PT')}
                />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey={selectedMetric}
                  stroke={colors.primary}
                  strokeWidth={2}
                  dot={{ fill: colors.primary, strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Impact Area Chart */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Impacto Financeiro</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date"
                  tickFormatter={(value) => new Date(value).toLocaleDateString('pt-PT')}
                />
                <YAxis />
                <Tooltip 
                  content={<CustomTooltip />}
                  formatter={(value) => [
                    new Intl.NumberFormat('pt-PT', {
                      style: 'currency',
                      currency: 'EUR'
                    }).format(value),
                    'Impacto'
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="impact"
                  stroke={colors.secondary}
                  fill={colors.secondary}
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}

      {/* Distribution Section */}
      {visibleCharts.has('distribution') && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Section Distribution */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Distribuição por Secção</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sectionData.slice(0, 10)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="value" 
                  fill={colors.primary}
                  onClick={(data) => onChartClick && onChartClick('section', data)}
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Priority Distribution */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Distribuição por Prioridade</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={priorityData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  onClick={(data) => onChartClick && onChartClick('priority', data)}
                >
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}

      {/* Patterns Section */}
      {visibleCharts.has('patterns') && patterns.recommendations.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Insights e Recomendações</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Products */}
            <div>
              <h4 className="font-medium mb-3">Produtos Mais Afetados</h4>
              <div className="space-y-2">
                {patterns.topProducts.slice(0, 5).map((product, index) => (
                  <div key={product.codigo} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div>
                      <span className="font-medium">{product.codigo}</span>
                      <p className="text-sm text-gray-600 truncate">{product.descricao}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-medium">{product.occurrences} rupturas</span>
                      <p className="text-xs text-gray-500">
                        Média: {product.avgQuantity.toFixed(0)} un.
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div>
              <h4 className="font-medium mb-3">Recomendações Estratégicas</h4>
              <div className="space-y-3">
                {patterns.recommendations.slice(0, 3).map((rec, index) => (
                  <div key={index} className={`p-3 rounded-lg border-l-4 ${
                    rec.priority === 'high' ? 'border-red-500 bg-red-50' :
                    rec.priority === 'medium' ? 'border-yellow-500 bg-yellow-50' :
                    'border-blue-500 bg-blue-50'
                  }`}>
                    <h5 className="font-medium">{rec.title}</h5>
                    <p className="text-sm text-gray-600 mb-2">{rec.description}</p>
                    <ul className="text-xs text-gray-500">
                      {rec.actions.slice(0, 2).map((action, i) => (
                        <li key={i}>• {action}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default InteractiveDashboard;
