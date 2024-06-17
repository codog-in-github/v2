import { h, ref } from 'vue';
import { loadJs } from './utils';

const JS_NAME = 'CLodopfuncs.js',
  URL_HTTP1 = 'http://localhost:8000/'+JS_NAME,
  URL_HTTP2 = 'http://localhost:18000/'+JS_NAME;

export function runLodopScripts() {
  return Promise.race([
    loadJs(URL_HTTP1),
    loadJs(URL_HTTP2)
  ]).catch(() => {
    window.LODOP = null;
  });
}

export function usePrinter() {
  let _printSettings = JSON.parse(
    localStorage.getItem('printSettings')
  );
  if(!_printSettings) {
    _printSettings = {
      printerIndex:   null,
      paperSizeIndex: null
    };
  }
  const printSettings = ref(_printSettings);
  const visible = ref(false);
  function savePrintSettings(settings) {
    if(settings) {
      localStorage.setItem('printSettings', JSON.stringify(settings));
      printSettings.value = settings;
    }
  }
  const showButton = () => (
    <span>
      <ElButton type="primary" onClick={() => visible.value = true}>打印设置</ElButton>
      <GlPrintSetting
        visible={visible.value}
        model={printSettings.value}
        {...{
          'onUpdate:visible': (val) => {
            visible.value = val;
          },
          'onSubmit': savePrintSettings
        }}
      ></GlPrintSetting>
    </span>
  );
  return {
    showButton,
    printSettings
  };
}
