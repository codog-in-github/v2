import { Button } from "antd"
import PropTypes from "prop-types"
import { useAsyncCallback } from "@/hooks"

const LoadingButton = ({ children, onClick, ...props }) => {
  const [handleClick, loading] = useAsyncCallback(onClick)
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
