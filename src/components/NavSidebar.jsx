import { NavButton, NavButtonGroup } from "./NavButton";

function Sidebar() {
  return (
    <NavButtonGroup className="w-90px bg-gray-100 p-4 flex-col">
      <NavButton to="" className="mb-2">顧客名簿</NavButton>
      <NavButton to="" className="mb-2">オーダー</NavButton>
      <NavButton to="" className="mb-2">オーダー表</NavButton>
      <NavButton to="" className="mb-2">船期</NavButton>
    </NavButtonGroup>
  );
}

export default Sidebar;