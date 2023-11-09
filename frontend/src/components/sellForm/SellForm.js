import React, { useState } from 'react';
import PropTypes from 'prop-types';

import CleanButton from '../cleanButton/CleanButton';
import Button from '../Button/Button';

import './SellForm.css';

function SellForm(props) {
  const { flowerInfo, sellFlower } = props;

  const [quantity, setQuantity] = useState(0);

  const handleIncrement = () => {
    setQuantity(quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 0) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <div className="div_sellform-container">
      <h2>Quantas rosas vermelhas foram vendidas?</h2>
      <div className="div_sellform-input">
        <CleanButton
          style={{ backgroundColor: '#F5FBE9' }}
          type="button"
          onClick={handleDecrement}
        >
          <p style={{ color: '#6C9300' }}>-</p>
        </CleanButton>
        <input
          className="input_sellform"
          type="number"
          id="quantity"
          name="quantity"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
        />
        <CleanButton
          style={{
            backgroundColor: '#F5FBE9',
          }}
          type="button"
          onClick={handleIncrement}
        >
          <p style={{ color: '#6C9300' }}>+</p>
        </CleanButton>
      </div>
      <p className="p_input-sellform">{`Valor total: ${flowerInfo.price * quantity}`}</p>
      <Button
        style={{
          width: '175px',
          backgroundColor: '#6C9300',
          border: 'none',
        }}
        type="button"
        onClick={() => {
          sellFlower({ quantityToSell: quantity });
        }}
      >
        Registrar venda

      </Button>
    </div>
  );
}

SellForm.propTypes = {
  flowerInfo: PropTypes.shape({
    lote: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    quantity: PropTypes.number.isRequired,
  }).isRequired,
  sellFlower: PropTypes.func.isRequired,
};

export default SellForm;
