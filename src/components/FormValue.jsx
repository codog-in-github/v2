import { Form } from "antd"

const Value = ({ value, ...props }) => {
  return (
    <span {...props}>{value}</span>
  )
}

const FormValue = ({ name, formItemProps, ...props}) => {
  return (
    <Form.Item name={name} noStyle {...formItemProps}><Value {...props} /></Form.Item>
  )
}

export default FormValue
