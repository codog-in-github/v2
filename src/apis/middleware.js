import { changeKeysCase } from '@/helpers';
import {camelCase} from 'lodash';

/**
 * 将字符串填充或截断为16字节长度
 * @param {string} str - 要处理的字符串
 * @returns {Object} - 加密的16字节字符串
 */
function pad16(str) {
  if(str.length < 16) {
    str += '\0'.repeat(16 - str.length);
  } else {
    str = str.slice(0, 16);
  }
  return CryptoJS.enc.Utf8.parse(str);
}

const KEY = pad16('123');
const IV = pad16('123');

export function sign(config, next) {
  const keys = Object.keys(config.data);
  keys.sort();
  const newObj = {};
  keys.forEach(key => {
    newObj[key] = config.data[key];
  });
  config.headers = {
    ...config.headers,
    signature: CryptoJS.MD5(
      JSON.stringify(newObj)
    ).toString()
  };
  return next(config);
}

/**
 * 加密请求参数
 * @param {Object} config - axios的config对象
 * @param {Function} next - 后续的处理函数
 * @returns {Object} - 加密后的config对象
 */
export function encodeParams(config, next) {
  const json = JSON.stringify(config.data);
  const d = CryptoJS.AES.encrypt(
    json,
    KEY,
    {
      iv:      IV,
      mode:    CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    }
  );
  config.data = {
    cipher: d.ciphertext.toString(
      CryptoJS.enc.Base64
    )
  };
  return next(config);
}

/**
 * 解密请求参数
 * @param {Object} data - 解密后的请求参数
 * @param {Function} next - 后续的处理函数
 * @returns {Object} - 解密后的请求参数
 */
export function decodeParams(data, next) {
  const d = CryptoJS.AES.decrypt(
    data,
    KEY,
    {
      iv:      IV,
      mode:    CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    }
  );
  return next(
    JSON.parse(d.toString(CryptoJS.enc.Utf8))
  );
}

export function toCamelCase(data, next) {
  return next(changeKeysCase(data));
}

export function checkLoginStatus(response, next) {
  if(response.state < 200 || response.state >= 300) {
    const msg = '请求错误';
    ElMessage.error(msg);
    throw Error(msg);
  }
  if(response.data && response.data.code === 0) {
    return next(response.data.data);
  }
  const msg = response.data.message;
  ElMessage.error(msg);
  throw Error(msg);
}

