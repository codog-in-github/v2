import { NavButton, NavButtonGroup } from "@/components/NavButton";
import classNames from "classnames";
import * as Icon from '@/components/Icon'
function Sidebar({ className }) {
  return (
    <NavButtonGroup
      align="left"
      vertical
      rect
      className={classNames("nav-side-bar bg-white p-4 flex-col", className)}
    >
      <NavButton to="/acc/dashboard">
        <Icon.ChartDashboard className={'mr-2'} />
        统计首页
      </NavButton>
      <NavButton to="/acc/requestbook">
        <Icon.AccRequestBook className={'mr-2'} />
        請求書
      </NavButton>
      <NavButton to="/acc/requestMulti">
        <Icon.MultiList className={'mr-2'} />
        综合LIST
      </NavButton>
      <NavButton to="/acc/payCheckReadOnly">
        <Icon.RequestBookCosts className={'mr-2'} />
        上游請求書
      </NavButton>
    </NavButtonGroup>
  );
}

export default Sidebar;
