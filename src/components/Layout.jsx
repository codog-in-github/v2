import classNames from "classnames"

export function Horizontal (props) {
  const { gap, align, children } = props
  const classes = [
    'flex', 'flex-col'
  ]
  if(gap) {
    classes.push(`gap-${gap}`)
  }
  if(align) {
    classes.push(`items-${align}`)
  }
  return (
    <div className={classNames(classes)}>
      {props.children}
    </div>
  )
}



export function Vertical () {
  const { gap, align, children } = props
  const classes = [
    'flex', 'flex-col'
  ]
  if(gap) {
    classes.push(`gap-${gap}`)
  }
  if(align) {
    classes.push(`jus-${align}`)
  }
  return (
    <div className={classNames(classes)}>
      {props.children}
    </div>
  )
}

