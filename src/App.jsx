import { RouterProvider } from "react-router-dom";
import router from "@/router/index.jsx";
import { message } from "antd";
import { useEffect } from "react";
import pubSub from "@/helpers/pubSub";
import { Provider } from "react-redux";
import store from "@/store";
import { isObject } from "lodash";

const useGlobalMessage = () => {
  const [messageApi, contextHolder] = message.useMessage();
  useEffect(() => {
    /**
     * @param {import('axios').AxiosResponse} err
     */
    const showApiError = (err) => {
      let errMsg
      if(isObject(err.data) && err.data.message) {
        errMsg = err.data.message
      } else {
        errMsg = `${err.status}: ${err.statusText}`
      }
      showErrorToast(new Error(errMsg))
    };
    /**
     * @param {Error} err
     */
    const showErrorToast = (err) => {
      messageApi.error(err.message);
    };
    const showToast = (msg, type = "info") => {
      messageApi[type](msg);
    };
    const makeNotification = (rep) => {
      console.log(rep)
    }

    pubSub.subscribe("Error:HTTP.State", showApiError);
    pubSub.subscribe("Error:API.Code", showApiError);
    pubSub.subscribe("Info.Toast.Error", showErrorToast)
    pubSub.subscribe("Info.Toast", showToast)
    pubSub.subscribe("Info.Notification.Received", makeNotification)

    return () => {
      pubSub.unsubscribe("Error:HTTP.State", showApiError);
      pubSub.unsubscribe("Error:API.Code", showApiError);
      pubSub.unsubscribe("Info.Toast.Error", showErrorToast);
      pubSub.unsubscribe("Info.Toast", showToast);
      pubSub.unsubscribe("Info.Notification.Received", makeNotification);
    };
  }, [messageApi]);
  return contextHolder;
};


export default function App() {
  const msgElement = useGlobalMessage();
  return (
    <Provider store={store}>
      {msgElement}
      <RouterProvider router={router}></RouterProvider>
    </Provider>
  );
}
