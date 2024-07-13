import classNames from "classnames"
import Color from "color"
function CompanyAvatar ({
  bg,
  text,
  children,
  className,
  circle = false
}) {
  const baseClass = 'flex justify-center items-center w-12 h-12 text-lg'
  const isDeepBg = Color(bg).isDark()
  const textColor = isDeepBg ? 'text-white' : 'text-black'
  const round = circle ? 'rounded-full' : 'rounded-md'
  return <div
    className={classNames(baseClass, textColor, round, className)}
    style={{
      backgroundColor: bg
    }}
  >{children ?? text}</div>
}

export default CompanyAvatar