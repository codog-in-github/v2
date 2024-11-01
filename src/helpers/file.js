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
    const file = inputElement.files[0]
    if(file) {
      _onChoose(file);
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
