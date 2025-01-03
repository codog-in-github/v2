import NavSidebar from "./NavSidebar";
import NavTopbar from "./NavTopbar";
import {Outlet, useNavigate} from "react-router-dom";
import { ORDER_TYPE_EXPORT, ORDER_TYPE_IMPORT } from "@/constant";
import { useDispatch, useSelector } from "react-redux";
import { setOrderType } from "@/store/slices/order";
import classNames from "classnames";
import {useEffect, useState} from "react";
import pubSub from "@/helpers/pubSub.js";
export const TopLayout = () => {
  const [isScrollPage, setIsScrollPage] = useState(false)
  useEffect(() => {
    const onChange = (isScroll) => {
      setIsScrollPage(isScroll)
    }
    pubSub.subscribe('Info.UI.ScrollPage.Change', onChange)

    return () => pubSub.unsubscribe('Info.UI.ScrollPage.Change', onChange)
  }, []);
  return (
    <div className="nav-layout flex flex-col h-screen">
      <NavTopbar className="flex-shrink-0" />
      <div
        className={classNames(
          'flex-1 flex',
          { 'overflow-hidden': !isScrollPage }
        )}
      >
        <Outlet />
      </div>
    </div>
  );
};

export const SideLayout = () => {
  const orderType = useSelector((state) => state.order.type);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onOrderTypeChange = (type) => {
    dispatch(setOrderType(type))
    navigate('/top')
  };

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
            [&>.active]:pointer-events-none
            [&>.active]:bg-primary
            [&>.active]:text-white
          "
        >
            <div
              className={classNames(orderType === ORDER_TYPE_EXPORT ? 'active': 'cursor-pointer' )}
              onClick={() => onOrderTypeChange(ORDER_TYPE_EXPORT)}
            >輸出</div>
            <div
              className={classNames(orderType === ORDER_TYPE_IMPORT ? 'active': 'cursor-pointer' )}
              onClick={() => onOrderTypeChange(ORDER_TYPE_IMPORT)}
            >輸入</div>
        </div>
      </div>
      <div className="nav-layout-main">
        <Outlet />
      </div>
    </>
  );
};
