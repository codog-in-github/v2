import ReactDOM from 'react-dom/client';
import React from 'react';
import App from './App.jsx'
import { registerAllModules } from 'handsontable/registry';
import { ConfigProvider } from 'antd';

import '@/assets/styles/public.scss';
import 'handsontable/dist/handsontable.full.min.css';
import theme from '@/../theme.yml';

const antdGlobalConfig = {
  theme: {
    token: {
      colorPrimary: theme.colors.primary,
    }
  }
};

registerAllModules();
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ConfigProvider {...antdGlobalConfig}>
        <App />
      </ConfigProvider>
  </React.StrictMode>
)
