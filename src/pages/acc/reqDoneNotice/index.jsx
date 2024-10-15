import List from "@/components/List.jsx";
import {useMemo, useRef} from "react";
import {Button, DatePicker, Form, Input, Popconfirm} from "antd";
import dayjs from "dayjs";
import {useAsyncCallback} from "@/hooks/index.js";
import {request} from "@/apis/requestBuilder.js";
import pubSub from "@/helpers/pubSub.js";

const PageContent = () => {

  const listRef = useRef(null);

  const [confirm, loading] = useAsyncCallback(async (id, status) => {
    await request('/admin/acc/confirm_req_done').data({ id, status }).send()
    pubSub.publish('Info.Toast', '操作成功')
    listRef.current?.getList()
  })

  const columns = useMemo(() => [{
    title: '社内番号',
    dataIndex: ['order', 'order_no'],
  }, {
    title: 'お客様名',
    dataIndex: ['order', 'company_name'],
  }, {
    width: 400,
    title: '说明',
    dataIndex: ['reason'],
  }, {
    title: '申请人',
    dataIndex: ['created_by_name'],
  }, {
    title: '申请时间',
    dataIndex: ['created_at'],
    render: (value) => dayjs(value).format('YYYY-MM-DD HH:mm:ss'),
  }, {
    title: '申请时间',
    render: (row) => (
        <>
          <Popconfirm
              title={'是否确定'}
              onConfirm={() => confirm(row.id, 1)}
          >
            <Button type={'link'} >通过</Button>
          </Popconfirm>

          <Popconfirm
              title={'是否确定'}
              onConfirm={() => confirm(row.id, -1)}
          >
            <Button type={'link'} danger>驳回</Button>
          </Popconfirm>
        </>
    ),
  }], [])
  const [filters] = Form.useForm()

  return (
    <List
      ref={listRef}
      filters={filters}
      filterItems={(
          <>
            <Form.Item noStyle name={'company_name'}>
              <Input placeholder={'お客様名'} />
            </Form.Item>
            <Form.Item noStyle name={'created_at'}>
              <DatePicker.RangePicker />
            </Form.Item>
          </>
      )}
      columns={columns}
      url={'/admin/acc/req_check_list'}
    ></List>
  )
}

export default PageContent
