import { useLoaderData } from 'react-router-dom';
import { DashboardItem } from '../../../../../types/dashboard';
import Dashboard from '../../components/dashboard/Dashboard';

export default function RootBase() {
  const { dashboardItems } = useLoaderData() as { dashboardItems: DashboardItem[] };

  return <Dashboard data={dashboardItems} />;
}
