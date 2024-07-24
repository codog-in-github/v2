import classNames from "classnames";
import { debounce } from "lodash";
import { useRef } from "react";
import { useEffect, useCallback } from "react";

const ScrollView = ({
  className,
  scrollY,
  scrollX,
  debounce: debounceDelay = 200,
  onScrollBottom,
  onScrollRight,
  children,
  ...props
}) => {
  // cbs 始终为同一引用
  const cbs = useRef({})

  // 缓存回调函数 name为字符串字面量且始终不变
  const useWatchCallback = (name, callback) => useEffect(() => {
    if(!callback) {
      callback = () => {}
    }
    if(debounceDelay) {
      cbs.current[name] = debounce(callback, debounceDelay)
    } else {
      cbs.current[name] = callback
    }
  }, [callback, debounceDelay])

  useWatchCallback('onScrollBottom', onScrollBottom)
  useWatchCallback('onScrollRight', onScrollRight)

  const onScrollHandle = useCallback((e) => {
    if(e.target.scrollTop + e.target.clientHeight >= e.target.scrollHeight) {
      cbs.current.onScrollBottom?.(e)
    }
    if(e.target.scrollLeft + e.target.clientWidth >= e.target.scrollWidth) {
      cbs.current.onScrollRight?.(e)
    }
  }, [])
  return (
    <div
      {...props}
      className={classNames(
        className,
        { 'overflow-y-auto': scrollY, 'overflow-x-auto': scrollX }
      )}
      onScroll={onScrollHandle}
    >
      {children}
    </div>
  )
}

export default ScrollView;
