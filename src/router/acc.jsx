/**
 * 会计端
 */
import store from "@/store/index.js";
import {USER_ROLE_ACC, USER_ROLE_ADMIN, USER_ROLE_BOOS} from "@/constant/index.js";
import AccLayout from "@/components/AccLayout/index.js";
import LazyPage from "@/components/LazyPage.jsx";
import { redirectUrl, routeGuarder } from "@/router/common.jsx";

// eslint-disable-next-line react-refresh/only-export-components
export default routeGuarder((_, next) => {
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
      },{
        path: "/acc/requestbook",
        element: <LazyPage load={() => import('@/pages/acc/requestbook/list.jsx')} />,
      },{
        path: "/acc/payCheck",
        element: <LazyPage load={() => import('@/pages/acc/payCheck/list.jsx')} />,
      },{
        path: "/acc/requestMulti",
        element: <LazyPage load={() => import('@/pages/acc/requestMulti/list.jsx')} />,
      },{
        path: "/acc/payCheckReadOnly",
        element: <LazyPage load={() => import('@/pages/acc/payCheck/readOnlyList.jsx')} />,
      }
    ],
  },
])
