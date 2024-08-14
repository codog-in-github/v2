import {
  COST_PART_CUSTOMS, COST_PART_LAND, COST_PART_OTHER,
  COST_PART_SEA, SELECT_ID_RB_DETAIL_ITEM, SELECT_ID_RB_DETAIL_UNIT, SELECT_ID_RB_EXTRA_ITEM
} from "@/constant"
import {
  Switch, Radio, InputNumber, AutoComplete, Button,
  Col, Form, Input, Row, Popover, Checkbox
} from "antd"
import { useMemo, useEffect, useContext, createContext, useState } from "react"
import { useOptions } from "@/hooks"
import { request } from "@/apis/requestBuilder"
import { MinusOutlined, PlusOutlined } from "@ant-design/icons"
import Label from "@/components/Label"
import { useCallback } from "react"
import SingleCheckbox from "@/components/SingleCheckbox"

const costTypes = [
  COST_PART_CUSTOMS,
  COST_PART_SEA,
  COST_PART_LAND,
  COST_PART_OTHER
]

const EditFormContext = createContext()

const ExtraInput = ({ datakey }) => {
  const form = Form.useFormInstance()
  const { extraItems } = useContext(EditFormContext)
  const add = () => {
    const oldValue = form.getFieldValue('extra')
    form.setFieldValue('extra', [
      ...oldValue,
      {}
    ])
  }
  const del = () => {
    const oldValue = form.getFieldValue('extra')
    form.setFieldValue('extra', oldValue.filter((_, i) => i != datakey))
  }
  return (
    <div className="flex gap-2">
      <Form.Item noStyle name={[datakey, 'column']}>
        <AutoComplete
          className="w-32"
          options={extraItems}
          filterOption="value"
          onSelect={(_, { origin }) => {
            console.log('select', origin)
            form.setFieldValue(['extra', datakey, 'value'], origin['extra'])
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


const DetailRow = ({ partType, partName, props }) => {
  const { detailItems, units } = useContext(EditFormContext)
  const form = Form.useFormInstance()
  const calcTotal = useCallback(() => {
    const row = form.getFieldValue(['details', partType, props.key])
    // todo 計算总价
    form.setFieldValue(['details', partType, props.key, 'total'], 1)
  }, [partType, props])
  return (
    <tr key={props.key} name={[props.key, 'item_name']}>
      <td  className="text-right">{partName}</td>
      <td>
        <Form.Item noStyle>
          <AutoComplete
            className="w-full"
            options={detailItems}
            filterOption="value"
            onSelect={(_, { origin }) => {
              form.setFieldValue(['details', partType, props.key, 'unit'], origin['extra'])
            }}
          ></AutoComplete>
        </Form.Item>
      </td>
      <td className="flex gap-2">
        <Form.Item noStyle name={[props.key, 'detail']}>
          <Input className="flex-1"></Input>
        </Form.Item>
        <Form.Item noStyle name={[props.key, 'currency']}>
          <SingleCheckbox  />
        </Form.Item>
      </td>
      <td>
        <Form.Item noStyle name={[props.key, 'price']}>
          <InputNumber className="w-full"></InputNumber>
        </Form.Item>
      </td>
      <td>
        <Form.Item noStyle name={[props.key, 'num']}>
          <InputNumber min={0} className="w-full" />
        </Form.Item>
      </td>
      <td>
        <Form.Item noStyle name={[props.key, 'unit']}>
          <AutoComplete className="w-full" options={units} />
        </Form.Item>
      </td>
      <td className="text-center">
        <Form.Item noStyle name={[props.key, 'tax']}>
          <SingleCheckbox onBlur={calcTotal} />
        </Form.Item>
      </td>
      <td className="flex gap-2">
        <Form.Item noStyle name={[props.key, 'amount']}>
          <Input className="flex-1" />
        </Form.Item>
        <Button type="primary" icon={<PlusOutlined />}></Button>
        <Button type="primary" danger icon={<MinusOutlined />}></Button>
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

const useBankList = () => {
  const [banks, setBanks] = useState([])
  useEffect(() => {
    request('/admin/bank_list').get().send()
      .then(res => {
        setBanks(res.map(item => ({
          value: item.id,
          label: item.name,
          style: { width: 150 }
        })))
      })
  }, [])
  return banks
}

const useDepartmentList = () => {
  const [departments, setDepartments] = useState([])
  useEffect(() => {
    request('/admin/department_list').get().send()
      .then(res => {
        setDepartments(res.map(item => ({
          value: item.id,
          label: item.name,
          style: { width: 150 }
        })))
      })
  }, [])
  return departments
}

const Total = () => {
  return (
    <div className="border-t border-gray-300 px-16">
      <div className="flex justify-between my-4">
        <div>小計</div>
        <div>小計</div>
      </div>
      <div className="flex justify-between my-4">
        <div>消費税</div>
        <div>消費税</div>
      </div>
      <div className="flex justify-between my-4 font-bold">
        <div>御請求金額</div>
        <div>御請求金額</div>
      </div>
    </div>
  )
}
const EditForm = () => {
  const [form] = Form.useForm()
  const extraItems = useItemList(SELECT_ID_RB_EXTRA_ITEM)
  const detailItems = useItemList(SELECT_ID_RB_DETAIL_ITEM)
  const units = useItemList(SELECT_ID_RB_DETAIL_UNIT)
  const banks = useBankList()
  const departments = useDepartmentList()
  const submit = useCallback(() => {
    console.log(form.getFieldsValue())
  }, [])
  useEffect(() => {
    form.setFieldsValue({
      extra: [{}, {}],
      details: {
        [COST_PART_CUSTOMS]: [{}, {}]
      }
    })
  }, [])
  return (
    <EditFormContext.Provider value={{ detailItems, extraItems, units }}>
      <Form
        form={form}
        className="flex h-screen"
      >
          <div className="h-full flex-1 pt-4">
            <div className="text-center text-xl font-bold">請求書</div>

            <Row className="px-16 mt-6">
              <Col span={8}>
                <Form.Item label="請求番号" labelCol={{ span: 6 }} >
                  <Input></Input>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="請求日" labelCol={{ span: 6 }} >
                  <Input></Input>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="〒" labelCol={{ span: 6 }} >
                  <Input></Input>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="会社名" labelCol={{ span: 6 }} >
                  <Input></Input>
                </Form.Item>
              </Col>
              <Col span={16}>
                <Form.Item label="住所" labelCol={{ span: 3 }} >
                  <Input></Input>
                </Form.Item>
              </Col>
            </Row>

            <Form.List name="extra">{list => (
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
              <Popover>
                <Button type="primary" className="bg-success">枠追加</Button>
              </Popover>
            </div>

            <Total></Total>
            
            <div className="border-t py-8 border-gray-300 px-16">
              <Form.Item label="銀行" name="back">
                  <Radio.Group options={banks}>
                </Radio.Group>
              </Form.Item>
              <Form.Item label="地址" name="department">
                  <Radio.Group options={departments} >
                </Radio.Group>
              </Form.Item>
              <Form.Item label="社印" name="sign">
                <Switch></Switch>
              </Form.Item>
            </div>

            <div className="flex gap-2 justify-end px-16">
              <Button className="w-32" type="primary">追加請求書</Button>
              <Button className="w-32" type="primary">参照入力</Button>
              <Button className="w-32" type="primary">出力</Button>
              <Button className="w-32" type="primary" onClick={submit}>保存</Button>
              <Button className="w-32">戻る</Button>
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
