import { Outlet } from "react-router-dom";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setOrderType } from "@/store/slices/order";
import logo from "@/assets/images/icons/chz_logo.webp";
import { Tag } from "antd";
import { NavButton, NavButtonGroup } from "./NavButton";
export const TopClientLayout = () => {
  return (
    <div className="nav-layout flex flex-col h-screen staff client">
      <div className="staff-head">
        <div className="head-left">
          <div>南京方業物流有限公司</div>
        </div>

        <div className="head-right">
          <div className="flex items-center text-[14px]">
            <div className="flex items-center">
              <img className="mr-3 w-[30px]" src={logo}></img>
              <div>春海組システム</div>
            </div>

            <div className="ml-[30px]">
              <Tag color="#4471EF">负责人员</Tag>吉田部长丨090-12345678
            </div>
            <div className="ml-[30px]">
              <Tag color="#F85935">紧急联络</Tag>范扬社长丨090-12345678
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 flex overflow-hidden pt-[50px]">
        <Outlet />
      </div>
    </div>
  );
};

const ClientSidebar = () => {
  return (
    <NavButtonGroup
      align="left"
      rect
      className="nav-side-bar bg-white p-4 flex-col"
    >
      <NavButton to="/client-top" className="mb-2">
        TOP
      </NavButton>
      <NavButton to="/client-rules" className="mb-2">
        新規依頼
      </NavButton>
      <NavButton to="/client-offer" className="mb-2">
        船期
      </NavButton>
    </NavButtonGroup>
  );
};

export const SideClientLayout = () => {
  const orderType = useSelector((state) => state.order.type);
  const dispatch = useDispatch();
  const orderTypeChangeHandle = useCallback((e) => {
    const { value } = e.target;
    dispatch(setOrderType(value));
  }, []);
  return (
    <>
      <div className="flex flex-col h-full w-[240px] items-center">
        <ClientSidebar />
      </div>
      <div className="nav-layout-main">
        <Outlet />
      </div>
    </>
  );
};
