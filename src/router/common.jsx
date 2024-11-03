import {USER_ROLE_ACC, USER_ROLE_CUSTOMS} from "@/constant/index.js";
import LazyPage from "@/components/LazyPage.jsx";
import {Outlet} from "react-router-dom";

export const redirectUrl = (roleId) => {
  switch (roleId) {
    case USER_ROLE_CUSTOMS:
      return '/declarant'
    case USER_ROLE_ACC:
      return '/acc/todo'
    default:
      return
  }
}

export const routeGuarder = (guarder, children) => {
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