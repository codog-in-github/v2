import List from "@/components/List.jsx";
import {useCallback, useMemo, useRef} from "react";
import {DatePicker, Form, Input, Radio, Select} from "antd";
import {genRowSpan, map2array} from "@/helpers/index.js";
import {COST_PART_CUSTOMS, COST_PART_LAND, COST_PART_OTHER, COST_PART_SEA, DEPARTMENTS} from "@/constant/index.js";
import dayjs from "dayjs";
import {isArray} from "lodash";
import {Link} from "react-router-dom";
import FilterItem from "@/components/FilterItem.jsx";

const costTypeMap = {
  [COST_PART_CUSTOMS]: '通関',
  [COST_PART_SEA]: '海運',
  [COST_PART_LAND]: '運送',
  [COST_PART_OTHER]: 'その他'
}

const departments = map2array(DEPARTMENTS)

const getRowKey = (row) => [row.book_id, row.type, row.purchase].join('|')
const ListPage = () => {
  const [filters] = Form.useForm()

  const listRef = useRef(null);

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
      key: 'date',
      onCell: row => row.cellSpan
    },
    {
      title: '社内番号',
      dataIndex: ['order_no'],
      key: 'no',
      onCell: row => row.cellSpan
    },
    {
      title: '請求書番号',
      dataIndex: ['no'],
      key: 'bkg_no'
    },
    {
      title: '制作日期',
      dataIndex: ['date'],
      render: (value) => dayjs(value).format('YYYY-MM-DD')
    },
    {
      title: '請求金额',
      dataIndex: ['amount'],
    },
    {
      title: '支払先お客様名',
      dataIndex: ['purchase'],
    },
    {
      title: '請求部分',
      dataIndex: ['cost_type'],
      render: (value) => costTypeMap[value]
    },
    {
      title: '処理',
      render: (row) => (
        <>
          <Link
            className={'text-primary-500'}
            to={`/rb/edit/${row.book_id}/order/${row.order_id}/type/${row.book_type}`}
          >查看</Link>
        </>
      )
    }
  ], [])

  const onDataSource = useCallback(genRowSpan('order_id'), []);

  return (
    <List
      onDataSource={onDataSource}
      url={'/admin/acc/costs_pay_check_list'}
      rowKey={getRowKey}
      tableProps={{ bordered: true }}
      ref={listRef}
      columns={columns}
      filters={filters}
      beforeSearch={filters => {
        filters = { ...filters }
        filters.with_sea = 1
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

          <FilterItem label={'お客様名'} name={'company_name'}>
            <Input className={'w-44'} placeholder={'お客様名'}></Input>
          </FilterItem>

          <FilterItem label={'社内番号'} name={'order_no'}>
            <Input className={'w-44'} placeholder={'社内番号'}></Input>
          </FilterItem>

          <FilterItem label={'BKG NO.'} name={'bkg_no'}>
            <Input className={'w-44'} placeholder={'BKG NO.'}></Input>
          </FilterItem>

          <FilterItem label={'制作状态'} name={'is_send'}>
            <Radio.Group
              optionType={'button'}
              buttonStyle={'solid'}
              options={[
                { label: '未完了', value: 0 },
                { label: '完了', value: 1 }
              ]}
            ></Radio.Group>
          </FilterItem>

          <FilterItem label={'請求部分'} name={'type'}>
            <Radio.Group
              optionType={'button'}
              buttonStyle={'solid'}
              options={[
                { label: '通関', value: COST_PART_CUSTOMS },
                { label: '海運', value: COST_PART_SEA },
                { label: '運送', value: COST_PART_LAND },
                { label: 'その他', value: COST_PART_OTHER }
              ]}
           ></Radio.Group>
          </FilterItem>

          <FilterItem label={'制作日期'} name={'date'}>
            <DatePicker.RangePicker  />
          </FilterItem>

          <FilterItem label={'支払先お客様名'} name={'purchase'}>
            <Input className={'w-44'} placeholder={'支払先お客様名'}></Input>
          </FilterItem>
        </>
      )}
    >
    </List>
  )
}

export default ListPage
