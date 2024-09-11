import classNames from 'classnames'

const Icon = ({ className, children, ...props }) =>(
  <span
  className={classNames('inline-block align-middle', className)}
  {...props}
  >
    {children}
  </span>
)

export const Top = ({ classname = '' }) => (
  <svg className={classname} width="20" height="20" fill="currentcolor" viewBox="0 0 20 20">
    <path d="M10 0L0 7L0 20L7 20L7 14C7 13.4477 7.44769 13 8 13L12 13C12.5523 13 13 13.4477 13 14L13 20L20 20L20 7L10 0Z" clipRule="evenodd" fillOpacity="1" fillRule="evenodd"/>
  </svg>
)

export const Acl = ({ className }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="currentcolor">
    <path d="M1 0L15 0C15.5523 0 16 0.447723 16 1L16 11L12 11C11.4477 11 11 11.4477 11 12L11 19C11 19.5523 11.4477 20 12 20L1 20C0.447693 20 0 19.5523 0 19L0 1C0 0.447723 0.447693 0 1 0ZM3 3L13 3C13.5523 3 14 3.44772 14 4C14 4.55228 13.5523 5 13 5L3 5C2.44769 5 2 4.55228 2 4C2 3.44772 2.44769 3 3 3ZM13 7L3 7C2.44769 7 2 7.44772 2 8C2 8.55228 2.44769 9 3 9L13 9C13.5523 9 14 8.55228 14 8C14 7.44772 13.5523 7 13 7ZM3 11L7 11C7.55231 11 8 11.4477 8 12C8 12.5523 7.55231 13 7 13L3 13C2.44769 13 2 12.5523 2 12C2 11.4477 2.44769 11 3 11ZM20 13C20 12.4477 19.5523 12 19 12L13 12C12.4477 12 12 12.4477 12 13L12 19C12 19.5523 12.4477 20 13 20L19 20C19.5523 20 20 19.5523 20 19L20 13ZM18 18L18 14L14 14L14 18L18 18Z" />
  </svg>
)
export const Po = ({ className }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="currentcolor">
    <path d="M1 0L19 0C19.5523 0 20 0.447723 20 1L20 19C20 19.5523 19.5523 20 19 20L1 20C0.447693 20 0 19.5523 0 19L0 1C0 0.447723 0.447693 0 1 0ZM5 4L15 4C15.5523 4 16 4.44772 16 5C16 5.55228 15.5523 6 15 6L5 6C4.44769 6 4 5.55228 4 5C4 4.44772 4.44769 4 5 4ZM15 8L5 8C4.44769 8 4 8.44772 4 9C4 9.55228 4.44769 10 5 10L15 10C15.5523 10 16 9.55228 16 9C16 8.44772 15.5523 8 15 8ZM5 12L12 12C12.5523 12 13 12.4477 13 13C13 13.5523 12.5523 14 12 14L5 14C4.44769 14 4 13.5523 4 13C4 12.4477 4.44769 12 5 12Z" clipRule="evenodd"/>
  </svg>
)

