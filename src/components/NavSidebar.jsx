import { NavButton, NavButtonGroup } from "./NavButton";
import classNames from "classnames";
import * as Icon from '@/components/Icon'
function Sidebar({ className }) {
  return (
    <NavButtonGroup
      align="left"
      rect
      vertical
      className={classNames("nav-side-bar bg-white p-4", className)}
    >
      <NavButton to="/customer-list" className="mb-2">
        <Icon.Customer className="text-lg mr-2" />
        顧客名簿
      </NavButton>
      <NavButton to="/order" className="mb-2">
        <Icon.OrderList className="text-lg mr-2" />
        オーダー
      </NavButton>
      <NavButton to="/calendar" className="mb-2">
      <Icon.OrderCalendar className="text-lg mr-2" />
        オーダー表
      </NavButton>
      {/* <NavButton to="/ship" className="mb-2">
        <Icon.Boat className="text-lg mr-2" />
        船期
      </NavButton> */}
      <NavButton to="/petition" className="mb-2">
        <Icon.RequestBookChange className={'text-sm ml-1 mr-2'}/>
        請求書変更
      </NavButton>
      <NavButton to="/partner" className="mb-2">
        <Icon.OrderCalendar className="text-lg mr-2" />
        協力会社名簿
      </NavButton>
    </NavButtonGroup>
  );
}

export default Sidebar;
