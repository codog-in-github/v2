import classNames from 'classnames'

const Label = ({ children, className }) => {
  return (
    <div className={classNames('flex h-6 items-center', className)}>
      <div className="w-1 h-3/4 bg-primary"></div>
      <div className="ml-2">{children}</div>
    </div>
  )
}

export default Label
