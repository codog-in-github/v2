import { createBrowserRouter, Outlet } from "react-router-dom";
import Login from "@/pages/Login.jsx";
import Err404 from "@/pages/Err/404.jsx";
import { SideLayout, TopLayout } from "@/components/NavLayout";
import CustomerLayout from "@/components/CustomerLayout";
import { SideClientLayout, TopClientLayout } from "@/components/ClientLayout";
import { DeclarantLayout } from "@/components/DeclarantLayout";
import LazyPage from "@/components/LazyPage";
import pubSub from "@/helpers/pubSub";
import { request } from "@/apis/requestBuilder";
import store from "@/store";
import { setUserInfo } from "@/store/slices/user"
import { USER_ROLE_ACC, USER_ROLE_ADMIN, USER_ROLE_BOOS, USER_ROLE_CUSTOMS, USER_ROLE_NORMAL } from "@/constant";
import AccLayout from "@/components/AccLayout";


pubSub.subscribe('Error:HTTP.Unauthorized', () => {
  localStorage.removeItem('token')
  router.navigate('/')
})

const redirectUrl = (roleId) => {
  switch (roleId) {
    case USER_ROLE_CUSTOMS:
      return '/declarant'
    case USER_ROLE_ACC:
      return '/acc/todo'
    default:
      return
  }
}

const routeGuarder = (guarder, children) => {
  return {
    element: (
      <LazyPage
        load={() => Promise.resolve({ default: () => <Outlet /> })}
        beforeLoad={guarder}
      />
    ),
    children,
  }
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  routeGuarder(async (_, next) => {
    const rep = await request('/admin/user/me').get().send()
    store.dispatch(setUserInfo({
      name: rep.name,
      role: rep.role_id,
    }))
    next()
  }, [
    routeGuarder((_, next) => {
      const role = store.getState().user.userInfo.role
      if([USER_ROLE_ADMIN, USER_ROLE_BOOS, USER_ROLE_NORMAL, USER_ROLE_ACC].includes(role)) {
        next()
      } else {
        next(redirectUrl(role))
      }
    }, [
      {
        path: "/rb/add/:orderId/type/:type",
        element: <LazyPage load={() => import('@/pages/orderDetail/requestBook/EditForm.jsx')} />,
      },
      {
        path: "/rb/edit/:id/order/:orderId/type/:type",
        element: <LazyPage load={() => import('@/pages/orderDetail/requestBook/EditForm.jsx')} />,
      },
      {
        path: "/rb/copy/:copyId/order/:orderId/type/:type",
        element: <LazyPage load={() => import('@/pages/orderDetail/requestBook/EditForm.jsx')} />,
      },
      {
        path: "/rb/void/:voidFrom/order/:orderId/type/:type",
        element: <LazyPage load={() => import('@/pages/orderDetail/requestBook/EditForm.jsx')} />,
      },
      routeGuarder((_, next) => {
        const role = store.getState().user.userInfo.role
        if([USER_ROLE_ADMIN, USER_ROLE_BOOS, USER_ROLE_NORMAL].includes(role)) {
          next()
        } else {
          next(redirectUrl(role))
        }
      }, [
      {
        element: <TopLayout />,
        children: [
          {
            path: "/orderDetail/:id",
            element: <LazyPage load={() => import('@/pages/orderDetail/Index.jsx')} />,
          },
          {
            path: "/orderDetail/copy/:copyId",
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
                path: "/rbl",
                element: <LazyPage load={() => import('@/pages/tabs/RequestBookList')} />,
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
                path: "/partner",
                element: <LazyPage load={() => import('@/pages/sys/partnerList')} />,
              }
            ],
          },
        ],
      },
      ]),
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
    ]),
    //报关员端
    routeGuarder((_, next) => {
      const role = store.getState().user.userInfo.role
      if([USER_ROLE_ADMIN, USER_ROLE_BOOS, USER_ROLE_CUSTOMS].includes(role)) {
        next()
      } else {
        next(redirectUrl(role))
      }
    }, [
      {
        element: <DeclarantLayout />,
        children: [
          {
            path: "/declarant",
            element: <LazyPage load={() => import('@/pages/declarant/list')} />,
          },{
            path: "/declarant/detail/:id",
            element: <LazyPage load={() => import('@/pages/declarant/detail')} />,
          },
        ],
      },
    ]),
    //会计端
    routeGuarder((_, next) => {
      const role = store.getState().user.userInfo.role
      if([USER_ROLE_ADMIN, USER_ROLE_BOOS, USER_ROLE_ACC].includes(role)) {
        next()
      } else {
        next(redirectUrl(role))
      }
    }, [
      {
        element: <AccLayout />,
        children: [
          {
            path: "/acc/todo",
            element: <LazyPage load={() => import('@/pages/acc/todo/Todo.jsx')} />,
          },{
            path: "/acc/dashboard",
            element: <LazyPage load={() => import('@/pages/acc/dashboard/Dashboard.jsx')} />,
          },{
            path: "/acc/reqNotice",
            element: <LazyPage load={() => import('@/pages/acc/reqNotice/index.jsx')} />,
          },{
            path: "/acc/reqDoneNotice",
            element: <LazyPage load={() => import('@/pages/acc/reqDoneNotice/index.jsx')} />,
          },
        ],
      },
    ])
  ]),
  {
    path: "*",
    element: <Err404 />,
  },
]);

export default router;
