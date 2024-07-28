import { MinusOutlined, PlusOutlined } from "@ant-design/icons"
import { COST_PART_CUSTOMS, COST_PART_LAND, COST_PART_OTHER, COST_PART_SEA, SELECT_ID_RB_DETAIL_ITEM } from "@/constant"
import { Select, Switch, Radio, InputNumber, AutoComplete, Button, Col, Form, Input, Row, Popover } from "antd"
import { useMemo, useEffect } from "react"
import { useOptions } from "@/hooks"
import Label from "@/components/Label"
import { createContext } from "react"
import { useContext } from "react"

const costTypes = [
  COST_PART_CUSTOMS,
  COST_PART_SEA,
  COST_PART_LAND,
  COST_PART_OTHER
]

const EditFormContext = createContext()

const ExtraInput = ({ datakey }) => {
  const form = Form.useFormInstance()
  return (
    <div className="flex">
      <Form.Item noStyle name={[datakey, 'column']}>
        <AutoComplete className="w-32"></AutoComplete>
      </Form.Item>
      <Form.Item noStyle name={[datakey, 'value']}>
          <Input className="flex-1 ml-2"></Input>
        </Form.Item>
      <Button type="primary" className="ml-2" icon={<PlusOutlined />}></Button>
      <Button type="primary" danger className="ml-2" icon={<MinusOutlined />}></Button>
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


const DetailRow = ({ partName, ...props }) => {
  const { detailItems } = useContext(EditFormContext)
  return (
    <tr key={props.key}>
      <td  className="text-right">{partName}</td>
      <td>
        <Form.Item noStyle>
          <AutoComplete className="w-full" options={detailItems}></AutoComplete>
        </Form.Item>
      </td>
      <td className="flex gap-2">
        <Form.Item noStyle name={[props.key, 'value']}>
          <Input className="flex-1"></Input>
        </Form.Item>
        <Form.Item noStyle name={[props.key, 'value']}>
          <Select className="w-12"></Select>
        </Form.Item>
      </td>
      <td>
        <Form.Item noStyle name={[props.key, 'value']}>
          <Input className="w-full"></Input>
        </Form.Item>
      </td>
      <td>
        <Form.Item noStyle name={[props.key, 'value']}>
          <InputNumber className="w-full" />
        </Form.Item>
      </td>
      <td>
        <Form.Item noStyle name={[props.key, 'value']}>
          <Select className="w-full" />
        </Form.Item>
      </td>
      <td>
        <Form.Item noStyle name={[props.key, 'value']}>
          <Select className="w-full" options={[
            { value: '课', label: '课' },
            { value: '免', label: '免' }
          ]} />
        </Form.Item>
      </td>
      <td className="flex gap-2">
        <Form.Item noStyle name={[props.key, 'value']}>
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
    return list.map((props, i) => <DetailRow key={props.key}  partName={i ? '' : partName} {...props} />)
  }
}

const EditForm = () => {
  const [form] = Form.useForm()
  const { options: detailItemsData } = useOptions(SELECT_ID_RB_DETAIL_ITEM)
  const detailItems = useMemo(() => {
    return detailItemsData.map(item => ({
      value: item.value
    }))
  }, [detailItemsData])
  useEffect(() => {
    form.setFieldsValue({
      extra: [{}, {}],
      details: {
        [COST_PART_CUSTOMS]: [{}, {}]
      }
    })
  }, [])
  return (
    <EditFormContext.Provider value={{ detailItems }}>
      <Form
        form={form}
        className="flex h-screen"
      >
          <div className="h-full flex-1 pt-4">
            <div className="text-center text-xl font-bold">請求書</div>

            <Row className="px-8 mt-6">
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
              <div className="border-t py-8 border-gray-300 grid grid-cols-2 gap-x-12 gap-y-8 px-24">
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
            
            <div className="border-t py-8 border-gray-300 px-16">
              <Form.Item label="銀行" name="back">
                  <Radio.Group options={[
                    { label: '銀行1', value: '1'},
                    { label: '銀行1', value: '2'},
                    { label: '銀行1', value: '3'},
                  ]}>
                </Radio.Group>
              </Form.Item>
              <Form.Item label="地址" name="back">
                  <Radio.Group options={[
                    { label: '銀行1', value: '1'},
                    { label: '銀行1', value: '2'},
                    { label: '銀行1', value: '3'},
                  ]}>
                </Radio.Group>
              </Form.Item>
              <Form.Item label="社印" name="back">
                <Switch></Switch>
              </Form.Item>
            </div>

            <div className="flex gap-2 justify-end px-16">
              <Button className="w-32" type="primary">追加請求書</Button>
              <Button className="w-32" type="primary">参照入力</Button>
              <Button className="w-32" type="primary">出力</Button>
              <Button className="w-32" type="primary">保存</Button>
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
