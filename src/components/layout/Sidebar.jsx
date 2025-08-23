import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home, 
  FileText, 
  LayoutGrid, 
  Search, 
  TrendingUp, 
  AlertTriangle, 
  Calendar,
  Truck,
  Package,
  FileSpreadsheet,
  ArrowLeftRight,
  X
} from 'lucide-react';
import Input from '../ui/Input';

const navItems = [
  { 
    path: "/demand-analysis", 
    icon: <TrendingUp size={18} />, 
    label: "Análise de Demanda", 
    code: "DEMAND",
    category: "Logística"
  },
  { 
    path: "/stock-ruptures", 
    icon: <AlertTriangle size={18} />, 
    label: "Rupturas de Stock", 
    code: "RUPTURES",
    category: "Logística"
  },
  { 
    path: "/expiring-products", 
    icon: <Calendar size={18} />, 
    label: "Produtos Vencendo", 
    code: "EXPIRING",
    category: "Logística"
  },
  { 
    path: "/transit-orders", 
    icon: <Truck size={18} />, 
    label: "Pedidos em Trânsito", 
    code: "TRANSIT",
    category: "Logística"
  },
  { 
    path: "/pending-purchases", 
    icon: <Package size={18} />, 
    label: "Compras Pendentes", 
    code: "PURCHASES",
    category: "Logística"
  },
  { 
    path: "/requisicoes-management", 
    icon: <FileSpreadsheet size={18} />, 
    label: "Gestão de Requisições", 
    code: "REQ001",
    category: "Gestão Logística"
  },
  { 
    path: "/rupture-analysis", 
    icon: <AlertTriangle size={18} />, 
    label: "Análise de Rupturas", 
    code: "ANA001",
    category: "Gestão Logística"
  },
  { 
    path: "/relatorios", 
    icon: <FileSpreadsheet size={18} />, 
    label: "Relatórios Profissionais", 
    code: "REPORTS",
    category: "Relatórios"
  },
  { 
    path: "/pr007", 
    icon: <FileText size={18} />, 
    label: "Gestão de Requisições", 
    code: "SGR003",
    category: "Gestão Logística"
  },
  { 
    path: "/opv32", 
    icon: <FileText size={18} />, 
    label: "Report Viewer", 
    code: "SRP002",
    category: "Gestão Logística"
  },
  { 
    path: "/oprp1", 
    icon: <LayoutGrid size={18} />, 
    label: "Requisições sem Necessidades", 
    code: "RSN001",
    category: "Gestão Logística"
  },
  { 
    path: "/not001", 
    icon: <ArrowLeftRight size={18} />, 
    label: "Nova Ordem de Transferência", 
    code: "NOT001",
    category: "Gestão Logística"
  },
];

const Sidebar = ({ isOpen, isMobile, onClose }) => {
  const location = useLocation();

  // Agrupar itens por categoria
  const groupedItems = navItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <aside className={`
      ${isMobile ? 'fixed' : 'relative'} 
      ${isMobile ? 'z-30' : 'z-0'}
      ${isOpen ? (isMobile ? 'w-64' : 'w-64') : (isMobile ? 'w-0' : 'w-16')} 
      ${isMobile && !isOpen ? '-translate-x-full' : 'translate-x-0'}
      bg-pw-sidebar-bg border-r border-gray-200 
      transition-all duration-300 ease-in-out
      flex flex-col h-full
      ${isMobile && !isOpen ? 'invisible' : 'visible'}
      overflow-hidden
    `}>
      <div className="p-3 sm:p-4 border-b border-gray-200 flex-shrink-0">
        {isOpen ? (
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-semibold text-pw-dark-blue">Sistema Logístico</h2>
            {isMobile && (
              <button
                onClick={onClose}
                className="p-1 rounded-md hover:bg-gray-200 lg:hidden"
                aria-label="Fechar menu"
              >
                <X size={20} className="text-gray-600" />
              </button>
            )}
          </div>
        ) : (
          <div className="text-center text-pw-dark-blue font-bold text-sm">GL</div>
        )}
      </div>
      
      {isOpen && (
        <div className="p-3 sm:p-4 flex-shrink-0">
          <Input 
            type="text" 
            placeholder="Pesquisar..." 
            icon={<Search size={16} className="text-gray-400" />}
            className="text-sm"
          />
        </div>
      )}
      
      <nav className="flex-1 p-2 overflow-y-auto">
        <ul className="space-y-1">
          <li>
            <NavLink 
              to="/" 
              onClick={() => isMobile && onClose && onClose()}
              className={({isActive}) => `flex items-center p-3 text-sm text-gray-700 hover:bg-gray-200 rounded-md transition-colors ${isActive ? 'bg-gray-300 font-medium' : ''}`}
            >
              <Home size={18} className={`${isOpen ? 'mr-3' : 'mx-auto'}`} />
              {isOpen && <span>Dashboard</span>}
            </NavLink>
          </li>
        </ul>
        
        {Object.entries(groupedItems).map(([category, items]) => (
          <div key={category} className="mt-4">
            {isOpen && (
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-t border-gray-200">
                {category}
              </div>
            )}
            <ul className="space-y-1">
              {items.map(item => (
                <li key={item.code}>
                  <NavLink 
                    to={item.path} 
                    onClick={() => isMobile && onClose && onClose()}
                    className={({isActive}) => `flex items-center p-3 text-sm text-gray-700 hover:bg-gray-200 rounded-md transition-colors ${isActive ? 'bg-gray-300 font-medium' : ''}`}
                    title={isOpen ? '' : item.label}
                  >
                    <span className={`${isOpen ? 'mr-3' : 'mx-auto'}`}>{item.icon}</span>
                    {isOpen && (
                      <div className="flex-1">
                        <div className="font-medium">{item.label}</div>
                        <div className="text-xs text-gray-500">{item.code}</div>
                      </div>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
      
      {isOpen && (
        <div className="p-4 border-t border-gray-200 flex-shrink-0">
          <div className="text-xs text-gray-500">
            <p className="font-medium">Kibiona Logistics</p>
            <p>Sistema de Gestão Logística</p>
            <p className="mt-1">v2.0.0</p>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
