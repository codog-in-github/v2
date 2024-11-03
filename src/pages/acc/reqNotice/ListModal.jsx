import {forwardRef, useImperativeHandle, useMemo, useState} from "react";
import {Modal, Form, Input, DatePicker} from "antd";
import List from "@/components/List.jsx";
import {Link} from "react-router-dom";
import {EyeOutlined} from "@ant-design/icons";

const ListModal = forwardRef(function ListModal(_, ref) {
  const [open, setOpen] = useState(false)
  const [filters] = Form.useForm()
  const columns = useMemo(() => {
    return [
      {
        title: "序号",
        render: (_, row, index) => index + 1
      },
      {
        title: "お客様",
        dataIndex: ['order', 'company_name'],
      },
      {
        title: '社内番号',
        dataIndex: ['order', 'order_no'],
      },
      {
        title: '作废請求書号',
        dataIndex: ['no'],
        render: (value, row) => (
          <div className={'text-primary-500'}>
            <Link to={`/rb/edit/${row.id}/order/${row.order_id}/type/${row.id}`}>{value}</Link>
            <EyeOutlined className={'ml-2'} />
          </div>
        ),
      },
      {
        title: '变更后請求書号',
        dataIndex: ['replace_book', 'no'],
        render: (value, row) => (
          <div className={'text-primary-500'}>
            <Link
              to={`/rb/edit/${row.replace_book.id}/order/${row.replace_book.order_id}/type/${row.replace_book.id}`}
            >{value}</Link>
            <EyeOutlined className={'ml-2'} />
          </div>
        ),
      },
      {
        title: '制作日期',
        dataIndex: ['created_at'],
        render: (value) => value?.substring(0, 10),
      },
      {
        title: '变更日期',
        dataIndex: ['void_at'],
        render: (value) => value?.substring(0, 10),
      },
    ]
  }, []);

  useImperativeHandle(ref, () => {
    return {
      open() {
        setOpen(true)
      }
    }
  }, [])

  return (
    <Modal
      title={'すべての改訂済請求書'}
      width={1200}
      open={open}
      footer={null}
      onCancel={() => setOpen(false)}
    >
      <div>
        <List
          url={'/admin/request_book/list'}
          beforeSearch={(params) => ({
            ...params,
            is_void: 1,
          })}
          columns={columns}
          filters={filters}
          className={'!bg-transparent'}
          filterItems={(
            <>
              <Form.Item noStyle name={'company_name'}>
                <Input placeholder={'お客様名'} rootClassName={'w-32'}/>
              </Form.Item>
              <Form.Item noStyle name={'bkg_no'}>
                <Input placeholder={'BKG NO.'} rootClassName={'w-32'} />
              </Form.Item>
              <Form.Item noStyle name={'void_at'}>
                <DatePicker.RangePicker />
              </Form.Item>
            </>
          )}
        />
      </div>
    </Modal>
  )
})

export default ListModal
