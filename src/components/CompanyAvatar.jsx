import classNames from "classnames"
import Color from "color"
const colors = '#FD7556,#45A73A,#FBD521,#426CF6'.split(',');
function CompanyAvatar ({
  bg,
  text = '',
  children,
  className,
  circle = false
}) {
  if(!bg && text) {
    bg = colors[text.charCodeAt(0) % colors.length]
  }
  const baseClass = 'flex justify-center items-center w-12 h-12 text-lg'
  // const isDeepBg = Color(bg).isDark()
  // const textColor = isDeepBg ? 'text-white' : 'text-black'
  const textColor = 'text-white'
  const round = circle ? 'rounded-full' : 'rounded-md'
  return <div
    className={classNames(baseClass, textColor, round, className)}
    style={{
      backgroundColor: bg
    }}
  >{children ?? text}</div>
}

export default CompanyAvatar