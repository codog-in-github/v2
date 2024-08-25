import { useEffect } from 'react';
import { useState } from 'react';
import classNames from 'classnames';
import CompanyAvatar from '@/components/CompanyAvatar';
import { themeColor } from '@/helpers/color';

/**
 * 
 * @param {Date} start 
 * @param {Date} end 
 * @returns 
 */
function getTimeDistant(start, end) {
  start = Math.floor(start.valueOf() / 1000)
  end = Math.floor(end.valueOf() / 1000)
  const dist = end - start
  if(dist <= 0) {
    return ['00', '00', '00']
  }
  return [
    Math.floor(dist / 3600),
    Math.floor(dist / 60) % 60,
    dist % 60
  ].map(item => item.toString().padStart(2, '0'))
}
/**
 * @param {Object} param0
 * @param {import('dayjs').Dayjs} param0.expiredAt 
 * @returns 
 */
function Timer({ expiredAt }) {
  const [display, setDisplay] = useState(
    getTimeDistant(new Date(), expiredAt.toDate())
  )
  const [color, setColor] = useState('primary')
  useEffect(() => {
    const timerId = setInterval(() => {
      if( expiredAt.toDate()  < new Date()) {
        clearInterval(timerId)
      }
      if(expiredAt.diff(new Date(), 'minutes') < 20) {
        setColor('danger')
      }
      setDisplay(
        getTimeDistant(new Date(), expiredAt.toDate() )
      )
    }, 1000);
    return () => {
      clearInterval(timerId)
    }
  }, [ expiredAt ])
  return (
    <div className='h-[40px] rounded flex items-center px-4 py-1' style={{ backgroundColor: themeColor(color, 95) }}>
      <div className='text-sm' style={{ color: themeColor(color, 60)}}>残時間：</div>
      <div
        className='ml-2 px-0.5 rounded text-white'
        style={{
          backgroundColor: themeColor(color, 60)
        }}
      >{display[0]}</div>
      <div className='mx-1'>:</div>
      <div className='px-0.5 rounded text-white' style={{ backgroundColor: themeColor(color, 60) }}>{display[1]}</div>
      <div className='mx-1'>:</div>
      <div className='px-0.5 rounded text-white' style={{ backgroundColor: themeColor(color, 60) }}>{display[2]}</div>
    </div>
  )
}

function Card({
  jobInfo = {},
  onToDetail,
  className,
  ...props
}) {
  return (
    <div
      className={classNames(
        'bg-white p-4 shadow-lg shadow-gray-50 rounded border-2 flex-shrink-0 flex flex-col relative hover:border-primary overflow-hidden',
        className,
      )}
      onClick={() => onToDetail(jobInfo.id)}
      {...props}
    >
      
      <div className='flex flex-1'>
        <CompanyAvatar  bg={jobInfo.color} text={jobInfo.customer_company_name[0]}></CompanyAvatar>
        <div className='ml-4'>
          <div className='font-semibold'><span className='text-xs'>￥</span>{Number(jobInfo.amount).toFixed(2)}</div>
          <div className="text-sm">{jobInfo.customer_company_name}</div>
        </div>
      </div>

      <div className='flex my-2 items-center text-sm text-gray-600'>
        <div className='flex-1 w-1/2'>{jobInfo.order.bkg_no}</div>
        <div className='h-4 border-l border-gray-300'></div>
        <div className='flex-1 w-1/2 text-right'>{jobInfo.order.order_no}</div>
      </div>

      <Timer expiredAt={jobInfo.expired_at}></Timer>
    </div>
  );
}

export default Card;