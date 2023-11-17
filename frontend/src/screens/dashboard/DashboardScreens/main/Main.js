import React from 'react';
import PropTypes from 'prop-types';

import Button from '../../../../components/Button/Button';
import utils from '../../../../utils/formatDate';

import './Main.css';

function Main(props) {
  const { flowers } = props;

  return (
    <div className="div_dashboard-main">
      <header className="header_dashboard-main">
        <h1>Dashboard</h1>
        <img alt="dot" src="/assets/images/dot.png" />
        <h2 style={{ fontWeight: 'bold' }}>Bem-vinda, </h2>
        <h2>Aqui é possível ter uma visão geral do estoque de suas flores</h2>
      </header>
      <div className="div_content-main">
        <div className="div_table-main">
          <header>
            <h2>Flores em estoque</h2>
            <h3>Gerenciar estoque</h3>
          </header>
          <table className="table_table-main">
            <thead>
              <tr>
                <th>Lote</th>
                <th>Validade</th>
                <th>Descrição</th>
                <th>Preço</th>
                <th>Quantidade</th>
              </tr>
            </thead>
            <tbody>
              {flowers && flowers.length > 0 ? flowers.map((flower) => {
                const { _id } = flower;
                return (
                  <tr key={_id}>
                    <td>{flower.lote}</td>
                    <td>{utils.convertToNormalDate(flower.validity)}</td>
                    <td>{flower.description}</td>
                    <td>{flower.price}</td>
                    <td>
                      <div style={{ backgroundColor: flower.quantity < 5 ? '#D83F51' : '#80AE00' }} />
                      {flower.quantity}
                    </td>
                  </tr>
                );
              }) : <p>Nenhuma flor cadastrada.</p>}
            </tbody>
          </table>
        </div>
        <div>
          <Button
            style={{
              width: '442px',
              height: '120px',
              backgroundColor: '#6C9300',
              border: 'none',
              borderRadius: '25px',
              marginBottom: '8px',
            }}
            textStyle={{
              fontFamily: 'sans-serif',
              fontSize: '20px',
            }}
            icon={<img alt="add button" src="/assets/images/add_circle.png" style={{ marginLeft: '114px' }} />}
            onClick={() => {}}
          >
            Cadastrar Novas Flores
          </Button>
          <Button
            style={{
              width: '442px',
              height: '120px',
              backgroundColor: '#6C9300',
              border: 'none',
              borderRadius: '25px',
              marginBottom: '8px',
            }}
            textStyle={{
              fontFamily: 'sans-serif',
              fontSize: '20px',
            }}
            icon={<img alt="add button" src="/assets/images/add_circle.png" style={{ marginLeft: '114px' }} />}
            onClick={() => {}}
          >
            Cadastrar Novas Flores
          </Button>
          <Button
            style={{
              width: '442px',
              height: '120px',
              backgroundColor: '#6C9300',
              border: 'none',
              borderRadius: '25px',
            }}
            textStyle={{
              fontFamily: 'sans-serif',
              fontSize: '20px',
            }}
            icon={<img alt="add button" src="/assets/images/add_circle.png" style={{ marginLeft: '114px' }} />}
            onClick={() => {}}
          >
            Cadastrar Novas Flores
          </Button>
        </div>
      </div>
    </div>
  );
}

Main.propTypes = {
  flowers: PropTypes.shape([]).isRequired,
};

export default Main;
