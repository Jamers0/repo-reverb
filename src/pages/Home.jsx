import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Monitor, 
  LayoutGrid, 
  Plus, 
  TrendingUp, 
  AlertTriangle, 
  Calendar,
  Package,
  Truck,
  ClipboardList
} from 'lucide-react';
import Card from '../components/ui/Card';

const Home = () => {
    const navigate = useNavigate();
    
    const modules = [
        { 
            title: 'Análise de Demanda', 
            icon: <TrendingUp className="w-16 h-16 text-blue-500" />, 
            path: '/demand-analysis',
            description: 'Previsão de necessidades 5-7 dias'
        },
        { 
            title: 'Rupturas de Stock', 
            icon: <AlertTriangle className="w-16 h-16 text-red-500" />, 
            path: '/stock-ruptures',
            description: 'Análise pré e pós-picking'
        },
        { 
            title: 'Produtos Vencendo', 
            icon: <Calendar className="w-16 h-16 text-yellow-500" />, 
            path: '/expiring-products',
            description: 'Gestão de produtos D+2'
        },
        { 
            title: 'Requisições sem Necessidades', 
            icon: <LayoutGrid className="w-16 h-16 text-green-500" />, 
            path: '/oprp1',
            description: 'Criar requisições diretas'
        },
        { 
            title: 'Report Viewer', 
            icon: <FileText className="w-16 h-16 text-purple-500" />, 
            path: '/opv32',
            description: 'Visualizar e gerar relatórios'
        },
        { 
            title: 'Gestão de Requisições', 
            icon: <Monitor className="w-16 h-16 text-indigo-500" />, 
            path: '/pr007',
            description: 'Gerir e acompanhar requisições'
        },
        { 
            title: 'Pedidos em Trânsito', 
            icon: <Truck className="w-16 h-16 text-orange-500" />, 
            path: '/transit-orders',
            description: 'Acompanhar pedidos do secundário'
        },
        { 
            title: 'Compras Pendentes', 
            icon: <Package className="w-16 h-16 text-teal-500" />, 
            path: '/pending-purchases',
            description: 'Compras já realizadas pendentes'
        },
    ];

    // Dados mockados para dashboard
    const dashboardStats = {
        rupturasCriticas: 5,
        produtosVencendo: 12,
        pedidosTransito: 8,
        comprasPendentes: 15,
        estoqueOk: 1250,
        necessidadeCompra: 23
    };

    return (
        <div className="space-y-4 sm:space-y-6 max-w-7xl mx-auto">
            <div className="text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Sistema de Gestão Logística</h1>
                <p className="text-gray-600 text-base sm:text-lg mt-1">Logística Integrada - Kibiona Logistics</p>
            </div>

            {/* Alertas Críticos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4">
                    <div className="flex items-center">
                        <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 mr-2 sm:mr-3 flex-shrink-0" />
                        <div className="min-w-0">
                            <h3 className="text-xs sm:text-sm font-medium text-red-800">Rupturas Críticas</h3>
                            <p className="text-xl sm:text-2xl font-bold text-red-600">{dashboardStats.rupturasCriticas}</p>
                            <p className="text-xs text-red-700 hidden sm:block">Requerem ação imediata</p>
                        </div>
                    </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4">
                    <div className="flex items-center">
                        <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 mr-2 sm:mr-3 flex-shrink-0" />
                        <div className="min-w-0">
                            <h3 className="text-xs sm:text-sm font-medium text-yellow-800">Produtos Vencendo</h3>
                            <p className="text-xl sm:text-2xl font-bold text-yellow-600">{dashboardStats.produtosVencendo}</p>
                            <p className="text-xs text-yellow-700 hidden sm:block">Regra D+2 aplicada</p>
                        </div>
                    </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 sm:col-span-2 lg:col-span-1">
                    <div className="flex items-center">
                        <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 mr-2 sm:mr-3 flex-shrink-0" />
                        <div className="min-w-0">
                            <h3 className="text-xs sm:text-sm font-medium text-blue-800">Estoque OK</h3>
                            <p className="text-xl sm:text-2xl font-bold text-blue-600">{dashboardStats.estoqueOk}</p>
                            <p className="text-xs text-blue-700 hidden sm:block">Artigos com estoque adequado</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Módulos Principais */}
            <div>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Módulos do Sistema</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                    {modules.map((module) => (
                        <Card 
                            key={module.title} 
                            title={module.title} 
                            onClick={() => navigate(module.path)}
                            className="h-full"
                        >
                            <div className="flex flex-col items-center space-y-2 sm:space-y-3 p-2 sm:p-3">
                                <div className="transform scale-75 sm:scale-100">
                                    {module.icon}
                                </div>
                                <p className="text-xs text-gray-500 text-center px-1 sm:px-2 leading-tight">{module.description}</p>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Resumo Operacional */}
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo Operacional</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="text-center">
                        <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg mx-auto mb-2">
                            <Truck className="w-6 h-6 text-orange-600" />
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{dashboardStats.pedidosTransito}</p>
                        <p className="text-sm text-gray-600">Pedidos em Trânsito</p>
                        <p className="text-xs text-gray-500">Do estoque secundário</p>
                    </div>

                    <div className="text-center">
                        <div className="flex items-center justify-center w-12 h-12 bg-teal-100 rounded-lg mx-auto mb-2">
                            <Package className="w-6 h-6 text-teal-600" />
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{dashboardStats.comprasPendentes}</p>
                        <p className="text-sm text-gray-600">Compras Pendentes</p>
                        <p className="text-xs text-gray-500">Já realizadas, não entregues</p>
                    </div>

                    <div className="text-center">
                        <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-2">
                            <ClipboardList className="w-6 h-6 text-purple-600" />
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{dashboardStats.necessidadeCompra}</p>
                        <p className="text-sm text-gray-600">Necessidade Compra</p>
                        <p className="text-xs text-gray-500">Artigos a solicitar</p>
                    </div>

                    <div className="text-center">
                        <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mx-auto mb-2">
                            <TrendingUp className="w-6 h-6 text-green-600" />
                        </div>
                        <p className="text-2xl font-bold text-gray-900">94%</p>
                        <p className="text-sm text-gray-600">Taxa de Cobertura</p>
                        <p className="text-xs text-gray-500">Próximos 5 dias</p>
                    </div>
                </div>
            </div>

            {/* Informações do Sistema */}
            <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Logística Integrada - Kibiona Logistics</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                        <p><strong>Responsabilidade:</strong> Gestão de estoque principal e coordenação com estoque secundário</p>
                        <p><strong>Objetivo:</strong> Garantir disponibilidade de artigos para todas as secções</p>
                    </div>
                    <div>
                        <p><strong>Último Update:</strong> {new Date().toLocaleString('pt-PT')}</p>
                        <p><strong>Próxima Análise:</strong> Automática a cada 4 horas</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
