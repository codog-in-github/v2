import {
  COST_PART_CUSTOMS, COST_PART_LAND, COST_PART_OTHER,
  COST_PART_SEA, COST_PARTS, SELECT_ID_RB_DETAIL_ITEM, SELECT_ID_RB_DETAIL_UNIT, SELECT_ID_RB_EXTRA_ITEM
} from "@/constant"
import {
  Switch, Radio, InputNumber, AutoComplete, Button, DatePicker,
  Col, Form, Input, Row, Popover
} from "antd"
import { useMemo, useEffect, useContext, createContext, useCallback, useRef } from "react"
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
            form.setFieldValue(['extra', datakey, 'value'], def)
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


const formDataFormat = (book) => {
  const formData = { ...book }
  formData['date'] = dayjs(book['date'])
  formData['is_stamp'] = book['is_stamp'] === 1
  if(!book['extras'] || book['extras'].length === 0) {
    formData['extras'] = [{}]
  } 
  if(book['details'] && book['details'].length > 0) {
    const details = {}
    for(const row of book['details']) {
      if(!details[row['type']]) {
        details[row['type']] = [row]
      } else {
        details[row['type']].push(row)
      }
    }
    formData['details'] = details
  } else {
    formData['details'] = [{}]
  }
  return formData
}

const saveDataFormat = (formData) => {
  const saveData = {...formData}
  console.log(saveData)
  saveData['date'] = dayjs(saveData['date']).format('YYYY-MM-DD')
  saveData['is_stamp'] = saveData['is_stamp'] ? 1 : 0
  const details = []
  for(const group in saveData['details']) {
    if(!saveData['details'][group]) {
      continue
    }
    for(const detail of saveData['details'][group]) {
      details.push({
        ...detail,
        type: group
      })
    }
  }
  saveData['details'] = details
  saveData['counts'] = []
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
  }


  const removeRow = () => {
    const details = form.getFieldValue('details')
    if(Object.keys(details).length <= 1 && details[partType]?.length <= 1) {
      pubSub.publish('Info.Toast', '削除する行がありません', 'error')
      return
    }
    const part = form.getFieldValue(['details', partType])
    form.setFieldValue(['details', partType], part.filter((_, i) => i !== props.key))
  }

  return (
    <tr key={props.key}>
      <Form.Item noStyle name={[props.key, 'id']} />
      <td  className="text-right">{partName}</td>
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
        <Form.Item noStyle name={[props.key, 'detail']}>
          <Input className="flex-1" onBlur={calcPrice}></Input>
        </Form.Item>
        <Form.Item noStyle name={[props.key, 'currency']}>
          <SingleCheckbox onBlur={calcPrice}  />
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

const detailPart = (type) => {
  let partName = getPartName(type)
  return (list) => {
    if(!list.length) {
      return null
    }
    return list.map((props, i) => (
      <DetailRow
        key={props.key}
        partType={type}
        partName={i ? '' : partName}
        props={props}
      />
    ))
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


const Total = () => {
  const form = Form.useFormInstance()
  const detailsOrigin = Form.useWatch('details')
  const details = useMemo(() => {
    return detailsOrigin?.flat().filter(item => item) ?? []
  }, [detailsOrigin])

  useEffect(() => {
    let total = details.reduce((acc, cur) => {
      return acc + (Number(cur['amount']) ?? 0)
    }, 0)
    if(isNaN(total)) {
      total = 0
    }
    let tax = details.filter(item => item['tax']).reduce((acc, cur) => acc + cur['amount'] * 0.1, 0)
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
  const { id, orderId } = useParams()
  const navigate = useNavigate()
  const extraDefaultValue = useRef({})
  const extraItems = useItemList(SELECT_ID_RB_EXTRA_ITEM)
  const detailItems = useItemList(SELECT_ID_RB_DETAIL_ITEM)
  const units = useItemList(SELECT_ID_RB_DETAIL_UNIT)
  const banks = useBankList()
  const bankOptions = useMemo(() => {
    return banks.map(item => ({
      ...item,
      style: { width: 150 }
    }))
  }, [banks])
  const departments = useDepartmentList()
  const departmentOptions = useMemo(() => {
    return departments.map(item => ({
      ...item,
      style: { width: 150 }
    }))
  }, [departments])

  const [submit, submiting] = useAsyncCallback(async () => {
    const data = saveDataFormat(form.getFieldsValue())
    await request('/admin/request_book/save').data(data).send()
    pubSub.publish('Info.Toast', '保存成功！', 'success')
  })

  useEffect(() => {
    form.resetFields()
    if(orderId) {
      form.setFieldsValue({
        'order_id': orderId,
        'type': 1
      })
      request('/admin/request_book/get_default_value').get({ id: orderId }).send().then((rep) => {
        form.setFieldsValue(formDataFormat(rep['book']))
        extraDefaultValue.current = rep['extra']
      })
    } else {
      request('/admin/request_book/detail').get({ id }).send()
        .then(rep => {
          form.setFieldsValue(formDataFormat(rep))
          return request('/admin/request_book/get_default_value').get({ id: form.getFieldValue('order_id') }).send()
        })
        .then(rep => {
          extraDefaultValue.current = rep['extra']
        })
    }
  }, [form, id, orderId])

  const details = Form.useWatch('details', form)

  const groupAddButtons = useMemo(() => {
    const buttons = []
    for(const part of COST_PARTS){
      if(!details?.[part]) {
        buttons.push(
          <div
            className="text-center w-32 leading-8 hover:bg-primary hover:text-white cursor-pointer"
            onClick={() => {
              form.setFieldValue(['details', part], [{}])
            }}
          >{getPartName(part)}</div>
        )
      }
    }
    return buttons
  }, [details, form])

  const [doExport, exporting] = useAsyncCallback(async () => {
    const rep = await request('/admin/request_book/export').data({ id }).download().send()
    console.log(rep)
  })
  
  return (
    <EditFormContext.Provider value={{ detailItems, extraItems, units, extraDefaultValue }}>
      <Form
        form={form}
        className="flex h-screen"
      >
        <Form.Item noStyle name="id" />
        <Form.Item noStyle name="order_id" />
        <Form.Item noStyle name="type" />

        <div className="h-full flex-1 pt-4 overflow-auto pb-4">
          <div className="text-center text-xl font-bold">請求書</div>

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
                  <td className="w-32">单价</td>
                  <td className="w-16">数量</td>
                  <td className="w-16">单位</td>
                  <td className="w-16">消費税</td>
                  <td className="w-64">金额</td>
                </tr>
                {
                  costTypes.map((type) => (
                    <Form.List key={type} name={['details', type]}>{detailPart(type)}</Form.List>
                  ))
                }
              </tbody>
            </table>
          </div>
          <div className="ml-16 my-4">
            <Popover
              trigger="hover"
              placement="rightTop"
              rootClassName="[&_.ant-popover-inner]:!p-0"
              content={groupAddButtons}
            >
              <Button type="primary" className="bg-success hover:!bg-success-400">枠追加</Button>
            </Popover>
          </div>

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
            <Button className="w-32" type="primary">追加請求書</Button>
            <Button className="w-32" type="primary">参照入力</Button>
            <Button className="w-32" type="primary" loading={exporting} onClick={doExport}>出力</Button>
            <Button className="w-32" loading={submiting} type="primary" onClick={submit}>保存</Button>
            <Button className="w-32" onClick={() => navigate(`/orderDetail/${form.getFieldValue('order_id')}`)}>戻る</Button>
          </div>
      
        </div>
        <div
          className="h-full w-[600px] shadow-lg shadow-gray-400 p-8"
        >
          <Label>コストチェック表</Label>
          {/* todo files */}
        </div>
      </Form>
    </EditFormContext.Provider>
  )
}

export default EditForm
