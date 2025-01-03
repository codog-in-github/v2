import { request } from "@/apis/requestBuilder"
import { createElement } from "react"
import {
  useRef,
  useCallback,
  useEffect,
  useState
} from "react"
import {useSelector} from "react-redux";

export * from './modal.jsx'

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
  const stateRef = useRef(null)
  useEffect(() => {
    stateRef.current = play(stateRef.current)
  }, dependency)
}

/**
 * 使用useAsyncCallback钩子来创建一个异步操作的回调函数，并管理其加载状态。
 *
 * 此钩子接受一个函数作为参数，该函数应该是一个异步操作。它返回一个对象，其中包含
 * 一个loading状态和一个callback函数。当调用callback函数时，它将执行传入的异步函数，
 * 并在操作开始和结束时自动更新loading状态。
 * @template {(...args: any[]) => Promise<any>} T
 * @param {T} func - 一个异步函数，它将被封装在callback中并带有加载状态管理。
 *                          这个函数的返回值可以是一个Promise，如果返回的是一个Promise，
 *                          则表示操作正在进行中，否则表示操作已完成。
 * @returns {[T, boolean]} 返回一个包含loading状态和callback函数的对象。
 *                   callback 始终返回同一函数
 */
export const useAsyncCallback = (func) => {
  const handleRef = useRef()
  handleRef.current = func
  const loadingRef = useRef(false)
  const [loading, setLoading] = useState(false)

  const callback = useCallback((...args) => {
    if(loadingRef.current) {
      return Promise.reject(
        new Error('UseAsyncCallback: loading')
      )
    }

    const result = handleRef.current(...args)
    if(result instanceof Promise) {
      setLoading(true)
      loadingRef.current = true
      result
        .then(() => {
          setLoading(false)
          loadingRef.current = false
        })
        .catch((e) => {
          setLoading(false)
          loadingRef.current = false
          throw e
        })
    }
    return result
  }, [])

  return [ callback, loading ]
}

export const useFileUpload = (orderId) => {
  const [total, setTotal] = useState(0)
  const [loaded, setLoaded] = useState(0)

  const [upload, uploading] = useAsyncCallback(({ file, fileType }) => {
    setLoaded(0)
    return request('/admin/upload_file').form({
      file, 'order_id': orderId, 'type': fileType
    })
      .config({
        onUploadProgress: (e) => {
          setTotal(e.total)
          setLoaded(e.loaded)
        }
      })
      .send()
  })
  return {
    uploading,
    total,
    loaded,
    upload
  }
}

export const useOptions = (selectId) => {
  const [options, setOptions] = useState([])
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    setLoading(true)
    request('/admin/option_list')
      .get({
        'select_id': selectId
      })
      .send()
      .then(data => { setOptions(data) })
      .finally(() => { setLoading(false) })
  }, [selectId])

  return [options, loading]
}

export const useContextMenu = (menu) => {
  const [_show, setShow] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const hidden = useCallback(() => {
    setShow(false)
  }, [])

  const show = useCallback(({ x, y }) => {
    setPosition({ x, y })
    setShow(true)
  }, [])

  useEffect(() => {
    document.addEventListener('click', hidden)
    return () => {
      document.removeEventListener('click', hidden)
    }
  }, [hidden])

  const element = (
    _show && createElement('div', { className: 'fixed', style: { left: position.x, top: position.y } }, menu)
  )
  return [element, show, hidden]
}


export const useDepartmentList = () => {
  const [departments, setDepartments] = useState([])
  useEffect(() => {
    request('/admin/department_list').get().send()
      .then(res => {
        setDepartments(res.map(item => ({
          value: item.id,
          label: item.name,
        })))
      })
  }, [])
  return departments
}

export const useBankList = () => {
  const [banks, setBanks] = useState([])
  useEffect(() => {
    request('/admin/bank_list').get().send()
      .then(res => {
        setBanks(res.map(item => ({
          value: item.id,
          label: item.name,
        })))
      })
  }, [])
  return banks
}

export const useGateCompanyOptions = (showSelf = true) => {
  const [options, setOptions] = useState([])

  const [loadOptions, loading] = useAsyncCallback(() => {
    return request('/admin/order/get_custom_com')
      .get()
      .send()
      .then((data) => {
        const options = []
        if(showSelf) {
          options.push({
            label: createElement('div', { className: 'font-bold' }, '株式会社 春海组'),
            value: -1,
            filterValue: '株式会社 春海组',
          })
        }
        setOptions(
          options.concat(data.map(item => ({
            label: item.name,
            value: item.id,
            filterValue: item.name,
          })))
        )
      })
  })

  useEffect(() => { loadOptions() }, [showSelf])

  return [options, loading]
}

export const useCompleteList = (tab) => {
  const [list, setList] = useState([])
  const orderType = useSelector(state => state.order.type)

  const [load, loading] = useAsyncCallback(async (tab) => {
    const rep = await request('/admin/order/complete_lasted')
      .get({ tab, 'order_type': orderType }).send()
    setList(rep)
  })

  useEffect(() => {
    load(tab)
  }, [tab, orderType])

  return [list, loading]
}
