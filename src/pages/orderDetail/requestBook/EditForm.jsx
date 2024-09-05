import {
  COST_PART_CUSTOMS, COST_PART_LAND, COST_PART_OTHER,
  COST_PART_SEA, COST_PARTS, FILE_TYPE_COST, FILE_TYPE_REQUEST, REQUEST_TYPE_ADVANCE, REQUEST_TYPE_NORMAL, SELECT_ID_RB_DETAIL_ITEM, SELECT_ID_RB_DETAIL_UNIT, SELECT_ID_RB_EXTRA_ITEM
} from "@/constant"
import {
  Switch, Radio, InputNumber, AutoComplete, Button, DatePicker,
  Col, Form, Input, Row, Popover
} from "antd"
import { useMemo, useEffect, useContext, createContext, useRef } from "react"
import { useAsyncCallback, useBankList, useDepartmentList, useOptions } from "@/hooks"
import { request } from "@/apis/requestBuilder"
import { MinusOutlined, PlusOutlined } from "@ant-design/icons"
import Label from "@/components/Label"
import SingleCheckbox from "@/components/SingleCheckbox"
import { useParams } from "react-router-dom"
import dayjs from "dayjs"
import pubSub from "@/helpers/pubSub"
import { useNavigate } from "react-router-dom"
import FormValue from "@/components/FormValue"
import { useState } from "react"
import FileTabs from "@/components/FileTabs"
import { Space } from "antd/lib"
import { Select } from "antd"

const costTypes = [
  COST_PART_CUSTOMS,
  COST_PART_SEA,
  COST_PART_LAND,
  COST_PART_OTHER
]
const getPartName = (type) => {
  switch (type) {
    case COST_PART_CUSTOMS:
      return '通関部分'
    case COST_PART_SEA:
      return '海運部分'
    case COST_PART_LAND:
      return '陸送部分'
    default:
      return 'その他'
  }
}

const EditFormContext = createContext()

const ExtraInput = ({ datakey }) => {
  const form = Form.useFormInstance()
  const { extraItems, extraDefaultValue } = useContext(EditFormContext)
  const add = () => {
    const oldValue = form.getFieldValue('extras')
    form.setFieldValue('extras', [
      ...oldValue,
      {}
    ])
  }
  const del = () => {
    const oldValue = form.getFieldValue('extras')
    if(oldValue.length <= 1) {
      pubSub.publish('Info.Toast', '削除するには少なくとも1つ必要です', 'error')
      return
    }
    form.setFieldValue('extras', oldValue.filter((_, i) => i != datakey))
  }
  return (
    <div className="flex gap-2">
      <Form.Item noStyle name={[datakey, 'column']}>
        <AutoComplete
          className="w-32"
          options={extraItems}
          allowClear
          filterOption="value"
          onSelect={(name) => {
            const def = extraDefaultValue.current[name] ?? ''
            form.setFieldValue(['extras', datakey, 'value'], def)
          }}
        ></AutoComplete>
      </Form.Item>
      <Form.Item noStyle name={[datakey, 'value']}>
        <Input className="flex-1"></Input>
      </Form.Item>
      <Button type="primary" icon={<PlusOutlined />} onClick={add}></Button>
      <Button type="primary" danger icon={<MinusOutlined />} onClick={del}></Button>
    </div>
  )
}


const formDataFormat = (book, type = REQUEST_TYPE_NORMAL) => {
  const formData = { ...book }
  formData['date'] = dayjs(book['date'])
  formData['is_stamp'] = book['is_stamp'] === 1
  if(!book['extras'] || book['extras'].length === 0) {
    formData['extras'] = [{}]
  } 
  formData['counts'] = {}
  if(book['counts'] && book['counts'].length > 0) {
    const counts = {}
    for(const row of book['counts']) {
      if(!counts[row['type']]) {
        counts[row['type']] = []
      }
      counts[row['type']].push(row)
    }
    formData['counts'] = counts
  }
  if(book['details'] && book['details'].length > 0) {
    const details = {}
    for(const row of book['details']) {
      if(!details[row['type']]) {
        details[row['type']] = []
      }
      details[row['type']].push(row)
    }
    formData['details'] = details
  } else {
    if(type === REQUEST_TYPE_NORMAL) {
      formData['details'] = {
        [COST_PART_CUSTOMS]: [{}],
        [COST_PART_SEA]: [{}],
        [COST_PART_LAND]: [{}]
      }
    } else {
      formData['counts'] = {
        [COST_PART_OTHER]: [{}]
      }
    }
  }
  return formData
}