export const BlCopy = ({ className }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="currentcolor">
    <path d="M1 0L19 0C19.5523 0 20 0.447723 20 1L20 9.99991L17 9.99991L17 4C17 3.44772 16.5523 3 16 3L4 3C3.44769 3 3 3.44772 3 4L3 16C3 16.5523 3.44769 17 4 17L10 17L10 19.9999L15 19.9999C14.4477 19.9999 14 19.5522 14 18.9999L14 14.9999C14 14.4476 14.4477 13.9999 15 13.9999L19 13.9999C19.5523 13.9999 20 14.4476 20 14.9999L20 18.9999C20 19.5522 19.5523 19.9999 19 19.9999L19.0137 19.9999L19 20L1 20C0.447693 20 0 19.5523 0 19L0 1C0 0.447723 0.447693 0 1 0ZM6 4.99991L14 4.99991C14.5523 4.99991 15 5.44763 15 5.99991L15 6.99991C15 7.55219 14.5523 7.99991 14 7.99991L6 7.99991C5.44769 7.99991 5 7.55219 5 6.99991L5 5.99991C5 5.44763 5.44769 4.99991 6 4.99991ZM14 9.99985L6 9.99985C5.44769 9.99985 5 10.4476 5 10.9998L5 11.9998C5 12.5521 5.44769 12.9998 6 12.9998L14 12.9998C14.5523 12.9998 15 12.5521 15 11.9998L15 10.9998C15 10.4476 14.5523 9.99985 14 9.99985Z" clipRule="evenodd" />
  </svg>
)
export const Drive = ({ className }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="currentcolor">
    <path d="M1 0L19 0C19.5523 0 20 0.447723 20 1L20 19C20 19.5523 19.5523 20 19 20L1 20C0.447693 20 0 19.5523 0 19L0 1C0 0.447723 0.447693 0 1 0ZM16 3L4 3C3.44769 3 3 3.44772 3 4L3 16C3 16.5523 3.44769 17 4 17L16 17C16.5523 17 17 16.5523 17 16L17 4C17 3.44772 16.5523 3 16 3ZM15 4L5 4C4.44769 4 4 4.44772 4 5L4 6C4 6.55228 4.44769 7 5 7L15 7C15.5523 7 16 6.55228 16 6L16 5C16 4.44772 15.5523 4 15 4ZM5 8L9 8C9.55231 8 10 8.44772 10 9L10 14C10 14.5523 9.55231 15 9 15L5 15C4.44769 15 4 14.5523 4 14L4 9C4 8.44772 4.44769 8 5 8ZM15 8L12 8C11.4477 8 11 8.44772 11 9L11 10C11 10.5523 11.4477 11 12 11L15 11C15.5523 11 16 10.5523 16 10L16 9C16 8.44772 15.5523 8 15 8ZM12 12L15 12C15.5523 12 16 12.4477 16 13L16 14C16 14.5523 15.5523 15 15 15L12 15C11.4477 15 11 14.5523 11 14L11 13C11 12.4477 11.4477 12 12 12Z" clipRule="evenodd"/>
  </svg>
)

export const GateDoc = ({className}) => (
  <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="currentcolor">
    <path d="M1 0L14 0C17.3137 0 20 2.68628 20 6L20 19C20 19.5523 19.5523 20 19 20L1 20C0.447693 20 0 19.5523 0 19L0 1C0 0.447723 0.447693 0 1 0ZM5 4L9 4C9.55231 4 10 4.44772 10 5C10 5.55228 9.55231 6 9 6L5 6C4.44769 6 4 5.55228 4 5C4 4.44772 4.44769 4 5 4ZM16 9C16 8.44772 15.5523 8 15 8L5 8C4.44769 8 4 8.44772 4 9C4 9.55228 4.44769 10 5 10L15 10C15.5523 10 16 9.55228 16 9ZM4 13C4 12.4477 4.44769 12 5 12L15 12C15.5523 12 16 12.4477 16 13C16 13.5523 15.5523 14 15 14L5 14C4.44769 14 4 13.5523 4 13Z" clipRule="evenodd"/>
  </svg>
)
export const Sur = ({className}) => (
  <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="currentcolor">
    <path d="M10 0L20 3L16 4.5L6.5 1L10 0ZM4.5 1.5L14 5L10 6.5L0 3L4.5 1.5ZM0 16L0 5L9 8L9 20L0 16ZM20 5L15.9578 6.34741L15.9578 10.5L13.9048 12L13.9048 7.03174L11 8L11 20L20 16L20 5Z"/>
  </svg>
)
export const Permission = ({className}) => (
  <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="currentcolor">
    <path d="M2.99982 2.16907C2.99731 2.16864 1.99982 2.00125 1.99982 3C1.99982 4 2.99982 4 2.99982 4L13.9998 6L13.9998 20.1691L10.5 20.1691L0 17.169L0 2.16907C0 0 1.5 0 1.99982 0L20 3.16907L20 17.5C20 18 19.5 18.5 19 18.5C18.5 18.5 18 18 18 17.5L18 5L2.99982 2.16907ZM4 11.2C4 9.43268 5.34314 8 7 8C8.65686 8 10 9.43268 10 11.2C10 12.0941 9.65619 12.9026 9.10187 13.4833L9.81091 14.7933C10.0115 15.1638 9.88324 15.6432 9.52454 15.8641C9.16577 16.085 8.71246 15.9637 8.5119 15.5933L7.80322 14.284C7.54761 14.3596 7.2782 14.4 7 14.4C5.34314 14.4 4 12.9673 4 11.2Z"/>
  </svg>
)

