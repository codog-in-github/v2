import { request } from "@/apis/requestBuilder"
import { useAsyncCallback } from "@/hooks"
import { LoadingOutlined } from "@ant-design/icons"
import { Modal } from "antd"
import { useEffect, useState } from "react"
import classNames from "classnames"
import { basename } from "@/helpers"

const TimeLine = ({ items, children }) => {
  return (
    <div>
      {items.map((item, i) => {
        return (
          <div key={item.id} className="flex">
            <div className="w-16 flex-shrink-0">
              <div>
                <span
                  className={classNames('mr-4',{'text-primary-500': i === 0})}
                >●</span>
                <span>送信</span>
              </div>
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

const MailDetail = ({
  modal
}) => {
  const [nodeId, setNodeId] = useState(null)
  const [open, setOpen] = useState(false)
  const [contents, setContents] = useState([])
  const [getList, loading] = useAsyncCallback((id) => (
    request('/admin/order/email_log')
      .get({ id })
      .send()
      .then(setContents)
  ))
  if(modal) {
    modal.current = {
      open(id) {
        setOpen(true)
        setNodeId(id)
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
      title="メール詳細"
      footer={null}
      onCancel={() => setOpen(false)}
    >
      <div className="flex flex-col gap-4">
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
