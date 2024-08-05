import { Skeleton } from "antd"

const SkeletonList = ({
  loading,
  skeletonCount = 0,
  skeletonClassName,
  list = [],
  prepend,
  append,
  children = () => null,
}) => {
  return <>
    {prepend}
    {loading ? Array(skeletonCount).fill(0).map((_, k) =>  (
      <Skeleton.Node className={skeletonClassName} key={k} active>
        <></>
      </Skeleton.Node>
    )) : list.map(children)}
    {append}
  </>
}

export default SkeletonList
