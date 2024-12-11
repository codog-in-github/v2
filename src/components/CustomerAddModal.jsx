import {forwardRef, useCallback, useImperativeHandle, useState} from "react";
import {Button, Form, Input, Modal} from "antd";
import {useAsyncCallback} from "@/hooks/index.js";
import {request} from "@/apis/requestBuilder.js";
import pubSub from "@/helpers/pubSub.js";
import TagInput from "@/components/TagInput.jsx";
import {MinusOutlined, PlusOutlined} from "@ant-design/icons";

const CustomerAddModal = forwardRef(function CustomerAddModal ({ onSuccess }, ref) {
  const [open, setOpen] = useState(false)
  const [form] = Form.useForm()
  const [isEdit, setIsEdit] = useState(false)
  const [modalInstance, modalEl] = Modal.useModal()

  useImperativeHandle(ref, () => ({
    open(id) {
      setIsEdit(!!id)
      form.resetFields()
      form.setFieldValue(['contacts', 0], {})
      setOpen(true)
      if(id) {
        load(id)
      }
    }
  }), [])

  const [load, loading] = useAsyncCallback(async (id) => {
    const rep = await request('/admin/customer/detail').get({ id }).send()
    if(rep.cc) {
      rep.cc = rep.cc.split('|')
    }
    form.setFieldsValue(rep)
  })

  const [submit, inSubmit] = useAsyncCallback(async () => {
    const data = await form.validateFields()
    if(data.cc) {
      data.cc = data.cc.join('|')
    }
    const newCustomer = await request('/admin/customer/save').data(data).send()
    onSuccess(newCustomer)
    setOpen(false)
  })

  const del = useCallback((index) => {
    form.setFieldValue(['contacts'], form.getFieldValue(['contacts']).filter((_, i) => i !== index))
  }, [])

  const add = useCallback(() => {
    form.setFieldValue(['contacts'], [...form.getFieldValue(['contacts']), {}])
  }, [])

  const [delCustomer] = useAsyncCallback(async () => {
    const confirm = await modalInstance.confirm({
      content: 'お客様の削除を確認する？',
    })
    if(!confirm) return
    await request('/admin/customer/delete').data({ id: form.getFieldValue('id')  }).send()
    pubSub.publish('Info.Toast', '削除完了', 'success')
    setOpen(false)
    onSuccess()
  })

  return (
    <Modal
      open={open}
      title="お客様新規登録"
      footer={null}
      onCancel={() => setOpen(false)}
      width={800}
      maskClosable={false}
    >
      {modalEl}
      <Form layout="vertical" className="mt-8 px-8" form={form}>
        <Form.Item name="id" noStyle></Form.Item>
        <div className="grid grid-cols-3 gap-x-4">
          <Form.Item label="お客様名" name="name" rules={[{ required: true, message: 'お客様名' }]} className="col-span-2">
            <Input />
          </Form.Item>
          <Form.Item label="略称" name="abbr" rules={[{ required: true, message: '略称' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="住所" name="addr" className="col-span-3">
            <Input />
          </Form.Item>
          <Form.Item label="法人番号" name="code">
            <Input />
          </Form.Item>
          <Form.Item label="電話" name="tel">
            <Input />
          </Form.Item>
          <Form.Item label="FAX" name="fax">
            <Input />
          </Form.Item>
          <Form.Item label="〒" name="zipcode">
            <Input />
          </Form.Item>
          <Form.Item label="メールアドレス" name="email" className="col-span-2">
            <Input />
          </Form.Item>
          <Form.Item label="CC" name="cc" className="col-span-3">
            <TagInput />
          </Form.Item>
        </div>
        <Form.Item label="担当者信息">
          <Form.List name="contacts">{list => (
            <div className="bg-gray-100 p-4">{
              list.map((props) => (
                <div className="flex gap-4 items-center [&:nth-child(n+2)]:mt-4" key={props.name}>
                  <div className="w-12">担当者</div>
                  <Form.Item noStyle name={[props.name, 'name']} rules={[{ required: true, message: '请输入担当者' }]}>
                    <Input className="flex-1"></Input>
                  </Form.Item>
                  <div className="w-12">携帯</div>
                  <Form.Item noStyle name={[props.name, 'tel']}>
                    <Input className="flex-1"></Input>
                  </Form.Item>
                  <div className="w-24 flex">
                    <Button type="primary" icon={<PlusOutlined />} onClick={add}></Button>
                    {props.name > 0 &&  <Button type="primary" className="ml-2" onClick={() => del(props.name)} danger icon={<MinusOutlined />}></Button>}
                  </div>
                </div>
              ))
            }</div>
          )}</Form.List>
        </Form.Item>
      </Form>
      <div className="flex gap-2 items-center justify-center">
        <Button className="w-32" type="primary" loading={inSubmit || loading} onClick={submit}>确认</Button>
        {isEdit && <Button className="w-32" type="primary" onClick={delCustomer} danger>删除</Button>}
        <Button className="w-32" onClick={() => setOpen(false)}>取消</Button>
      </div>
    </Modal>
  )
})

export default CustomerAddModal;
