import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { authService } from './services/authService';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import UploadEvidence from './pages/UploadEvidence';
import EvidenceList from './pages/EvidenceList';
import EvidenceDetail from './pages/EvidenceDetail';
import LedgerExplorer from './pages/LedgerExplorer';
import Alerts from './pages/Alerts';
import LedgerNodes from './pages/LedgerNodes';

function ProtectedLayout() {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/upload" element={<UploadEvidence />} />
          <Route path="/evidence" element={<EvidenceList />} />
          <Route path="/evidence/:id" element={<EvidenceDetail />} />
          <Route path="/ledger" element={<LedgerExplorer />} />
          <Route path="/nodes" element={<LedgerNodes />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={<ProtectedLayout />} />
      </Routes>
    </BrowserRouter>
  );
}
