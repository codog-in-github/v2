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
  text = text[0] ?? ''
  const fontSize = 28
  const baseClass = 'flex justify-center items-center w-[56px] h-[56px]'
  const textColor = 'text-white'
  const round = circle ? 'rounded-full' : 'rounded-md'
  return <div
    className={classNames(baseClass, textColor, round, className)}
    style={{
      backgroundColor: bg,
      fontSize
    }}
  >{children ?? text}</div>
}

export default CompanyAvatar
