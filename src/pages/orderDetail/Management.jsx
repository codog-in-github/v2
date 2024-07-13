import Label from "@/components/Label"
import { Form, Button, Input, DatePicker, Select } from "antd"

const Management = ({
  className,
  onSave = () => {},
  onCancel = () => {},
  onDelete = () => {},
  onShowCopy = () => {},
  onShowMakeDocu = () => {},
  onShowInvoiceList = () => {}
}) => {
  return (
    <div className={className}>
      <div className="mr-auto">
        <Label>管理情報</Label>
        <div className="flex gap-2">
          <Form.Item label="DATE" name="orderDate">
            <DatePicker />
          </Form.Item>
          <Form.Item label="BKG NO." name="bkgNo" rules={[{ required: true, message: 'BKG NO.を入力してください' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="B/L NO." name="blNo">
            <Input />
          </Form.Item>
          <Form.Item label="TYPE" name="type"  className="w-48" rules={[{ required: true, message: 'TYPEを入力してください' }]}>
            <Select />
          </Form.Item>
          <Form.Item label="社内管理番号" name="companyNo">
            <Input readOnly />
          </Form.Item>
          <Form.Item label="通関" name="gateCompany" rules={[{ required: true, message: '通関を入力してください' }]}>
            <Input />
          </Form.Item>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-1 mt-2">
        <Button type="primary" className="bg-success hover:!bg-success-400" onClick={onSave}>新規登録</Button>
        <Button type="primary" danger onClick={onDelete}>削除</Button>
        <Button type="primary" className="!bg-gray-400 hover:!bg-gray-300" onClick={onCancel}>戻る</Button>
        <Button type="primary" onClick={onShowCopy}>類似事件</Button>
        <Button type="primary" onClick={onShowMakeDocu}>各種書類作成</Button>
        <Button type="primary" onClick={onShowInvoiceList}>請求書</Button>
      </div>
    </div>
  )
}

export default Management
