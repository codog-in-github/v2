import { createBrowserRouter } from "react-router-dom";
import Login from "@/pages/Login.jsx";
import Err404 from "@/pages/Err/404.jsx";
import { SideLayout, TopLayout } from "@/components/NavLayout";
import { SideStaffLayout, TopStaffLayout } from "@/components/StaffLayout";
import { SideClientLayout, TopClientLayout } from "@/components/ClientLayout";
import { DeclarantLayout } from "@/components/DeclarantLayout";
import RouterPage from "./RouterPage";
// 还没写的页面 占个位先
const placeholderUrls = [
  "/drive",
  "/customs",
  "/permission",
  "/invoice",
  "/blCopy",
  "/sur",
];

const routeGuarder = (routeState, next) => {
  console.log(routeState);
  return next();
};

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
        element: <RouterPage load={() => import('@/pages/orderDetail/Index.jsx')} />,
      },
      {
        element: <SideLayout />,
        children: [
          {
            path: "/top",
            element: <RouterPage load={() => import('@/pages/top/Index')} />,
          },
          {
            path: "/po",
            element: <RouterPage load={() => import('@/pages/po/Index')} />,
          },
          {
            path: "/customer",
            element: <RouterPage load={() => import('@/pages/customer/list')} />,
          },
          {
            path: "/order",
            element: <RouterPage load={() => import('@/pages/order/list')} />,
          },
          {
            path: "/calendar",
            element: <RouterPage load={() => import('@/pages/order/calendar')} />,
          },
          {
            path: "/ship",
            element: <RouterPage load={() => import('@/pages/ship/list')} />,
          },
          {
            path: "/petition",
            element: <RouterPage load={() => import('@/pages/petition/list')} />,
          },
          {
            path: '/acl',
            element: <RouterPage load={() => import('@/pages/acl/index.jsx')} beforeLoad={routeGuarder} />,
          },
          ...placeholderUrls.map((url) => ({
            path: url,
            element: <></>,
          })),
        ],
      },
    ],
  },
  //员工端
  {
    element: <TopStaffLayout />,
    children: [
      {
         element: <SideStaffLayout />,
        children: [
          {
            path: "/staff-top",
            element: <RouterPage load={() => import('@/pages/staff/top')} />,
          },
          {
            path: "/staff-rules",
            element: <RouterPage load={() => import('@/pages/staff/rules')} />,
          },
          {
            path: "/staff-ship",
            element: <RouterPage load={() => import('@/pages/staff/ship')} />,
          },
          {
            path: "/staff-pet",
            element: <RouterPage load={() => import('@/pages/staff/petition')} />,
          },
        ],
      },
    ],
  },
  //客户端
  {
    element: <TopClientLayout />,
    children: [
      {
        element: <SideClientLayout />,
        children: [
          {
            path: "/client-top",
            element: <RouterPage load={() => import('@/pages/client/top')} />,
          },
          {
            path: "/client-rules",
            element: <RouterPage load={() => import('@/pages/client/rules')} />,
          },
          {
            path: "/client-offer",
            element: <RouterPage load={() => import('@/pages/client/offer')} />,
          },
        ],
      },
    ],
  },
  //报关员端
  {
    element: <DeclarantLayout />,
    children: [
      {
        path: "/declarant",
        element: <RouterPage load={() => import('@/pages/declarant/list')} />,
      },
    ],
  },
  {
    path: "*",
    element: <Err404 />,
  },
]);

export default router;
