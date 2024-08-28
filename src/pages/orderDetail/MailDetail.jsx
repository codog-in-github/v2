import { request } from "@/apis/requestBuilder"
import { useAsyncCallback } from "@/hooks"
import { LoadingOutlined } from "@ant-design/icons"
import { Modal } from "antd"
import { useEffect, useState } from "react"
import classNames from "classnames"
import { basename } from "@/helpers"
import { EXPORT_NODE_NAMES, MAIL_LOG_TYPE_ACC_PAY, MAIL_LOG_TYPE_MAIL, MAIL_LOG_TYPE_NODE_CONFIRM } from "@/constant"

const stepName = (item) => {
  switch (item.type) {
    case MAIL_LOG_TYPE_ACC_PAY:
      return '支払い'
    case MAIL_LOG_TYPE_NODE_CONFIRM:
      return '确认'
    default:
      return '送信'
  }
}
const TimeLine = ({ items, children }) => {
  return (
    <div className="[&>*:last-child_.line]:hidden">
      {items.map((item, i) => {
        return (
          <div key={item.id} className="flex">
            <div className="w-32 flex-shrink-0 flex flex-col">
              <div>
                <span
                  className={classNames('mr-4',{'text-primary-500': i === 0})}
                >●</span>
                <span>{stepName(item)}</span>
              </div>
              <div className="line flex-1 border-l ml-[3px]"></div>
            </div>
            <div className="w-full flex-1">
              <div className="mb-2">
                <span className="inline-block w-16">{item.operator}</span>
                <span className="text-gray-500">{item.operate_at}</span>
              </div>
              {children(item)}
            </div>
          </div>
        )
      })}
    </div>
  )
}
const MailRecord = ({ record }) => {
  const data = JSON.parse(record.content)
  switch (record.type) {
    case MAIL_LOG_TYPE_ACC_PAY:
      return (
        <>
          <div className="mb-2">金额：￥{data.amount && Number(data.amount).toFixed(2)}</div>
        </>
      )
    default:
      return (
        <>
          <div className="mb-2">收件人：{data.to?.join(',')}</div>
          {
            data.files && data.files.length > 0 && (
              <div className="bg-gray-200 py-2 px-4 text-gray-800">
                {data.files.map(basename)}
              </div>
            )
          }
        </>
      )
  }
  
}

const MailDetail = ({
  modal
}) => {
  const [nodeId, setNodeId] = useState(null)
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [contents, setContents] = useState([])
  const [getList, loading] = useAsyncCallback((id) => (
    request('/admin/order/email_log')
      .get({ id })
      .send()
      .then(setContents)
  ))
  if(modal) {
    modal.current = {
      open(id, type) {
        setOpen(true)
        setNodeId(id)
        setTitle(`${EXPORT_NODE_NAMES[type]} - メール詳細`)
      }
    }
  }
  useEffect(() => {
    if(nodeId) {
      getList(nodeId)
    }
  }, [nodeId])
  return (
    <Modal
      open={open}
      title={title}
      footer={null}
      onCancel={() => setOpen(false)}
      maskClosable={false}
    >
      <div className="flex flex-col gap-4 mp-4">
        {loading ? (
          <div className="text-center"><LoadingOutlined /></div>
        ) : (
          <TimeLine items={contents}>
            {rec => (
              <MailRecord record={rec} />
            )}
          </TimeLine>
        )}
      </div>
    </Modal>
  )
}

export default MailDetail
