import { Empty } from "antd"
import { Skeleton } from "antd"

const SkeletonList = ({
  loading,
  skeletonCount = 0,
  skeletonClassName,
  list = [],
  prepend,
  showEmpty = true,
  append,
  children = () => null,
}) => {
  return <>
    {prepend}
    {loading ? Array(skeletonCount).fill(0).map((_, k) =>  (
      <Skeleton.Node className={skeletonClassName} key={k} active>
        <></>
      </Skeleton.Node>
    )) : (
      list && list.length ? list.map(children) : (showEmpty && <Empty />)
    )}
    {append}
  </>
}

export default SkeletonList
