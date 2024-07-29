import { createBrowserRouter } from "react-router-dom";
import Login from "@/pages/Login.jsx";
import Err404 from "@/pages/Err/404.jsx";
import { SideLayout, TopLayout } from "@/components/NavLayout";
import { SideStaffLayout, TopStaffLayout } from "@/components/StaffLayout";
import { SideClientLayout, TopClientLayout } from "@/components/ClientLayout";
import { DeclarantLayout } from "@/components/DeclarantLayout";
import LazyPage from "../components/LazyPage";
import pubSub from "@/helpers/pubSub";
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
  // console.log(routeState);
  return next();
};

pubSub.subscribe('Error:HTTP.Unauthorized', () => {
  localStorage.removeItem('token')
  router.navigate('/')
})

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/rb",
    element: <LazyPage load={() => import('@/pages/orderDetail/requestBook/EditForm.jsx')} />,
  },
  {
    element: (
      <LazyPage
        load={() => Promise.resolve({ default: TopLayout })}
        beforeLoad={routeGuarder}
      />
    ),
    children: [
      {
        path: "/orderDetail/:id",
        element: <LazyPage load={() => import('@/pages/orderDetail/Index.jsx')} />,
      },
      {
        element: <SideLayout />,
        children: [
          {
            path: "/top",
            element: <LazyPage load={() => import('@/pages/top/Index')} />,
          },
          {
            path: "/po",
            element: <LazyPage load={() => import('@/pages/po/Index')} />,
          },
          {
            path: "/customer-list",
            element: <LazyPage load={() => import('@/pages/customer/list')} />,
          },
          {
            path: "/order",
            element: <LazyPage load={() => import('@/pages/order/list')} />,
          },
          {
            path: "/calendar",
            element: <LazyPage load={() => import('@/pages/order/calendar')} />,
          },
          {
            path: "/ship",
            element: <LazyPage load={() => import('@/pages/ship/list')} />,
          },
          {
            path: "/petition",
            element: <LazyPage load={() => import('@/pages/petition/list')} />,
          },
          {
            path: '/acl',
            element: <LazyPage load={() => import('@/pages/acl/index.jsx')} beforeLoad={routeGuarder} />,
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
            path: "/customer-top",
            element: <LazyPage load={() => import('@/pages/customer/top')} />,
          },
          {
            path: "/customer-rules",
            element: <LazyPage load={() => import('@/pages/customer/rules')} />,
          },
          {
            path: "/customer-ship",
            element: <LazyPage load={() => import('@/pages/customer/ship')} />,
          },
          {
            path: "/customer-pet",
            element: <LazyPage load={() => import('@/pages/customer/petition')} />,
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
            element: <LazyPage load={() => import('@/pages/client/top')} />,
          },
          {
            path: "/client-rules",
            element: <LazyPage load={() => import('@/pages/client/rules')} />,
          },
          {
            path: "/client-offer",
            element: <LazyPage load={() => import('@/pages/client/offer')} />,
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
        element: <LazyPage load={() => import('@/pages/declarant/list')} />,
      },
    ],
  },
  {
    path: "*",
    element: <Err404 />,
  },
]);

export default router;
