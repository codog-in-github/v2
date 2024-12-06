import {forwardRef, useEffect, useImperativeHandle, useRef, useState} from "react";
import {Form, Input, Modal, Radio} from "antd";
import {request} from "@/apis/requestBuilder.js";

const UserPicker = forwardRef(function UserPicker(_, ref) {
  const [open, setOpen] = useState(false)
  const pickerCallbacks = useRef({
    resolve: () => {},
    reject: () => {}
  })

  const [users, setUsers] = useState([])
  const [form] = Form.useForm()

  useEffect(() => {
    request('admin/user/user_list').get({ dispatchable: 1 }).send()
      .then((rep) => {
        if(!rep) {
          setUsers([])
          return
        }
        setUsers(rep.map(user => ({
          label: user.name,
          value: user.id
        })))
      })
  }, [])

  useImperativeHandle(ref, () => {
    return {
      pick: () => {
        setOpen(true)
        form.resetFields()
        return new Promise((resolve, reject) => {
          pickerCallbacks.current = {
            resolve,
            reject
          }
        })
      }
    }
  }, [])

  return (
    <Modal
      title="選択してください"
      open={open}
      width={600}
      onOk={async () => {
        const data = await form.validateFields()
        setOpen(false)
        pickerCallbacks.current.resolve(data)
      }}
      onCancel={() => {
        setOpen(false)
        pickerCallbacks.current.reject()
      }}
    >
      <Form
        form={form}
        className={'mt-4'}
        labelCol={{ span: 2 }}
      >
        <Form.Item label={'人员'} name={'user_id'} rules={[{ required: true, message: '人员必填' }]}>
          <Radio.Group
            options={users}
          ></Radio.Group>
        </Form.Item>
        <Form.Item label={'留言'} name={'content'}>
          <Input.TextArea
            rows={4}
          ></Input.TextArea>
        </Form.Item>
      </Form>
    </Modal>
  )
})

export default UserPicker
