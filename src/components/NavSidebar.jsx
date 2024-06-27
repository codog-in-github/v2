import { NavButton, NavButtonGroup } from "./NavButton";

function Sidebar() {
  return (
    <NavButtonGroup align="left" rect className="w-90px bg-gray-100 p-4 flex-col">
      <NavButton to="/customer" className="mb-2">顧客名簿</NavButton>
      <NavButton to="/order" className="mb-2">オーダー</NavButton>
      <NavButton to="/calendar" className="mb-2">オーダー表</NavButton>
      <NavButton to="/ship" className="mb-2">船期</NavButton>
    </NavButtonGroup>
  );
}

export default Sidebar;