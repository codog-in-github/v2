function Navbar() {
  return (
    <div className="bg-white shadow p-4 flex justify-between items-center">
      <div className="flex space-x-4">
        <button className="bg-blue-500 text-white px-4 py-2 rounded">TOP</button>
        <button>PO</button>
        <button>DRIVE</button>
        <button>通関資料</button>
        <button>ACL</button>
        <button>許可</button>
      </div>
      <div className="flex items-center">
        <span>吉田</span>
        <button className="ml-4">請求書</button>
      </div>
    </div>
  );
}

export default Navbar;