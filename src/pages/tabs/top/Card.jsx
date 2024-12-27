import { useEffect } from 'react';
import { useState } from 'react';
import classNames from 'classnames';
import CompanyAvatar from '@/components/CompanyAvatar';
import { themeColor } from '@/helpers/color';
import dayjs from 'dayjs';
import TopBadge from '@/components/TopBadge';

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
function Timer({ expiredAt  = dayjs() }) {
  const [display, setDisplay] = useState(
    getTimeDistant(new Date(), expiredAt.toDate())
  )
  const [color, setColor] = useState(expiredAt.diff(new Date(), 'minutes') < 20 ? 'danger' : 'primary')
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
  orderInfo = {},
  onToDetail,
  className,
  end,
  ...props
}) {
  return (
    <div
      className={classNames(
        'bg-white p-4 shadow rounded border-2 flex-shrink-0 flex flex-col relative hover:border-primary overflow-hidden',
        { 'cursor-pointer': orderInfo.isTempOrder },
        className,
      )}
      onClick={() => onToDetail(orderInfo.id)}
      {...props}
    >
      { orderInfo.top && <TopBadge>{orderInfo.topName}</TopBadge> }
      { orderInfo.isTempOrder ? (
        <div className='flex flex-1'>
          <CompanyAvatar
            className="!text-[10px] flex-shrink-0"
            bg="#D46DE0"
            text="REMARK"
          />
          <div className='ml-4'>
            <div className="font-semibold line-clamp-3">{orderInfo.remark}</div>
          </div>
        </div>
      ) : (
        <div className='flex flex-1'>
          <CompanyAvatar className={'flex-shrink-0'} text={orderInfo.avatarText}></CompanyAvatar>
          <div className='ml-4'>
            <div className="font-semibold">{orderInfo.companyName}</div>
            <div className="mt-2 text-sm text-gray-500">BKG No. {orderInfo.bkgNo}</div>
          </div>
        </div>
      )}

      { end ? (
        <div className='flex items-center text-sm'>
          <div className='text-gray-800'>{end.time}</div>
          <div className='ml-auto p-2 bg-gray-200 rounded'>{end.name}</div>
        </div>
      ) : (
        <Timer expiredAt={orderInfo.expiredAt}></Timer>
      )}
    </div>
  );
}

export default Card;
