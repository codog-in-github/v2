import List from '@/components/List.jsx'
import {Button, DatePicker, Form, Input, Select} from "antd";
import {genRowSpan, map2array} from "@/helpers/index.js";
import {DEPARTMENTS} from "@/constant/index.js";
import {useCallback, useMemo} from "react";
import dayjs from "dayjs";
import {Link} from "react-router-dom";
import {useAsyncCallback} from "@/hooks/index.js";
import {request} from "@/apis/requestBuilder.js";
import FilterItem from "@/components/FilterItem.jsx";

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
      render: (department) => DEPARTMENTS[department],
      onCell: row => row.cellSpan
    },
    {
      title: "客户名",
      dataIndex: ['order', 'company_name'],
      onCell: row => row.cellSpan
    },
    {
      title: "BKG NO.",
      dataIndex: ['order', 'bkg_no'],
      onCell: row => row.cellSpan
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
        <Link to={`/rb/edit/${row.id}/order/${row.order_id}/type/${row.type}`}>
          <span className={'text-primary-500'}>{ row.is_void === 1 ? '查看' : '编辑' }</span>
        </Link>
      )
    },
  ], []);

  const onDataSource = useCallback(genRowSpan('order_id'), []);

  return (
    <List
      url={'/admin/acc/request_books'}
      columns={columns}
      onDataSource={onDataSource}
      tableProps={{ bordered: true }}
      filters={filters}
      filterItems={(
        <>
          <FilterItem label={'营业场所'} name={'department'}>
            <Select
              placeholder={'营业场所'}
              className={'w-44'}
              options={departments}
            ></Select>
          </FilterItem>

          <FilterItem label={'お客様名'} name={'company_name'}>
            <Input
              placeholder={'お客様名'}
              className={'w-44'}
            ></Input>
          </FilterItem>

          <FilterItem label={'社内請求書番号'} name={'no'}>
            <Input
              placeholder={'社内請求書番号'}
              className={'w-44'}
            ></Input>
          </FilterItem>

          <FilterItem label={'BKG NO.'} name={'bkg_no'}>
            <Input
              placeholder={'BKG NO.'}
              className={'w-44'}
            ></Input>
          </FilterItem>

          <FilterItem label={'作废状态'} name={'is_void'}>
            <Select
              placeholder={'作废状态'}
              className={'w-44'}
              options={[
                { value: 0, label: '未作废' },
                { value: 1, label: '已作废' },
              ]}
            ></Select>
          </FilterItem>

          <FilterItem label={'请求日期'} name={'date'}>
            <DatePicker.RangePicker
              className={'w-64'}
            ></DatePicker.RangePicker>
          </FilterItem>

          <FilterItem label={'制作日期'} name={'created_at'}>
            <DatePicker.RangePicker
              className={'w-64'}
            ></DatePicker.RangePicker>
          </FilterItem>
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
