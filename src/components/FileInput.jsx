import { useRef } from "react"

const FileInput = ({ className, onChange, accept, multiple, value, ...props }) => {
  console.log('props', props)
  const ref = useRef(null)
  if(!value && ref.current) {
    ref.current.value = ''
  }
  return (
    <input
      ref={ref}
      type="file"
      className={className}
      onChange={() => {
        onChange(ref.current.files)
      }}
      accept={accept}
      multiple={multiple}
      {...props}
    ></input>
  )
}

export default FileInput
