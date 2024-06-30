import { useEffect, useRef } from 'react';
import { useState } from 'react';

function CompanyAvatar (props) {
  return <div
    className='flex-shrink-0 flex rounded text-white justify-center items-center w-12 h-12 text-lg'
    style={{
      backgroundColor: props.bg
    }}
  >{props.children}</div>
}

function getTimeDistant(start, end) {
  start = Math.floor(start.valueOf() / 1000)
  end = Math.floor(end.valueOf() / 1000)
  const dist = end - start
  return [
    Math.floor(dist / 3600),
    Math.floor(dist / 60) % 60,
    dist % 60
  ].map(item => item.toString().padStart(2, '0'))
}

function Timer(props) {
  const [display, setDisplay] = useState(
    getTimeDistant(new Date(), new Date(props.end))
  )
  useEffect(() => {
    let timerId = setInterval(() => {
      if(props.end < new Date()) {
        clearInterval(timerId)
      }
      setDisplay(
        getTimeDistant(new Date(), new Date(props.end))
      )
    }, 1000);
    return () => {
      clearInterval(timerId)
    }
  }, [props.end])
  return (
    <div className='bg-blue-100 rounded flex items-center px-4 py-1 text-blue-500'>
      <div className='text-sm'>残時間：</div>
      <div className='ml-2 bg-blue-400 px-0.5 rounded text-white'>{display[0]}</div>
      <div className='mx-1'>:</div>
      <div className='bg-blue-400 px-0.5 rounded text-white'>{display[1]}</div>
      <div className='mx-1'>:</div>
      <div className='bg-blue-400 px-0.5 rounded text-white'>{display[2]}</div>
    </div>
  )
}

function Card({ end }) {
  const cardRef = useRef(null);
  return (
    <div ref={cardRef} className="top-card bg-white p-4 shadow rounded flex-shrink-0 flex flex-col">
      <div className='flex flex-1'>
        <CompanyAvatar bg={end ? '#8f8f8f' : '#426cf6'}>無</CompanyAvatar>
        <div className='ml-4'>
          <div className="font-semibold">無錫永興貨運有限公司</div>
          <div className="mt-2 text-sm text-gray-500">宋琴 | 86-15240056982</div>
        </div>
      </div>
      {
        end ? <div className='flex items-center text-sm'>
          <div className='text-gray-800'>2024年6月3日18:00:58</div>
          <div className='ml-auto p-2 bg-gray-200 rounded'>吉田</div>
        </div>
          : <Timer end={new Date(Date.now() + 3600000)}></Timer>
      }
    </div>
  );
}

export default Card;