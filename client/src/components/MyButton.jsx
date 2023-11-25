import { Button } from "react-bootstrap";
import PropTypes from "prop-types";

const MyButton = ({ text, variant, className, ...props }) => {
  return (
    <Button variant={variant} {...props} className={className}>
      {text}
    </Button>
  );
};

export default MyButton;

MyButton.propTypes = {
  text: PropTypes.any,
  className: PropTypes.string,
  variant: PropTypes.string,
  props: PropTypes.object,
};
