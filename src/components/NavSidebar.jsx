import { NavButton, NavButtonGroup } from "./NavButton";
import classNames from "classnames";

function Sidebar({ className }) {
  return (
    <NavButtonGroup align="left" rect className={classNames('nav-side-bar bg-white p-4 flex-col', className)}>
      <NavButton to="/customer" className="mb-2">顧客名簿</NavButton>
      <NavButton to="/order" className="mb-2">オーダー</NavButton>
      <NavButton to="/calendar" className="mb-2">オーダー表</NavButton>
      <NavButton to="/ship" className="mb-2">船期</NavButton>
    </NavButtonGroup>
  );
}

export default Sidebar;