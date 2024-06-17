/**
 * 类型断言
 * @auth zjy<zhaojangyu@gmail.com>
 * @date 2023-11-06
 */

import { isFunction } from 'lodash';

/**
 * 判断对象是否可以异步等待
 * @param {*} val
 * @returns {val is {
 *  then: Function,
 *  catch: Function,
 *  finally: Function
 * } | Promise}
 */
export function isPromiseLike(val) {
  return (
    val &&
    (val instanceof Promise ||
      (isFunction(val.then) &&
        isFunction(val.catch) &&
        isFunction(val.finally)))
  );
}

export function isStandardSpec(spec) {
  return /^\d+(?:\.\d+)?\*\d+(?:\.\d+)?(?:\*\d+)?$/.test(spec);
}
