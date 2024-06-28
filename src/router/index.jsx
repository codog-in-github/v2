import { createBrowserRouter } from "react-router-dom";
import Login from "@/pages/Login.jsx";
import Err404 from "@/pages/Err/404.jsx";
import NavLayout from "@/components/NavLayout";
import Top from "@/pages/top/Index";
import Po from "@/pages/po/Index";
// 还没写的页面 占个位先
const placeholderUrls = [
  '/drive',
  '/customs',
  '/acl',
  '/permission',
  '/invoice',
  '/customer',
  '/order',
  '/calendar',
  '/ship',
]
const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    element: <NavLayout />,
    children: [
      {
        path: '/top',
        element: <Top />
      },
      {
        path: '/po',
        element: <Po />
      },
      ...placeholderUrls.map(url => ({
        path: url,
        element: <></>
      }))
    ]
  },
  {
    path: "*",
    element: <Err404 />,
  },
])

export default router;