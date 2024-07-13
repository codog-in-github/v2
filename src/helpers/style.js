import { isArray, isObject } from "lodash"
/**
 * 为类名添加命名空间前缀。
 * 
 * 该函数接受一个命名空间字符串，并返回一个高阶函数，该高阶函数可以用于为传入的类名添加这个命名空间前缀。
 * 支持传入单个类名字符串、类名数组、或是一个包含类名的键值对对象。对于对象，键将被视为类名，值将被视为这些类名是否被选中（布尔值）。
 * 
 * @param {string} namespace - 要添加的命名空间前缀。
 * @returns {Function} 一个函数，用于添加命名空间前缀到传入的类名。
 */
export const namespaceClass = namespace => {
   /**
   * 添加命名空间前缀到类名。
   * 
   * 这个函数是前面返回的高阶函数内部使用的实际处理函数。它通过检查传入的className的类型（字符串、数组、对象）来决定如何处理，并相应地添加前缀。
   * 
   * @template {string|string[]|Record<string, boolean>} T
   * @param {T|T[]} className - 要处理的类名，可以是字符串、字符串数组，或是一个对象。
   * @returns {string|string[]|Record<string, boolean>} 返回添加了前缀的类名，其类型与输入保持一致。
   */
  const addPrefix = (className) => {
    if(isArray(className)){
      return className.map(addPrefix)
    } else if(isObject(className)) {
      const newClass = {}
      for(let key in className) {
        newClass[addPrefix(key)] = className[key]
      }
      return newClass
    } else if(/\s/.test(className.trim())) {
      return className.split(/\s+/).map(addPrefix).join(' ')
    }
    return className ? `${namespace}__${className}` : namespace
  }
  return (...args) => {
    return addPrefix(args)
  }
}