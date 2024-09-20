import {forwardRef, useEffect, useImperativeHandle, useRef, useState} from "react";
import {Modal, Radio} from "antd";
import {request} from "@/apis/requestBuilder.js";

const UserPicker = forwardRef(function UserPicker(_, ref) {
  const [open, setOpen] = useState(false)
  const pickerCallbacks = useRef({
    resolve: () => {},
    reject: () => {}
  })
  const [selected, setSelected] = useState(null)
  const [users, setUsers] = useState([])

  useEffect(() => {
    request('admin/user/user_list').get().send()
      .then((rep) => {
        if(!rep) {
          setUsers([])
          return
        }
        setUsers(rep.map(user => ({
          label: user.name,
          value: user.id
        })))
      })
  }, [])

  useImperativeHandle(ref, () => {
    return {
      pick: () => {
        setOpen(true)
        setSelected(null)
        return new Promise((resolve, reject) => {
          pickerCallbacks.current = {
            resolve,
            reject
          }
        })
      }
    }
  }, [])

  return (
    <Modal
      title="選択してください"
      open={open}
      onOk={() => {
        if(!selected) {
          return
        }
        setOpen(false)
        pickerCallbacks.current.resolve(selected)
      }}
      onCancel={() => {
        setOpen(false)
        pickerCallbacks.current.reject()
      }}
    >
      <Radio.Group
        className="mt-4"
        value={selected}
        options={users}
        onChange={e => setSelected(e.target.value)}
      ></Radio.Group>
    </Modal>
  )
})

export default UserPicker
