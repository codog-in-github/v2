import {forwardRef, useContext, useEffect, useImperativeHandle, useState} from "react";
import {AutoComplete, Form, Input, Modal} from "antd";
import FileInput from "@/components/FileInput.jsx";
import {useAsyncCallback} from "@/hooks/index.js";
import {request} from "@/apis/requestBuilder.js";
import pubSub from "@/helpers/pubSub.js";
import {DetailDataContext} from "./dataProvider.js";
const MakePayRequestModal = (props, ref) => {
  const [open, setOpen] = useState(false)
  const [form] = Form.useForm()
  const [partner, setPartner] = useState([])
  const { form: detailForm } = useContext(DetailDataContext)

  useEffect(() => {
    request('admin/partner/all').get().send().then(setPartner)
  }, []);

  useImperativeHandle(ref, () => ({
    open () {
      form.resetFields()
      form.setFieldsValue({
        order_id: detailForm.getFieldValue('id'),
        pay_to: detailForm.getFieldValue('carrierName')
      })
      setOpen(true)
    }
  }), [detailForm, form])

  const [submit, loading] = useAsyncCallback( async () => {
    const data = await form.validateFields()
    await request('/admin/order/make_pay_request')
      .form({
        ...data,
        check_file: data.check_file[0]
      })
      .send()
    pubSub.publish('Info.Toast', '保存成功！', 'success')
    setOpen(false)
  })

  return (
    <Modal
      open={open}
      title={'追加料金'}
      onOk={submit}
      onCancel={() => setOpen(false)}
      maskClosable={false}
      okButtonProps={{ loading }}
    >
      <Form form={form} labelCol={{ span: 4 }} className={'pt-4'}>
        <Form.Item name={'order_id'} noStyle />
        <Form.Item name={'pay_to'} label={'支払先'} rules={[{ required: true }]}>
          <AutoComplete
            options={partner}
            fieldNames={{
              value: 'name'
            }}
          />
        </Form.Item>
        <Form.Item name={'amount'} label={'金額'} rules={[{ required: true }]}>
            <Input addonAfter={'¥'} />
        </Form.Item>
        <Form.Item name={'check_file'} label={'申請証憑'} rules={[{ required: true }]}>
          <FileInput />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default forwardRef(MakePayRequestModal)
