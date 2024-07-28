import Label from "@/components/Label"
import { COST_PART_CUSTOMS, COST_PART_LAND, COST_PART_OTHER, COST_PART_SEA } from "@/constant"
import { MinusOutlined, PlusOutlined } from "@ant-design/icons"
import { AutoComplete, Table } from "antd"
import { Divider } from "antd"
import { Button, Col, Form, Input, Row } from "antd"
import { useEffect } from "react"

const costTypes = [
  COST_PART_CUSTOMS,
  COST_PART_SEA,
  COST_PART_LAND,
  COST_PART_OTHER
]

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

const detailPart = (type, index) => {
  let partName = getPartName(type)
  // eslint-disable-next-line react/display-name
  return (list) => {
    if(!list.length) {
      return null
    }
    return (
      <>
        { index && <Divider className="my-2" /> }
        <Row>
          <Col span={2}>{partName}</Col>
          <Col span={2}>明細項目</Col>
          <Col span={2}>詳細</Col>
          <Col span={4}>单价</Col>
          <Col span={2}>数量</Col>
          <Col span={2}>单位</Col>
          <Col span={2}>消費税</Col>
          <Col span={2}>金额</Col>
        </Row>
      </>
    )
  }
}

const EditForm = () => {
  const [form] = Form.useForm()
  useEffect(() => {
    form.setFieldsValue({
      extra: [{}, {}],
      details: {
        [COST_PART_CUSTOMS]: [{}]
      }
    })
  }, [])
  return (
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

          <div className="border-t py-8 border-gray-300 bg-gray-100">
            <Row>
              <Col offset={2} span={2}>明細項目</Col>
              <Col span={2}>詳細</Col>
              <Col span={4}>单价</Col>
              <Col span={2}>数量</Col>
              <Col span={2}>单位</Col>
              <Col span={2}>消費税</Col>
              <Col span={2}>金额</Col>
            </Row>
            {
              costTypes.map((type, index) => (
                <Form.List key={type} name={['details', type]}>{detailPart(type, index)}</Form.List>
              ))
            }
          </div>
        </div>

        <div
          className="h-full w-[600px] shadow-lg shadow-gray-400 p-8"
        >
          <Label>コストチェック表</Label>
          {/* todo files */}
        </div>
    </Form>
  )
}

export default EditForm