const saveDataFormat = (formData) => {
  const saveData = {...formData}
  saveData['date'] = dayjs(saveData['date']).format('YYYY-MM-DD')
  saveData['is_stamp'] = saveData['is_stamp'] ? 1 : 0
  const details = []
  for(const group in saveData['details']) {
    if(!saveData['details'][group]) {
      continue
    }
    for(const detail of saveData['details'][group]) {
      const row = {
        ...detail,
        type: group
      }
      row.detail = row.detail + (row.currencyUnit || '')
      delete row.currencyUnit
      details.push(row)
    }
  }
  saveData['details'] = details
  const counts = []
  for(const group in saveData['counts']) {
    if(!saveData['counts'][group]) {
      continue
    }
    for(const i in saveData['counts'][group]) {
      const count = {
        ...saveData['counts'][group][i],
        type: group
      }
      if(~~group !== COST_PART_SEA) {
        count['item_name'] = formData['details'][group][i]['item_name']
      }
      counts.push(count)
    }
  }
  saveData['counts'] = counts
  return saveData
}


const DetailRow = ({ partType, partName, props }) => {
  const currentRowPath = ['details', partType, props.key]
  const { detailItems, units } = useContext(EditFormContext)
  const form = Form.useFormInstance()
  const calcAmount = () => {
    const row = form.getFieldValue(currentRowPath)
    if(row['num'] && row['price']) {
      form.setFieldValue([...currentRowPath, 'amount'], (row['num'] * row['price']).toFixed(2))
    }
  }

  const calcPrice = () => {
    const row = form.getFieldValue(currentRowPath)
    if(row['detail'] && row['currency']) {
      const rate = form.getFieldValue(['extras'])?.find(item => item['column'] === 'RATE')?.value
      if(!rate) {
        pubSub.publish('Info.Toast', '汇率が未設定です', 'error')
        return
      }
      form.setFieldValue([...currentRowPath, 'price'], (row['detail'] * rate).toFixed(2))
      calcAmount()
    }
  }

  const addRow = () => {
    const part = form.getFieldValue(['details', partType])
    form.setFieldValue(['details', partType, part.length], {})
    if(partType !== COST_PART_SEA) {
      form.setFieldValue(['counts', partType, part.length], {})
    }
  }


  const removeRow = () => {
    const details = form.getFieldValue('details')
    if(Object.values(details).flat().length <= 1) {
      pubSub.publish('Info.Toast', '削除する行がありません', 'error')
      return
    }
    const part = form.getFieldValue(['details', partType])
    form.setFieldValue(['details', partType], part.filter((_, i) => i !== props.key))
    
    const counts = form.getFieldValue('counts')
    counts[partType] = counts[partType].filter((_, i) => i !== props.key)
    form.setFieldValue('counts', {...counts})
  }

  return (
    <tr key={props.key}>
      <Form.Item noStyle name={[props.key, 'id']} />
      <td className="text-right">{partName}</td>
      <td>
        <Form.Item noStyle name={[props.key, 'item_name']}>
          <AutoComplete
            className="w-full"
            options={detailItems}
            filterOption="value"
            allowClear
            onSelect={(_, { origin }) => {
              form.setFieldValue([...currentRowPath, 'unit'], origin['extra'])
            }}
          ></AutoComplete>
        </Form.Item>
      </td>
      <td className="flex gap-2">
        <Space.Compact className="flex-1">
          <Form.Item noStyle name={[props.key, 'detail']}>
            <Input onBlur={calcPrice} />
          </Form.Item>
          <Form.Item noStyle name={[props.key, 'currencyUnit']}>
          </Form.Item>
        </Space.Compact>
      </td>
      <td className="text-center">
        <Form.Item noStyle name={[props.key, 'currency']}>
          <Select
            className="w-16"
            allowClear
            options={[
              {value: '$'}
            ]}
          ></Select>
        </Form.Item>
      </td>
      <td>
        <Form.Item noStyle name={[props.key, 'price']}>
          <InputNumber className="w-full" min={0} onBlur={calcAmount}></InputNumber>
        </Form.Item>
      </td>
      <td>
        <Form.Item noStyle name={[props.key, 'num']}>
          <InputNumber min={0} className="w-full" onBlur={calcAmount} />
        </Form.Item>
      </td>
      <td>
        <Form.Item noStyle name={[props.key, 'unit']}>
          <AutoComplete className="w-full" options={units} />
        </Form.Item>
      </td>
      <td className="text-center">
        <Form.Item noStyle name={[props.key, 'is_tax']}>
          <SingleCheckbox onBlur={calcAmount} />
        </Form.Item>
      </td>
      <td className="flex gap-2">
        <Form.Item noStyle name={[props.key, 'amount']}>
          <Input className="flex-1" />
        </Form.Item>
        <Button type="primary" onClick={addRow} icon={<PlusOutlined />}></Button>
        <Button type="primary" onClick={removeRow} danger icon={<MinusOutlined />}></Button>
      </td>
    </tr>
  )
}

