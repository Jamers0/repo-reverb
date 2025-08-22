import React from 'react';
import { Menu, Search, User, Settings } from 'lucide-react';

const Header = ({ onToggleSidebar, isSidebarOpen }) => (
  <header className="flex items-center justify-between px-3 sm:px-4 lg:px-6 py-3 sm:py-4 bg-white border-b border-gray-200 flex-shrink-0">
    <div className="flex items-center space-x-2 sm:space-x-4 min-w-0">
      <button 
        onClick={onToggleSidebar} 
        className="text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-700 p-1 rounded-md hover:bg-gray-100"
        aria-label={isSidebarOpen ? 'Fechar menu' : 'Abrir menu'}
      >
        <Menu size={20} className="sm:w-6 sm:h-6" />
      </button>
      <div className="flex items-center space-x-1 sm:space-x-2 min-w-0">
        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-pw-green rounded text-white flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0">
          SGL
        </div>
        <h1 className="text-sm sm:text-lg lg:text-xl font-semibold text-pw-dark-blue truncate hidden sm:block">
          Sistema de Gestão Logística
        </h1>
        <h1 className="text-sm font-semibold text-pw-dark-blue block sm:hidden">
          SGL
        </h1>
      </div>
    </div>
    
    <div className="flex items-center space-x-2 sm:space-x-4">
      <button className="text-gray-500 hover:text-gray-700 p-1 rounded-md hover:bg-gray-100 hidden sm:block">
        <Search size={18} className="sm:w-5 sm:h-5" />
      </button>
      
      <div className="flex items-center space-x-2 sm:space-x-3">
        <div className="text-right hidden md:block">
          <p className="text-xs sm:text-sm font-medium text-gray-900">Kibiona</p>
          <p className="text-xs text-gray-500 hidden lg:block">kibiona@logiticas.imigrante.pt</p>
        </div>
        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
          <User size={14} className="sm:w-4 sm:h-4 text-gray-600" />
        </div>
      </div>
      
      <button className="text-gray-500 hover:text-gray-700 p-1 rounded-md hover:bg-gray-100 hidden sm:block">
        <Settings size={18} className="sm:w-5 sm:h-5" />
      </button>
      
      <div className="w-8 h-6 sm:w-12 sm:h-8 bg-orange-500 rounded flex items-center justify-center flex-shrink-0">
        <span className="text-white text-xs font-bold">GL</span>
      </div>
    </div>
  </header>
);

export default Header;
