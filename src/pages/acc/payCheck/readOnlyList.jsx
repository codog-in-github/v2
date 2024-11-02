import List from "@/components/List.jsx";
import {useCallback, useMemo, useRef, useState} from "react";
import {Button, Checkbox, DatePicker, Form, Input, Radio, Select} from "antd";
import {map2array} from "@/helpers/index.js";
import {COST_PART_CUSTOMS, COST_PART_LAND, COST_PART_OTHER, COST_PART_SEA, DEPARTMENTS} from "@/constant/index.js";
import dayjs from "dayjs";
import pubSub from "@/helpers/pubSub.js";
import {isArray} from "lodash";
import {Link} from "react-router-dom";

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
  const [selectRows, setSelectRows] = useState({})

  const listRef = useRef(null);

  const checkModalRef = useRef(null);

  const selectRow = useCallback((checked, row) => {
    console.log(checked, selectRows)
    const key = getRowKey(row)
    if(checked) {
      selectRows[key] = row
    } else {
      delete selectRows[key]
    }
    setSelectRows({ ...selectRows })
  }, []);

  const showCheckModal = useCallback(() => {
    if(Object.keys(selectRows).length === 0) {
      return pubSub.publish('Info.Toast', '请选择要校对的费用记录', 'error')
    }
    checkModalRef.current.open(Object.values(selectRows))
    setSelectRows({})
  }, [selectRows]);

  const columns = useMemo(() => [
    // {
    //   width: 80,
    //   render: (row) => (
    //     <Checkbox
    //       onChange={(e) => selectRow(e.target.checked, row)}
    //       checked={getRowKey(row) in selectRows}
    //     ></Checkbox>
    //   ),
    // },
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
      title: '请求书番号',
      dataIndex: ['no'],
      key: 'bkg_no'
    },
    {
      title: 'BKG NO.',
      dataIndex: ['bkg_no'],
      key: 'date',
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
  ], [selectRows])

  return (
    <>
      <List
        url={'/admin/acc/costs_pay_check_list'}
        rowKey={getRowKey}
        ref={listRef}
        columns={columns}
        filters={filters}
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

            <span>制作状态</span>
            <Form.Item noStyle name={'is_send'}>
              <Radio.Group
                optionType={'button'}
                buttonStyle={'solid'}
                options={[
                  { label: '未完了', value: 0 },
                  { label: '完了', value: 1 }
                ]}
              ></Radio.Group>
            </Form.Item>

            <span>請求部分</span>
            <Form.Item noStyle name={'type'}>
              <Radio.Group
                optionType={'button'}
                buttonStyle={'solid'}
                options={[
                  { label: '通関', value: COST_PART_CUSTOMS },
                  { label: '運送', value: COST_PART_LAND },
                  { label: 'その他', value: COST_PART_OTHER }
                ]}
             ></Radio.Group>
            </Form.Item>

            <span>制作日期</span>
            <Form.Item noStyle name={'date'}>
              <DatePicker.RangePicker  />
            </Form.Item>

            <span>支払先お客様名</span>
            <Form.Item noStyle name={'purchase'}>
              <Input placeholder={'支払先お客様名'}></Input>
            </Form.Item>
          </>
        )}
      >
      </List>
    </>
  )
}

export default ListPage
