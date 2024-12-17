import {useRef, useState} from "react";
import {useAnimate} from "@/hooks/index.js";
import animate from 'animejs'
import {pipeExec} from "@/helpers/index.js";

const NumberTransition = ({
  children = 0,
  duration = 0,
  format = val => val,
  animateProps,
  ...props
}) => {
  const [showNumber, setShowNumber] = useState(children)
  const animateNumber = useRef(showNumber);

  useAnimate(last => {
    if(last !== null && last !== children) {
      animate({
        targets: animateNumber,
        current: children,
        easing: 'linear',
        duration,
        ...animateProps,
        update: () => {
          pipeExec(animateNumber.current, format, setShowNumber)
        }
      })
    }
  }, [children])

  return (
    <span {...props}>{showNumber}</span>
  )
}

export default NumberTransition;
