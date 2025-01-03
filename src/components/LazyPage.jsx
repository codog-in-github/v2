import { isString } from "lodash";
import { useMemo, lazy, Suspense } from "react";
import router from "@/router";

const LazyPage = ({ load, beforeLoad }) => {
  const Page = useMemo(() => {
    return lazy(() => new Promise((resolve, reject) => {
      if(!beforeLoad)
          return resolve(load())
      const next = (res) => {
        if(isString(res)) {
          router.navigate(res)
          reject()
        } else if(res === false) {
          reject()
        } else {
          resolve(load())
        }
      }
      beforeLoad(router.state, next)
    }))
  }, [load, beforeLoad])

  return (
    <Suspense>
      <Page />
    </Suspense>
  )
}

export default LazyPage;
