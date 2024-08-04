import { createBrowserRouter, Outlet } from "react-router-dom";
import Login from "@/pages/Login.jsx";
import Err404 from "@/pages/Err/404.jsx";
import { SideLayout, TopLayout } from "@/components/NavLayout";
import CustomerLayout from "@/components/CustomerLayout";
import { SideClientLayout, TopClientLayout } from "@/components/ClientLayout";
import { DeclarantLayout } from "@/components/DeclarantLayout";
import LazyPage from "@/components/LazyPage";
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
    element: <LazyPage
      load={() =>  Promise.resolve({ default: () => <Outlet /> })}
      beforeLoad={routeGuarder}
    />,
    children: [
      {
        path: "/rb",
        element: <LazyPage load={() => import('@/pages/orderDetail/requestBook/EditForm.jsx')} />,
      },
      {
        element: <TopLayout />,
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
                element: <LazyPage load={() => import('@/pages/tabs/top/Index')} />,
              },
              {
                path: "/ct/:tab",
                element: <LazyPage load={() => import('@/pages/tabs/ContainerList')} />,
              },
              {
                path: "/od/:tab",
                element: <LazyPage load={() => import('@/pages/tabs/OrderList')} />,
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
        element: <CustomerLayout />,
        children: [
          {
            path: "/customer/:id/top",
            element: <LazyPage load={() => import('@/pages/customer/top')} />,
          },
          {
            path: "/customer/:id/rules",
            element: <LazyPage load={() => import('@/pages/customer/rules')} />,
          },
          {
            path: "/customer/:id/ship",
            element: <LazyPage load={() => import('@/pages/customer/ship')} />,
          },
          {
            path: "/customer/:id/pet",
            element: <LazyPage load={() => import('@/pages/customer/petition')} />,
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
      
    ]
  },
  {
    path: "*",
    element: <Err404 />,
  },
]);

export default router;
