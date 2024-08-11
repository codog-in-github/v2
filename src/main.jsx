import ReactDOM from 'react-dom/client';
import App from '@/App.jsx'
import { registerAllModules } from 'handsontable/registry';
import { ConfigProvider } from 'antd';
import { themeColor } from '@/helpers/color.js';
import ja_JP from 'antd/locale/ja_JP';
import dayjs from 'dayjs';

import 'dayjs/locale/ja';
import 'dayjs/locale/zh-cn';
import '@/assets/styles/public.scss';
import 'handsontable/dist/handsontable.full.min.css';


const antdGlobalConfig = {
  locale: ja_JP,
  form: {
    colon: false
  },
  theme: {
    token: {
      colorPrimary: themeColor('primary'),
      colorWarring: themeColor('warning'),
      borderRadius: 4,
    },
  }
};

dayjs.locale('ja')
registerAllModules();

ReactDOM.createRoot(document.getElementById('root')).render(
  <ConfigProvider {...antdGlobalConfig}>
    <App />
  </ConfigProvider>
)
