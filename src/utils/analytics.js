// Data analysis and Machine Learning utilities

/**
 * Calculate week number from date
 * @param {Date} date - Date to calculate week for
 * @returns {string} - Formatted week string (e.g., "3ª Semana de Janeiro/2024")
 */
export const calculateWeekFromDate = (date) => {
  const d = new Date(date);
  const startOfYear = new Date(d.getFullYear(), 0, 1);
  const startOfMonth = new Date(d.getFullYear(), d.getMonth(), 1);
  
  // Calculate week of year
  const dayOfYear = Math.floor((d - startOfYear) / (24 * 60 * 60 * 1000)) + 1;
  const weekOfYear = Math.ceil(dayOfYear / 7);
  
  // Calculate week of month
  const dayOfMonth = d.getDate();
  const weekOfMonth = Math.ceil(dayOfMonth / 7);
  
  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  
  const monthName = months[d.getMonth()];
  const year = d.getFullYear();
  
  return `${weekOfMonth}ª Semana de ${monthName}/${year}`;
};

/**
 * Predict future ruptures using simple linear regression
 * @param {Array} historicalData - Historical rupture data
 * @param {number} daysAhead - Number of days to predict ahead
 * @returns {Array} - Predicted ruptures
 */
export const predictRuptures = (historicalData, daysAhead = 7) => {
  if (!historicalData || historicalData.length < 7) {
    return [];
  }

  // Group data by product code
  const productGroups = historicalData.reduce((acc, item) => {
    if (!acc[item.codigo]) {
      acc[item.codigo] = [];
    }
    acc[item.codigo].push({
      date: new Date(item.data),
      quantity: item.quantidadeFaltante || 0,
      frequency: 1
    });
    return acc;
  }, {});

  const predictions = [];

  Object.entries(productGroups).forEach(([codigo, data]) => {
    if (data.length < 3) return; // Need at least 3 data points

    // Sort by date
    data.sort((a, b) => a.date - b.date);

    // Calculate trend
    const trend = calculateTrend(data);
    const seasonality = calculateSeasonality(data);
    
    // Generate predictions
    for (let i = 1; i <= daysAhead; i++) {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + i);
      
      const prediction = {
        codigo,
        data: futureDate.toISOString().split('T')[0],
        probabilidade: Math.min(Math.max(trend.probability * seasonality, 0.1), 0.9),
        quantidadePrevista: Math.max(Math.round(trend.quantity * seasonality), 1),
        confianca: trend.confidence,
        tipo: 'predicao',
        semana: calculateWeekFromDate(futureDate)
      };

      if (prediction.probabilidade > 0.3) {
        predictions.push(prediction);
      }
    }
  });

  return predictions.sort((a, b) => b.probabilidade - a.probabilidade);
};

/**
 * Calculate trend from historical data
 * @param {Array} data - Historical data points
 * @returns {Object} - Trend analysis
 */
