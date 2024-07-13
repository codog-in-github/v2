import { namespaceClass } from "@/helpers/style"
import classNames from "classnames"
import Color from "color"
import './index.scss'
import moment from 'moment'
import { themeColor } from "@/helpers/color"
const c = namespaceClass('op-card')

function Card ({
  end,
  color = 'primary',
  avatarColor = '#ddd',
  avatorText = '',
  address = '',
  date
}) {
  const grayscale = {}
  if (end) {
    grayscale.filter = 'grayscale(100%)'
  }
  const isDarkAvatar = Color(avatarColor).isDark()
  const m = moment(date)
  const md = m.format('MM-DD')
  const hm = m.format('HH:mm')
  return (
    <div className={classNames(c('', color))} style={{ ...grayscale }}>
      <div className="flex p-2">
        <div
          className={
            classNames('rounded-full w-8 h-8 leading-8 text-center', {
              'text-white': isDarkAvatar,
              'text-black': !isDarkAvatar
            })
          }
          style={{ backgroundColor: avatarColor }}>
            {avatorText}
        </div>
        <div className="ml-2">
          <div>{address}</div> 
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
        <div
          className="flex justify-center items-center flex-col px-2"
          style={{ backgroundColor: themeColor(color, 90) }}>
          <div>{md}</div>
          <div>{hm}</div>
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
          <Card avatarColor="red" avatorText="你" address="中国浙江省宁波市鄞州区中…" date={Date.now()} />
          <Card avatarColor="gold" color="success" avatorText="好" address="中国浙江省宁波市鄞州区中…" />
          <Card avatarColor="green" avatorText="世" />
          <Card avatarColor="lightblue" avatorText="界" />
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