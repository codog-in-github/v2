import { useAnimate } from '@/hooks';
import anime from 'animejs';
import classNames from 'classnames';
import { useRef, createContext, useContext } from 'react';
import { useHref, NavLink } from 'react-router-dom';

const NavContext = createContext({ vertical: false })
export function NavButton(props) {
  const { vertical } = useContext(NavContext)
  const staticClass = ['nav-button relative', vertical && 'mb-4']
  return (
    <NavLink
      to={props.to}
      className={({isActive}) => classNames(staticClass, { active: isActive })}
    >
      <div className={classNames('nav-button-bg', props.bgClass)}></div>
      <div className='nav-button-text'>{props.children}</div>
    </NavLink>
  );
}

export function NavButtonGroup(props) {
  const classes = [
    'nav-button-group flex',
    {
      'rect': props.rect,
      'align-left': props.align === 'left',
      'flex-col': props.vertical
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
  const className = classNames(
    classes,
    props.className
  )
  return (
    <NavContext.Provider value={{ vertical: props.vertical }}>
      <div ref={boxRef} className={className}>
        {props.children}
      </div>
    </NavContext.Provider>
  );
}