const calculateTrend = (data) => {
  const n = data.length;
  const sumX = data.reduce((sum, _, i) => sum + i, 0);
  const sumY = data.reduce((sum, item) => sum + item.quantity, 0);
  const sumXY = data.reduce((sum, item, i) => sum + (i * item.quantity), 0);
  const sumXX = data.reduce((sum, _, i) => sum + (i * i), 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  const avgQuantity = sumY / n;
  const frequency = data.length / 30; // Assuming 30-day period

  return {
    probability: Math.min(frequency * 0.7, 0.8),
    quantity: Math.max(avgQuantity + slope, 1),
    confidence: Math.max(0.3, 1 - Math.abs(slope) / avgQuantity)
  };
};

/**
 * Calculate seasonality factor
 * @param {Array} data - Historical data points
 * @returns {number} - Seasonality multiplier
 */
const calculateSeasonality = (data) => {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const weekOfMonth = Math.ceil(now.getDate() / 7);
  
  // Simple seasonality based on day of week and week of month
  const weekdayFactor = dayOfWeek >= 1 && dayOfWeek <= 5 ? 1.2 : 0.8;
  const monthFactor = weekOfMonth <= 2 ? 1.1 : 0.9;
  
  return weekdayFactor * monthFactor;
};

/**
 * Analyze rupture patterns
 * @param {Array} data - Rupture data
 * @returns {Object} - Pattern analysis
 */
export const analyzePatterns = (data) => {
  if (!data || data.length === 0) {
    return {
      topProducts: [],
      criticalSections: [],
      timePatterns: {},
      recommendations: []
    };
  }

  // Top products with most ruptures
  const productCounts = data.reduce((acc, item) => {
    acc[item.codigo] = (acc[item.codigo] || 0) + 1;
    return acc;
  }, {});

  const topProducts = Object.entries(productCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([codigo, count]) => {
      const product = data.find(item => item.codigo === codigo);
      return {
        codigo,
        descricao: product?.descricao || '',
        occurrences: count,
        avgQuantity: data.filter(item => item.codigo === codigo)
          .reduce((sum, item) => sum + (item.quantidadeFaltante || 0), 0) / count
      };
    });

  // Critical sections
  const sectionCounts = data.reduce((acc, item) => {
    acc[item.secao] = (acc[item.secao] || 0) + 1;
    return acc;
  }, {});

  const criticalSections = Object.entries(sectionCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([secao, count]) => ({
      secao,
      occurrences: count,
      percentage: (count / data.length) * 100
    }));

  // Time patterns
  const timePatterns = analyzeTimePatterns(data);

  // Generate recommendations
  const recommendations = generateRecommendations(topProducts, criticalSections, timePatterns);

  return {
    topProducts,
    criticalSections,
    timePatterns,
    recommendations
  };
};

/**
 * Analyze time-based patterns
 * @param {Array} data - Rupture data
 * @returns {Object} - Time pattern analysis
 */
const analyzeTimePatterns = (data) => {
  const patterns = {
    byDay: {},
    byWeek: {},
    byMonth: {},
    trends: []
  };

  data.forEach(item => {
    if (!item.data) return;

    const date = new Date(item.data);
    const dayOfWeek = date.getDay();
    const week = calculateWeekFromDate(date);
    const month = date.getMonth();

    patterns.byDay[dayOfWeek] = (patterns.byDay[dayOfWeek] || 0) + 1;
    patterns.byWeek[week] = (patterns.byWeek[week] || 0) + 1;
    patterns.byMonth[month] = (patterns.byMonth[month] || 0) + 1;
  });

  return patterns;
};

/**
 * Generate recommendations based on analysis
 * @param {Array} topProducts - Top problematic products
 * @param {Array} criticalSections - Critical sections
 * @param {Object} timePatterns - Time patterns
 * @returns {Array} - Recommendations
 */
const generateRecommendations = (topProducts, criticalSections, timePatterns) => {
  const recommendations = [];

  // Product-based recommendations
  if (topProducts.length > 0) {
    recommendations.push({
      type: 'products',
      priority: 'high',
      title: 'Produtos Críticos Identificados',
      description: `${topProducts.length} produtos com rupturas frequentes necessitam de atenção especial`,
      actions: [
        'Aumentar stock mínimo',
        'Revisar fornecedores',
        'Implementar reposição automática'
      ]
    });
  }

  // Section-based recommendations
  if (criticalSections.length > 0) {
    const topSection = criticalSections[0];
    if (topSection.percentage > 30) {
      recommendations.push({
        type: 'sections',
        priority: 'high',
        title: `Secção ${topSection.secao} Crítica`,
        description: `${topSection.percentage.toFixed(1)}% das rupturas ocorrem nesta secção`,
        actions: [
          'Revisar processo de reposição',
          'Aumentar frequência de monitoramento',
          'Treinar equipe específica'
        ]
      });
    }
  }

  // Time-based recommendations
  const dayPattern = Object.entries(timePatterns.byDay || {})
    .sort(([,a], [,b]) => b - a)[0];
  
  if (dayPattern) {
    const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    recommendations.push({
      type: 'timing',
      priority: 'medium',
      title: 'Padrão Temporal Identificado',
      description: `Maior incidência de rupturas às ${days[dayPattern[0]]}`,
      actions: [
        'Antecipar reposição nos dias anteriores',
        'Revisar cronograma de entregas',
        'Ajustar turnos de trabalho'
      ]
    });
  }

  return recommendations;
};

/**
 * Calculate KPIs from rupture data
 * @param {Array} data - Rupture data
 * @param {Array} previousData - Previous period data for comparison
 * @returns {Object} - KPI metrics
 */
export const calculateKPIs = (data, previousData = []) => {
  const current = {
    total: data.length,
    critical: data.filter(item => item.prioridade === 'critica').length,
    resolved: data.filter(item => item.status === 'resolvido').length,
    pending: data.filter(item => item.status === 'pendente').length,
    avgResolutionTime: calculateAvgResolutionTime(data),
    totalImpact: data.reduce((sum, item) => sum + (item.impactoFinanceiro || 0), 0)
  };

  const previous = {
    total: previousData.length,
    critical: previousData.filter(item => item.prioridade === 'critica').length,
    resolved: previousData.filter(item => item.status === 'resolvido').length,
    pending: previousData.filter(item => item.status === 'pendente').length,
    totalImpact: previousData.reduce((sum, item) => sum + (item.impactoFinanceiro || 0), 0)
  };

  const calculateChange = (current, previous) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  return {
    totalRuptures: {
      value: current.total,
      change: calculateChange(current.total, previous.total),
      trend: current.total > previous.total ? 'up' : 'down'
    },
    criticalRuptures: {
      value: current.critical,
      change: calculateChange(current.critical, previous.critical),
      trend: current.critical > previous.critical ? 'up' : 'down'
    },
    resolutionRate: {
      value: current.total > 0 ? (current.resolved / current.total) * 100 : 0,
      change: calculateChange(
        current.total > 0 ? (current.resolved / current.total) * 100 : 0,
        previous.total > 0 ? (previous.resolved / previous.total) * 100 : 0
      ),
      trend: (current.resolved / current.total) > (previous.resolved / previous.total) ? 'up' : 'down'
    },
    avgResolutionTime: {
      value: current.avgResolutionTime,
      unit: 'hours'
    },
    financialImpact: {
      value: current.totalImpact,
      change: calculateChange(current.totalImpact, previous.totalImpact),
      trend: current.totalImpact > previous.totalImpact ? 'up' : 'down'
    }
  };
};

/**
 * Calculate average resolution time
 * @param {Array} data - Rupture data
 * @returns {number} - Average resolution time in hours
 */
const calculateAvgResolutionTime = (data) => {
  const resolvedItems = data.filter(item => 
    item.status === 'resolvido' && item.dataResolucao && item.data
  );

  if (resolvedItems.length === 0) return 0;

  const totalHours = resolvedItems.reduce((sum, item) => {
    const start = new Date(item.data);
    const end = new Date(item.dataResolucao);
    const hours = (end - start) / (1000 * 60 * 60);
    return sum + hours;
  }, 0);

  return Math.round(totalHours / resolvedItems.length);
};
