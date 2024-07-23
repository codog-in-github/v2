import { useEffect, useRef } from 'react';
import { useState } from 'react';
import classNames from 'classnames';
import { namespaceClass } from '@/helpers/style';
import CompanyAvatar from '@/components/CompanyAvatar';
import { Button } from 'antd';

const c = namespaceClass('top-card');

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
  useEffect(() => {
    let timerId = setInterval(() => {
      if( expiredAt  < new Date()) {
        clearInterval(timerId)
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
    <div className='bg-[#d8eaff] h-[40px] rounded flex items-center px-4 py-1 text-primarbg-primary-500'>
      <div className='text-sm text-[#426CF6]'>残時間：</div>
      <div className='ml-2 bg-primary-400 px-0.5 rounded text-white'>{display[0]}</div>
      <div className='mx-1'>:</div>
      <div className='bg-primary-400 px-0.5 rounded text-white'>{display[1]}</div>
      <div className='mx-1'>:</div>
      <div className='bg-primary-400 px-0.5 rounded text-white'>{display[2]}</div>
    </div>
  )
}

function Card({
  className,
  isTempOrder,
  remark,
  end,
  active,
  avatarText,
  avatarColor,
  companyName,
  contactPerson,
  contactPhone,
  expiredAt,
  onClick
}) {
  const [optionsButtonPosition, setOptionsButtonPosition] = useState({ x: 0, y: 0 })
  const rootRef = useRef()
  let content;
  if(isTempOrder) {
    content = (
      <div className='flex flex-1'>
        <CompanyAvatar className="!text-[10px]" bg="#D46DE0" text="REMARK"></CompanyAvatar>
        <div className='ml-4'>
          <div className="font-semibold">{remark}</div>
        </div>
      </div>
    )
  } else {
    content = (
      <div className='flex flex-1'>
        <CompanyAvatar bg={avatarColor} text={avatarText}></CompanyAvatar>
        <div className='ml-4'>
          <div className="font-semibold">{companyName}</div>
          <div className="mt-2 text-sm text-gray-500">{contactPerson} | {contactPhone}</div>
        </div>
      </div>
    )
  }
  return (
    <div
      ref={rootRef}
      className={classNames(
        'bg-white p-4 shadow rounded flex-shrink-0 flex flex-col relative',
        active && 'border-2 border-primary',
        className,
      )}
      onClick={isTempOrder && !active && (
        e => {
          const box = rootRef.current.getBoundingClientRect()
          setOptionsButtonPosition({
            x: box.x + box.width,
            y: box.y
          })
          onClick && onClick(e)
        }
      )}
    >
      {content}
      {
        end ? <div className='flex items-center text-sm'>
          <div className='text-gray-800'>2024年6月3日18:00:58</div>
          <div className='ml-auto p-2 bg-gray-200 rounded'>吉田</div>
        </div>
          : <Timer expiredAt={expiredAt}></Timer>
      }
      {active && (
        <div
          onClick={e => e.stopPropagation()}
          className='fixed top-0 -right-24 w-24 z-50'
          style={{ left: optionsButtonPosition.x, top: optionsButtonPosition.y }}
        >
          <Button
            className='w-full'
          >结束任务</Button>
          <Button
            type='primary'
            className='w-full mt-1'
          >指派任务</Button>
        </div>
      )}
    </div>
  );
}

export default Card;