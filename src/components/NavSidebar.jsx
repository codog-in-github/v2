import { NavButton, NavButtonGroup } from "./NavButton";
import classNames from "classnames";
import * as Icon from '@/components/Icon'
function Sidebar({ className }) {
  return (
    <NavButtonGroup
      align="left"
      rect
      className={classNames("nav-side-bar bg-white p-4 flex-col", className)}
    >
      <NavButton to="/customer-list" className="mb-2">
      {/* <Icon.Customer className="w-2 h-2" /> */}
        顧客名簿
      </NavButton>
      <NavButton to="/order" className="mb-2">
        オーダー
      </NavButton>
      <NavButton to="/calendar" className="mb-2">
        オーダー表
      </NavButton>
      <NavButton to="/ship" className="mb-2">
        船期
      </NavButton>
      <NavButton to="/petition" className="mb-2">
        請求書変更
      </NavButton>
    </NavButtonGroup>
  );
}

export default Sidebar;
