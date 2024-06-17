import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import 'handsontable/dist/handsontable.full.min.css';
import { registerAllModules } from 'handsontable/registry';
import './main.css'

registerAllModules();
ReactDOM.createRoot(document.getElementById('root')).render(
  <App />,
)
