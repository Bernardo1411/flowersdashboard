import React from 'react';
import PropTypes from 'prop-types';

import Modal from 'react-modal';

function MyModal(props) {
  const {
    modalIsOpen,
    closeModal,
    children,
    top,
    left,
    width,
    height,
  } = props;

  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      style={{
        content: {
          top,
          left,
          width,
          height,
          flexShrink: 0,
          borderRadius: '16px',
          background: '#FFF',
        },
        overlay: {
          backgroundColor: '#1F211E60',
        },
      }}
      contentLabel="Example Modal"
    >
      { children }
    </Modal>
  );
}

MyModal.propTypes = {
  modalIsOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  top: PropTypes.string.isRequired,
  left: PropTypes.string.isRequired,
  width: PropTypes.string.isRequired,
  height: PropTypes.string.isRequired,
};

export default MyModal;
