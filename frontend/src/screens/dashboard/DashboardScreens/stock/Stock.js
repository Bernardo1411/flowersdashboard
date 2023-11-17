import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';

import Button from '../../../../components/Button/Button';
import CleanButton from '../../../../components/cleanButton/CleanButton';
import Modal from '../../../../components/Modal/Modal';
import userAPI from '../../../../API/userAPI';
import FlowerSignUpForm from '../../../../components/flowerSignUpForm/FlowerSignUpForm';
import SellForm from '../../../../components/sellForm/SellForm';
import utils from '../../../../utils/formatDate';

import './Stock.css';

function Stock(props) {
  const { flowers, setFlowers } = props;

  const [openModal, setOpenModal] = useState(false);
  const [openModalSell, setOpenModalSell] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [flowerId, setFlowerId] = useState(false);
  const [flowerInfo, setFlowerInfo] = useState({});

  const handleSubmit = async (flowerData) => {
    try {
      const response = await userAPI.addFlower(flowerData, localStorage.getItem('token'));

      setFlowers(response.data.flowers);

      toast.success('Cadastro realizado com sucesso!');
    } catch (error) {
      toast.error(error.response.data.error);
    }
  };

  const editFlower = async (flowerData) => {
    const flowerDataWithId = {
      flowerId,
      ...flowerData,
    };

    try {
      const response = await userAPI.editFlower(flowerDataWithId, localStorage.getItem('token'));

      setFlowers(response.flowers);

      return toast.success('Edição realizada com sucesso!');
    } catch (error) {
      return toast.error(error.response.data.error);
    }
  };

  const sellFlower = async (flowerData) => {
    const flowerDataWithId = {
      flowerId,
      ...flowerData,
    };

    try {
      const response = await userAPI.sellFlowers(flowerDataWithId, localStorage.getItem('token'));

      setFlowers(response.flowers);

      toast.success('Venda realizada com sucesso!');
      return true;
    } catch (error) {
      toast.error(error.response.data.error);
      return false;
    }
  };

  const deleteFlower = async (flowerIdParameter) => {
    try {
      const response = await userAPI.deleteFlower(flowerIdParameter, localStorage.getItem('token'));

      setFlowers(response.flowers);

      toast.success('Flor deletada com sucesso!');
    } catch (error) {
      toast.error(error.response.data.error);
    }
  };

  return (
    <div className="div_dashboard-stock">
      <Modal
        top="10%"
        left="32%"
        width="663px"
        height="570px"
        modalIsOpen={openModal}
        closeModal={() => { setOpenModal(false); }}
      >
        <FlowerSignUpForm
          isEdit={isEdit}
          flowerInfo={flowerInfo}
          handleSubmit={isEdit ? editFlower : handleSubmit}
          closeModal={() => setOpenModal(false)}
        />
      </Modal>
      <Modal
        top="30%"
        left="40%"
        width="348px"
        height="280px"
        modalIsOpen={openModalSell}
        closeModal={() => { setOpenModalSell(false); }}
      >
        <SellForm
          closeModal={() => setOpenModalSell(false)}
          sellFlower={sellFlower}
          flowerInfo={flowerInfo}
        />
      </Modal>
      <header className="header_dashboard-stock">
        <h1>Estoque de flores</h1>
        <Button
          style={{
            width: '114px', backgroundColor: '#6C9300', border: 'none', marginRight: '152px',
          }}
          onClick={() => {
            setOpenModal(true);
            setIsEdit(false);
          }}
        >
          <div style={{
            display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
          }}
          >
            <img alt="add button" src="/assets/images/add_circle.png" style={{ width: '20px', marginRight: '8px' }} />
            <p>Nova Flor</p>
          </div>
        </Button>
      </header>
      <div className="div_table-stock">
        <header>
          <h2>Flores cadastradas em estoque</h2>
        </header>
        <table className="table_table-stock">
          <thead>
            <tr>
              <th>Lote</th>
              <th>Validade</th>
              <th>Descrição</th>
              <th>Preço</th>
              <th>Quantidade</th>
              <th>Opções</th>
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
                    <div className="indicator" style={{ backgroundColor: flower.quantity < 5 ? '#D83F51' : '#80AE00' }} />
                    {flower.quantity}
                  </td>
                  <td>
                    <div>
                      <CleanButton onClick={() => {
                        setFlowerId(_id);
                        setOpenModalSell(true);
                        setFlowerInfo({
                          price: flower.price,
                        });
                      }}
                      >
                        <img alt="add button" src="/assets/images/sell2.png" />
                      </CleanButton>
                      <CleanButton onClick={() => {
                        setFlowerId(_id);
                        setIsEdit(true);
                        setOpenModal(true);
                        setFlowerInfo({
                          lote: flower.lote,
                          validity: flower.validity,
                          description: flower.description,
                          price: flower.price,
                          quantity: flower.quantity,
                        });
                      }}
                      >
                        <img alt="add button" src="/assets/images/edit.png" />
                      </CleanButton>
                      <CleanButton onClick={() => deleteFlower(_id)}>
                        <img alt="add button" src="/assets/images/delete.png" />
                      </CleanButton>
                    </div>
                  </td>
                </tr>
              );
            }) : <p>Nenhuma flor cadastrada.</p>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

Stock.propTypes = {
  flowers: PropTypes.shape([]).isRequired,
  setFlowers: PropTypes.func.isRequired,
};

export default Stock;
