import axios from 'axios';
import {
  addAuthorization,
  checkHttpState,
  checkJSONCode,
  getRequestBodyData,
  getRequestJsonBodyData,
} from './middleware';
import { cloneDeep, isObject } from 'lodash';
import QueryString from 'qs';
import { downloadBlob } from '@/helpers/utils';

const baseURL = '/api';

class Request {
  constructor(url = '') {
    this.baseURL = baseURL;
    this.targetUrl = url;
    this.method = 'post';
    this._headers = {};
    this._config = {};
    this._data = {};
    this._query = {};
    this.requestMiddleware = [addAuthorization];
    this.responseMiddleware = [
      checkHttpState,
      checkJSONCode,
      getRequestJsonBodyData,
    ];
  }

  get(url, queryData) {
    this.method = 'get';
    if (url !== void 0) {
      if (isObject(url)) {
        queryData = url;
      } else {
        this.targetUrl = url;
      }
    }
    if (queryData) {
      this.query(queryData);
    }
    return this;
  }

  headers (headerObj) {
    this._headers = Object.assign(this._headers, headerObj);
    return this
  }

  /**
   * 
   * @param {import('axios').AxiosRequestConfig} configObj 
   * @returns 
   */
  config (configObj) {
    this._config = Object.assign(this._config, configObj);
    return this
  }

  post(url, bodyData) {
    this.method = 'post';
    if (url !== void 0) {
      if (isObject(url)) {
        bodyData = url;
      } else {
        this.targetUrl = url;
      }
    }
    if (bodyData !== void 0) {
      this.data(bodyData);
    }
    return this;
  }

  /**
   * @param {FormData|Record<string, any>} formData 
   * @returns 
   */
  form(formData) {
    if (formData) {
      if(!(formData instanceof FormData)) {
        const _formData = new FormData()
        for(const key in formData) {
          _formData.append(key, formData[key])
        }
        formData = _formData
      }
      this.data(formData, true)
    }
    return this.headers({
      'Content-Type': 'multipart/form-data',
    });
  }

  data(data, replace = false) {
    if (replace) {
      this._data = data;
      return this;
    }
    this._data = Object.assign(this._data, data);
    return this;
  }

  query(data, replace = false) {
    if (replace) {
      this._query = data;
      return this;
    }
    this._query = Object.assign(this._query, data);
    return this;
  }

  /**
   * 克隆请求
   * @returns {Request}
   */
  clone() {
    const request = new Request();
    request.baseURL = this.baseURL;
    request.targetUrl = this.targetUrl;
    request.method = this.method;
    request._query = cloneDeep(this._query);
    request._headers = cloneDeep(this._headers);
    request._config = cloneDeep(this._config);
    request._data = cloneDeep(this._data);
    request.requestMiddleware = [...this.requestMiddleware];
    request.responseMiddleware = [...this.responseMiddleware];
    return request;
  }

  addRequestMiddleware(...middlewares) {
    return this.addMiddleware('requestMiddleware', ...middlewares);
  }

  addResponseMiddleware(...middlewares) {
    return this.addMiddleware('responseMiddleware', ...middlewares);
  }

  /**
   * 添加中间件
   * @access protected
   * @param {'requestMiddleware' | 'responseMiddleware'} key
   * @param  {...Function} middlewares
   * @returns {Request}
   */
  addMiddleware(key, ...middlewares) {
    this[key].push(...middlewares);
    return this;
  }

  responseWithout(...middlewares) {
    return this._excludeMiddleware('responseMiddleware', ...middlewares);
  }

  requestWithout(...middlewares) {
    return this._excludeMiddleware('requestMiddleware', ...middlewares);
  }

  /**
   * 排除指定中间件
   * @access protected
   * @param {'requestMiddleware' | 'responseMiddleware'} type
   * @param  {...Function} middlewares
   * @returns {Request}
   */
  _excludeMiddleware(type, ...middlewares) {
    this[type] = this[type].filter(mw => !middlewares.includes(mw));
    return this;
  }

  paginate() {
    this.responseWithout(getRequestJsonBodyData)
    this.addResponseMiddleware(getRequestBodyData)
    return this
  }

  download(filename) {
    this.config({
      responseType: 'blob'
    })
    this.responseWithout(getRequestJsonBodyData, checkJSONCode)
    this.addResponseMiddleware(getRequestBodyData, blob => downloadBlob(blob, filename))
    return this
  }

  /**
   * 发送请求
   * @returns {Promise<any>}
   */
  send() {
    const instance = axios.create({
      baseURL: this.baseURL,
    });

    const callMiddleware = middlewares => arg => {
      let next = n => n;
      if (middlewares.length > 0) {
        for (let i = middlewares.length - 1; i >= 0; i--) {
          let _next = next;
          next = prev => middlewares[i](prev, _next);
        }
        return next(arg);
      }
      return arg;
    };

    instance.interceptors.request.use(callMiddleware(this.requestMiddleware));
    instance.interceptors.response.use(callMiddleware(this.responseMiddleware));

    let url = this.targetUrl;
    if (Object.keys(this._query).length) {
      url += '?' + QueryString.stringify(this._query);
    }

    return instance.request({
      url,
      method: this.method,
      data: this._data,
      headers: this._headers,
      validateStatus: null,
      ...this._config
    });
  }


}
export const request = import.meta.env.DEV
  ? (
    (url = '') => {
      const devAddrs = [
        'http://10.0.2.2/api',
        'http:///127.0.0.1:3100'
      ]
      for(const addr of devAddrs) {
        if(url.startsWith(addr)) {
          return new Request(url.substring(addr.length))
        }
      }
      return new Request(url);
    }
  )
  : (url = '') => new Request(url)

