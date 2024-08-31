import cryptoJs from 'crypto-js';
import { camelCase, isArray, isObject } from 'lodash';

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
 * 修改对象的键的大小写形式
 * @param {any} obj 需要修改的对象
 * @param {(str: string) => string} format 键的大小写格式化函数，默认为驼峰格式化函数
 * @returns {any} 修改大小写后的新对象
 */
export function changeKeysCase(obj, format = camelCase) {
  const cache = new Map();
  return (function(obj) {
    if(cache.has(obj)) {
      return cache.get(obj);
    } else if(isArray(obj)) {
      const newArr = [];
      cache.set(obj, newArr);
      obj.forEach(item => {
        newArr.push(changeKeysCase(item, format));
      });
      return newArr;
    } else if(isObject(obj)) {
      const newObj = {};
      cache.set(obj, newObj);
      Object.keys(obj).forEach(k => {
        newObj[format(k)] = changeKeysCase(obj[k], format);
      });
      return newObj;
    } else {
      return obj;
    }
  })(obj);
}

export function bitHas(num, bit) {
  return (num & bit) === bit;
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
 * 这个包装函数的主要作用是让被包装的函数能够先处理参数，然后允许调用者继续使用未经修改的参数。
 * 
 * @param {Function} func - 被包装的函数，它将接收一个参数并对其进行处理。
 * @returns {Function} 返回一个新的函数，这个函数接收一个参数，调用被包装的函数处理该参数后，再返回该参数。
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
  URL.revokeObjectURL(url);
  a.remove()
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