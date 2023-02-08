import './App.css';
import 'react-tooltip/dist/react-tooltip.css';
import './tooltips.css';

import Dashboard from './components/Dashboard';
import { useEffect, useState } from 'react';
import { DashboardItem } from '../../../types/dashboard';
import Loading from './components/Loading';

function App() {
  const [dashboardItems, setDashboardItems] = useState<DashboardItem[]>([] as DashboardItem[]);
  useEffect(() => {
    fetch('https://field-manager.butterfliesapp.workers.dev/options?key=dashboardItems').then(
      async (res) => {
        const { value } = await res.json();
        const parsedValue = JSON.parse(value) as DashboardItem[];
        setDashboardItems(parsedValue);
      }
    );
  }, []);
  return (
    <div className="App">
      <header className="App-header">
        {dashboardItems.length === 0 ? <Loading /> : <Dashboard data={dashboardItems} />}
      </header>
    </div>
  );
}

export default App;
