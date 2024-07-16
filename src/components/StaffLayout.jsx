import NavSidebar from "./NavSidebar";
import { Outlet } from "react-router-dom";
import { Radio } from "antd";
import { ORDER_TYPE_EXPORT, ORDER_TYPE_IMPORT } from "@/costant";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setOrderType } from "@/store/slices/order";
import logo from "@/assets/images/icons/chz_logo.webp";
import { DownOutlined } from "@ant-design/icons";
import { NavButton, NavButtonGroup } from "./NavButton";
export const TopStaffLayout = () => {
  return (
    <div className="nav-layout flex flex-col h-screen staff">
      <div className="staff-head">
        <div className="head-left">
          <img className="mr-3" src={logo}></img>
          <div>春海組システム</div>
        </div>

        <div className="head-right">
          <ul className="info">
            <li>住所：大阪市住吉区 杉本6-1-1</li>
            <li>〒：547-0014</li>
            <li>TEL：090-12345678</li>
            <li>EMAIL：123456789@XX.com</li>
            <li>FAX：12345678</li>
          </ul>
          <div className="drop">
            南京方業物流有限公司 <DownOutlined className="ml-2" />
          </div>
        </div>
      </div>
      <div className="flex-1 flex overflow-hidden pt-[30px]">
        <Outlet />
      </div>
    </div>
  );
};

const StaffSidebar = () => {
  return (
    <NavButtonGroup
      align="left"
      rect
      className="nav-side-bar bg-white p-4 flex-col"
    >
      <NavButton to="/staff-top" className="mb-2">
        TOP
      </NavButton>
      <NavButton to="/staff-rules" className="mb-2">
        新規依頼
      </NavButton>
      <NavButton to="/staff-ship" className="mb-2">
        船期
      </NavButton>
      <NavButton to="/staff-pet" className="mb-2">
        合計請求書
      </NavButton>
    </NavButtonGroup>
  );
};

export const SideStaffLayout = () => {
  const orderType = useSelector((state) => state.order.type);
  const dispatch = useDispatch();
  const orderTypeChangeHandle = useCallback((e) => {
    const { value } = e.target;
    dispatch(setOrderType(value));
  }, []);
  return (
    <>
      <div className="flex flex-col h-full w-[240px] items-center">
        <StaffSidebar />
      </div>
      <div className="nav-layout-main">
        <Outlet />
      </div>
    </>
  );
};
