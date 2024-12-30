import {cloneDeep, isString} from "lodash";
import {Modal} from "antd";

/**
 *
 * @param {Record<string, string>} map
 * @param {number} exclude
 * @returns {Array<{value: number, label: string}>}
 */
export function map2array(map, ...exclude) {
  const list = [];
  for(const [value, label] of Object.entries(map)) {
    if(exclude.includes(Number(value))) {
      continue;
    }
    list.push({
      value: Number(value),
      label
    });
  }
  return list;
}



/**
 * 加载js文件
 * @param {string} src
 * @returns Promise<void>
 */
export function loadJs(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}
/**
 * @param {Function[]} funcs
 */
export const pipe = (...funcs) => {
  return (arg) => {
    let result = arg;
    for(let i = 0; i < funcs.length; i++) {
      result = funcs[i](result);
    }
    return result;
  }
}

/**
 * 创建一个包装函数，用于调用另一个函数后返回相同的参数。
 * 这个包装函数的主要作用是让被包装的函数能够先处理参数，
 * 然后允许调用者继续使用未经修改的参数。
 *
 * @param {Function} func - 被包装的函数，它将接收一个参数并对其进行处理。
 * @returns {Function} 返回一个新的函数，这个函数接收一个参数，调用被包装的
 * 函数处理该参数后，再返回该参数。
 */
export const touch = (func) => {
  return (arg) => {
    func(arg)
    return arg
  }
}

/**
 *
 * @param {Blob} blob
 * @param {string} fileName
 * @param {boolean} preview
 */
export const downloadBlob = (blob, fileName, preview = false) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  if(preview) {
    a.target = '_blank'
  } else {
    a.download = fileName;
  }
  a.click();
  if(!preview) {
    URL.revokeObjectURL(url);
  }
}

export const fileNameParse = (contentDisposition) => {
  if(!contentDisposition) return ''
  if(contentDisposition.includes('filename*=')) {
    const [, charset, fileName] = /filename\*=(.*)''(.*)/.exec(contentDisposition) ?? []
    if(charset === 'utf-8') {
      return decodeURIComponent(fileName)
    }
    return fileName
  }
  return contentDisposition.split('filename=')[1]
}

export const basename = (path) => {
  return path.split('/').pop()
}
/**
 * 列出多个数组中元素的所有组合
 * @params {...any[]}
 * @return {any[]}
 */
export const combie = (...arrs) => {
  if(arrs.length === 1) {
    arrs = arrs[0]
  }
  if(arrs.some(arr => !Array.isArray(arr))) {
    throw new Error('参数必须为数组')
  }
  if(arrs.some(arr => arr.length === 0)) {
    return []
  }
  let combine = arrs[0].map(item => [item]);
  for(let i = 1; i < arrs.length; i++) {
    const newCombine = [];
    for(let j = 0; j < combine.length; j++) {
      for(let k = 0; k < arrs[i].length; k++) {
        newCombine.push([...combine[j], arrs[i][k]])
      }
    }
    combine = newCombine
  }
  return combine
}

export const genMetaBy = (keyBy, genMeta) => {
  if(isString(keyBy)) {
    const keyName = keyBy
    keyBy = item => item[keyName]
  }
  return dataSource => {
    if(!dataSource || dataSource.length === 0) {
      return dataSource
    }
    let item = { ...dataSource[0] }
    const newDataSource = [item]
    let lastGroupKey = keyBy(item), spanGroup = [item], injectMetaRow = item
    for(let i = 1; i < dataSource.length; i++) {
      item = { ...dataSource[i] }
      const currentKey = keyBy(item)
      if(currentKey === lastGroupKey) {
        genMeta(item, [])
        spanGroup.push(item)
      } else {
        genMeta(injectMetaRow, spanGroup)
        spanGroup = [item]
        injectMetaRow = item
      }
      lastGroupKey = currentKey
      newDataSource.push(item)
    }
    genMeta(injectMetaRow, spanGroup)
    return newDataSource
  }
}

export const genRowSpan = (keyBy) => genMetaBy(keyBy, (metaRow, spanGroup) => {
  metaRow.cellSpan = {
    rowSpan: spanGroup.length
  }
})

export const confirm = (message, options) => {
  return new Promise((resolve, reject) => {
    const modal = Modal.confirm({
      title: '提示',
      content: message,
      ...options,
      onOk() {
        resolve()
        modal.destroy()
      },
      onCancel() {
        reject('Confirm cancel')
        modal.destroy()
      }
    })
  })
}

/**
 * 将 Base64 字符串转换为 Blob 对象
 * @param base64
 * @returns {Blob}
 */
export const base64ToBlob = (base64) => {
  // 移除 Base64 字符串的前缀（例如 "data:image/png;base64,"）
  const [type, data] = base64.split(';base64,');
  const mimeType = type.substring(5);
  let byteCharacters = atob(data);

  // 创建一个 Uint8Array 数组以存储二进制数据
  let byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  let byteArray = new Uint8Array(byteNumbers);

  // 创建 Blob 对象
  return new Blob([byteArray], {type: mimeType});
}

export const openLinkBlank = (url) => {
  const a = document.createElement('a')
  a.href = url
  a.target = '_blank'
  a.click()
  a.remove()
}

export const pipeExec = (input, ...callbacks) => {
  return callbacks.reduce((result, callback) => callback(result), input)
}
