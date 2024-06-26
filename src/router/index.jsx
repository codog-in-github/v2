import { createBrowserRouter } from "react-router-dom";
import Login from "@/pages/Login.jsx";
import Err404 from "@/pages/Err/404.jsx";
import NavLayout from "@/components/NavLayout";
import Top from "@/pages/top/Index";

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
        element: <></>
      },
      {
        path: '/drive',
        element: <></>
      },
      {
        path: '/acl',
        element: <></>
      }
    ]
  },
  {
    path: "*",
    element: <Err404 />,
  },
])

export default router;