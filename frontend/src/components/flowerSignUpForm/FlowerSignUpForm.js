import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Button from '../Button/Button';

import './FlowerSignUpForm.css';

function FlowerSignUpForm(props) {
  const {
    handleSubmit, closeModal, isEdit, flowerInfo,
  } = props;

  const [lote, setLote] = useState(isEdit ? flowerInfo.lote : '');
  const [validity, setValidity] = useState(isEdit ? flowerInfo.validity : '');
  const [description, setDescription] = useState(isEdit ? flowerInfo.description : '');
  const [price, setPrice] = useState(isEdit ? flowerInfo.price : '');
  const [quantity, setQuantity] = useState(isEdit ? flowerInfo.quantity : '');

  return (
    <form
      className="form_input-form-signup-flower"
    >
      <label htmlFor="lote" className="label_input-form-signup-flower">
        Lote
        <input placeholder="Digite aqui..." type="text" id="lote" name="lote" value={lote} onChange={(e) => setLote(e.target.value)} className="input_input-form-signup-flower" />
      </label>
      <label htmlFor="validity" className="label_input-form-signup-flower">
        Validade
        <input placeholder="Digite aqui..." type="date" id="validity" name="validity" value={validity} onChange={(e) => setValidity(e.target.value)} className="input_input-form-signup-flower" />
      </label>
      <label htmlFor="description" className="label_input-form-signup-flower">
        Descrição
        <input placeholder="Digite aqui..." id="description" name="description" value={description} onChange={(e) => setDescription(e.target.value)} className="input_input-form-signup-flower" />
      </label>
      <label htmlFor="price" className="label_input-form-signup-flower">
        Preço
        <input placeholder="Digite aqui..." type="number" id="price" name="price" value={price} onChange={(e) => setPrice(e.target.value)} className="input_input-form-signup-flower" />
      </label>
      <label htmlFor="quantity" className="label_input-form-signup-flower" style={{ marginBottom: '24px' }}>
        Quantidade
        <input placeholder="Digite aqui..." type="number" id="quantity" name="quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="input_input-form-signup-flower" />
      </label>
      <div style={{
        width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end',
      }}
      >
        <Button
          style={{
            width: '94px', backgroundColor: 'white', borderColor: '#6C9300', marginRight: '12px', outline: 'none',
          }}
          textStyle={{ color: '#6C9300' }}
          onClick={closeModal}
        >
          Cancelar
        </Button>
        <Button
          style={{
            width: '94px', backgroundColor: '#6C9300', border: 'none',
          }}
          onClick={() => {
            handleSubmit({
              lote, validity, description, price, quantity,
            });

            closeModal();
          }}
        >
          Concluir
        </Button>
      </div>
    </form>
  );
}

FlowerSignUpForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  isEdit: PropTypes.bool.isRequired,
  flowerInfo: PropTypes.shape({
    lote: PropTypes.string.isRequired,
    validity: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    quantity: PropTypes.number.isRequired,
  }).isRequired,
};

export default FlowerSignUpForm;
