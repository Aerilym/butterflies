import './App.css';
import 'react-tooltip/dist/react-tooltip.css';
import './tooltips.css';

import Dashboard from './components/Dashboard';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Dashboard />
      </header>
    </div>
  );
}

export default App;
