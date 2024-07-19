import { Outlet } from "react-router-dom";
import logo from "@/assets/images/icons/chz_logo.webp";
import Avatar from "./Avatar";
import { namespaceClass } from "@/helpers/style";
import classnames from "classnames";

import { CaretDownOutlined } from "@ant-design/icons";
import { DatePicker, Dropdown, Radio } from "antd";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
const { RangePicker } = DatePicker;

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

const useLogout = () => {
  const navigate = useNavigate();
  const handle = useCallback(() => {
    localStorage.removeItem("token");
    navigate("/");
  }, [navigate]);
  return handle;
};
const DeclarantTopbar = ({ className }) => {
  const logoutHandle = useLogout();
  const dateFormat = "YYYY/MM/DD";
  return (
    <div className={classnames(c(""), "bg-white flex items-center", className)}>
      <img className={classnames(c("logo"))} src={logo}></img>
      <div className={classnames(c("title"))}>春海組システム</div>

      <div className="flex ml-auto pr-4 items-center">
        <div className="mr-8 flex items-center">
          <span className="mr-3">日付</span>
          <RangePicker
            defaultValue={[dayjs("2024/07/19", dateFormat)]}
            format={dateFormat}
          />
        </div>

        <div className="mr-8">
          <span className="mr-3">件数</span>
          <Radio.Group defaultValue="1" buttonStyle="solid">
            <Radio.Button value="1">全件</Radio.Button>
            <Radio.Button value="2">残件</Radio.Button>
          </Radio.Group>
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
            <span className="mx-2">吉田</span>
            <CaretDownOutlined />
          </div>
        </Dropdown>
      </div>
    </div>
  );
};
