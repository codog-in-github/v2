const PortFullName = ({
  country = '',
  port = '',
  placeholder = '',
  ...props
}) => {
  const portAbbr = port?.split('/')?.[1]
  if(!portAbbr) {
    return <span className="text-gray-400">{placeholder}</span>
  }
  const countryAbbr =  country?.split('/')?.[1] ?? ''
  return (
    <span {...props}>{`${countryAbbr} ${portAbbr}`}</span>
  )
}

export default PortFullName
