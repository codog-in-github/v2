import { Input, Tag } from "antd"
import { useState, useRef } from "react"
import classNames from "classnames"

const TagInput = ({ className, onChange, value, ...props }) => {
  const [inputText, setInputText] = useState('')
  const inputRef = useRef(null)
  value = value || []
  return (
    <div
      className={classNames(
        className,
        'flex flex-wrap items-center border rounded pl-1 border-[#d9d9d9]',
        'hover:border-primary has-[input:focus]:border-primary',
      )}
      onClick={() => {inputRef.current.focus()}}
    >
      {value.map((item, index) => (
        <Tag
          key={index}
          closable
          onClose={() => {
          onChange(value.filter((_, i) => i !== index))
        }}>{item}</Tag>
      ))}
      <Input
        {...props}
        ref={inputRef}
        value={inputText}
        className="flex-1"
        variant="borderless"
        onChange={(e) => {setInputText(e.target.value)}}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            onChange([...value, inputText])
            setInputText('')
          } else if (e.key === 'Backspace' && !inputText && value.length) {
            onChange(value.slice(0, -1))
          }
        }}
        onBlur={() => {
          if(inputText) {
            onChange([...value, inputText])
            setInputText('')
          }
        }}
      ></Input>
    </div>
  )
}

export default TagInput
