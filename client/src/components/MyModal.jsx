import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import { Icon } from "@iconify/react";
import { useAuthContext } from "../config";

const MyModal = ({ children, title, handleClose, show, ...props }) => {
  const { isDark } = useAuthContext();

  return (
    <Modal show={show} onHide={handleClose} centered {...props}>
      <Modal.Header
        style={{
          backgroundColor: isDark ? "var(--color-backgroundDark)" : "white",
          color: isDark ? "var(--color-backgroundLight)" : "black",
        }}
      >
        <Modal.Title className="fs-5">{title}</Modal.Title>
        <Icon
          icon="line-md:menu-to-close-alt-transition"
          className="fs-3 cursor"
          onClick={handleClose}
        />
      </Modal.Header>
      <Modal.Body
        style={{
          backgroundColor: isDark ? "var(--color-backgroundDark)" : "white",
          color: isDark ? "var(--color-backgroundLight)" : "black",
        }}
      >
        {children}
      </Modal.Body>
    </Modal>
  );
};

export default MyModal;

MyModal.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  handleClose: PropTypes.func,
  show: PropTypes.bool,
};
