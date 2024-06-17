import { createBrowserRouter } from "react-router-dom";
import Login from "pages/Login.jsx";
import Err404 from "pages/Err/404.jsx";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    element: <Login />,
    children: [
      {
        path: '/dashboard',
        element: <Login />
      }
    ]
  },
  {
    path: "*",
    element: <Err404 />,
  },
])

export default router;