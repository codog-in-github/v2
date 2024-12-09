import classNames from "classnames";
import { useMessages, useReadMessage } from "./dataProvider";
import { Switch } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import ScrollView from "@/components/ScrollView";
import MessageParse from "@/components/MessageParse";
import {forwardRef, useImperativeHandle} from "react";

function At ({ children }) {
  return (
    <span className="message-at">
      @{children}
    </span>
  );
}

function Message({
  id, from, at, datetime, content, isRead: isReadProp, isAtMe, to, doText
}) {

  const [isRead, read, loading] = useReadMessage(id, isReadProp)
  const navigate = useNavigate()

  return (
    <div className="bg-gray-100 rounded">
      <div className="p-4">
        <div className="text-sm text-gray-400">
          {datetime}
        </div>
        <div className="mt-2">
          {from}：{at && <At>{at}</At>} <MessageParse message={content} />
        </div>
      </div>
      {
        isAtMe && <div className="flex leading-8 text-white">
          <button
            className={classNames(
              "bg-primary flex-1",
              {'!bg-gray-400': isRead }
            )}
            onClick={read}
          >{loading && <LoadingOutlined className="mr-2" />}既読</button>
          <button
            className='bg-primary flex-1 border-l'
            onClick={() => navigate(to)}
          >{doText}</button>
        </div>
      }
    </div>
  );
}

const MessageList = forwardRef(function MessageList({ className }, ref) {
  const { messages, toggleAtMe, isAtMe, loadTop, load, loading} = useMessages();

  useImperativeHandle(ref, () => ({ loadTop }), [loadTop])

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
})
export default MessageList;
