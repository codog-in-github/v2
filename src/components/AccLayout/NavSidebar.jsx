import { NavButton, NavButtonGroup } from "@/components/NavButton";
import classNames from "classnames";
import * as Icon from '@/components/Icon'
function Sidebar({ className }) {
  return (
    <NavButtonGroup
      align="left"
      rect
      className={classNames("nav-side-bar bg-white p-4 flex-col", className)}
    >
      <NavButton to="/acc/dashboard" className="mb-2">
        统计首页
      </NavButton>
      <NavButton to="/acc/reqNotice" className="mb-2">
        请求书
      </NavButton>
    </NavButtonGroup>
  );
}

export default Sidebar;
