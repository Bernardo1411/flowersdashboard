import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

import Button from '../../../../components/Button/Button';
import CleanButton from '../../../../components/cleanButton/CleanButton';
import Modal from '../../../../components/Modal/Modal';
import userAPI from '../../../../API/userAPI';
import FlowerSignUpForm from '../../../../components/flowerSignUpForm/FlowerSignUpForm';
import utils from '../../../../utils/formatDate';

import './Stock.css';

function Stock() {
  const [openModal, setOpenModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [flowerId, setFlowerId] = useState(false);
  const [flowerInfo, setFlowerInfo] = useState({});
  const [search, setSearch] = useState('');
  const [filteredFlowers, setFilteredFlowers] = useState([]);

  const fetchFlowers = async () => {
    try {
      const flowersData = await userAPI.getFlowers(localStorage.getItem('token'));

      return setFilteredFlowers(flowersData);
    } catch (error) {
      return toast.error(error?.response?.data?.error);
    }
  };

  useEffect(() => {
    (async () => {
      await fetchFlowers();
    })();
  }, []);

  const handleSubmit = async (flowerData) => {
    try {
      const flowersAPI = await userAPI.addFlower(flowerData, localStorage.getItem('token'));

      setFilteredFlowers(flowersAPI.data.flowers);

      toast.success('Cadastro realizado com sucesso!');
    } catch (error) {
      toast.error(error?.response?.data?.error);
    }
  };

  const editFlower = async (flowerData) => {
    const flowerDataWithId = {
      flowerId,
      ...flowerData,
    };

    try {
      const flowersAPI = await userAPI.editFlower(flowerDataWithId, localStorage.getItem('token'));

      setFilteredFlowers(flowersAPI.flowers);

      return toast.success('Edição realizada com sucesso!');
    } catch (error) {
      return toast.error(error?.response?.data?.error);
    }
  };

  const deleteFlower = async (flowerIdParameter) => {
    try {
      const flowersAPI = await userAPI.deleteFlower(flowerIdParameter, localStorage.getItem('token'));

      setFilteredFlowers(flowersAPI.flowers);

      toast.success('Flor deletada com sucesso!');
    } catch (error) {
      toast.error(error?.response?.data?.error);
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const searchHandler = () => {
    if (search !== '') {
      const filterFlowers = filteredFlowers
        .filter((flower) => flower.category.toLowerCase() === search.toLowerCase()
     || flower.lote === search);

      setFilteredFlowers([...filterFlowers]);
    } else {
      fetchFlowers();
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
      <header className="header_dashboard-stock">
        <h1>Estoque de flores</h1>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <div className="login_div-input" style={{ marginRight: '13px' }}>
            <input
              className="login_input"
              type="email"
              id="search"
              value={search}
              onChange={handleSearchChange}
              placeholder="Buscar"
              required
            />
            <CleanButton onClick={searchHandler}>
              <img
                src="/assets/images/search.png"
                alt="person"
              />
            </CleanButton>
          </div>
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
        </div>
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
            {filteredFlowers && filteredFlowers.length > 0 ? filteredFlowers.map((flower) => {
              const { _id } = flower;
              return (
                <tr key={_id}>
                  <td>{flower.lote}</td>
                  <td>{utils.convertToNormalDate(flower.validity)}</td>
                  <td>{flower.description}</td>
                  <td>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(flower.price)}</td>
                  <td>
                    <div className="indicator" style={{ backgroundColor: flower.quantity < 5 ? '#D83F51' : '#80AE00' }} />
                    {flower.quantity}
                  </td>
                  <td>
                    <div className="div_td_stock">
                      <div style={{ marginRight: '12px' }}>
                        <CleanButton
                          onClick={() => {
                            setFlowerId(_id);
                            setIsEdit(true);
                            setOpenModal(true);
                            setFlowerInfo({
                              lote: flower.lote,
                              validity: flower.validity,
                              description: flower.description,
                              price: flower.price,
                              quantity: flower.quantity,
                              category: flower.category,
                              provider: flower.provider,
                            });
                          }}
                        >
                          <img alt="add button" src="/assets/images/edit.png" />
                        </CleanButton>
                      </div>
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

export default Stock;
