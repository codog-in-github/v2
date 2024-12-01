import { request } from "@/apis/requestBuilder";
import {useEffect, useState, useRef, forwardRef, useImperativeHandle, useCallback} from "react";
import {useAsyncCallback, useBankList, useContextMenu, useDepartmentList} from "@/hooks";
import { useNavigate } from "react-router-dom";
import { LoadingOutlined } from "@ant-design/icons";
import pubSub from "@/helpers/pubSub";
import SkeletonList from "@/components/SkeletonList";
import { ORDER_TAB_STATUS_REQUEST} from "@/constant";
import {Avatar, Button, Checkbox, Form, Input, Modal, Radio, Select} from "antd";
import OrderFilter from "@/components/OrderFilter";
import PortFullName from "@/components/PortFullName";
import { CARD_COLORS } from "./common";
import TopBadge from "@/components/TopBadge";
import UserPicker from "@/components/UserPicker.jsx";
import {isArray} from "lodash";

const MultiExportModal = forwardRef(function MultiExportModal(props, ref) {
  const { onSuccess } = props

  const bankOptions = useBankList()
  const departmentOptions = useDepartmentList()
  const [open, setOpen] = useState(false)
  const ids = useRef([])
  const [form] = Form.useForm()
  const [ccOptions, setCcOptions] = useState([])
  const [toOptions, setToOptions] = useState([])

  useImperativeHandle(ref, () => {
    return {
      open (selectedIds) {
        ids.current = selectedIds
        form.resetFields()
        form.setFieldValue('custom_cols', ['orderNo', 'containerCount', 'port', 'etd'])
        setOpen(true)
        return getMailDefault(selectedIds)
      }
    }
  }, [])

  const [getMailDefault, loading] = useAsyncCallback(async (ids) => {
    const rep = await request('/admin/request_book/merge_export')
      .get({ id: ids.join(',') }).send()
    const subject = rep.subject
    const content = rep.content
    let cc = []
    let to = []
    const contact = rep.contact
    if(contact.email) {
      to = [{ value: contact.email }]
      form.setFieldValue('to', contact.email)
    }

    if(contact.cc) {
      cc.push(contact.cc.split(',').map(item => ({ value: item })))
    }
    setCcOptions(cc)
    setToOptions(to)
    form.setFieldsValue({
      subject, content
    })
  })

  const [onSubmit, submitting] = useAsyncCallback(async () => {
    const formData = await form.validateFields()
    formData.id = ids.current.join(',')
    formData.custom_cols = formData.custom_cols.join(',')

    await request('/admin/request_book/merge_export')
      .data(formData).download('', true).send()

    pubSub.publish('Info.Toast', '导出成功', 'success')
    setOpen(false)
    onSuccess()
  })

  return (
    <Modal
      title={'请选择'}
      open={open}
      onOk={onSubmit}
      onCancel={() => setOpen(false)}
      loading={loading}
      okButtonProps={{
        loading: submitting
      }}
    >
      <Form form={form} labelCol={{ span: 4 }}>
        <Form.Item label={'件名'} name={'subject'} rules={[{ required: true, message: '件名必填' }]}>
          <Input placeholder={'请输入件名'} />
        </Form.Item>
        <Form.Item label={'受信者'} name={'to'} rules={[{ required: true, message: '受信者必填' }]}>
          <Select mode={'tags'} options={toOptions}></Select>
        </Form.Item>
        <Form.Item label={'CC'} name={'cc'}>
          <Select mode={'tags'} options={ccOptions}></Select>
        </Form.Item>
        <Form.Item label={'内容'} name={'content'}>
          <Input.TextArea rows={7} placeholder={'请输入内容'} />
        </Form.Item>
        <Form.Item label="銀行" name="bank_id" rules={[{ required: true, message: '銀行必填' }]}>
          <Radio.Group options={bankOptions} />
        </Form.Item>
        <Form.Item label="住所" name="department_id" rules={[{ required: true, message: '住所必填' }]}>
          <Radio.Group options={departmentOptions} />
        </Form.Item>
        <Form.Item label="显示列" name="custom_cols">
          <Checkbox.Group options={[
            { value: 'orderNo', label: '社内番号'},
            { value: 'containerCount', label: 'コンテナ数'},
            { value: 'port', label: '出港地-到着地'},
            { value: 'etd', label: '出発日'},
          ]} />
        </Form.Item>
        <Form.Item label={'REMARK'} name={'remark'}>
          <Input.TextArea />
        </Form.Item>
      </Form>
    </Modal>
  )
})

