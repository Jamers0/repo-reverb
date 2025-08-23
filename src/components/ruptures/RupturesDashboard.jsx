import React from 'react';
import { AlertTriangle, XCircle, Clock, Users, Package, TrendingUp } from 'lucide-react';
import Card from '../ui/Card';

const RupturesDashboard = ({ data, onCardClick }) => {
  const metrics = {
    totalRuptures: data.length,
    rupturesTotal: data.filter(item => item.tipoRuptura === 'total').length,
    rupturesParcial: data.filter(item => item.tipoRuptura === 'parcial').length,
    clientesAfetados: new Set(data.map(item => item.cliente)).size,
    seccoesAfetadas: new Set(data.map(item => item.secao)).size,
    valorImpacto: data.reduce((sum, item) => sum + (item.valorUnitario * item.quantidadeRuptura || 0), 0)
  };

  const DashboardCard = ({ title, value, subtitle, icon: Icon, color, onClick, gradient }) => (
    <Card 
      className={`p-6 cursor-pointer transition-all duration-200 hover:scale-105 ${gradient ? `bg-gradient-to-br ${gradient}` : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-2xl font-bold ${color === 'white' ? 'text-white' : 'text-gray-900'}`}>
            {typeof value === 'number' && value > 999 ? `${(value/1000).toFixed(1)}k` : value}
          </p>
          <p className={`text-sm ${color === 'white' ? 'text-white/80' : 'text-gray-600'}`}>
            {title}
          </p>
          {subtitle && (
            <p className={`text-xs mt-1 ${color === 'white' ? 'text-white/60' : 'text-gray-500'}`}>
              {subtitle}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color === 'white' ? 'bg-white/20' : `bg-${color}-100`}`}>
          <Icon className={`w-6 h-6 ${color === 'white' ? 'text-white' : `text-${color}-600`}`} />
        </div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Dashboard de Rupturas</h2>
        <p className="text-sm text-gray-600">
          Métricas em tempo real da análise de rupturas de stock
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard
          title="Total de Rupturas"
          value={metrics.totalRuptures}
          subtitle="Identificadas na análise"
          icon={AlertTriangle}
          color="blue"
          onClick={() => onCardClick('all')}
        />

        <DashboardCard
          title="Rupturas Totais"
          value={metrics.rupturesTotal}
          subtitle="Stock zerado"
          icon={XCircle}
          color="white"
          gradient="from-red-500 to-red-600"
          onClick={() => onCardClick('total')}
        />

        <DashboardCard
          title="Rupturas Parciais"
          value={metrics.rupturesParcial}
          subtitle="Stock insuficiente"
          icon={Clock}
          color="white"
          gradient="from-yellow-500 to-yellow-600"
          onClick={() => onCardClick('parcial')}
        />

        <DashboardCard
          title="Clientes Afetados"
          value={metrics.clientesAfetados}
          subtitle="Requerem atenção"
          icon={Users}
          color="purple"
          onClick={() => onCardClick('clientes')}
        />

        <DashboardCard
          title="Secções Afetadas"
          value={metrics.seccoesAfetadas}
          subtitle="Com rupturas"
          icon={Package}
          color="indigo"
          onClick={() => onCardClick('seccoes')}
        />

        <DashboardCard
          title="Impacto Financeiro"
          value={`€${(metrics.valorImpacto/1000).toFixed(1)}k`}
          subtitle="Valor estimado"
          icon={TrendingUp}
          color="green"
          onClick={() => onCardClick('impacto')}
        />
      </div>

      {/* Quick Stats Bar */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-lg font-semibold text-gray-900">
              {((metrics.rupturesTotal / metrics.totalRuptures) * 100 || 0).toFixed(1)}%
            </p>
            <p className="text-xs text-gray-600">Taxa Ruptura Total</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-900">
              {((metrics.rupturesParcial / metrics.totalRuptures) * 100 || 0).toFixed(1)}%
            </p>
            <p className="text-xs text-gray-600">Taxa Ruptura Parcial</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-900">
              {(metrics.valorImpacto / metrics.totalRuptures || 0).toFixed(0)}€
            </p>
            <p className="text-xs text-gray-600">Impacto Médio/Item</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-900">
              {data.filter(item => item.acaoTomada === 'resolvido').length}
            </p>
            <p className="text-xs text-gray-600">Rupturas Resolvidas</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RupturesDashboard;