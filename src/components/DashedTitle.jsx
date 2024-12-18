import classNames from "classnames";

const DashedTitle = ({ children, rootClassName }) => {
  return (
    <div className={classNames(
      'flex items-center',
      rootClassName
    )}>
      <div className={'px-2 font-bold'}>{children}</div>
      <div className={'flex-1 border-t border-dashed'}></div>
    </div>
  )
}

export default DashedTitle
