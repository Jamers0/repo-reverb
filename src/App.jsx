import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { DataProvider } from './contexts/DataContextSimple';
import { ReferenceDataProvider } from './contexts/ReferenceDataContext';
import MainLayout from './components/layout/MainLayout';
import Login from './pages/Login';
import Home from './pages/Home';
import Requisicoes from './pages/Requisicoes';
import ReportViewer from './pages/ReportViewer';
import RequestManagement from './pages/RequestManagement';
import DemandAnalysis from './pages/DemandAnalysis';
import StockRupturesNew from './pages/StockRupturesNew';
import ExpiringProducts from './pages/ExpiringProducts';
import TransitOrders from './pages/TransitOrders';
import PendingPurchases from './pages/PendingPurchases';
import ReportsNew from './pages/ReportsNew';
import TransferOrderManagementNew from './pages/TransferOrderManagementNew';
import RequisicoesManagement from './pages/RequisicoesManagement';
import RequisicoesManagementNew from './pages/RequisicoesManagementNew';
import RuptureAnalysis from './pages/RuptureAnalysis';
import ReferenceDataDemo from './pages/ReferenceDataDemo';

function App() {
  return (
    <ReferenceDataProvider>
      <DataProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="oprp1" element={<Requisicoes />} />
            <Route path="opv32" element={<ReportViewer />} />
            <Route path="pr007" element={<RequestManagement />} />
            <Route path="demand-analysis" element={<DemandAnalysis />} />
            <Route path="stock-ruptures" element={<StockRupturesNew />} />
            <Route path="expiring-products" element={<ExpiringProducts />} />
            <Route path="transit-orders" element={<TransitOrders />} />
            <Route path="pending-purchases" element={<PendingPurchases />} />
            <Route path="relatorios" element={<ReportsNew />} />
            <Route path="not001" element={<TransferOrderManagementNew />} />
            <Route path="transfer-orders" element={<TransferOrderManagementNew />} />
            <Route path="requisicoes-management" element={<RequisicoesManagementNew />} />
            <Route path="rupture-analysis" element={<RuptureAnalysis />} />
            <Route path="reference-data" element={<ReferenceDataDemo />} />
            {/* Adicionar outras rotas aqui conforme necessário */}
          </Route>
        </Routes>
      </Router>
    </DataProvider>
    </ReferenceDataProvider>
  );
}

export default App;
