function Card ({ end, color = 'red' }) {
  const style = {}
  if (end) {
    style.filter = 'grayscale(100%)'
  }
  return (
    <div className={`border-2 border-${color}-400 border-t-4 rounded`} style={style}>
      <div className="flex p-2">
        <div className={`rounded-full w-8 h-8 bg-${color}-400`}></div>
        <div className="ml-2">
          <div>中国浙江省宁波市鄞州区中…</div> 
          <div>KOBE-SHANGHAI</div>
        </div>
      </div>
      <div className="flex">
        <div className="flex-1 flex flex-col items-center  p-2">
          <div className="flex text-lg font-bold">
            <div>苏</div>
            <div className="w-0.5 h-full bg-gray-300 mx-4"></div>
            <div>杭</div>
          </div>
          <div className="text-sm text-gray-400 mt-2">GQF413SK202</div>
        </div>
        <div className={`bg-${color}-100 w-16 flex items-center justify-center flex-col`}>
          <div>06-03</div>
          <div>15:00</div>
        </div>
      </div>
    </div>
  )
}

function Po () {
  return (
    <div className="flex-1">
      <div className="bg-white  m-2 rounded-lg shadow p-4">
        <div>未完成</div>
        <div className="flex gap-8 flex-wrap mt-4">
          <Card />
          <Card color="amber" />
          <Card />
          <Card />
        </div>
      </div>
      <div className="bg-white  m-2 rounded-lg shadow p-4">
        <div>直近完了</div>
        <div className="flex gap-8 flex-wrap mt-4">
          <Card end/>
          <Card end/>
          <Card end/>
          <Card end/>
        </div>
      </div>
    </div>
  )
}

export default Po