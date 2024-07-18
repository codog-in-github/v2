import { RouterProvider } from "react-router-dom";
import router from "@/router/index.jsx";
import { message } from "antd";
import { useEffect } from "react";
import pubSub from "@/helpers/pubSub";
import { Provider } from "react-redux";
import store from "@/store";

const useGlobalMessage = () => {
  const [messageApi, contextHolder] = message.useMessage();
  useEffect(() => {
    const showError = (err) => {
      messageApi.error(err.data.message);
    };
    const showText = (text) => {
      messageApi.info(text);
    };
    pubSub.subscribe("Error:HTTP.State", showError);
    pubSub.subscribe("Error:API.Code", showError);
    pubSub.subscribe("Info:Message.*", showText); // TODO 还没实现通配符 预留
    return () => {
      pubSub.unsubscribe("Error:HTTP.State", showError);
      pubSub.unsubscribe("Error:API.Code", showError);
      pubSub.unsubscribe("Info:Message.*", showText);
    };
  }, [messageApi]);
  return contextHolder;
};

const useAuthorizedCheck = () => {
  useEffect(() => {
    const logout = () => {
      localStorage.removeItem('token')
      router.navigate('/')
    }
    pubSub.subscribe('Error:HTTP.Unauthorized', logout)
    return () => {
      pubSub.unsubscribe('Error:HTTP.Unauthorized', logout)
    }
  }, [])
}


export default function App() {
  const msgElement = useGlobalMessage();
  useAuthorizedCheck()
  return (
    <Provider store={store}>
      {msgElement}
      <RouterProvider router={router}></RouterProvider>
    </Provider>
  );
}
