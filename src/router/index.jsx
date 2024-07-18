import { createBrowserRouter } from "react-router-dom";
import Login from "@/pages/Login.jsx";
import Err404 from "@/pages/Err/404.jsx";
import { SideLayout, TopLayout } from "@/components/NavLayout";
import { SideStaffLayout, TopStaffLayout } from "@/components/StaffLayout";
import { SideClientLayout, TopClientLayout } from "@/components/ClientLayout";
import OrderDetail from "@/pages/orderDetail/Index";
import Top from "@/pages/top/Index";
import Po from "@/pages/po/Index";
import {
  OrderList,
  CustomerList,
  OrderCalendar,
  ShipList,
  PetitionList,
  StaffTop,
  StaffRules,
  StaffShip,
  StaffPet,
  ClientTop,
  ClientRules,
  ClientOffer,
} from "@/pages/index";
// 还没写的页面 占个位先
const placeholderUrls = [
  "/drive",
  "/customs",
  "/acl",
  "/permission",
  "/invoice",
  "/blCopy",
  "/sur",
];
const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    element: <TopLayout />,
    children: [
      {
        path: "/orderDetail/:id",
        element: <OrderDetail />,
      },
      {
        element: <SideLayout />,
        children: [
          {
            path: "/top",
            element: <Top />,
          },
          {
            path: "/po",
            element: <Po />,
          },
          {
            path: "/customer",
            element: <CustomerList />,
          },
          {
            path: "/order",
            element: <OrderList />,
          },
          {
            path: "/calendar",
            element: <OrderCalendar />,
          },
          {
            path: "/ship",
            element: <ShipList />,
          },
          {
            path: "/petition",
            element: <PetitionList />,
          },
          ...placeholderUrls.map((url) => ({
            path: url,
            element: <></>,
          })),
        ],
      },
    ],
  },
  {
    element: <TopStaffLayout />,
    children: [
      {
        element: <SideStaffLayout />,
        children: [
          {
            path: "/staff-top",
            element: <StaffTop />,
          },
          {
            path: "/staff-rules",
            element: <StaffRules />,
          },
          {
            path: "/staff-ship",
            element: <StaffShip />,
          },
          {
            path: "/staff-pet",
            element: <StaffPet />,
          },
        ],
      },
    ],
  },
  {
    element: <TopClientLayout />,
    children: [
      {
        element: <SideClientLayout />,
        children: [
          {
            path: "/client-top",
            element: <ClientTop />,
          },
          {
            path: "/client-rules",
            element: <ClientRules />,
          },
          {
            path: "/client-offer",
            element: <ClientOffer />,
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <Err404 />,
  },
]);

export default router;
