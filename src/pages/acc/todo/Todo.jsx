import { request } from "@/apis/requestBuilder.js";
import {useEffect, useState, useRef, useCallback} from "react";
import { useAsyncCallback } from "@/hooks/index.js";
import SkeletonList from "@/components/SkeletonList.jsx";
import { ACC_JOB_TYPE_BL, ACC_JOB_TYPE_SEA } from "@/constant/index.js";
import Card from "./Card.jsx";
import dayjs from "dayjs";
import CompModal from "./CompModal.jsx";
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
            expired_at: dayjs(job.created_at).add(1, 'hours')
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

const ListGroup = ({ title, color, list, onClick, loading }) => {
  return (
    <div className=" m-2 rounded-lg  py-4">
      <div>{title}</div>
      <div className="grid grid-cols-4 2xl:grid-cols-5 gap-8 flex-wrap mt-4">
        <SkeletonList
          list={list}
          loading={loading}
          skeletonCount={8}
          skeletonClassName="w-full h-32"
        >
          {item => (
            <Card
              key={item['id']}
              onClick={() => onClick(item)}
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
  const modalRef = useRef(null)
  const onClick = useCallback((item) => {
    modalRef.current.open(item.id)
  }, [])
  /**
   *
   * @param {Event} e
   */

  return (
    <div className="flex-1">
      { groups.map(item => (
        list[item.key] && list[item.key].length > 0 && (
          <ListGroup
            key={item.key}
            list={list[item.key]}
            title={item.title}
            loading={loading}
            onClick={onClick}
          ></ListGroup>
        )
      )) }
      <CompModal ref={modalRef} onSuccess={reload}></CompModal>
    </div>
  );
}

export default TodoList;
