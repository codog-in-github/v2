import NavSidebar from "./NavSidebar";
import NavTopbar from "./NavTopbar";
import { Outlet } from "react-router-dom";
import { Radio } from "antd";
import { ORDER_TYPE_EXPORT, ORDER_TYPE_IMPORT } from "@/costant";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setOrderType } from "@/store/slices/order";
export const TopLayout = () => {
  return (
    <div className="nav-layout flex flex-col h-screen">
      <NavTopbar className="flex-shrink-0" />
      <div className="flex-1 flex overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
};

export const SideLayout = () => {
  const orderType = useSelector((state) => state.order.type);
  const dispatch = useDispatch();
  const orderTypeChangeHandle = useCallback((e) => {
    const { value } = e.target;
    dispatch(setOrderType(value));
  }, []);
  return (
    <>
      <div className="flex flex-col h-full w-[220px] bg-white shadow-lg shadow-gray-300">
        <NavSidebar className="flex-1" />
        <div className="h-16 flex justify-center items-center">
          <Radio.Group value={orderType} onChange={orderTypeChangeHandle}>
            <Radio value={ORDER_TYPE_EXPORT}>出口</Radio>
            <Radio value={ORDER_TYPE_IMPORT}>进口</Radio>
          </Radio.Group>
        </div>
      </div>
      <div className="nav-layout-main">
        <Outlet />
      </div>
    </>
  );
};
