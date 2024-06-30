import { Switch } from 'antd';
import Card from './Card';
import Message from './Message';
import './top.scss'
import AddCard from './AddCard';

function MainContent() {
  return (
    <div className="flex">
      <div className='top-main flex-1'>
        <div className="flex gap-4 flex-wrap">
          <AddCard />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
        </div>
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">直近完了</h2>
          <div className="flex space-x-4">
            <Card end />
            <Card end />
          </div>
        </div>
        </div>
      <div className="p-2 w-64 bg-white">
        <div className="flex mb-4">
          <div className='mr-auto'>社内伝達</div>
          <div className='mr-1'>@ME</div>
          <Switch></Switch>
        </div>
        <div className="space-y-4">
          <Message />
          <Message />
          <Message />
        </div>
      </div>
    </div>
  );
}

export default MainContent;