import { Button, Input } from 'antd';
import leftImage from '@/assets/images/login@2x.webp'
import classnames from 'classnames';
import { useInput } from '@/hooks';
import GroupLabel from '@/components/GroupLabel';
import { useNavigate } from 'react-router-dom';

function Label(props) {
  const className = classnames(
    'text-gray-500 text-sm capitalize',
    props.className
  )
  return <div className={className}>{props.children}</div>
}

function Card () {
  const [usr, setUsr] = useInput('')
  const [pwd, setPwd] = useInput('')
  const navigate = useNavigate()
  function toPage () {
    navigate('/top')
  }
  return (
    <div className='w-80 flex-shrink-0 bg-white p-10 rounded-lg'>
      <GroupLabel className="tracking-widest">登录</GroupLabel>
      <div className='mt-4'>
        <Label>user name</Label>
        <Input className='mt-1' value={usr} onChange={setUsr} />
      </div>
      <div className='mb-8 mt-2'>
        <Label>password</Label>
        <Input className='mt-1' type='password' value={pwd} onChange={setPwd} />
      </div>
      <Button block type='primary' onClick={toPage}>登录</Button>
    </div>
  )
}

export default function Login() {
  return (
    <div className='h-screen flex items-center justify-center bg-gradient-to-tr from-login-gradient-light to-login-gradient-dark'>
      <div>
        <img src={leftImage}></img>
      </div>
      <div className='ml-2'>
        <Card></Card>
      </div>
    </div>
  );
}