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
      {/* <NavButton to="/customer-list" className="mb-2">
        顧客名簿
      </NavButton> */}
    </NavButtonGroup>
  );
}

export default Sidebar;
