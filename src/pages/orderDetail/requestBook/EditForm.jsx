import {
  COST_PART_CUSTOMS,
  COST_PART_LAND,
  COST_PART_OTHER,
  COST_PART_SEA,
  COST_PARTS,
  FILE_TYPE_COST,
  REQUEST_TYPE_ADVANCE,
  REQUEST_TYPE_NORMAL,
  SELECT_ID_RB_DETAIL_ITEM,
  SELECT_ID_RB_DETAIL_UNIT,
  SELECT_ID_RB_EXTRA_ITEM,
  USER_ROLE_ACC
} from "@/constant"
import {
  Switch, Radio, InputNumber, AutoComplete, Button, DatePicker,
  Col, Form, Input, Row, Popover, Popconfirm, Space, Select, Modal
} from "antd"
import { useMemo, useEffect, useContext, createContext, useRef, useState } from "react"
import {useAsyncCallback, useBankList, useConfirm, useDepartmentList, useOptions} from "@/hooks"
import { request } from "@/apis/requestBuilder"
import { MinusOutlined, PlusOutlined } from "@ant-design/icons"
import Label from "@/components/Label"
import SingleCheckbox from "@/components/SingleCheckbox"
import { useParams, useNavigate } from "react-router-dom"
import dayjs from "dayjs"
import pubSub from "@/helpers/pubSub"
import FormValue from "@/components/FormValue"
import FileTabs from "@/components/FileTabs"
import { useSearchParams } from "react-router-dom"
import {useSelector} from "react-redux";
import {groupBy} from "lodash";
import classNames from "classnames";

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
      return '海上部分'
    case COST_PART_LAND:
      return '運送部分'
    default:
      return 'その他'
  }
}

const EditFormContext = createContext(null)

const genEmptyCostGroup = () => ({
  purchase: '',
  items: [{}]
})
const genEmptyCostTotalGroup = () => ({
  purchase: '',
  items: [{
    item_name: '合计',
    data_type: 'total'
  }]
})
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

const CostItemRow =
  ({ value,
     onChange,
     addable = true,
     disabled = false,
     operation,
     index
  }) => {
  const { detailItems } = useContext(EditFormContext)
  const onChangeField = (field, changeValue) => {
    onChange({
      ...value,
      [field]: changeValue
    })
  }

  const dataType = value?.data_type

  return (
    <div className="flex gap-2 my-2">
      { dataType === 'total' ? (
        <Input
          value={value?.item_name}
          readOnly
          className={'w-32 flex-shrink-0'}
        ></Input>
      ) : (
        <AutoComplete
          onChange={(value) => onChangeField('item_name', value)}
          className={'w-32 flex-shrink-0'}
          disabled={disabled}
          options={detailItems}
          filterOption
          value={value?.item_name}
          optionFilterProp={'value'}
        ></AutoComplete>
      )}

      <InputNumber
        value={value?.item_value}
        onChange={value => onChangeField('item_value', value)}
        className="w-full"
        disabled={disabled}
        min={0}
      ></InputNumber>

      { addable && (
        <>
          <Button
            className={'flex-shrink-0'}
            icon={<PlusOutlined/>}
            onClick={() => operation.add({})}
          ></Button>
          <Button
            className={'flex-shrink-0'}
            onClick={() => operation.remove(index)}
            icon={<MinusOutlined/>}
          ></Button>
        </>
      ) }
    </div>
  )
}

