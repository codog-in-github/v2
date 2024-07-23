import classNames from "classnames";
import { useMessages, useReadMessage } from "./dataHooks";
import { Switch } from "antd";
import { useCallback } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { debounce } from "lodash";

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
          {from}：{at && <At>{at}</At>} {content}
        </div>
      </div>
      {
        isAtMe && <div className="flex leading-8 text-white">
          <button
            className={classNames(
              "bg-primary flex-1",
              {'!bg-gray-400': isReaded || localIsReaded}
            )}
            onClick={read}
          >{loading && <LoadingOutlined className="mr-2" />}既読</button>
          <button
            className="bg-primary flex-1"
            onClick={() => navigate(`/orderDetail/${orderId}`)}
          >案件処理</button>
        </div>
      }
    </div>
  );
}

const MessageList = ({ className }) => {
  const { filteredMessages: messages, setIsAtMe, isAtMe, load, loading} = useMessages();
  const onScrollBottomHandler = (e) => {
    if(e.target.scrollTop + e.target.clientHeight >= e.target.scrollHeight) {
      load()
    }
  }
  return (
    <>
      <div className="flex mb-4">
        <div className='mr-auto'>社内伝達</div>
        <div className='mr-1'>@ME</div>
        <Switch onChange={setIsAtMe} value={isAtMe}></Switch>
      </div>
      <div className={classNames(
        "gap-4 flex flex-col flex-1 overflow-auto pr-2",
        className
      )} onScroll={onScrollBottomHandler}>
        {loading && (
          <div className="text-center">
            <LoadingOutlined className="text-4xl text-gray-400" />
          </div>
        )}
        {messages.map(item => (
          <Message key={item.id} {...item} />
        ))}
      </div>
    </>
  )
}

export default MessageList;