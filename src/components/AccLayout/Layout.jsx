import NavSidebar from "./NavSidebar";
import NavTopbar from "./NavTopbar";
import { Outlet } from "react-router-dom";
import { ORDER_TYPE_EXPORT, ORDER_TYPE_IMPORT } from "@/constant";
import { useDispatch, useSelector } from "react-redux";
import { setOrderType } from "@/store/slices/order";
import classNames from "classnames";
const AccLayout = () => {
  return (
    <div className="nav-layout flex flex-col h-screen">
      <NavTopbar className="flex-shrink-0" />
      <div className="flex-1 flex overflow-hidden">
        <SideLayout />
      </div>
    </div>
  );
};

const SideLayout = () => {
  const orderType = useSelector((state) => state.order.type);
  const dispatch = useDispatch();
  return (
    <>
      <div className="flex flex-col h-full w-[220px] bg-white shadow-lg shadow-gray-300">
        <NavSidebar className="flex-1" />
        <div
          className="
            leading-[40px]
            flex
            items-center
            text-center
            bg-[#f2f4f8]
            [&>*]:flex-1
            [&>*]:cursor-pointer
            [&>.active]:pointer-events-none
            [&>.active]:bg-primary
            [&>.active]:text-white
          "
        >
            <div
              className={classNames({'active': orderType === ORDER_TYPE_EXPORT })}
              onClick={() => dispatch(setOrderType(ORDER_TYPE_EXPORT))}
            >出口</div>
            <div
              className={classNames({ 'active': orderType === ORDER_TYPE_IMPORT })}
              onClick={() => dispatch(setOrderType(ORDER_TYPE_IMPORT))}
            >进口</div>
        </div>
      </div>
      <div className="nav-layout-main">
        <Outlet />
      </div>
    </>
  );
};

export default AccLayout;