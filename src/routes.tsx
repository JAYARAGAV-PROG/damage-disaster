import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CitizenReport from './pages/CitizenReport';
import AuthorityDashboard from './pages/AuthorityDashboard';
import { ProtectedRoute } from './components/ProtectedRoute';
import type { ReactNode } from 'react';

interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
}

const routes: RouteConfig[] = [
  {
    name: 'Home',
    path: '/',
    element: <Home />
  },
  {
    name: 'Login',
    path: '/login',
    element: <Login />
  },
  {
    name: 'Register',
    path: '/register',
    element: <Register />
  },
  {
    name: 'Report Damage',
    path: '/report',
    element: (
      <ProtectedRoute>
        <CitizenReport />
      </ProtectedRoute>
    )
  },
  {
    name: 'Authority Dashboard',
    path: '/dashboard',
    element: (
      <ProtectedRoute requireAdmin>
        <AuthorityDashboard />
      </ProtectedRoute>
    )
  }
];

export default routes;
