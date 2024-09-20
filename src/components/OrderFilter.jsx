import { Form, Space, Select, Input } from 'antd';
import { useEffect } from 'react';

/**
 *
 * @param {Object} param0 props
 * @param {import('antd').FormInstance} param0.form
 * @returns
 */
const OrderFilter = ({ form, onSearch }) => {
  return (
    <Form form={form}>
      <Space.Compact>
        <Form.Item name="filter_key" noStyle>
          <Select
            options={[
              { value: 'bkg_no', label: 'BKG NO.' },
              { value: 'order_no', label: '社内番号' },
              { value: 'company_name', label: 'お客様' },
            ]}
          />
        </Form.Item>
        <Form.Item name="filter_value" noStyle>
          <Input.Search
            placeholder="検索"
            onSearch={() => setTimeout(onSearch)}
            allowClear
          />
        </Form.Item>
      </Space.Compact>
    </Form>
  )
};

export default OrderFilter;
