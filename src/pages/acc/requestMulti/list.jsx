import List from "@/components/List.jsx";
import {useCallback, useMemo} from "react";
import {DEPARTMENTS} from "@/constant/index.js";
import {DatePicker, Form, Input, Radio, Select} from "antd";
import {isArray} from "lodash";
import {genMetaBy, genRowSpan, map2array} from "@/helpers/index.js";
import FilterItem from "@/components/FilterItem.jsx";
import classNames from "classnames";

const priceRender = (value) => {
  if (!value) {
    return <div className={'text-right'}>-</div>
  }
  return (
    <div className={'text-right'}>¥{Number(value).toFixed(2)}</div>
  )
}

const booleanTextRender = (value) => {
  const boolTagClassName = 'rounded py-2 px-4'
  if(value) {
    return (
      <span
        className={classNames(boolTagClassName, 'text-success-500 bg-success-50')}
      >是</span>
    )
  }
  return (
    <span
      className={classNames(boolTagClassName, 'text-danger-500 bg-danger-50')}
    >否</span>
  )
}

const departments = map2array(DEPARTMENTS)
const RequestMultiList = () => {
  const [filters] = Form.useForm()
  const columns = useMemo(() => [
    {
      title: '营业场所',
      dataIndex: ['department'],
      key: 'department',
      width: 120,
      render: (text) => DEPARTMENTS[text],
      onCell: row => row.cellSpan
    },
    {
      title: 'お客様名',
      dataIndex: ['company_name'],
      key: 'company_name',
      onCell: row => row.cellSpan
    },
    {
      title: 'BKG NO.',
      dataIndex: ['bkg_no'],
      onCell: row => row.cellSpan
    },
    {
      title: '社内番号',
      dataIndex: ['order_no'],
      key: 'no',
      onCell: row => row.cellSpan
    },
    {
      title: '请求番号',
      dataIndex: ['no'],
      key: 'bkg_no'
    },
    {
      title: '请求金额',
      dataIndex: ['total_amount'],
      render: priceRender
    },
    {
      title: '支出金额',
      dataIndex: ['pay_total'],
      render: priceRender
    },
    {
      title: '入金',
      dataIndex: ['is_entry'],
      render: booleanTextRender
    },
    {
      title: '出金',
      dataIndex: ['pay_cost_status'],
      render: booleanTextRender
    },
    {
      title: '毛利',
      dataIndex: ['profit'],
      render: priceRender,
      onCell: row => row.cellSpan
    },
  ], []);


  const onDataSource = useCallback(genMetaBy('order_id', (metaRow, group) => {
    metaRow.cellSpan = { rowSpan: group.length }

    let total = 0
    let costs = 0

    group.forEach(row => {
      if(row.total_amount) {
        total += Number(row.total_amount)
      }
      if(row.pay_total) {
        costs += Number(row.pay_total)
      }
    })

    metaRow.profit = total - costs
  }), []);

  return (
    <List
      rowKey={'book_id'}
      filters={filters}
      columns={columns}
      onDataSource={onDataSource}
      tableProps={{ bordered: true }}
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
          <FilterItem label={'营业场所'} name={'department'}>
            <Select
              className={'w-32'}
              options={departments}
            ></Select>
          </FilterItem>

          <FilterItem name={'company_name'} label={'お客様名'}>
            <Input
              className={'w-44'}
              placeholder={'お客様名'}
            />
          </FilterItem>

          <FilterItem name={'order_no'} label={'社内番号'}>
            <Input
              className={'w-44'}
              placeholder={'社内番号'}
            ></Input>
          </FilterItem>

          <FilterItem label={'BKG NO.'} name={'bkg_no'}>
            <Input
              className={'w-44'}
              placeholder={'BKG NO.'}
            ></Input>
          </FilterItem>

          <FilterItem label={'入金'} name={'is_entry'}>
            <Radio.Group
              optionType={'button'}
              buttonStyle={'solid'}
              options={[
                {label: '是', value: 1},
                {label: '否', value: 0},
              ]}
            ></Radio.Group>
          </FilterItem>

          <FilterItem label={'出金'} name={'pay_cost_status'}>
            <Radio.Group
              optionType={'button'}
              buttonStyle={'solid'}
              options={[
                {label: '是', value: 1},
                {label: '否', value: 0},
              ]}
            ></Radio.Group>
          </FilterItem>

          <FilterItem label={'日期类型'}>
            <Form.Item noStyle name={'date_type'}>
              <Radio.Group
                className={'mr-2'}
                optionType={'button'}
                buttonStyle={'solid'}
                options={[
                  {label: 'CUT', value: 'cy_cut'},
                  {label: '入金', value: 'entry_at'},
                  {label: '請求', value: 'date'},
                  {label: '新建', value: 'orders.created_at'},
                ]}
              ></Radio.Group>
            </Form.Item>
            <Form.Item noStyle name={'date'}>
              <DatePicker.RangePicker className={'w-72'}></DatePicker.RangePicker>
            </Form.Item>
          </FilterItem>

          <FilterItem label={'日期类型'}>
            <Form.Item noStyle name={'date_type2'}>
              <Radio.Group
                className={'mr-2'}
                optionType={'button'}
                buttonStyle={'solid'}
                options={[
                  {label: 'CUT', value: 'cy_cut'},
                  {label: '入金', value: 'entry_at'},
                  {label: '請求', value: 'date'},
                  {label: '新建', value: 'orders.created_at'},
                ]}
              ></Radio.Group>
            </Form.Item>
            <Form.Item noStyle name={'date2'}>
              <DatePicker.RangePicker className={'w-72'}></DatePicker.RangePicker>
            </Form.Item>
          </FilterItem>
        </>
      )}
    ></List>
  )
}

export default RequestMultiList