export const RequestBook = ({className}) => (
  <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="currentcolor">
    <path d="M3 7C3 3.134 6.13403 0 10 0C13.866 0 17 3.134 17 7C17 10.866 13.866 14 10 14C6.13403 14 3 10.866 3 7ZM10.175 10.2392L13.7071 6.70709C14.0977 6.31659 14.0977 5.68341 13.7071 5.29288C13.3166 4.90237 12.6834 4.90237 12.2929 5.29288L9.46448 8.12128L8.05029 6.70706C7.65979 6.31656 7.02661 6.31656 6.63611 6.70706C6.24554 7.0976 6.24554 7.73077 6.63611 8.12128L8.75018 10.2354C8.75256 10.2378 8.75494 10.2402 8.75739 10.2426C9.09375 10.579 9.61011 10.6256 9.9964 10.3826C10.0587 10.3434 10.1174 10.2968 10.1716 10.2426C10.1728 10.2415 10.1739 10.2403 10.175 10.2392ZM15.5 16L20 16L17 11C17 11 15.875 12.5 14.5 13.5C13.125 14.5 11 15 11 15L14 19L15.5 16ZM3.5 12L0 16L6 17L8 20L10 15C10 15 7.77014 15.0891 6 14C4.22986 12.9109 3.5 12 3.5 12Z"/>
  </svg>
)

export const Light = ({className}) => (
  <svg className={className} width="40" height="40" viewBox="-1 -1 30 30" fill="none">
    <path d="M14 6C10.68 6 8 8.18 8 11.5C8 14.5 12 19 14 19C16 19 20 14.5 20 11.5C20 8 17.31 6 14 6ZM12.33 8.27C12.85 8.09 13.4 8 14 8C14.61 8 15.17 8.08 15.69 8.26C16.17 8.42 16.59 8.65 16.93 8.95C17.14 9.13 17.32 9.33 17.46 9.55C17.82 10.08 18 10.73 18 11.5C18 11.68 17.96 11.9 17.89 12.15C17.81 12.43 17.69 12.74 17.54 13.06C17.21 13.75 16.77 14.42 16.21 15.09C15.67 15.73 15.14 16.24 14.61 16.62C14.4 16.77 14.2 16.89 14.04 16.96C14.02 16.96 14.01 16.97 14 16.98C13.98 16.97 13.97 16.96 13.95 16.96C13.79 16.89 13.59 16.77 13.38 16.62C12.85 16.24 12.32 15.73 11.78 15.09C11.22 14.42 10.78 13.75 10.45 13.06C10.3 12.74 10.18 12.43 10.1 12.15C10.03 11.9 10 11.68 10 11.5C10 10.97 10.09 10.49 10.29 10.06C10.35 9.93 10.42 9.81 10.49 9.69C10.65 9.43 10.85 9.21 11.08 9C11.43 8.69 11.85 8.44 12.33 8.27Z" fill="#FFFFFF"/>
    <rect x="12" y="20" rx="1" width="4" height="2" fill="#FFFFFF"/>
  </svg>
)

