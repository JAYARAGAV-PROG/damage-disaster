import Home from './pages/Home';
import CitizenReport from './pages/CitizenReport';
import AuthorityDashboard from './pages/AuthorityDashboard';
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
    name: 'Report Damage',
    path: '/report',
    element: <CitizenReport />
  },
  {
    name: 'Authority Dashboard',
    path: '/dashboard',
    element: <AuthorityDashboard />
  }
];

export default routes;
