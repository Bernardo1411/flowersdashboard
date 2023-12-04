import React from 'react';
import PropTypes from 'prop-types';

import Button from '../Button/Button';

function DeleteModal(props) {
  const { closeModal, deleteFlower } = props;

  const DeleteModalContent = (
    <div className="div_sellform-container">
      <h3 style={{ marginBottom: '16px' }}>
        Tem certeza que deseja
        excluir a flor?

      </h3>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <Button
          style={{
            width: '115px',
            backgroundColor: 'white',
            borderColor: '#6C9300',
            marginRight: '12px',
            outline: 'none',
          }}
          textStyle={{ color: '#6C9300' }}
          type="button"
          onClick={closeModal}
        >
          Cancelar
        </Button>
        <Button
          style={{
            width: '115px',
            backgroundColor: '#D83B31',
            border: 'none',
          }}
          type="button"
          onClick={deleteFlower}
        >
          Excluir
        </Button>
      </div>
    </div>
  );

  return DeleteModalContent;
}

DeleteModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  deleteFlower: PropTypes.func.isRequired,
};

export default DeleteModal;
