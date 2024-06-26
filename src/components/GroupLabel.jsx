import classnames from "classnames";

function GroupLabel(props) {
  const className = classnames(
    'flex h-4 items-center',
    props.className
  )
  return (
    <div {...props} className={className}>
      <div className='h-full w-1 rounded bg-primary'></div>
      <div className='ml-2 font-bold'>{props.children}</div>
    </div>
  )
}

export default GroupLabel;