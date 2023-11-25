import { Form, FloatingLabel } from "react-bootstrap";
import PropTypes from "prop-types";

const Formfields = ({
  register,
  errors,
  label,
  className,
  id,
  type,
  placeholder,
  name,
  registerOptions,
  togglePassword,
  showPassword,
  ...props
}) => {
  return (
    <div>
      <FloatingLabel controlId={id} label={label} className={className}>
        <Form.Control
          type={showPassword ? "text" : type}
          placeholder={placeholder}
          name={name}
          size="lg"
          {...props}
          {...register(name, registerOptions)}
          isInvalid={!!errors}
        />
        <Form.Control.Feedback type="invalid">
          {errors?.message}
        </Form.Control.Feedback>
        {type === "password" && (
          <>
            {showPassword ? (
              <p
                className="small text-black position-absolute end-0 top-50 translate-middle cursor"
                onClick={togglePassword}
              >
                Hide
              </p>
            ) : (
              <p
                className="small text-black position-absolute end-0 top-50 translate-middle cursor"
                onClick={togglePassword}
              >
                Show
              </p>
            )}
          </>
        )}
      </FloatingLabel>
    </div>
  );
};

export default Formfields;

Formfields.propTypes = {
  register: PropTypes.func,
  registerOptions: PropTypes.object,
  errors: PropTypes.object,
  label: PropTypes.string,
  className: PropTypes.string,
  id: PropTypes.string,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  name: PropTypes.string,
  props: PropTypes.object,
  togglePassword: PropTypes.func,
  showPassword: PropTypes.any,
};
