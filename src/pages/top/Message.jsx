function Message() {
  return (
    <div className="bg-gray-100 p-4 rounded">
      <div className="flex justify-between items-center">
        <div className="font-semibold">2024-06-01 16:01:09</div>
        <div>@ME</div>
      </div>
      <div className="mt-2">
        吉田：<span className="font-semibold">@施汉</span> 南京立健物流有限公司需要一个新的集装箱，堆场元需跟进该公司后期文件上传的情况。
      </div>
      <div className="mt-2 flex space-x-4">
        <button className="bg-gray-300 px-4 py-2 rounded">既読</button>
        <button className="bg-blue-500 text-white px-4 py-2 rounded">案件処理</button>
      </div>
    </div>
  );
}

export default Message;