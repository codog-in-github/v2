import { Button, Modal } from "antd"
import {useCallback, useContext, useRef, useState} from "react";
import BookingNotice from "./BookNotice";
import { useAsyncCallback } from "@/hooks";
import { chooseFilePromise } from "@/helpers/file";
import { request } from "@/apis/requestBuilder";
import LoadingButton from "@/components/LoadingButton.jsx";
import {DetailDataContext} from "@/pages/orderDetail/dataProvider.js";
import {useSelector} from "react-redux";
import {ORDER_TYPE_EXPORT} from "@/constant/index.js";

const BookSelectModal = ({ instance }) => {
  const [open, setOpen] = useState(false);
  const bookingNoticeInstance = useRef(null);
  const orderType = useSelector(state => state.order.type)
  // const handingInstance = useRef(null);

  if(instance) {
    instance.current = {
      open: () => { setOpen(true) },
    }
  }
  const openForm = (formRef) => {
    formRef.current.open()
    setOpen(false)
  }
  const { form: detailForm } = useContext(DetailDataContext)

  const [exportTxt, exporting] = useAsyncCallback(async () => {
    const file = await chooseFilePromise()
    await request('/admin/customs/acl').form({ file }).download().send()
  })
  const downloadDeliveryExcel = () => {
    const id = detailForm.getFieldValue('id')
    return request('/admin/book/delivery_book').get({ id }).download().send()
  }

  return (
    <Modal title="COHISE BOOK" open={open} footer={null} onCancel={() => setOpen(false)} maskClosable={false}>
      <div className="my-4">
        <Button onClick={() => openForm(bookingNoticeInstance)}>BOOKEING NOTICE</Button>
        { orderType === ORDER_TYPE_EXPORT && (
          <LoadingButton
            className={'ml-2'}
            onClick={downloadDeliveryExcel}
          >（輸出）コンテナ配送依頼書</LoadingButton>
        )}
     </div>
      <div>
        <Button loading={exporting} onClick={exportTxt}>ACL TO TXT</Button>
      </div>
      <BookingNotice instance={bookingNoticeInstance}></BookingNotice>
      {/* <Handling instance={handingInstance} /> */}
    </Modal>
  )
}

export default BookSelectModal
