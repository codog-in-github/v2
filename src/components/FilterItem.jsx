import {Form} from "antd";

const FilterItem = ({ label, name, children }) => {
  return (
    <span className={'inline-block'}>
      { !!label && (
        <span className={'mr-2'}>{label}</span>
      ) }
      { name ? (
        <Form.Item noStyle name={name}>
          {children}
        </Form.Item>
      ) : children }
    </span>
  )
}

export default FilterItem
