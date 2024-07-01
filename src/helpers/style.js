import { isArray, isObject } from "lodash"
export const namespaceClass = namespace => {
  const addPrefix = (className) => {
    if(isArray(className)){
      return className.map(addPrefix)
    } else if(isObject(className)) {
      const newClass = {}
      for(let key in className) {
        newClass[addPrefix(key)] = className[key]
      }
      return newClass
    }
    return className ? `${namespace}__${className}` : namespace
  }
  return (...args) => {
    return addPrefix(args)
  }
}