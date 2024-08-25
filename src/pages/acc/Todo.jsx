import { themeColor } from "@/helpers/color";
import { request } from "@/apis/requestBuilder";
import { useEffect, useState, useRef } from "react";
import { useAsyncCallback, useContextMenu } from "@/hooks";
import { useNavigate } from "react-router-dom";
import { LoadingOutlined } from "@ant-design/icons";
import pubSub from "@/helpers/pubSub";
import SkeletonList from "@/components/SkeletonList";
import { ACC_JOB_TYPE_BL, ACC_JOB_TYPE_SEA } from "@/constant";
import Card from "./Card";
import dayjs from "dayjs";
import CompModal from "./CompModal";
const useTodo = () => {
  const [list, setList] = useState({});
  const [reload, loading] = useAsyncCallback(async () => {
    const res = await request('/admin/acc/todo_list').get().send()
    const list = {}
    for(const item of groups) {
      list[item.key] = []
      if(res[item.key]) {
        for(const job of res[item.key]) {
          list[item.key].push({
            ...job,
            color: colors[job.customer_company_name.charCodeAt() % colors.length],
            expired_at: job.expired_at ? dayjs(job.created_at) : dayjs().add(1, 'hours')
          })
        }
      }
    }
    setList(list)
  })
  useEffect(() => { reload() }, [])
  return { list, reload, loading }
}

const colors = '#fbd521,#426cf6,#45a73a,#fd7556'.split(',')

const groups = [
  {
    key: ACC_JOB_TYPE_SEA,
    title: '海上部分',
  },
  {
    key: ACC_JOB_TYPE_BL,
    title: '海上部分',
  },
]

const ListGroup = ({ title, color, list, onContextMenu, loading }) => {
  const navigate = useNavigate()
  return (

    <div className=" m-2 rounded-lg  py-4">
      <div>{title}</div>
      <div className="grid grid-cols-4 lg:grid-cols-5 gap-8 flex-wrap mt-4">
        <SkeletonList
          list={list}
          loading={loading}
          skeletonCount={8}
          skeletonClassName="w-full h-32"
        >
          {item => (
            <Card
              key={item['id']}
              onContextMenu={e => onContextMenu(e, item)}
              onClick={() => {}}
              color={color}
              jobInfo={item}
            />
          )}
        </SkeletonList>
      </div>
    </div>
  )
}
function TodoList() {
  const { list, reload, loading } = useTodo()
  const job = useRef(null)
  const modalInstall = useRef(null)
  const [pay, paying] = useAsyncCallback(async () => {
    modalInstall.current.open(job.current['id'])
    hidden()
  })

  const [menu, open, hidden] = useContextMenu(
    <div
      className="
        fixed w-32 z-50 border cursor-OrderListinter
        text-center bg-white shadow-md
        leading-8 rounded-md overflow-hidden
      "
      onClick={e => e.stopPropagation()}
    >
      <div
        type='primary'
        className='text-primary hover:text-white hover:bg-primary active:bg-primary-600'
        onClick={pay}
      >
        {paying && <LoadingOutlined className="mr-2" />}
        付款
      </div>
    </div>
  )
  /**
   * 
   * @param {Event} e 
   */
  const contextMenuHandle = (e, item) => {
    e.preventDefault()
    job.current = item
    open({
      x: e.clientX,
      y: e.clientY
    })
  }
  return (
    <div className="flex-1">
      { groups.map(item => (
        list[item.key] && (
          <ListGroup
            key={item.key}
            list={list[item.key]}
            title={item.title}
            loading={loading}
            onContextMenu={contextMenuHandle}
          ></ListGroup>
        )
      )) }
      {menu}
      <CompModal instance={modalInstall} onSuccess={reload}></CompModal>
    </div>
  );
}

export default TodoList;
