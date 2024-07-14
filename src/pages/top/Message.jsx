function At ({ children }) {
  return (
    <span className="message-at">
      @{children}
    </span>
  );
}

function Message() {
  return (
    <div className="bg-gray-100 rounded">
      <div className="p-4">
        <div className="text-sm text-gray-400">
          2024-06-01 16:01:09
        </div>
        <div className="mt-2">
          吉田：<At>施双</At> 南京立健物流有限公司需要一个新的集装箱，堆场元需跟进该公司后期文件上传的情况。
        </div>
      </div>
      <div className="flex leading-8 text-white">
        <button className="bg-gray-300 w-1/2">既読</button>
        <button className="bg-primary w-1/2">案件処理</button>
      </div>
    </div>
  );
}

export default Message;