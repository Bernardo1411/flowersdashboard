import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';

import Button from '../../../../components/Button/Button';
import CleanButton from '../../../../components/cleanButton/CleanButton';
import userAPI from '../../../../API/userAPI';
import THeadTable from '../../../../components/THeadTable/THeadTable';
import utils from '../../../../utils/utils';

import './Main.css';

function Main(props) {
  const { userProps } = props;

  const [flowers, setFlowers] = useState([]);
  const [user, setUser] = useState(userProps);

  const fetchUsers = async () => {
    try {
      const userData = await userAPI.getUser(sessionStorage.getItem('token'));

      return setUser(userData.user);
    } catch (error) {
      return toast.error(error.response.data.error);
    }
  };

  const fetchFlowers = async () => {
    try {
      const flowersData = await userAPI.getFlowers(sessionStorage.getItem('token'));

      return setFlowers(flowersData);
    } catch (error) {
      return toast.error(error.response.data.error);
    }
  };

  useEffect(() => {
    fetchFlowers();

    fetchUsers();
  }, []);

  const month = new Date().getMonth() + 1; // Get the current month
  const year = new Date().getFullYear(); // Get the current year
  const monthKey = `${month}-${year}`; // Construct the key for the current month

  const quantitySoldInCurrentMonth = user?.soldFlowers?.[monthKey] || 0;

  const quantityCloseToEnd = flowers.reduce(
    (accumulator, currentValue) => accumulator + (currentValue.quantity < 5 ? 1 : 0),
    0,
  );

  return (
    <div className="div_dashboard-main">
      <header className="header_dashboard-main">
        <h1>Dashboard</h1>
        <img alt="dot" src="/assets/images/dot.png" />
        <h2 style={{ fontWeight: 'bold' }}>
          Bem-vindo,
          {' '}
          {user?.name}
          {'. '}
        </h2>
        <h2 className="header_dashboard-main-description">Aqui é possível ter uma visão geral do estoque de suas flores</h2>
      </header>
      <div className="div_content-main">
        <div className="div_table-main">
          <header>
            <h2>Flores em estoque</h2>
            <CleanButton onClick={() => { window.location.href = 'http://localhost:3000/dashboard/stock'; }}>
              <h3>Gerenciar estoque</h3>
            </CleanButton>
          </header>
          <table className="table_table-main">
            <thead>
              <tr>
                <THeadTable title="Lote" sortMethod={() => utils.sortByLote(flowers, setFlowers)} />
                <th>Descrição</th>
                <th>Categoria</th>
                <THeadTable title="Preço" sortMethod={() => utils.sortByPrice(flowers, setFlowers)} />
                <THeadTable title="Quantidade" sortMethod={() => utils.sortByQuantity(flowers, setFlowers)} />
              </tr>
            </thead>
            <tbody>
              {flowers && flowers.length > 0 ? flowers.map((flower) => {
                const { _id } = flower;
                return (
                  <tr key={_id}>
                    <td>{flower.lote}</td>
                    <td>{flower.description}</td>
                    <td>{flower.category}</td>
                    <td>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(flower.price)}</td>
                    <td>
                      <span style={{ backgroundColor: flower?.quantity < 5 ? '#D83F51' : '#80AE00' }} />
                      {flower?.quantity}
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td>
                    <p>Nenhuma flor cadastrada.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="div_buttons">
          <Button
            style={{
              width: '100%',
              height: '120px',
              backgroundColor: '#6C9300',
              border: 'none',
              borderRadius: '25px',
              marginBottom: '8px',
              paddingLeft: '10px',
              paddingRight: '10px',
            }}
            textStyle={{
              fontFamily: 'sans-serif',
              fontSize: '20px',
            }}
            icon={<img alt="add button" src="/assets/images/add_circle.png" style={{ marginLeft: '114px' }} />}
            onClick={() => { window.location.href = 'http://localhost:3000/dashboard/stock'; }}
          >
            Cadastrar Novas Flores
          </Button>
          <Button
            style={{
              width: '100%',
              height: '120px',
              backgroundColor: '#E1DEF2',
              border: 'none',
              borderRadius: '25px',
              marginBottom: '8px',
              overflow: 'hidden',
              paddingLeft: '10px',
              paddingRight: '10px',
            }}
            textStyle={{
              fontFamily: 'sans-serif',
              fontSize: '45px',
              fontWeight: 'bold',
              color: '#6149CD',
            }}
            onClick={() => { window.location.href = 'http://localhost:3000/dashboard/stock'; }}
          >
            <div style={{
              height: '100', width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center',
            }}
            >
              <img alt="add button" src="/assets/images/iconFlower.png" style={{ marginRight: '16px' }} />
              {quantitySoldInCurrentMonth.toString().padStart(2, '0')}
              <p style={{ fontSize: '14px', marginLeft: '14px' }}>Flores vendidas esse mês</p>
              <img alt="add button" src="/assets/images/blueRightArrow.png" style={{ width: '16px', height: '16px', marginLeft: '70px' }} />
            </div>
          </Button>
          <Button
            style={{
              width: '100%',
              height: '120px',
              backgroundColor: '#F8F1EB',
              border: 'none',
              borderRadius: '25px',
              marginBottom: '8px',
              overflow: 'hidden',
              paddingLeft: '10px',
              paddingRight: '10px',
            }}
            textStyle={{
              fontFamily: 'sans-serif',
              fontSize: '45px',
              fontWeight: 'bold',
              color: '#D83F51',
            }}
            onClick={() => { window.location.href = 'http://localhost:3000/dashboard/stock'; }}
          >
            <div style={{
              height: '100', width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center',
            }}
            >
              <img alt="add button" src="/assets/images/alarm.png" style={{ marginRight: '16px' }} />
              {quantityCloseToEnd.toString().padStart(2, '0')}
              <p style={{ fontSize: '14px', marginLeft: '14px' }}>Lotes  precisam de sua atenção</p>
              <img alt="add button" src="/assets/images/redRightArrow.png" style={{ width: '16px', height: '16px', marginLeft: '35px' }} />
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}

Main.defaultProps = {
  userProps: {},
};

Main.propTypes = {
  userProps: PropTypes.shape({
    name: PropTypes.string,
    soldFlowers: PropTypes.shape({}),
  }),
};

export default Main;
