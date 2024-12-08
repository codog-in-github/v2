import Pusher from "pusher-js";
import LaravelEcho from "laravel-echo";
import icon from '@/assets/images/icons/chz_logo.webp'

window.Pusher = Pusher

Notification.requestPermission()

const Echo = new LaravelEcho({
  broadcaster: 'pusher',
  wsHost: window.location.host,
  key: 'harumigumi',
  wsPort: 6001,
  forceTLS: false,
  disableStats: true,
  cluster: 'mt1'
})

/**
 * 创建系统通知
 * @param {string} message
 * @param {string} title
 * @returns {Notification}
 */
export const makeSystemNotification = (message, title = '提示') => {
  return new Notification(title, {
    body: message,
    icon: icon,
    silent: false
  })
}

export default Echo
