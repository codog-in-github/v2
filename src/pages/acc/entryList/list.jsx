import { request } from "@/apis/requestBuilder";
import { useEffect, useState, useRef } from "react";
import { useAsyncCallback, useContextMenu } from "@/hooks";
import pubSub from "@/helpers/pubSub";
import SkeletonList from "@/components/SkeletonList";
import {DEPARTMENT_KOBE, DEPARTMENT_KYUSHU, DEPARTMENT_OSAKA, DEPARTMENTS} from "@/constant";
import { Form } from "antd";
import dayjs from "dayjs";
import classNames from "classnames";
import UploadModal from "@/pages/acc/entryList/UploadModal.jsx";
import {useNavigate} from "react-router-dom";

const useReqList = (form) => {
  const [list, setList] = useState({});
  const [reload, loading] = useAsyncCallback(async () => {
    const res = await request('/admin/acc/un_entry')
      .get(form.getFieldsValue()).send()
    setList(res)
  })
  useEffect(() => {
    form.setFieldsValue({
      'filter_key': 'bkg_no',
      'filter_value': '',
    })
    reload()
  }, [])
  return { list, reload, loading }
}

const groups = [
  { title: DEPARTMENTS[DEPARTMENT_KOBE], key: DEPARTMENT_KOBE },
  { title: DEPARTMENTS[DEPARTMENT_OSAKA], key: DEPARTMENT_OSAKA },
  { title: DEPARTMENTS[DEPARTMENT_KYUSHU], key: DEPARTMENT_KYUSHU },
  { title: DEPARTMENTS[DEPARTMENT_KYUSHU], key: DEPARTMENT_KYUSHU },
  { title: '直近完了', key: 'recent'}
]

const ListGroup = ({
  title,
  list,
  onContextMenu,
  loading,
  filter
}) => {
  const navigate = useNavigate()

  return (
    <div className="mb-[20px]">
      <div className="flex justify-between">
        <div>{title}</div>
        <div>{filter}</div>
      </div>
      <div className="grid grid-cols-4 2xl:grid-cols-5 gap-8 flex-wrap mt-4 [&:has(.ant-empty)]:!grid-cols-1">
        <SkeletonList
          list={list}
          loading={loading}
          skeletonCount={8}
          skeletonClassName="w-full h-32"
        >
          {item => (
            <Card
              isEnd={!!item.is_entry}ß
              key={item['id']}
              onContextMenu={e => onContextMenu(e, item)}
              onClick={() => navigate(`/rb/edit/${item.id}/order/${item.order_id}/type/${item.type}`)}
              data={item}
            />
          )}
        </SkeletonList>
      </div>
    </div>
  )
}

const avatarColors = [
  '#45A73A', '#FBD521', '#D46DE0', '#426CF6', '#FD7556'
]

const getAvatarColor = (name = '') => {
  return avatarColors[name.charCodeAt(0) % avatarColors.length]
}

const formatDate = (date) => {
  if(!date) return '0000-00-00'
  return dayjs(date).format('YYYY-MM-DD')
}

function Card({
  data = {},
  isEnd = false,
  ...props
}) {
  const grayscale = {};
  if (isEnd) {
    grayscale.filter = "grayscale(100%)";
  }
  return (
    <div
      className={classNames(
        'bg-white rounded cursor-pointer overflow-hidden relative flex flex-col shadow',
        {
          'border-2': !isEnd
        }
      )}
      style={{
        height: isEnd ? 'auto' : '120px',
        color: '#484848',
        borderColor: '#FD7556',
        ...grayscale
      }}
      {...props}
    >
      <div className={'flex-1 flex p-4 gap-2 items-start'}>
        <div
          className={'rounded w-10 h-10 flex justify-center items-center text-white'}
          style={{
            background: getAvatarColor(data.order.short_name ?? '')
          }}
        >{ data.order.short_name?.[0] }</div>

        <div className={'flex-1'}>
          <div className={'font-bold'}>
            <span className={'text-xs'}>¥</span>
            <span className={'text-lg'}>{data.total_amount}</span>
          </div>

          <div className={'flex justify-between text-sm text-gray-400'}>
            <div>{formatDate(data.send_at)}</div>
            <div>送信日</div>
          </div>
        </div>
      </div>

      { isEnd && (
        <div
          className={'flex px-4 justify-between text-sm'}
        >
          <div className={'w-1/2 flex-1'}>{data.order.bkg_no}</div>
          <div className={'w-1/2 border-l flex-1 text-right'}>{data.order.order_no}</div>
        </div>
      )}

      {isEnd ? (
        <div className={'p-4 text-sm'}>
          <div
            className={'flex p-2 justify-between'}
            style={{backgroundColor: '#FFE0DD'}}
          >
            <div>{data.entry_at}</div>
            <div>{data.entry_by_name}</div>
          </div>
        </div>
      ) : (
        <div
          className={'flex px-4 py-2 justify-between text-sm rounded'}
          style={{backgroundColor: '#FFE0DD'}}
        >
          <div>{data.order.bkg_no}</div>
          <div>{data.order.order_no}</div>
        </div>
      )}
    </div>
  );
}

const ListPage = () => {
  const [filterForm] = Form.useForm()
  const {list, reload, loading} = useReqList(filterForm)
  const menuItem = useRef(null)
  const modalRef = useRef(null)
  const [menu, open] = useContextMenu(
    <div
      className="
        fixed w-32 z-50 border
        text-center bg-white shadow-md
        leading-8 rounded-md overflow-hidden
      "
      onClick={e => e.stopPropagation()}
    >
      <div
        className='text-primary hover:text-white hover:bg-primary active:bg-primary-600'
        onClick={() => modalRef.current.open(menuItem.current.id)}
      >收款</div>
    </div>
  )
  /**
   *
   * @param {Event} e
   */
  const contextMenuHandle = (e, item) => {
    e.preventDefault()
    e.stopPropagation()
    if(item.is_entry) {
      return
    }
    menuItem.current = item
    open({
      x: e.clientX,
      y: e.clientY
    })
  }
  return (
    <div className="flex-1">
      { groups.map((item) => (
        list[item.key] && (
          <ListGroup
            key={item.key}
            list={list[item.key]}
            title={item.title}
            color={item.color}
            loading={loading}
            onContextMenu={contextMenuHandle}
          ></ListGroup>
        )
      )) }
      {menu}
      <UploadModal ref={modalRef} onSuccess={reload} />
    </div>
  );
}

export default ListPage;
