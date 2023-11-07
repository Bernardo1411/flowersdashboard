import React from 'react';
import PropTypes from 'prop-types';

// import Button from '../../../../components/Button/Button';

import './Stock.css';

function Stock(props) {
  const { flowers } = props;

  return (
    <div className="div_dashboard-stock">
      <header className="header_dashboard-stock">
        <h1>Estoque de flores</h1>
      </header>
      <div className="div_table-stock">
        <header>
          <h2>Flores cadastradas em estoque</h2>
        </header>
        <table className="table_table-stock">
          <thead>
            <tr>
              <th>Lote</th>
              <th>Categoria</th>
              <th>Descrição</th>
              <th>Preço</th>
              <th>Quantidade</th>
            </tr>
          </thead>
          <tbody>
            {flowers.map((flower) => {
              const { _id } = flower;
              return (
                <tr key={_id}>
                  <td>{flower.lote}</td>
                  <td>{flower.category}</td>
                  <td>{flower.description}</td>
                  <td>{flower.price}</td>
                  <td>{flower.quantity}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

Stock.propTypes = {
  flowers: PropTypes.shape([]).isRequired,
};

export default Stock;
