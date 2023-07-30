import { ConfigProvider, theme } from 'antd';
import './App.css';
import FoodTable from './components/Foodtable';

function App() {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
      }}
    >
      <div className="App">
        <FoodTable />
      </div>
    </ConfigProvider>
  );
}

export default App;
