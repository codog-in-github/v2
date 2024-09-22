import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { namespaceClass } from "@/helpers/style";
import { CaretDownOutlined } from "@ant-design/icons";
import { DatePicker, Dropdown, Radio, Form, Button } from "antd";
import { useSelector } from "react-redux";
import { useCallback, useMemo } from "react";
import classnames from "classnames";
import Avatar from "./Avatar";
import dayjs from "dayjs";
import pubSub from "@/helpers/pubSub";
import logo from "@/assets/images/icons/chz_logo.webp";
import {chooseFile} from "@/helpers/file.js";

const CustomsListFilter = () => {
  const [form] = Form.useForm()

  const filter = useCallback(() => {
    const values = form.getFieldsValue();
    const filters = {}
    if(values.date && values.date[0]) {
      filters.start_date = values.date[0].format("YYYY-MM-DD")
    }
    if(values.date && values.date[1]) {
      filters.end_date = values.date[1].format("YYYY-MM-DD")
    }
    filters.type = values.type
    pubSub.publish("None.Customs.List.Filter", filters);
  }, [form]);

  return (
    <Form form={form} className="flex ml-auto pr-4 items-center">
      <div className="mr-8 flex items-center">
        <span className="mr-3">日付</span>
        <Form.Item noStyle name="date">
          <DatePicker.RangePicker
            format="YYYY/MM/DD"
            allowEmpty={[true, true]}
            defaultValue={[dayjs()]}
            onChange={filter}
            allowClear={false} />
        </Form.Item>
      </div>

      <div className="mr-8">
        <span className="mr-3">件数</span>
        <Form.Item noStyle name="type">
          <Radio.Group buttonStyle="solid" defaultValue={1} onChange={filter}>
            <Radio.Button value={1}>全件</Radio.Button>
            <Radio.Button value={2}>残件</Radio.Button>
          </Radio.Group>
        </Form.Item>
      </div>
    </Form>
  )
}

const ExcelUploadButton = () => {
  const onChooseFile = () => {
    chooseFile({
      accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      onChoose: (file) => {
        pubSub.publish("None.Customs.Detail.Upload", file)
      }
    })
  }
  return (
    <Button type="primary" onClick={onChooseFile}>実績参照</Button>
  )
}

const c = namespaceClass("nav-top-bar");
export const DeclarantLayout = () => {
  return (
    <div className="nav-layout flex flex-col h-screen">
      <DeclarantTopbar className="flex-shrink-0" />
      <div className="flex-1 flex px-[15px] py-[10px] overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

const DeclarantTopbar = ({ className }) => {
  const navigate = useNavigate();
  const username = useSelector(state => state.user.userInfo.name)
  const logoutHandle = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const { pathname } = useLocation()
  const customEle = useMemo(() => {
    if(pathname === '/declarant')
      return <CustomsListFilter />
    if(pathname.startsWith('/declarant/detail'))
      return <ExcelUploadButton />
  }, [pathname])

  return (
    <div className={classnames(c(""), "!h-[70px] bg-white flex items-center", className)}>
      <img className={classnames(c("logo"))} src={logo} alt=""></img>
      <div className={classnames(c("title"))}>春海組システム</div>
      <div className="ml-auto pr-4 flex gap-4 items-center">
        {customEle}
        <Dropdown
          menu={{
            items: [
              {
                key: "1",
                label: <div onClick={logoutHandle}>サインアウト</div>,
              },
            ],
          }}
        >
          <div className="flex gap-2 items-center">
            <Avatar></Avatar>
            <span className="mx-2">{username}</span>
            <CaretDownOutlined />
          </div>
        </Dropdown>
      </div>
    </div>
  );
};
