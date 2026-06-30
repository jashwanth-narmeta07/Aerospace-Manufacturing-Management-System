import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import AppShell from './components/AppShell.jsx';
import Landing from './pages/Landing.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Production from './pages/Production.jsx';
import Inspections from './pages/Inspections.jsx';
import Inventory from './pages/Inventory.jsx';
import Employees from './pages/Employees.jsx';
import Reports from './pages/Reports.jsx';

function Protected({ roles, children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  return children;
}

function Shell({ children }) {
  return <AppShell>{children}</AppShell>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Protected><Shell><Dashboard /></Shell></Protected>} />
      <Route path="/production" element={<Protected><Shell><Production /></Shell></Protected>} />
      <Route path="/inspections" element={<Protected roles={['admin','manager']}><Shell><Inspections /></Shell></Protected>} />
      <Route path="/inventory" element={<Protected><Shell><Inventory /></Shell></Protected>} />
      <Route path="/employees" element={<Protected roles={['admin']}><Shell><Employees /></Shell></Protected>} />
      <Route path="/reports" element={<Protected roles={['admin','manager']}><Shell><Reports /></Shell></Protected>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}