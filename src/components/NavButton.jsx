import { useAnimate } from '@/hooks';
import anime from 'animejs';
import classnames from 'classnames';
import { useRef } from 'react';
import { useHref } from 'react-router-dom';
import { NavLink } from 'react-router-dom';

export function NavButton(props) {
  const staticClass = [
    'nav-button',
    'relative'
  ]
  return (
    <NavLink
      to={props.to}
      className={({isActive}) => classnames(staticClass, { active: isActive })}
    >
      <div className={classnames('nav-button-bg', props.bgClass)}></div>
      <div className='nav-button-text'>{props.children}</div>
    </NavLink>
  );
}

export function NavButtonGroup(props) {
  const classes = [
    'nav-button-group flex',
    {
      'rect': props.rect,
      'align-left': props.align === 'left'
    }
  ]
  const boxRef = useRef(null)
  useAnimate((last) => {
    const bgDom = boxRef.current.querySelector('.active .nav-button-bg')
    if(bgDom) {
      const rect = bgDom.getBoundingClientRect()
      if(last) {
        anime({
          targets: bgDom,
          translateX: [last.left - rect.left, 0],
          translateY: [last.top - rect.top, 0],
          duration: 200,
          easing: 'easeInOutQuad',
        })
      }
      return {
        left: rect.left,
        top: rect.top
      }
    }
    return null
  }, [useHref()])
  const className = classnames(
    classes,
    props.className
  )
  return (
    <div ref={boxRef} className={className}>
      {props.children}
    </div>
  );
}

