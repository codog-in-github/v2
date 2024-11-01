import List from "@/components/List.jsx";
import {useMemo} from "react";
import {COST_PART_CUSTOMS, COST_PART_LAND, COST_PART_OTHER, COST_PART_SEA, DEPARTMENTS} from "@/constant/index.js";
import {DatePicker, Form, Input, Radio, Select} from "antd";
import {isArray} from "lodash";
import {map2array} from "@/helpers/index.js";

const departments = map2array(DEPARTMENTS)
const RequestMultiList = () => {
  const [filters] = Form.useForm()
  const columns = useMemo(() => [
    {
      title: '营业场所',
      dataIndex: ['department'],
      key: 'department',
      width: 120,
      render: (text) => DEPARTMENTS[text]
    },
    {
      title: 'お客様名',
      dataIndex: ['company_name'],
      key: 'company_name'
    },
    {
      title: '社内番号',
      dataIndex: ['order_no'],
      key: 'no'
    },
    {
      title: '请求番号',
      dataIndex: ['no'],
      key: 'bkg_no'
    },
    {
      title: 'BKG NO.',
      dataIndex: ['bkg_no'],
    },
    {
      title: '请求金额',
      dataIndex: ['total_amount'],
      render: (value) => value ?  '¥' + Number(value).toFixed(2) : ''
    },
    {
      title: '支出金额',
      dataIndex: ['pay_total'],
      render: (value) => value ?  '¥' + Number(value).toFixed(2) : ''
    },
    {
      title: '入金',
      dataIndex: ['is_entry'],
      render: (value) => value ? '是' : '否'
    },
    {
      title: '出金',
      dataIndex: ['costs'],
      render: (value) => {
        if(value && isArray(value) && value.length) {
          if(value.filter(item => item.type !== COST_PART_SEA).every(item => item.pay_check_status)) {
            return '是'
          }
          return '否'
        }
        return '-'
      }
    },
    {
      title: '毛利',
      render: (row) => {
        return `¥${row.total_amount - row.pay_total}`
      }
    },
  ], []);
  return (
    <List
      rowKey={'book_id'}
      filters={filters}
      columns={columns}
      url={'/admin/acc/request_multi_list'}
      beforeSearch={filters => {
        filters = { ...filters }
        if(filters.date && isArray(filters.date)) {
          filters.date = filters.date.map(item => item.format('YYYY-MM-DD'))
        }
        return filters
      }}
      filterItems={(
        <>
          <span>营业场所</span>
          <Form.Item noStyle name={'department'}>
            <Select
              className={'w-32'}
              options={departments}
            ></Select>
          </Form.Item>

          <span>お客様名</span>
          <Form.Item noStyle name={'company_name'}>
            <Input placeholder={'お客様名'}></Input>
          </Form.Item>

          <span>社内番号</span>
          <Form.Item noStyle name={'order_no'}>
            <Input placeholder={'社内番号'}></Input>
          </Form.Item>

          <span>BKG NO.</span>
          <Form.Item noStyle name={'bkg_no'}>
            <Input placeholder={'BKG NO.'}></Input>
          </Form.Item>

          <span>入金</span>
          <Form.Item noStyle name={'is_entry'}>
            <Radio.Group
              optionType={'button'}
              buttonStyle={'solid'}
              options={[
                { label: '是', value: 1 },
                { label: '否', value: 0 },
              ]}
            ></Radio.Group>
          </Form.Item>

          <span>日期类型</span>
          <Form.Item noStyle name={'date_type'}>
            <Radio.Group
              optionType={'button'}
              buttonStyle={'solid'}
              options={[
                { label: 'CUT', value: 'cy_cut' },
                { label: '入金', value: 'entry_at' },
                { label: '請求', value: 'date' },
                { label: '新建', value: 'orders.created_at' },
              ]}
            ></Radio.Group>
          </Form.Item>
          <Form.Item noStyle name={'date'}>
            <DatePicker.RangePicker className={'w-72'}></DatePicker.RangePicker>
          </Form.Item>
        </>
      )}
    ></List>
  )
}

export default RequestMultiList
