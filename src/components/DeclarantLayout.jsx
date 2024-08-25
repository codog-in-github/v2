import { Outlet } from "react-router-dom";
import logo from "@/assets/images/icons/chz_logo.webp";
import Avatar from "./Avatar";
import { namespaceClass } from "@/helpers/style";
import classnames from "classnames";
import { CaretDownOutlined } from "@ant-design/icons";
import { DatePicker, Dropdown, Radio, Form } from "antd";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import pubSub from "@/helpers/pubSub";

const c = namespaceClass("nav-top-bar");
export const DeclarantLayout = () => {
  return (
    <div className="nav-layout flex flex-col h-screen">
      <DeclarantTopbar className="flex-shrink-0" />
      <div className="flex-1 flex px-[15px] py-[10px]">
        <Outlet />
      </div>
    </div>
  );
};

const DeclarantTopbar = ({ className }) => {
  const [form] = Form.useForm()
  const navigate = useNavigate();
  const username = useSelector(state => state.user.userInfo.name)
  const logoutHandle = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

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
    <div className={classnames(c(""), "bg-white flex items-center", className)}>
      <img className={classnames(c("logo"))} src={logo}></img>
      <div className={classnames(c("title"))}>春海組システム</div>

      <Form form={form} className="flex ml-auto pr-4 items-center">
        <div className="mr-8 flex items-center">
          <span className="mr-3">日付</span>
          <Form.Item noStyle name="date">
            <DatePicker.RangePicker
              format="YYYY/MM/DD"
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
      </Form>
    </div>
  );
};