const formDataFormat = (book, type = REQUEST_TYPE_NORMAL) => {
  const formData = {...book, type}
  formData['date'] = dayjs(book['date'])
  formData['is_stamp'] = book['is_stamp'] === 1
  if (!book['extras'] || book['extras'].length === 0) {
    formData['extras'] = [{}]
  }
  formData['costs'] = {}
  if (book['costs'] && book['costs'].length > 0) {
    const costs = groupBy(book['costs'], 'type')
    for(const type in costs) {
      const byPurchase = groupBy(costs[type], 'purchase')
      costs[type] = Object.entries(byPurchase)
        .map(([purchase, items]) => {
          return { purchase, items }
        })
    }
    formData['costs'] = costs
  } else {
    if (type === REQUEST_TYPE_NORMAL) {
      formData['costs'] = {
        [COST_PART_CUSTOMS]: [genEmptyCostGroup()],
        [COST_PART_SEA]: [genEmptyCostTotalGroup()],
        [COST_PART_LAND]: [genEmptyCostGroup()]
      }
    } else {
      formData['costs'] = {
        [COST_PART_OTHER]: [genEmptyCostGroup()]
      }
    }
  }
  if(book['details'] && book['details'].length > 0) {
    formData['details'] = groupBy((book['details'], 'type'))
  } else {
    if(type === REQUEST_TYPE_NORMAL) {
      formData['details'] = {
        [COST_PART_CUSTOMS]: [{}],
        [COST_PART_SEA]: [{}],
        [COST_PART_LAND]: [{}]
      }
    } else {
      formData['details'] = {
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
      details.push({
        ...detail,
        type: group
      })
    }
  }
  saveData['details'] = details
  const costs = []
  for(const type in saveData['costs']) {
    if(!saveData['costs'][type]) {
      continue
    }
    for(const group of saveData['costs'][type]) {
      for(const item of group['items']) {
        costs.push({
          ...item,
          type,
          purchase: group['purchase']
        })
      }
    }
  }
  saveData['costs'] = costs
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
      form.setFieldValue(['costs', partType, part.length], {})
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

    const costs = form.getFieldValue('costs')
    costs[partType] = costs[partType].filter((_, i) => i !== props.key)
    form.setFieldValue('costs', {...costs})
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

const CostTable = ({ value, onChange }) => {
  const costs = value
  const [partners, setPartners] = useState([])
  const [getPartners, loading] = useAsyncCallback(async () => {
    const list = await request('/admin/request_book/partner').get().send()
    setPartners(list)
  })

  useEffect(() => { getPartners() }, [])

  const addRow = (type) => {
    onChange({
      ...value,
      [type]: [
        ...value[type],
        genEmptyCostGroup()
      ]
    })
  }

  const removeRow = (type, index) => {
    if(value[type].length <= 1) {
      return
    }
    onChange({
      ...value,
      [type]: value[type].filter((_, i) => i !== index)
    })
  }

  if(!costs) return null

  return costTypes.map((type) => {
    if(!costs[type] || costs[type].length === 0) {
      return null
    }
    return (
      <div key={type}>
        <div className="flex items-center my-2">
          <div className="flex-shrink-0 mr-8">{getPartName(type)}</div>
          <div className="h-0 w-full flex border-t border-dashed border-gray-300" />
        </div>
        <div className="p-4 bg-gray-200">

          {costs[type].map((_, groupIndex) => (
            <div
              key={groupIndex}
              className={classNames({
                'border-t border-dashed border-gray-300 mt-2 pt-2': groupIndex
              })}
            >
              <div className="flex gap-2 mb-2">
                <div className="w-32">明细项目</div>
                <div>金额</div>
              </div>
              <Form.List name={['costs', type, groupIndex, 'items']}>{
                (list, operation) => list.map((itemProps) => {
                  const decOpt = Object.assign({}, operation)
                  decOpt.remove = (index) => {
                    if (list.length <= 1) {
                      return
                    }
                    operation.remove(index)
                  }
                  return (
                    <Form.Item
                      noStyle
                      key={itemProps.key}
                      name={itemProps.name}
                    >
                      <CostItemRow
                        addable={type !== COST_PART_SEA}
                        operation={decOpt}
                        index={itemProps.name}
                      ></CostItemRow>
                    </Form.Item>
                  )
                })
              }</Form.List>

              <div className="my-2">仕入先</div>
              <div className={'flex gap-2'}>
                <Form.Item name={['costs', type, groupIndex, 'purchase']} noStyle>
                  <AutoComplete
                    className="flex-1"
                    options={partners}
                    filterOption
                    fieldNames={{
                      value: 'name'
                    }}
                    optionFilterProp={'name'}
                  ></AutoComplete>
                </Form.Item>
                {type !== COST_PART_SEA && (
                  <>
                    <Button
                      icon={<PlusOutlined/>}
                      onClick={() => addRow(type)}
                    ></Button>
                    <Button
                      icon={<MinusOutlined/>}
                      onClick={() => removeRow(type, groupIndex)}
                    ></Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  })
}

const detailPart = (type, i) => {
  let partName = getPartName(type)
  // eslint-disable-next-line react/display-name
  return (list) => {
    if (!list?.length) {
      return null
    }
    return (
      <>
        {i > 0 && (
          <>
            <tr>
              <td></td>
            </tr>
            <tr className="border-dashed border-t border-gray-300"></tr>
            <tr>
              <td></td>
            </tr>
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
  const { id, orderId, copyId, voidFrom, type } = useParams()
  const [searchParams] = useSearchParams()
  const bookType = ~~type
  const [files, setFiles] = useState({})
  const navigate = useNavigate()
  const extraDefaultValue = useRef({})
  const extraItems = useItemList(SELECT_ID_RB_EXTRA_ITEM)
  const detailItems = useItemList(SELECT_ID_RB_DETAIL_ITEM)
  const units = useItemList(SELECT_ID_RB_DETAIL_UNIT)
  const userRole = useSelector(state => state.user.userInfo.role)

  const [booksOpen, setBooksOpen] = useState(false)
  const [books, setBooks] =  useState([])
  const [openCopy, setOpenCopy] = useState(false)
  const [copyForm] = Form.useForm()
  const [findBooks, finding] = useAsyncCallback(async () => {
    const data = await copyForm.validateFields()
    const list = await request('/admin/request_book/cp_list').get(data).send()
    if(list.length === 1) {
      navigate(`/rb/copy/${list[0]['id']}/order/${orderId}/type/${list[0]['type']}`, { replace: true })
      return
    }
    copyForm.resetFields()
    setOpenCopy(false)
    setBooks(list)
    setBooksOpen(true)
  })

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
    let data = saveDataFormat(form.getFieldsValue())
    if(userRole === USER_ROLE_ACC) {
      const msg = await openAccConrirmModal()
      data = { ...data, ...msg }
    }
    if(copyId) {
      data.copy = 1
    }
    const rep = await request('/admin/request_book/save').data(data).send()
    pubSub.publish('Info.Toast', '保存成功！', 'success')
    navigate(`/rb/edit/${rep['id']}/order/${rep['order_id']}/type/${rep['type']}`, { replace: true })
  })

  const voidBook = () => {
    navigate(`/rb/copy/${voidFrom}/order/${orderId}/type/${type}?voidTo=${voidFrom}`, { replace: true })
  }

  // 获取请求书默认值
  useEffect(() => {
    const bookId = id || copyId
    form.setFieldsValue({
      'order_id': orderId,
      type: bookType
    })
    request('/admin/request_book/get_default_value')
      .get({ id: orderId }).send().then((rep) => {
        bookId || form.setFieldsValue(formDataFormat(rep['book'], bookType))
        extraDefaultValue.current = rep['extra']
        setFiles(rep['files'])
      })
  }, [orderId, id, copyId, form, bookType, searchParams.get('voidTo')])

  // 获取请求书详情数据
  useEffect(() => {
    const bookId = id || copyId || voidFrom
    form.resetFields()
    form.setFieldValue('void_id', searchParams.get('voidTo'))
    setDisabled(false)
    if(bookId) {
      request('/admin/request_book/detail').get({ id: bookId }).send()
        .then(rep => {
          form.setFieldsValue(formDataFormat(rep, bookType))
          setDisabled(
            (!!rep['is_send'] || !!rep['is_void'] || searchParams.get('d') === '1')
              && !copyId
          )
          // voidTo 被作废的请求书id
          if(searchParams.get('voidTo')) {
            form.setFieldValue('void_id', searchParams.get('voidTo'))
          }
        })
    }
  }, [form, copyId, id, bookType, voidFrom])

  const details = Form.useWatch('details', form)

  const [accConfirmModal, openAccConrirmModal] = useConfirm('备注', (
    <>
      <Form.Item label={'备注'} name={'acc_comment'} rules={[{ required: true }]}>
        <Input rows={4} placeholder="备注" />
      </Form.Item>
    </>
  ))

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
            form.setFieldValue(['costs', part], [countsDefaultRow])
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
    <EditFormContext.Provider value={{ detailItems, disabled, extraItems, units, extraDefaultValue }}>
      <Form
        disabled={disabled}
        form={form}
        className="flex h-screen"
      >
        <Form.Item noStyle name="id" />
        <Form.Item noStyle name="void_id" />
        <Form.Item noStyle name="order_id" />
        <Form.Item noStyle name="type" />

        <div className="h-full flex-1 pt-4 overflow-auto pb-4">
          <div className="text-center text-xl font-bold">{ bookType === REQUEST_TYPE_ADVANCE && '立替' }請求書</div>

          <Row className="px-16 mt-6">
            <Col span={8}>
              <Form.Item label="請求番号" name="no" labelCol={{ span: 6 }} >
                <Input readOnly></Input>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="請求日" name="date"  labelCol={{ span: 6 }} >
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
                  <td className="w-12 text-center">別通貨</td>
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
            <Form.Item label="住所" name="department_id">
              <Radio.Group options={departmentOptions} />
            </Form.Item>
            <Form.Item label="社印" name="is_stamp">
              <Switch></Switch>
            </Form.Item>
          </div>

          <div className="flex gap-2 justify-end px-16">
            <Button className="w-32" type="primary" onClick={() => navigate(`/rb/add/${orderId}/type/${type}`, { replace: true })}>追加請求書</Button>
            <Button
              className="w-32"
              type="primary"
              onClick={() =>{
                copyForm.setFieldValue('name', 'bkg_no')
                setOpenCopy(true)
              }}
            >参照入力</Button>
            <Button className="w-32" type="primary" disabled={disabled || !id} loading={exporting} onClick={doExport}>出力</Button>
            <Button className="w-32" loading={submiting} type="primary" onClick={submit}>保存</Button>
            { voidFrom && (
              <Popconfirm
                title={'無効にするかどうかを確認する'}
                onConfirm={voidBook}
                okButtonProps={{ disabled: false, danger: true }}
                cancelButtonProps={{ disabled: false }}
                okText={'はい'}
                cancelText={'いいえ'}
              >
                <Button
                  className="w-32"
                  disabled={false}
                  danger
                  type="primary"
                >無効</Button>
              </Popconfirm>
            )}
            <Button className="w-32" disabled={false} onClick={() => navigate(-1)}>戻る</Button>
          </div>

        </div>
        <div
          className="h-full w-[600px] shadow-lg shadow-gray-400 p-8"
        >
          <Label>コストチェック表</Label>

          <FileTabs tabs={[FILE_TYPE_COST]} files={files} />
          <Form.Item name='costs' noStyle>
            <CostTable></CostTable>
          </Form.Item>
        </div>
      </Form>
      <Modal
        title="参照入力"
        open={openCopy}
        onCancel={() => {
          setOpenCopy(false)
          copyForm.resetFields()
        }}
        okButtonProps={{ loading: finding }}
        onOk={findBooks}
      >
        <Form form={copyForm} className="mt-4">
          <Space.Compact className="w-full">
            <Form.Item noStyle name="name">
              <Select
                options={[
                  { value: 'bkg_no', label: 'BKG NO.'},
                  { value: 'order_no', label: '社内番号' },
                ]}
              ></Select>
            </Form.Item>
            <Form.Item noStyle name="value" rules={[{ required: true }]}>
              <Input></Input>
            </Form.Item>
          </Space.Compact>
        </Form>
      </Modal>
      {accConfirmModal}
      <Modal title="选择" open={booksOpen} footer={null} onCancel={() => setBooksOpen(false)}>
        <div className="flex flex-wrap gap-2">
          { books.map(book => {
            return (
              <Button
                key={book.id}
                onClick={() => navigate(`/rb/copy/${book['id']}/order/${orderId}/type/${book['type']}`)}
              >{book.name}</Button>
            )
          }) }
        </div>
      </Modal>
    </EditFormContext.Provider>
  )
}

export default EditForm
