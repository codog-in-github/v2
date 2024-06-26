import { useEffect, useRef } from 'react';
import anime from 'animejs';

function Card() {
  const cardRef = useRef(null);

  useEffect(() => {
    anime({
      targets: cardRef.current,
      translateY: [50, 0],
      opacity: [0, 1],
      duration: 800,
      easing: 'easeOutExpo',
    });
  }, []);

  return (
    <div ref={cardRef} className="bg-white p-4 shadow rounded">
      <div className="font-semibold">無錫永興貨運有限公司</div>
      <div className="text-sm text-gray-500">宋琴 | 86-15240056982</div>
      <div className="mt-2">残り時間: 40:10:05</div>
    </div>
  );
}

export default Card;