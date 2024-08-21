import classNames from "classnames";
import { useMessages, useReadMessage } from "./dataProvider";
import { Switch } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import ScrollView from "@/components/ScrollView";
import MessageParse from "@/components/MessageParse";

function At ({ children }) {
  return (
    <span className="message-at">
      @{children}
    </span>
  );
}

function Message({ id, from, at, datetime, content, isReaded, orderId, isAtMe }) {
  const {isReaded: localIsReaded, read, loading} = useReadMessage(id)
  const navigate = useNavigate()
  return (
    <div className="bg-gray-100 rounded">
      <div className="p-4">
        <div className="text-sm text-gray-400">
          {datetime}
        </div>
        <div className="mt-2">
          {from}：{at && <At>{at}</At>} <MessageParse message={content}></MessageParse>
        </div>
      </div>
      {
        isAtMe && <div className="flex leading-8 text-white">
          <button
            className={classNames(
              "bg-primary flex-1",
              {'!bg-gray-400 pointer-events-none': isReaded || localIsReaded}
            )}
            onClick={read}
          >{loading && <LoadingOutlined className="mr-2" />}既読</button>
          <button
            className='bg-primary flex-1 border-l'
            onClick={() => navigate(`/orderDetail/${orderId}`)}
          >案件処理</button>
        </div>
      }
    </div>
  );
}

const MessageList = ({ className }) => {
  const { messages, toggleAtMe, isAtMe, load, loading} = useMessages();
  return (
    <>
      <div className="flex mb-4">
        <div className='mr-auto'>社内伝達</div>
        <div className='mr-1'>@ME</div>
        <Switch loading={loading} onChange={toggleAtMe} value={isAtMe}></Switch>
      </div>
      <ScrollView
        scrollY
        className={classNames(
          'gap-4 flex flex-col flex-1 pr-2',
          className
        )}
        onScrollBottom={() => load()}
      >
        {messages.map(item => (
          <Message key={item.id} {...item} />
        ))}
        {loading && (
          <div className="text-center">
            <LoadingOutlined className="text-4xl text-gray-400" />
          </div>
        )}
      </ScrollView>
    </>
  )
}

export default MessageList;