const useReqList = (form, onRefresh) => {
  const [list, setList] = useState({});
  const [reload, loading] = useAsyncCallback(async () => {
    const res = await request('/admin/order/req_list')
      .get(form.getFieldsValue()).send()
    setList(res)
    onRefresh()
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

const ListGroup = ({
  title,
  color,
  list,
  onContextMenu,
  loading,
  filter,
  selectable = false,
  selectedKeys = [],
  onChange: propsOnChange,
}) => {
  const navigate = useNavigate()
  const onChange = (e, item) => {
    if(e) {
      propsOnChange([...selectedKeys, item.id])
    } else {
      propsOnChange(selectedKeys.filter(id => id !== item.id))
    }
  }

  return (
    <div className="bg-white mb-[20px] rounded-lg shadow p-4">
      <div className="flex justify-between">
        <div>{title}</div>
        <div>{filter}</div>
      </div>
      <div className="grid grid-cols-4 2xl:grid-cols-6 gap-8 flex-wrap mt-4 [&:has(.ant-empty)]:!grid-cols-1">
        <SkeletonList
          list={list}
          loading={loading}
          skeletonCount={8}
          skeletonClassName="w-full h-32"
        >
          {item => (
            <Card
              selectable={selectable}
              selected={selectable && selectedKeys.includes(item['id'])}
              key={item['id']}
              onContextMenu={e => onContextMenu(e, item)}
              onNavigate={() => navigate(`/orderDetail/${item['id']}`)}
              onChange={(e) => onChange(e, item)}
              color={color}
              orderInfo={item}
            />
          )}
        </SkeletonList>
      </div>
    </div>
  )
}
function Card({
  orderInfo = {},
  color,
  selectable = false,
  selected = false,
  onNavigate = () => {},
  onChange = () => {},
  ...props
}) {
  const grayscale = {};
  if (orderInfo.end) {
    grayscale.filter = "grayscale(100%)";
  }
  const onClick = useCallback(() => {
    if(selectable) {
      onChange(!selected)
    } else {
      onNavigate()
    }
  }, [selectable, onNavigate, onChange, selected]);
  return (
    <div
      className="border-2 border-t-[6px] rounded h-[120px] cursor-pointer overflow-hidden text-[#484848] relative"
      style={{
        borderColor: CARD_COLORS[color].border,
        ...grayscale
      }}
      onClick={onClick}
      {...props}
    >
      {!!orderInfo.request_book_node.is_top && <TopBadge>请</TopBadge>}
      <div className="flex p-2 overflow-hidden" style={{ background: CARD_COLORS[color].bg }}>
        { selectable && (
          <Checkbox
            className={'absolute top-1 left-1 z-10'}
            checked={selected}
          />
        )}
        <Avatar
          size={40}
          style={{ backgroundColor: CARD_COLORS[color].border }}
        >
          {orderInfo['short_name']?.[0]}
        </Avatar>
        <div className="ml-2 flex-1 w-1" >
          <div className="truncate text-[22px] flex items-center w-full">
            <span className="mr-auto">
              {orderInfo['cy_cut']?.substring(5)}
              <span className={'text-[16px] font-normal mx-2'}>{
                orderInfo['cy_cut_time'] ? 'PM' : 'AM'
              }</span>
            </span>
            <span className="text-[14px]" style={{color: CARD_COLORS[color].text}}>CY CUT</span>
          </div>
          <div className="truncate">
            <PortFullName
              country={orderInfo['loading_country_name']}
              port={orderInfo['loading_port_name']}
              placeholder="POL"
            />
            {' - '}
            <PortFullName
              country={orderInfo['delivery_country_name']}
              port={orderInfo['delivery_port_name']}
              placeholder="POD"
            />
          </div>
        </div>
      </div>
      <div className="flex justify-between p-2">
        <div className="truncate">{orderInfo.containers?.[0]?.['common']}</div>
        <div>{orderInfo['bkg_no']}</div>
      </div>
    </div>
  );
}

function RequestBookPage() {
  const [filterForm] = Form.useForm()
  const [selectedBookIds, setSelectedBookIds] = useState([])
  const [selectedMode, setSelectedMode] = useState(false)
  const { list, reload, loading } = useReqList(filterForm, () => setSelectedBookIds([]))
  const userPicker = useRef(null);
  const order = useRef(null)
  const modalRef = useRef(null);
  const [topNode, topNodeLoading] = useAsyncCallback(async () => {
    close()
    await request('/admin/order/change_top').data({
      'id': order.current['id'],
      'node_status': ORDER_TAB_STATUS_REQUEST,
      'is_top': 1
    }).send()
    pubSub.publish('Info.Toast', 'TOP PAGEに', 'success')
    reload()
  })

  useEffect(() => {
    filterForm.setFieldValue('filter_key', 'company_name')
  }, []);
  const exitSelectMode = () => {
    setSelectedMode(false)
    setSelectedBookIds([])
  }

  const onExportClick = () => {
    if(selectedMode) {
      if(selectedBookIds.length) {
        modalRef.current.open(selectedBookIds)
      } else {
        pubSub.publish('Info.Toast', '対象を選択してください', 'warning')
      }
    } else {
      setSelectedMode(true)
    }
  }

  const [menu, open, close] = useContextMenu(
    <div
      className="
        fixed w-32 z-50 border cursor-OrderListinter
        text-center bg-white shadow-md
        leading-8 rounded-md overflow-hidden
      "
      onClick={e => e.stopPropagation()}
    >
      <div
        className='text-primary hover:text-white hover:bg-primary active:bg-primary-600'
        onClick={async () => {
          close()
          const user = await userPicker.current.pick()
          const params = {
            'order_id': order.current.id,
            'node_id': order.current.request_book_node.id,
            'user_id': user
          }
          await request('admin/order/dispatch').data(params).send()
          pubSub.publish('Info.Toast', '仲間に協力', 'success')
        }}
      >仲間に協力</div>
      <div
        className='text-primary hover:text-white hover:bg-primary active:bg-primary-600'
        onClick={topNode}
      >
        {topNodeLoading && <LoadingOutlined className="mr-2"/>}
        TOP PAGEに
      </div>
    </div>
  )
  /**
   *
   * @param {Event} e
   */
  const contextMenuHandle = (e, item) => {
    e.preventDefault()
    order.current = item
    open({
      x: e.clientX,
      y: e.clientY
    })
  }

  return (
    <div className="flex-1">
      <ListGroup
        filter={<OrderFilter form={filterForm} onSearch={reload} />}
        list={list.undo}
        title={'作成待'}
        color={0}
        loading={loading}
        onContextMenu={contextMenuHandle}
      ></ListGroup>

      <ListGroup
        filter={(
         <div className={'flex gap-2'}>
           { selectedMode && (
             <Button
               className={'mr-2'}
               onClick={exitSelectMode}
             >キャンセル</Button>
           ) }

          <Button
            type={'primary'}
            onClick={onExportClick}
          >导出</Button>

           <OrderFilter form={filterForm} onSearch={reload} />
         </div>
        )}
        list={list.unsend}
        selectedKeys={selectedBookIds}
        onChange={(selected) => setSelectedBookIds(selected)}
        title={'発送待'}
        selectable={selectedMode}
        color={2}
        loading={loading}
        onContextMenu={contextMenuHandle}
      ></ListGroup>

      <ListGroup
        list={list.unentry}
        title={'入金待'}
        color={2}
        loading={loading}
        onContextMenu={contextMenuHandle}
      ></ListGroup>

      {menu}

      <UserPicker ref={userPicker} />
      <MultiExportModal
        ref={modalRef}
        onSuccess={() => {
          exitSelectMode();
          reload();
        }}
      />
    </div>
  );
}

export default RequestBookPage;
