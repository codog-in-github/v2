import Label from "@/components/Label"
import ListModal from "./requestBook/ListModal"
import { BKG_TYPE_CUSTOM, BKG_TYPES } from "@/constant"
import { Form, Button, Input, DatePicker, Select, AutoComplete, Modal } from "antd"
import { useContext, useMemo, useEffect, useState, useRef } from "react"
import { DetailDataContext } from "./dataProvider"
import { useAsyncCallback, useGateCompanyOptions } from '@/hooks'
import { Space } from "antd"
import { request } from "@/apis/requestBuilder"
import pubSub from "@/helpers/pubSub"
import { useNavigate } from "react-router-dom"
import BookSelectModal from "./otherBooks/BookSelectModal"

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
      dropdownAlign={{
        overflow: { adjustY: false }
      }}
    />
  )
}

const CopyModal = ({
  instance
}) => {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [form] = Form.useForm()
  if(instance) {
    instance.current = {
      open: () => {
        form.resetFields()
        form.setFieldValue('field', 'bkg_no')
        setOpen(true)
      },
      close: () => setOpen(false)
    }
  }
  const [submit, submiting] = useAsyncCallback(async () => {
    const data = await form.validateFields()
    const rep = await request('/admin/order/query_id').data(data).send()
    if(!rep){
      pubSub.publish('Info.Toast', '該当するデータがありません', 'error')
      return
    }
    navigate(`/orderDetail/copy/${rep.id}`, { replace: true })
    setOpen(false)
  })
  return (
    <Modal
      title="類似事件"
      open={open}
      onOk={submit}
      maskClosable={false}
      okButtonProps={{
        loading: submiting,
      }}
      onCancel={() => setOpen(false)}>
      <Form
        form={form}
        className="py-4"
        defaultValue={{ field: 'order_no', value: ''}}
      >
        <Space.Compact className="w-full">
          <Form.Item noStyle name="field">
            <Select className="w-64" options={[
              { label: '社内管理番号', value: 'order_no' },
              { label: 'BKG NO.', value: 'bkg_no' },
            ]}></Select>
          </Form.Item>
          <Form.Item noStyle name="value" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Space.Compact>
      </Form>
    </Modal>
  )
}

const Management = ({ className }) => {
  const { options, loading } = useGateCompanyOptions()
  const { form, saveOrder, savingOrder, delOrder, deletingOrder, isCopy, onModifyChange, rootRef } = useContext(DetailDataContext)
  const navigate = useNavigate()
  const copyModalInstance = useRef(null)
  const [modal, modalContent] = Modal.useModal()
  const setDefaultNumber = () => {
    const bkgNo = form.getFieldValue('bkgNo')
    if(bkgNo) {
      form.setFieldValue('blNo', bkgNo)
    }
  }
  const requestBookModalInstance = useRef(null)
  const bookSelectModalInstance = useRef(null)

  return (
    <div className={className}>
      {modalContent}
      <div className="mr-auto">
        <Label>管理情報</Label>
        <div className="flex gap-2">
          <Form.Item label="DATE" name="orderDate">
            <DatePicker allowClear={false} />
          </Form.Item>
          <Form.Item name="id" hidden />
          <Form.Item label="BKG NO." name="bkgNo" className="[&_label]:!font-bold" rules={[{ required: true, message: 'BKG NO.を入力してください' }]}>
            <Input onBlur={setDefaultNumber} onChange={onModifyChange} />
          </Form.Item>
          <Form.Item label="B/L NO." name="blNo">
            <Input onChange={onModifyChange} />
          </Form.Item>
          <Form.Item
            label="TYPE"
            name="type"
            className="w-48 [&_label]:!font-bold"
            rules={[{ required: true, message: 'TYPEを入力してください' }]}
          >
            <BkgTypeSelect
              className="[&_input]:!text-lg"
              getPopupContainer={() => rootRef.current}
              onChange={onModifyChange} />
          </Form.Item>
          <Form.Item label="社内管理番号" name="orderNo">
            <Input readOnly  />
          </Form.Item>
          <Form.Item
            label="通関"
            name="gateCompany"
            className="w-52 [&_label]:!font-bold"
            rules={[{ required: true, message: '通関を入力してください' }]}
          >
            <Select
              showSearch
              options={options}
              loading={loading}
              onChange={onModifyChange}
              getPopupContainer={() => rootRef.current}
              dropdownAlign={{
                overflow: { adjustY: false }
              }}
            />
          </Form.Item>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-1 mt-2">
        <Button
          loading={savingOrder}
          onClick={saveOrder}
          type="primary"
          className="bg-success hover:!bg-success-400"
        >新規登録</Button>
        <Button
          type="primary"
          danger
          onClick={async () => {
            const confirm = await modal.confirm({
              content: 'このデータを削除しますか？'
            })
            if(confirm) {
              delOrder()
            }
          }}
          loading={deletingOrder}
          disabled={isCopy}
        >削除</Button>
        <Button
          type="primary"
          className="!bg-gray-400 hover:!bg-gray-300"
          onClick={() => {
            navigate(-1)
          }}
        >戻る</Button>
        <Button type="primary"  onClick={() => { copyModalInstance.current.open() }}>類似事件</Button>
        <Button type="primary" disabled={isCopy} onClick={() => { bookSelectModalInstance.current.open() }}>各種書類作成</Button>
        <Button type="primary" disabled={isCopy} onClick={() => { requestBookModalInstance.current.open() }}>請求書</Button>
      </div>
      <ListModal instance={requestBookModalInstance}></ListModal>
      <CopyModal instance={copyModalInstance}></CopyModal>
      <BookSelectModal instance={bookSelectModalInstance} />
    </div>
  )
}

export default Management