export const Customer = ({ className }) => (
  <span className={classNames('inline-block align-middle', className)}>
    <svg width="1em" height="1em" viewBox="-3 -3 25 30" stroke="currentcolor" fill='none' strokeWidth={2}>
      <path
        d="M10.999,0.994 C14.312,0.994 16.999,3.680 16.999,6.994 C16.999,8.730 16.261,10.293 15.083,11.389 C14.012,12.385 12.576,12.994 10.999,12.994 C9.622,12.994 8.354,12.530 7.341,11.751 C5.916,10.654 4.999,8.931 4.999,6.994 C4.999,3.680 7.685,0.994 10.999,0.994 Z"/>
      <path
        d="M14.320,10.570 C18.205,11.942 20.989,15.646 20.989,20.001 L20.989,20.001 C20.989,20.697 16.512,21.001 10.989,21.001 L10.989,21.001 C5.466,21.001 0.989,20.766 0.989,20.001 L0.989,20.001 C0.989,15.679 3.731,11.998 7.570,10.601 "/>
      <path
        d="M11.994,17.012 L11.000,11.000 L9.994,17.012 L11.000,18.000 L11.994,17.012 Z"/>
    </svg>
  </span>
)

export const OrderList = ({ className }) => (
  <span className={classNames('inline-block align-middle', className)}>
    <svg width="1em" height="1em" viewBox="-2 -2 25 30" stroke="currentcolor" fill='none' strokeWidth={2}>
    <path strokeLinejoin="miter" fill="none"
      d="M3.000,1.000 L19.000,1.000 C20.105,1.000 21.000,1.895 21.000,3.000 L21.000,18.954 C21.000,20.059 20.105,20.954 19.000,20.954 L3.000,20.954 C1.895,20.954 1.000,20.059 1.000,18.954 L1.000,3.000 C1.000,1.895 1.895,1.000 3.000,1.000 Z"/>
    <path strokeLinejoin="miter" fill="currentcolor" stroke='none'
      d="M16.012,7.996 L10.012,7.996 C9.459,7.996 9.012,7.548 9.012,6.996 C9.012,6.443 9.459,5.996 10.012,5.996 L16.012,5.996 C16.564,5.996 17.012,6.443 17.012,6.996 C17.012,7.548 16.564,7.996 16.012,7.996 ZM10.009,9.996 L16.009,9.996 C16.562,9.996 17.009,10.443 17.009,10.996 C17.009,11.548 16.562,11.996 16.009,11.996 L10.009,11.996 C9.457,11.996 9.009,11.548 9.009,10.996 C9.009,10.443 9.457,9.996 10.009,9.996 ZM5.985,16.008 C5.433,16.008 4.985,15.561 4.985,15.008 C4.985,14.456 5.433,14.008 5.985,14.008 C6.537,14.008 6.985,14.456 6.985,15.008 C6.985,15.561 6.537,16.008 5.985,16.008 ZM5.985,12.008 C5.433,12.008 4.985,11.561 4.985,11.008 C4.985,10.456 5.433,10.008 5.985,10.008 C6.537,10.008 6.985,10.456 6.985,11.008 C6.985,11.561 6.537,12.008 5.985,12.008 ZM5.985,8.008 C5.433,8.008 4.985,7.561 4.985,7.008 C4.985,6.456 5.433,6.008 5.985,6.008 C6.537,6.008 6.985,6.456 6.985,7.008 C6.985,7.561 6.537,8.008 5.985,8.008 ZM10.009,13.996 L16.009,13.996 C16.562,13.996 17.009,14.443 17.009,14.996 C17.009,15.548 16.562,15.996 16.009,15.996 L10.009,15.996 C9.457,15.996 9.009,15.548 9.009,14.996 C9.009,14.443 9.457,13.996 10.009,13.996 Z"/>
    </svg>
  </span>
)