const CostTable = ({ value }) => {
  const counts = value
  const form = Form.useFormInstance()
  if(!counts) return null
  return costTypes.map((type) => {
    if(!counts[type] || counts[type].length === 0) {
      return null
    }
    return (
      <>
        <div className="flex items-center my-2">
          <div className="flex-shrink-0 mr-8">{getPartName(type)}</div>
          <div className="h-0 w-full flex border-t border-dashed border-gray-300" />
        </div>
        <div className="p-4 bg-gray-200">
          <div className="flex gap-2 mb-2">
            <div className="w-32">明细项目</div>
            <div>金额</div>
          </div>
          {counts[type].map((item, i) => (
            <div key={i} className="flex gap-2 my-2">
              <Form.Item noStyle
                name={[type === COST_PART_SEA ? 'counts': 'details', type, i, 'item_name']}
              >
                <Input readOnly className="w-32 flex-shrink-0"></Input>
              </Form.Item>
              <Form.Item noStyle name={['counts', type, i, 'id']} />
              <Form.Item noStyle name={['counts', type, i, 'item_amount']}>
                <InputNumber className="w-full" min={0}></InputNumber>
              </Form.Item>
            </div>
          ))}
          <div className="my-2">仕入先</div>
          <Form.Item name={['counts', type, 0, 'purchase']} noStyle>
            <Input
              className="w-full"
              onBlur={(e) => {
                const val = e.target.value
                const group = form.getFieldValue(['counts', type])
                for(const item of group) {
                  item['purchase'] = val
                }
                form.setFieldValue(['counts', type], group)
              }}
            ></Input>
          </Form.Item>
        </div>
      </>
    )
  })
}

const detailPart = (type, i) => {
  let partName = getPartName(type)
  return (list) => {
    if(!list?.length) {
      return null
    }
    return (
      <>
        { i  > 0 && (
          <>
            <tr><td></td></tr>
            <tr className="border-dashed border-t border-gray-300"></tr>
            <tr><td></td></tr>
          </>
        )}
       {list.map((props, i) => (
        <DetailRow
          key={props.key}
          partType={type}
          partName={i ? '' : partName}
          props={props}
        />
      ))}
      </>
    )
  }
}

const useItemList = (selectId) => {
  const [options] = useOptions(selectId)
  const items = useMemo(() => {
    return options.map(item => ({
      value: item.value,
      origin: item
    }))
  }, [options])
  return items
}

const MiniTotal = () => {
  const detailsOrigin = Form.useWatch('details')

  const miniTotal = useMemo(() => {
    
    if(!detailsOrigin) {
      return 0
    }
    const details = Object.values(detailsOrigin).flat().filter(item => item) ?? []

    return details.filter(item => item['is_tax'])
      .reduce((acc, cur) => acc + Number(cur['amount'] ?? 0), 0)

  }, [detailsOrigin])
  return `[*消費税対象金額 ${miniTotal.toFixed(2)}]`
}

