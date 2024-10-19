import List from '@/components/List.jsx'
import {Button, DatePicker, Form, Input, Select} from "antd";
import {map2array} from "@/helpers/index.js";
import {DEPARTMENTS} from "@/constant/index.js";
import {useMemo, useRef} from "react";
import dayjs from "dayjs";
import {Link} from "react-router-dom";
import {useAsyncCallback} from "@/hooks/index.js";
import {request} from "@/apis/requestBuilder.js";

const departments = map2array(DEPARTMENTS)

const PageContent = () => {
  const [filters] = Form.useForm()

  const [exportCSV, loading] = useAsyncCallback( () =>
    request('/admin/acc/request_book_csv').get(filters.getFieldsValue()).download().send()
  )

  const columns = useMemo(() => [
    {
      title: "营业场所",
      dataIndex: ['order', 'department'],
      render: (department) => DEPARTMENTS[department]
    },
    {
      title: "客户名",
      dataIndex: ['order', 'company_name'],
    },
    {
      title: "社内請求書番号",
      dataIndex: ['no'],
      render: (value, row) => {
        return (
          <>
            {value}
            {row.is_void === 1 && (
              <span className={'p-1 bg-warning-500 text-white rounded ml-2'}>已作废</span>
            )}</>
        )
      }
    },
    {
      title: "BKG NO.",
      dataIndex: ['order', 'bkg_no'],
    },
    {
      title: '请求日期',
      dataIndex: ['date'],
      render: (value) => dayjs(value).format('YYYY-MM-DD')
    },
    {
      title: '制作日期',
      dataIndex: ['created_at'],
      render: (value) => dayjs(value).format('YYYY-MM-DD')
    },
    {
      title: '処理',
      render: (row) => (
        <Link to={`/rb/edit/${row.id}/order/${row.order_id}/type/${row.id}`}>
          <span className={'text-primary-500'}>{ row.is_void === 1 ? '查看' : '编辑' }</span>
        </Link>
      )
    },
  ], []);
  return (
    <List
      columns={columns}
      url={'/admin/acc/request_books'}
      filters={filters}
      filterItems={(
        <>
          <Form.Item noStyle name={'department'}>
            <Select
              placeholder={'营业场所'}
              className={'w-44'}
              options={departments}
            ></Select>
          </Form.Item>

          <Form.Item noStyle name={'company_name'}>
            <Input
              placeholder={'お客様名'}
              className={'w-44'}
            ></Input>
          </Form.Item>

          <Form.Item noStyle name={'no'}>
            <Input
              placeholder={'社内請求書番号'}
              className={'w-44'}
            ></Input>
          </Form.Item>

          <Form.Item noStyle name={'bkg_no'}>
            <Input
              placeholder={'BKG NO.'}
              className={'w-44'}
            ></Input>
          </Form.Item>

          <Form.Item noStyle name={'is_void'}>
            <Select
              placeholder={'作废状态'}
              className={'w-44'}
              options={[
                { value: 0, label: '未作废' },
                { value: 1, label: '已作废' },
              ]}
            ></Select>
          </Form.Item>

          <Form.Item noStyle name={'date'}>
            <DatePicker.RangePicker
              placeholder={'请求日期'}
              className={'w-64'}
            ></DatePicker.RangePicker>
          </Form.Item>

          <Form.Item noStyle name={'created_at'}>
            <DatePicker.RangePicker
              placeholder={'制作日期'}
              className={'w-64'}
            ></DatePicker.RangePicker>
          </Form.Item>
        </>
      )}
      filterActions={(
        <>
          <Button onClick={exportCSV} loading={loading}>EXPORT</Button>
        </>
      )}
    ></List>
  )
}

export default PageContent
