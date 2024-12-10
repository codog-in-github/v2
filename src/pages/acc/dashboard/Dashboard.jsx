import OrderTotal from "./OrderTotal.jsx";
import classNames from "classnames";
import OrderCharts from "@/pages/acc/dashboard/OrderCharts.jsx";
import MessageList from "@/components/MessageList.jsx";

const Card = ({
  className,
  children,
  title,
  ...props
}) => {
  return (
    <div
      className={
        classNames(className, 'p-6 bg-white rounded-lg flex flex-col h-full')
      }
      {...props}
    >
      <div className={'text-#454C60 font-bold'}>{title}</div>
      <div className={'flex-1'}>{children}</div>
    </div>
  )
}

const Dashboard = () => {
  return (
    <div className={'no-padding h-full overflow-auto flex shadow-lg'}>
      <div
        className={'flex-1 h-full overflow-auto flex flex-col gap-4'}
        style={{ padding: 20 }}
      >
        <div className={'flex gap-4 flex-1'}>
          <Card title={'数据名称'} className={'w-[480px]'}>
            <OrderTotal/>
          </Card>
          <Card title={'数据名称'} className={'flex-1'}>
            {/* todo */}
          </Card>
        </div>
        <div className={'flex gap-4 flex-1'}>
          <Card title={'案件统计图'} className={'flex-1'}>
            <OrderCharts/>
          </Card>
          <Card title={'数据名称'} className={'flex-1'}>
            {/* todo */}
          </Card>
        </div>
      </div>

      <div
        className={'bg-white p-4 h-full overflow-hidden flex flex-col'}
        style={{ width: 360 }}
      >
        <MessageList />
      </div>
    </div>
  )
}

export default Dashboard
