let useLog = () => {
  return () => {}
}
if(process.env.NODE_ENV === 'development') {
  useLog = (namespace) => {
    return (message, type = 'INFO') => {
      console.log(
        `%c [${type.toUpperCase()}](${namespace}) ${new Date}: ${message}`,
        'color: #fff; background: #000; padding: 2px 4px; border-radius: 4px;'
      )
    }
  }
}

export default useLog