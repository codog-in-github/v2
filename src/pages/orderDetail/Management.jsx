import { request } from "@/apis/requestBuilder"
import Label from "@/components/Label"
import { BKG_TYPE_CUSTOM, BKG_TYPES } from "@/constant"
import { Form, Button, Input, DatePicker, Select, AutoComplete } from "antd"
import { useMemo, useEffect, useState, useRef } from "react"

const useGateCompanyOptions = () => {
  const [options, setOptions] = useState([])
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    setLoading(true)
    request('/admin/order/get_custom_com')
      .get()
      .send()
      .then((data) => {
        setLoading(false)
        const options = [
          { label: <div className="font-bold">春海组 株式会社</div>, value: -1 }
        ]
        setOptions(
          options.concat(data.map(item => ({
            label: item.com_name,
            value: item.id
          })))
        )
      })
  }, [])
  return { options, loading }
}

const BkgTypeSelect = ({ value, onChange, ...props }) => {
  const [inputValue, setInputValue] = useState('');
  const onChangeRef = useRef(null)
  onChangeRef.current = onChange 

  const options = useMemo(() => {
    return Object.entries(BKG_TYPES)
      .map(([key, text]) => ({ label: (
        <div onClick={() => onChangeRef.current({ key, text })}>{text}</div>
      ) }))
  }, [])

  const textToKeyMap = useMemo(() => {
    const map = {}
    for(const key in BKG_TYPES) {
      map[BKG_TYPES[key]] = ~~key
    }
    return map
  }, [])

  const onBlur = () => {
    if(textToKeyMap[inputValue]) {
      onChange({ key: textToKeyMap[inputValue], text: inputValue })
    } else {
      onChange({ key: BKG_TYPE_CUSTOM, text: inputValue })
    }
  }

  useEffect(() => {
    if(!value) {
      setInputValue('')
    } else if(value.key === BKG_TYPE_CUSTOM) {
      setInputValue(value.text)
    } else {
      setInputValue(BKG_TYPES[value.key])
    }
  }, [value])

  return (
    <AutoComplete
      {...props}
      value={inputValue}
      onChange={e => setInputValue(e)}
      onBlur={onBlur}
      options={options}
    />
  )
}

const Management = ({
  className,
  saving = false,
  onSave = () => {},
  onCancel = () => {},
  onDelete = () => {},
  onShowCopy = () => {},
  onShowMakeDocu = () => {},
  onShowInvoiceList = () => {}
}) => {
  const { options, loading } = useGateCompanyOptions()
  const form = Form.useFormInstance()
  const setDefaultNumber = () => {
    const bkgNo = form.getFieldValue('bkgNo')
    if(bkgNo) {
      form.setFieldValue('blNo', bkgNo)
    }
  }
  return (
    <div className={className}>
      <div className="mr-auto">
        <Label>管理情報</Label>
        <div className="flex gap-2">
          <Form.Item label="DATE" name="orderDate">
            <DatePicker allowClear={false} />
          </Form.Item>
          <Form.Item label="BKG NO." name="bkgNo" className="[&_label]:!font-bold" rules={[{ required: true, message: 'BKG NO.を入力してください' }]}>
            <Input onBlur={setDefaultNumber} />
          </Form.Item>
          <Form.Item label="B/L NO." name="blNo">
            <Input />
          </Form.Item>
          <Form.Item label="TYPE" name="type"  className="w-48 [&_label]:!font-bold" rules={[{ required: true, message: 'TYPEを入力してください' }]}>
            <BkgTypeSelect className="[&_input]:!text-lg" />
          </Form.Item>
          <Form.Item label="社内管理番号" name="orderNo">
            <Input readOnly />
          </Form.Item>
          <Form.Item
            label="通関"
            name="gateCompany"
            className="w-52 [&_label]:!font-bold"
            rules={[{ required: true, message: '通関を入力してください' }]}
          >
            <Select showSearch options={options} loading={loading} />
          </Form.Item>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-1 mt-2">
        <Button
          loading={saving}
          type="primary"
          className="bg-success hover:!bg-success-400"
          onClick={onSave}
        >新規登録</Button>
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