const Total = () => {
  const form = Form.useFormInstance()
  const detailsOrigin = Form.useWatch('details')
  const details = useMemo(() => {
    if(!detailsOrigin) {
      return []
    }
    return Object.values(detailsOrigin).flat().filter(item => item) ?? []
  }, [detailsOrigin])

  useEffect(() => {
    let total = details.reduce((acc, cur) => {
      return acc + Number(cur['amount'] ?? 0)
    }, 0)
    if(isNaN(total)) {
      total = 0
    }
    let tax = details.filter(item => item['is_tax']).reduce((acc, cur) => acc + Number(cur['amount']) * 0.1, 0)
    if(isNaN(tax)) {
      tax = 0
    }
    form.setFieldsValue({
      'tax': tax.toFixed(2),
      'total_amount': total.toFixed(2),
      'request_amount': (total + tax).toFixed(2),
    })
  }, [details, form])

  return (
    <div className="border-t border-gray-300 px-16">
      <div className="flex justify-between my-4">
        <div>小計</div>
        <div>￥<FormValue name="total_amount" /></div>
      </div>
      <div className="flex justify-between my-4">
        <div>消費税</div>
        <div>￥<FormValue name="tax" /></div>
      </div>
      <div className="flex justify-between my-4 font-bold">
        <div>御請求金額</div>
        <div>￥<FormValue name="request_amount" /></div>
      </div>
    </div>
  )
}
const EditForm = () => {
  const [form] = Form.useForm()
  const [disabled, setDisabled] = useState(false)
  const { id, orderId, copyId, type } = useParams()
  const bookType = ~~type
  const [files, setFiles] = useState({})
  const navigate = useNavigate()
  const extraDefaultValue = useRef({})
  const extraItems = useItemList(SELECT_ID_RB_EXTRA_ITEM)
  const detailItems = useItemList(SELECT_ID_RB_DETAIL_ITEM)
  const units = useItemList(SELECT_ID_RB_DETAIL_UNIT)
  const banks = useBankList()
  const bankOptions = useMemo(() => {
    return banks.map(item => ({
      ...item,
      style: { width: 180 }
    }))
  }, [banks])
  const departments = useDepartmentList()
  const departmentOptions = useMemo(() => {
    return departments.map(item => ({
      ...item,
      style: { width: 180 }
    }))
  }, [departments])

  const [submit, submiting] = useAsyncCallback(async () => {
    const data = saveDataFormat(form.getFieldsValue())
    const rep = await request('/admin/request_book/save').data(data).send()
    pubSub.publish('Info.Toast', '保存成功！', 'success')
    navigate(`/rb/edit/${rep['id']}/order/${rep['order_id']}/type/${rep['type']}`, { replace: true })
  })


  useEffect(() => {
    const bookId = id ?? copyId
    form.setFieldsValue({
      'order_id': orderId,
      type: bookType
    })
    request('/admin/request_book/get_default_value').get({ id: orderId }).send().then((rep) => {
      bookId || form.setFieldsValue(formDataFormat(rep['book'], bookType))
      extraDefaultValue.current = rep['extra']
      setFiles(rep['files'])
    })
  }, [orderId, id, copyId, form, bookType])

  useEffect(() => {
    const bookId = id ?? copyId
    if(bookId) {
      form.resetFields()
      request('/admin/request_book/detail').get({ id }).send()
        .then(rep => {
          form.setFieldsValue(formDataFormat(rep ,bookType))
          setDisabled(id && rep['is_send'])
        })
    }
  }, [form, copyId, id, bookType])

  const details = Form.useWatch('details', form)

  const groupAddButtons = useMemo(() => {
    const buttons = []
    for(const part of COST_PARTS){
      if(details?.[part]?.length > 0) {
        continue
      }
      buttons.push(
        <div
          className="text-center w-32 leading-8 hover:bg-primary hover:text-white cursor-pointer"
          onClick={() => {
            form.setFieldValue(['details', part], [{}])
            const countsDefaultRow = {}
            if(part === COST_PART_SEA) {
              countsDefaultRow['item_name'] = '合计'
            }
            form.setFieldValue(['counts', part], [countsDefaultRow])
          }}
        >{getPartName(part)}</div>
      )
    }
    return buttons
  }, [details, form])

  const [doExport, exporting] = useAsyncCallback(async () => {
    await request('/admin/request_book/export').data({ id }).download(null, true).send()
  })
  
  return (
    <EditFormContext.Provider value={{ detailItems, extraItems, units, extraDefaultValue }}>
      <Form
        disabled={disabled}
        form={form}
        className="flex h-screen"
      >
        <Form.Item noStyle name="id" />
        <Form.Item noStyle name="order_id" />
        <Form.Item noStyle name="type" />

        <div className="h-full flex-1 pt-4 overflow-auto pb-4">
          <div className="text-center text-xl font-bold">{ bookType === REQUEST_TYPE_ADVANCE && '立替' }請求書</div>

          <Row className="px-16 mt-6">
            <Col span={8}>
              <Form.Item label="請求番号" name="no" labelCol={{ span: 6 }} >
                <Input></Input>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="請求日" name="date" labelCol={{ span: 6 }} >
                <DatePicker className="w-full" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="〒" name="zip_code" labelCol={{ span: 6 }} >
                <Input></Input>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="会社名" name="company_name" labelCol={{ span: 6 }} >
                <Input></Input>
              </Form.Item>
            </Col>
            <Col span={16}>
              <Form.Item label="住所" name="company_address" labelCol={{ span: 3 }} >
                <Input></Input>
              </Form.Item>
            </Col>
          </Row>

          <Form.List name="extras">{list => (
            <div className="border-t py-8 border-gray-300 grid grid-cols-2 gap-x-12 gap-y-8 px-16">
              {list.map(({ key, name }) => (
                <ExtraInput key={key} datakey={name} />
              ))}
            </div>
          )}</Form.List>

          <div className="px-16 py-4 border-t border-gray-300 bg-gray-100">
            <table cellPadding={6} className=" w-full">
              <tbody>
                <tr>
                  <td className="w-24"></td>
                  <td className="w-32">明細項目</td>
                  <td className="w-64">詳細</td>
                  <td className="w-12 text-center">转换</td>
                  <td className="w-32">单价</td>
                  <td className="w-16">数量</td>
                  <td className="w-16">单位</td>
                  <td className="w-16 text-center">消費税</td>
                  <td className="w-64">金额</td>
                </tr>
                {
                  costTypes.map((type, i) => (
                    <Form.List key={type} name={['details', type]}>{detailPart(type, i)}</Form.List>
                  ))
                }
              </tbody>
            </table>
          </div>

          { bookType === REQUEST_TYPE_NORMAL && (
            <div className="mx-16 my-4 flex justify-between">
              <Popover
                trigger="hover"
                placement="rightTop"
                rootClassName="[&_.ant-popover-inner]:!p-0"
                content={groupAddButtons}
              >
                <Button type="primary" className="bg-success hover:!bg-success-400">枠追加</Button>
              </Popover>
              <MiniTotal></MiniTotal>
            </div>
          )}

          <Total></Total>

          <div className="border-t py-8 border-gray-300 px-16">
            <Form.Item label="銀行" name="bank_id">
              <Radio.Group options={bankOptions} />
            </Form.Item>
            <Form.Item label="地址" name="department_id">
              <Radio.Group options={departmentOptions} />
            </Form.Item>
            <Form.Item label="社印" name="is_stamp">
              <Switch></Switch>
            </Form.Item>
          </div>

          <div className="flex gap-2 justify-end px-16">
            <Button className="w-32" disabled={!id} type="primary" onClick={() => navigate(`/rb/add/${orderId}/type/${type}`, { replace: true })}>追加請求書</Button>
            {/* <Button className="w-32" type="primary">参照入力</Button> */}
            <Button className="w-32" type="primary" disabled={disabled || !id} loading={exporting} onClick={doExport}>出力</Button>
            <Button className="w-32" loading={submiting} type="primary" onClick={submit}>保存</Button>
            <Button className="w-32" disabled={false} onClick={() => navigate(-1)}>戻る</Button>
          </div>
      
        </div>
        <div
          className="h-full w-[600px] shadow-lg shadow-gray-400 p-8"
        >
          <Label>コストチェック表</Label>

          <FileTabs tabs={[FILE_TYPE_COST]} files={files} />
          <Form.Item name='counts' noStyle>
            <CostTable></CostTable>
          </Form.Item>
        </div>
      </Form>
    </EditFormContext.Provider>
  )
}

export default EditForm
