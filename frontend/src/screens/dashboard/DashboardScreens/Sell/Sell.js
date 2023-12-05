import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

import CleanButton from '../../../../components/cleanButton/CleanButton';
import Modal from '../../../../components/Modal/Modal';
import userAPI from '../../../../API/userAPI';
import SellForm from '../../../../components/sellForm/SellForm';
import utils from '../../../../utils/utils';
import THeadTable from '../../../../components/THeadTable/THeadTable';

function Sell() {
  const [openModalSell, setOpenModalSell] = useState(false);
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

  const sellFlower = async (flowerData) => {
    const flowerDataWithId = {
      flowerId,
      ...flowerData,
    };

    try {
      const flowersAPI = await userAPI.sellFlowers(flowerDataWithId, localStorage.getItem('token'));

      setFilteredFlowers(flowersAPI.flowers);

      await userAPI.getUser(localStorage.getItem('token'));

      setOpenModalSell(false);

      toast.success('Venda realizada com sucesso!');

      return true;
    } catch (error) {
      toast.error(error?.response?.data?.error);
      return false;
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
        width="348px"
        height="280px"
        modalIsOpen={openModalSell}
        closeModal={() => { setOpenModalSell(false); }}
      >
        <SellForm
          closeModal={async () => {
            setOpenModalSell(false);
          }}
          sellFlower={sellFlower}
          flowerInfo={flowerInfo}
        />
      </Modal>
      <header className="header_dashboard-stock">
        <h1>Estoque de flores</h1>
        <div className="login_div-input" style={{ marginRight: '150px' }}>
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
      </header>
      <div className="div_table-stock">
        <header>
          <h2>Flores cadastradas em estoque</h2>
        </header>
        <table className="table_table-stock">
          <thead>
            <tr>
              <THeadTable title="Lote" sortMethod={() => utils.sortByLote(filteredFlowers, setFilteredFlowers)} />
              <THeadTable title="Validade" sortMethod={() => utils.sortByValidity(filteredFlowers, setFilteredFlowers)} />
              <th>Descrição</th>
              <th>Categoria</th>
              <th>Fornecedor</th>
              <THeadTable title="Preço" sortMethod={() => utils.sortByPrice(filteredFlowers, setFilteredFlowers)} />
              <THeadTable title="Quantidade" sortMethod={() => utils.sortByQuantity(filteredFlowers, setFilteredFlowers)} />
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
                  <td>{flower.category}</td>
                  <td>{flower.provider}</td>
                  <td>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(flower.price)}</td>
                  <td>
                    <div className="indicator" style={{ backgroundColor: flower.quantity < 5 ? '#D83F51' : '#80AE00' }} />
                    {flower.quantity}
                  </td>
                  <td>
                    <CleanButton onClick={async () => {
                      setFlowerId(_id);
                      setOpenModalSell(true);
                      setFlowerInfo({
                        price: flower.price,
                      });
                    }}
                    >
                      <img alt="add button" src="/assets/images/sell2.png" />
                    </CleanButton>
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

export default Sell;
