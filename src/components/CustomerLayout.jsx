import { Outlet, Link } from "react-router-dom";
import logo from "@/assets/images/icons/chz_logo.webp";
import { NavButton, NavButtonGroup } from "./NavButton";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { request } from "@/apis/requestBuilder";
import { useState } from "react";
import { Select } from "antd";
import { useNavigate } from "react-router-dom";
const CustomerLayout = () => {
  const { id } = useParams()
  const [customerData, setCustomerData] = useState({})
  const [customers, setCustomer] = useState([])
  const navigate = useNavigate()
  useEffect(() => {
    request('/admin/customer/detail').get({ id }).send()
      .then(setCustomerData)
  }, [id])
  useEffect(() => {
    request('/admin/customer/list').get().send()
      .then((list) => setCustomer(list.map(item => ({
        value: item['id'],
        label: item['company_name'],
      }))))
  }, [])
  return (
    <div className="nav-layout flex flex-col h-screen staff">
      <div className="staff-head">
        <Link className="head-left" to="./top">
          <img className="mr-3" src={logo}></img>
          <div>春海組システム</div>
        </Link>

        <div className="head-right">
          <ul className="info">
            <li>住所：{customerData['address']}</li>
            <li>〒：{customerData['zip_code']}</li>
            <li>TEL：{customerData['mobile']}</li>
            <li>EMAIL：{customerData['email']}</li>
            <li>FAX：{customerData['fax']}</li>
          </ul>
          <Select
            value={Number(id)}
            className={[
              'drop',
              'w-56',
              '[&_.ant-select-selector]:!bg-transparent',
              '[&_.ant-select-selector]:!text-center',
              '[&_.ant-select-selector]:!border-none',
              '[&_.ant-select-selection-item]:text-white',
              '[&_.ant-select-arrow]:text-white'
            ]}
            options={customers}
            onSelect={(value)=> {
              if(value !== id) {
                navigate(`/customer-top/${value}`)
              }
            }}
          ></Select>
        </div>
      </div>
      <div className="flex-1 flex overflow-hidden pt-[50px]">
        <div className="flex flex-col h-full w-[240px] items-center">
          <CustomerSidebar />
        </div>
        <div className="nav-layout-main">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

const CustomerSidebar = () => {
  const { id } = useParams()
  return (
    <NavButtonGroup
      align="left"
      rect
      className="nav-side-bar bg-white p-4 flex-col"
    >
      <NavButton to={`/customer/${id}/top`} className="mb-2">
        TOP
      </NavButton>
      <NavButton to={`/customer/${id}/rules`} className="mb-2">
        新規依頼
      </NavButton>
      <NavButton to={`/customer/${id}/ship`} className="mb-2">
        船期
      </NavButton>
      <NavButton to={`/customer/${id}/pet`} className="mb-2">
        合計請求書
      </NavButton>
    </NavButtonGroup>
  );
};

export default CustomerLayout
