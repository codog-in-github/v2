import { createBrowserRouter } from "react-router-dom";
import Login from "@/pages/Login.jsx";
import Err404 from "@/pages/Err/404.jsx";
import NavLayout from "@/components/NavLayout";
import MainContent from "@/components/MainContent";

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
        element: <MainContent />
      }
    ]
  },
  {
    path: "*",
    element: <Err404 />,
  },
])

export default router;