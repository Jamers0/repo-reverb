import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Login from './pages/Login';
import Home from './pages/Home';
import Requisicoes from './pages/Requisicoes';
import ReportViewer from './pages/ReportViewer';
import RequestManagement from './pages/RequestManagement';
import DemandAnalysis from './pages/DemandAnalysis';
import StockRuptures from './pages/StockRuptures';
import ExpiringProducts from './pages/ExpiringProducts';
import TransitOrders from './pages/TransitOrders';
import PendingPurchases from './pages/PendingPurchases';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="oprp1" element={<Requisicoes />} />
          <Route path="opv32" element={<ReportViewer />} />
          <Route path="pr007" element={<RequestManagement />} />
          <Route path="demand-analysis" element={<DemandAnalysis />} />
          <Route path="stock-ruptures" element={<StockRuptures />} />
          <Route path="expiring-products" element={<ExpiringProducts />} />
          <Route path="transit-orders" element={<TransitOrders />} />
          <Route path="pending-purchases" element={<PendingPurchases />} />
          {/* Adicionar outras rotas aqui conforme necessário */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
