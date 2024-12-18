import { isFunction } from "lodash";

export const chooseFile = (() => {
  const inputElement = document.createElement('input');
  inputElement.style.display = 'none';
  inputElement.type = 'file';
  document.body.appendChild(inputElement);

  let _onCancel = () => {};
  let _onChoose = () => {};
  let _onError = () => {};

  inputElement.addEventListener('input', () => {
    const { files, multiple } = inputElement;
    if(files.length) {
      if(multiple) {
        _onChoose(files)
      } else {
        _onChoose(files[0]);
      }
    } else {
      _onCancel();
    }
  });
  inputElement.addEventListener('error', () => {
    _onError();
  });

  return ({
    size = -1,
    accept = '',
    multiple = false,
    onChoose,
    onCancel,
    onError
  }) => {
    _onChoose = isFunction(onChoose) ? onChoose : () => {};
    _onCancel = isFunction(onCancel) ? onCancel : () => {};
    _onError = isFunction(onError) ? onError : () => {};

    inputElement.accept = accept;
    inputElement.size = size;
    inputElement.value = ''
    inputElement.multiple = multiple;
    inputElement.click();
  }
})()

export const chooseFilePromise = (config) => new Promise((resolve, reject) => {
  chooseFile({
    ...config,
    onChoose: resolve,
    onCancel: reject,
    onError: reject,
  })
})
