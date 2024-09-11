import classNames from "classnames";
const TopBadge = ({ children, className, ...props }) => {
  return (
    <div
      {...props}
      className={classNames(
        'absolute top-2 -right-8 rotate-45 bg-red-500',
        'text-white w-24 text-center text-sm',
        className
      )}
    >
      {children}
    </div>
  )
};

export default TopBadge;
