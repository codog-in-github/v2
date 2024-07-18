import {
  useCallback,
  useEffect,
  useState
} from "react"

/**
 * 使用自定义钩子来管理输入框的状态。
 * 
 * 该钩子返回一个数组，包含当前输入值和一个用于更新输入值的函数。
 * 这种模式常用于表单输入组件，以简化状态管理和更新逻辑。
 * 
 * @param {string} initialValue - 输入框的初始值。
 * @returns {Array} 返回一个数组，第一个元素是当前的输入值，第二个元素是一个函数，用于更新输入值。
 */
export function useInput (initialValue) {
  const [value, setValue] = useState(initialValue)
  return [
    value,
    e => {
      setValue(e.target.value)
    }
  ]
}

/**
 * 使用动画钩子。
 * 
 * 此钩子旨在管理动画的播放状态。它通过比较当前状态和上一状态来决定是否触发动画。
 * 主要用于在组件中集成动画效果，通过控制动画的播放状态来实现组件的动态过渡。
 * 
 * @param {Function} play - 一个函数，用于根据当前状态决定是否播放动画。
 *                          这个函数会接收当前状态作为参数，并返回下一个状态。
 * @param {Array} dependency - 一个依赖数组，用于指定触发动画更新的条件。
 *                             当依赖数组中的任一元素发生变化时，动画状态将会更新。
 */
export function useAnimate(play, dependency) {
  const [lastState, setLastState] = useState(null)
  useEffect(() => {
    setLastState(play(lastState))
  }, dependency)
}

/**
 * 使用useAsyncCallback钩子来创建一个异步操作的回调函数，并管理其加载状态。
 * 
 * 此钩子接受一个函数作为参数，该函数应该是一个异步操作。它返回一个对象，其中包含
 * 一个loading状态和一个callback函数。当调用callback函数时，它将执行传入的异步函数，
 * 并在操作开始和结束时自动更新loading状态。
 * 
 * @param {Function} func - 一个异步函数，它将被封装在callback中并带有加载状态管理。
 *                          这个函数的返回值可以是一个Promise，如果返回的是一个Promise，
 *                          则表示操作正在进行中，否则表示操作已完成。
 * @param {Array} dependency - 一个依赖数组，用于指定触发回调函数更新的条件。
 * @returns {Object} 返回一个包含loading状态和callback函数的对象。
 */
export const useAsyncCallback = (func, dependency) => {
  const [loading, setLoading] = useState(false)
  const callback = useCallback((...args) => {
    const result = func(...args)
    if(result instanceof Promise) {
      setLoading(true)
      result.then(() => setLoading(false))
        .catch((e) => {
          setLoading(false)
          throw e
        })
    }
    return result
  }, dependency)
  return {
    loading,
    callback
  }
}
