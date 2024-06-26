import { useAnimate } from '@/hooks';
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
  const boxRef = useRef(null)
  useAnimate((last) => {
    const bgDom = boxRef.current.querySelector('.active .nav-button-bg')
    if(bgDom) {
      const rect = bgDom.getBoundingClientRect()
      if(last) {
        bgDom.animate([
          {
            transform: `translate(${last.left - rect.left}px, ${last.top - rect.top}px)`,
          },
          {}
        ], {
          duration: 200,
          easing: 'ease-in-out'
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
    'nav-button-group flex',
    props.className
  )
  return (
    <div ref={boxRef} className={className}>
      {props.children}
    </div>
  );
}

