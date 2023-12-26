import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";

const MyModal = ({ children, title, handleClose, show, ...props }) => {
  return (
    <Modal show={show} onHide={handleClose} centered {...props}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{children}</Modal.Body>
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