export const OrderCalendar = ({ className }) => (
  <span className={classNames('inline-block align-middle', className)}>
    <svg width="1em" height="1em" viewBox="-2 -2 25 30" stroke="currentcolor" fill='none' strokeWidth={2}>
      <path  stroke="currentcolor" fill="none"
        d="M3.000,1.000 L19.000,1.000 C20.105,1.000 21.000,1.895 21.000,3.000 L21.000,18.954 C21.000,20.059 20.105,20.954 19.000,20.954 L3.000,20.954 C1.895,20.954 1.000,20.059 1.000,18.954 L1.000,3.000 C1.000,1.895 1.895,1.000 3.000,1.000 Z"/>
      <path  stroke="none" fill="currentcolor"
        d="M14.985,12.008 C14.432,12.008 13.985,11.561 13.985,11.008 C13.985,10.456 14.432,10.008 14.985,10.008 C15.537,10.008 15.985,10.456 15.985,11.008 C15.985,11.561 15.537,12.008 14.985,12.008 ZM14.985,8.008 C14.432,8.008 13.985,7.561 13.985,7.008 C13.985,6.456 14.432,6.008 14.985,6.008 C15.537,6.008 15.985,6.456 15.985,7.008 C15.985,7.561 15.537,8.008 14.985,8.008 ZM10.985,16.008 C10.433,16.008 9.985,15.561 9.985,15.008 C9.985,14.456 10.433,14.008 10.985,14.008 C11.537,14.008 11.985,14.456 11.985,15.008 C11.985,15.561 11.537,16.008 10.985,16.008 ZM10.985,12.008 C10.433,12.008 9.985,11.561 9.985,11.008 C9.985,10.456 10.433,10.008 10.985,10.008 C11.537,10.008 11.985,10.456 11.985,11.008 C11.985,11.561 11.537,12.008 10.985,12.008 ZM10.985,8.008 C10.433,8.008 9.985,7.561 9.985,7.008 C9.985,6.456 10.433,6.008 10.985,6.008 C11.537,6.008 11.985,6.456 11.985,7.008 C11.985,7.561 11.537,8.008 10.985,8.008 ZM6.985,16.008 C6.433,16.008 5.985,15.561 5.985,15.008 C5.985,14.456 6.433,14.008 6.985,14.008 C7.537,14.008 7.985,14.456 7.985,15.008 C7.985,15.561 7.537,16.008 6.985,16.008 ZM6.985,12.008 C6.433,12.008 5.985,11.561 5.985,11.008 C5.985,10.456 6.433,10.008 6.985,10.008 C7.537,10.008 7.985,10.456 7.985,11.008 C7.985,11.561 7.537,12.008 6.985,12.008 ZM6.985,8.008 C6.433,8.008 5.985,7.561 5.985,7.008 C5.985,6.456 6.433,6.008 6.985,6.008 C7.537,6.008 7.985,6.456 7.985,7.008 C7.985,7.561 7.537,8.008 6.985,8.008 ZM14.985,14.008 C15.537,14.008 15.985,14.456 15.985,15.008 C15.985,15.561 15.537,16.008 14.985,16.008 C14.432,16.008 13.985,15.561 13.985,15.008 C13.985,14.456 14.432,14.008 14.985,14.008 Z"/>
    </svg>
  </span>
)

export const Boat = ({ className }) => (
  <span className={classNames('inline-block align-middle', className)}>
    <svg width="1em" height="1em" viewBox="-2 -2 25 30" stroke="currentcolor" fill='none' strokeWidth={2}>
      <path d="M4.007,9.009 L4.007,5.009 C4.007,4.457 4.455,4.009 5.007,4.009 L17.007,4.009 C17.559,4.009 18.007,4.457 18.007,5.009 L18.007,9.009 "/>
      <path d="M7.007,4.031 L7.007,2.009 C7.007,1.457 7.455,1.009 8.007,1.009 L14.007,1.009 C14.559,1.009 15.007,1.457 15.007,2.009 L15.007,4.031 "/>
      <path d="M17.053,16.009 C17.606,16.009 19.007,15.561 19.007,15.009 C19.007,15.009 20.906,12.282 20.906,10.989 C20.906,9.680 11.606,7.000 11.000,7.000 C10.394,7.000 11.512,7.000 10.906,7.000 C10.300,7.000 1.000,9.680 1.000,10.989 C1.000,12.282 2.899,15.009 2.899,15.009 C2.899,15.561 4.426,16.009 4.978,16.009 L17.053,16.009 Z"/>
      <path d="M1.000,18.280 C1.000,18.280 1.568,21.000 3.988,21.000 C6.408,21.000 7.031,19.693 7.031,19.693 C7.031,19.693 7.863,18.330 9.000,19.720 C9.831,20.735 10.475,21.000 12.021,21.000 C13.568,21.000 14.002,19.626 14.002,19.626 C14.002,19.626 14.765,18.167 16.013,19.720 C16.740,20.624 16.865,21.000 18.933,21.000 C21.000,21.000 21.000,18.177 21.000,18.177 "/>
    </svg>
  </span>
)

