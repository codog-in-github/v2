import {redirectUrl, routeGuarder} from "@/router/common.jsx";
import store from "@/store/index.js";
import {USER_ROLE_ADMIN, USER_ROLE_BOOS, USER_ROLE_CUSTOMS} from "@/constant/index.js";
import {DeclarantLayout} from "@/components/DeclarantLayout.jsx";
import LazyPage from "@/components/LazyPage.jsx";

export default routeGuarder((_, next) => {
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
])