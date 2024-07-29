import { Checkbox } from "antd"

const SingleCheckbox = ({ value, onChange, ...props }) => (
  <Checkbox
    {...props}
    checked={value}
    onChange={() => onChange(!value)}
  ></Checkbox>
)

export default SingleCheckbox
