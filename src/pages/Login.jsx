import { Button, Input } from 'antd';
import leftImage from '@/assets/images/login@2x.webp'
import GroupLabel from '@/components/GroupLabel';
import { useNavigate } from 'react-router-dom';
import { request } from '@/apis/requestBuilder'
import { Form } from 'antd/lib';
import { useState } from 'react';
import { useRef } from 'react';
import { addAuthorization } from '@/apis/middleware';

const login = async (data) => {
  const rep = await request('admin/login')
    .requestWithout(addAuthorization)
    .data(data)
    .send()
  localStorage.setItem('token', `${rep['token_type']} ${rep['access_token']}`)
}

const Card = () => {
  const [form] = Form.useForm()
  const usrRef = useRef(null)
  const pwdRef = useRef(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const formKeyDownHandle = (e) => {
    if (e.key === 'Enter') {
      if(!form.getFieldValue('username')) {
        usrRef.current.focus()
      } else if(!form.getFieldValue('password')) {
        pwdRef.current.focus()
      } else {
        onLoginBtnClickHandle()
      }
    }
  }
  const onLoginBtnClickHandle = async () => {
    const data = await form.validateFields()
    setLoading(true)
    try {
      await login(data)
      navigate('/top')
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className='w-80 flex-shrink-0 bg-white p-10 rounded-lg'>
      <GroupLabel className="tracking-widest">登录</GroupLabel>
      <Form
        form={form}
        layout="vertical"
        className='mt-4 [&_label]:before:!hidden'
        onKeyDown={formKeyDownHandle}>
        <Form.Item label="User Name" name="username" rules={[{ required: true }]}>
          <Input ref={usrRef} />
        </Form.Item>
        <Form.Item label="Password" name="password" rules={[{ required: true }]}>
          <Input.Password ref={pwdRef} />
        </Form.Item>
        <Button
          loading={loading}
          block
          type='primary'
          onClick={onLoginBtnClickHandle}
        >登录</Button>
      </Form>
    </div>
  )
}

export default function Login() {
  return (
    <div className='h-screen flex items-center justify-center bg-gradient-to-tr from-primary-200 to-primary-400'>
      <div>
        <img src={leftImage}></img>
      </div>
      <div className='ml-2'>
        <Card></Card>
      </div>
    </div>
  );
}