export const Exit = ({ className, color }) => (
  <Icon className={className} style={{ color }}>
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
      <path 
        d="M12,24A12,12,0,0,1,3.515,3.515,12,12,0,1,1,20.485,20.485,11.922,11.922,0,0,1,12,24ZM8,4A2,2,0,0,0,6,6V18a2,2,0,0,0,2,2h5a2,2,0,0,0,2-2V15a1,1,0,1,0-2,0v3H8V6h5V9a1,1,0,0,0,2,0V6a2,2,0,0,0-2-2Zm2,7a1,1,0,1,0,0,2h8.173l-1.122,1.122a1,1,0,0,0,1.414,1.414L21.2,12.8a.956.956,0,0,0,.1-.085,1.015,1.015,0,0,0,0-1.426,1.127,1.127,0,0,0-.093-.083L18.464,8.476A1,1,0,0,0,17.051,9.89L18.16,11Z" fill="currentcolor"/>
    </svg>
  </Icon>
)

export const CustomerBadge = ({ className, color }) => (
  <Icon className={className} style={{ color }}>
   <svg 
    fill="currentcolor"
    width="0.769em" height="0.145em" viewBox='0 0 769 145'>
    <path 
      d="M233.999,144.999 C79.918,144.999 111.40,0.0 9.0,0.0 C92.238,0.0 768.999,0.0 768.999,0.0 L768.999,144.999 C768.999,144.999 388.81,144.999 233.999,144.999 ZM435.381,99.590 L440.346,98.695 C439.640,93.649 438.799,88.496 437.823,83.233 L433.347,84.46 C434.52,89.92 434.730,94.274 435.381,99.590 ZM284.14,106.670 L290.199,106.670 L290.199,91.940 L323.565,91.940 L323.565,96.335 C323.565,98.939 322.73,100.241 319.89,100.241 C315.834,100.241 311.629,100.78 306.475,99.753 C307.18,102.194 307.424,104.283 307.696,106.19 C313.338,106.73 317.950,106.73 321.531,106.19 C327.10,105.910 329.750,102.845 329.750,96.823 L329.750,65.410 L284.14,65.410 L284.14,106.670 ZM257.810,45.960 C256.996,54.261 255.992,61.71 254.799,66.387 C257.77,66.821 258.840,67.201 260.88,67.526 C261.445,60.148 262.421,53.177 263.18,46.612 L257.810,45.960 ZM271.563,43.967 L271.563,27.406 L265.785,27.406 L265.785,106.914 L271.563,106.914 L271.563,45.920 C273.842,48.904 275.822,51.630 277.504,54.99 L282.61,50.762 C279.891,47.995 277.422,44.984 274.656,41.729 L271.563,43.967 ZM335.935,55.319 L309.812,55.319 L309.812,49.704 L331.947,49.704 L331.947,44.577 L309.812,44.577 L309.812,39.125 L334.226,39.125 L334.226,33.998 L309.812,33.998 L309.812,26.673 L303.627,26.673 L303.627,33.998 L280.840,33.998 L280.840,39.125 L303.627,39.125 L303.627,44.577 L283.119,44.577 L283.119,49.704 L303.627,49.704 L303.627,55.319 L278.725,55.319 L278.725,60.446 L335.935,60.446 L335.935,55.319 ZM338.214,91.45 L354.896,91.45 L354.896,107.77 L360.756,107.77 L360.756,91.45 L376.788,91.45 L376.788,85.349 L360.756,85.349 L360.756,75.990 L374.997,75.990 L374.997,70.456 L365.964,70.456 C368.134,67.309 370.304,63.973 372.475,60.446 L367.22,57.842 C364.906,61.911 362.546,66.116 359.942,70.456 L340.574,70.456 L340.574,75.990 L354.896,75.990 L354.896,85.349 L338.214,85.349 L338.214,91.45 ZM354.652,67.445 C352.699,63.919 350.691,60.609 348.630,57.516 L343.585,60.202 C345.429,63.24 347.355,66.387 349.363,70.293 L354.652,67.445 ZM377.32,51.250 L360.756,51.250 L360.756,42.705 L374.346,42.705 L374.346,37.334 L360.756,37.334 L360.756,27.975 L354.896,27.975 L354.896,37.334 L341.631,37.334 L341.631,42.705 L354.896,42.705 L354.896,51.250 L338.946,51.250 L338.946,56.784 L377.32,56.784 L377.32,51.250 ZM416.94,66.143 L416.94,60.609 L385.251,60.609 L385.251,37.171 L409.747,37.171 C409.692,39.613 409.584,41.973 409.421,44.252 C409.312,47.18 407.739,48.402 404.701,48.402 C401.988,48.402 398.462,48.294 394.122,48.76 C394.610,50.247 394.936,52.227 395.98,54.17 C398.299,54.72 401.690,54.99 405.271,54.99 C411.456,54.99 414.711,51.468 415.36,46.205 C415.199,43.221 415.389,38.311 415.606,31.475 L379.555,31.475 L379.555,106.996 L385.251,106.996 L385.251,66.143 L388.588,66.143 C390.378,76.451 393.823,84.996 398.923,91.778 C395.505,95.576 391.83,99.156 385.658,102.520 C387.14,103.876 388.370,105.503 389.727,107.403 C395.44,103.985 399.411,100.295 402.829,96.335 C406.573,100.186 410.994,103.578 416.94,106.507 C417.288,104.500 418.508,102.764 419.756,101.299 C414.548,98.640 410.126,95.467 406.492,91.778 C410.940,85.376 414.141,76.831 416.94,66.143 ZM426.592,104.66 C428.383,97.718 429.820,91.72 430.906,84.128 L426.185,83.233 C424.991,90.15 423.391,96.470 421.384,102.601 L426.592,104.66 ZM430.336,73.793 C437.443,63.593 443.926,53.773 449.786,44.333 L444.415,41.566 C442.353,45.472 440.372,49.53 438.474,52.308 C434.676,52.417 431.339,52.498 428.464,52.552 C432.208,47.127 436.765,39.668 442.136,30.173 L436.521,27.731 C431.312,39.559 426.402,48.22 421.791,53.122 L423.337,58.493 C426.538,57.951 430.580,57.598 435.463,57.435 C430.743,65.85 426.484,70.809 422.686,74.606 L424.558,80.59 C429.603,78.865 436.331,77.753 444.740,76.722 C445.120,77.753 445.499,78.838 445.879,79.977 L451.6,77.943 C448.348,70.781 446.232,65.573 444.659,62.318 L440.20,64.108 C440.997,66.333 442.55,69.18 443.194,72.165 C438.745,72.708 434.459,73.250 430.336,73.793 ZM498.451,35.625 L480.792,35.625 C479.923,33.672 478.323,30.716 475.990,26.755 L470.212,29.196 C471.568,31.367 472.762,33.509 473.793,35.625 L453.41,35.625 L453.41,60.121 C453.95,75.420 451.956,86.244 449.623,92.591 C448.266,88.360 446.856,84.643 445.391,81.442 L441.241,82.907 C442.434,85.783 443.655,89.662 444.903,94.544 L449.460,92.998 C448.266,96.308 446.639,99.346 444.577,102.113 C445.499,103.197 446.801,104.880 448.484,107.158 C452.281,101.299 454.858,94.951 456.215,88.115 C457.571,81.442 458.249,71.975 458.249,59.714 L458.249,55.238 L493.243,55.238 L493.243,57.923 L498.451,57.923 L498.451,35.625 ZM499.265,63.620 L460.202,63.620 L460.202,106.914 L465.85,106.914 L465.85,86.81 L471.433,86.81 L471.433,102.845 L476.316,102.845 L476.316,86.81 L482.663,86.81 L482.663,102.520 L485.674,102.520 C486.217,104.147 486.570,105.558 486.732,106.752 L492.22,106.752 C496.850,106.752 499.265,104.120 499.265,98.858 L499.265,63.620 ZM582.191,69.154 L551.104,69.154 L551.104,63.213 L578.366,63.213 L578.366,58.493 L551.104,58.493 L551.104,52.715 L578.366,52.715 L578.366,47.995 L551.104,47.995 L551.104,42.217 L581.947,42.217 L581.947,37.171 L550.779,37.171 L554.522,34.811 C552.894,32.99 550.805,29.332 548.256,26.511 L543.454,29.440 C545.462,32.126 547.198,34.703 548.663,37.171 L525.632,37.171 C527.205,34.893 528.751,32.506 530.271,30.10 L524.656,27.487 C519.230,37.90 512.584,45.174 504.717,51.738 C506.453,53.746 507.755,55.537 508.624,57.110 C511.526,54.505 514.374,51.576 517.169,48.321 L517.169,77.292 L522.865,77.292 L522.865,74.199 L582.191,74.199 L582.191,69.154 ZM583.168,86.651 L583.168,81.442 L548.174,81.442 L548.174,75.908 L542.478,75.908 L542.478,81.442 L507.403,81.442 L507.403,86.651 L535.886,86.651 C526.609,93.568 516.137,98.451 504.473,101.299 C505.883,103.35 507.159,104.744 508.298,106.426 C521.210,102.384 532.603,96.240 542.478,87.993 L542.478,107.158 L548.174,107.158 L548.174,88.75 C557.723,96.376 569.116,102.438 582.354,106.263 C583.439,104.527 584.714,102.520 586.179,100.241 C574.568,97.881 564.16,93.351 554.522,86.651 L583.168,86.651 ZM661.700,68.910 L623.533,47.914 L623.533,54.953 L651.934,70.212 L651.934,70.497 L623.533,83.965 L623.533,90.964 L661.700,72.2 L661.700,68.910 ZM522.865,63.213 L545.407,63.213 L545.407,69.154 L522.865,69.154 L522.865,63.213 ZM522.865,52.715 L545.407,52.715 L545.407,58.493 L522.865,58.493 L522.865,52.715 ZM522.865,42.217 L545.407,42.217 L545.407,47.995 L522.865,47.995 L522.865,42.217 ZM490.639,101.462 C489.662,101.462 488.631,101.434 487.546,101.380 L487.546,86.81 L494.382,86.81 L494.382,97.393 C494.382,100.105 493.134,101.462 490.639,101.462 ZM487.546,68.828 L494.382,68.828 L494.382,81.117 L487.546,81.117 L487.546,68.828 ZM476.316,68.828 L482.663,68.828 L482.663,81.117 L476.316,81.117 L476.316,68.828 ZM465.85,68.828 L471.433,68.828 L471.433,81.117 L465.85,81.117 L465.85,68.828 ZM458.249,40.834 L493.243,40.834 L493.243,50.30 L458.249,50.30 L458.249,40.834 ZM394.122,66.143 L410.316,66.143 C408.797,74.769 406.220,81.768 402.585,87.139 C398.462,81.442 395.641,74.444 394.122,66.143 ZM290.199,81.280 L323.565,81.280 L323.565,86.895 L290.199,86.895 L290.199,81.280 ZM290.199,70.619 L323.565,70.619 L323.565,76.234 L290.199,76.234 L290.199,70.619 Z"/>
    </svg>
  </Icon>
)
