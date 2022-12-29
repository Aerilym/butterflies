import './App.css';
import 'react-tooltip/dist/react-tooltip.css';
import './tooltips.css';

import { testItems } from './testdata';

import Dashboard from './components/Dashboard';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Dashboard data={testItems} />
      </header>
    </div>
  );
}

export default App;
