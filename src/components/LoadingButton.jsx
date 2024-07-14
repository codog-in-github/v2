import { Button } from "antd"
import { useState, useCallback } from "react"
import PropTypes from "prop-types"

const LoadingButton = ({ children, onClick, ...props }) => {
  const [loading, setLoading] = useState(false)

  const handleClick = useCallback((e) => {
    const result = onClick(e)
    if (result instanceof Promise) {
      setLoading(true)
      result.finally(() => setLoading(false))
    }
  }, [onClick])

  return (
    <Button {...props} loading={loading} onClick={handleClick}>
      {children}
    </Button>
  )
}

LoadingButton.propTypes = {
  ...Button.propTypes,
  onClick: PropTypes.func.isRequired,
}

export default LoadingButton
