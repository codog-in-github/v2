import OrderTotal from "./OrderTotal.jsx";
import classNames from "classnames";

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
    <div className={'h-full overflow-auto flex flex-col gap-4'}>
      <div className={'flex gap-4 flex-1'}>
        <Card title={'数据名称'} className={'w-[480px]'}>
          <OrderTotal />
        </Card>
        <Card title={'数据名称'} className={'flex-1'}>
          {/* todo */}
        </Card>
      </div>
      <div className={'flex gap-4 flex-1'}>
        <Card title={'数据名称'} className={'flex-1'}>
          {/* todo */}
        </Card>
        <Card title={'数据名称'} className={'flex-1'}>
          {/* todo */}
        </Card>
      </div>
    </div>
  )
}

export default Dashboard
