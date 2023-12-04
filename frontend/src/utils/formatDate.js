const utils = {
  convertToNormalDate: (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const normalDate = new Date(dateString).toLocaleDateString('pt-BR', options);
    return normalDate;
  },
  sortByLote: (data, setData) => {
    const sortedFlowers = [...data].sort((a, b) => a.lote.localeCompare(b.lote));
    setData(sortedFlowers);
  },

  sortByValidity: (data, setData) => {
    const sortedFlowers = [...data]
      .sort((a, b) => new Date(a.validity) - new Date(b.validity));
    setData(sortedFlowers);
  },

  sortByPrice: (data, setData) => {
    const sortedFlowers = [...data].sort((a, b) => a.price - b.price);
    setData(sortedFlowers);
  },
  sortByQuantity: (data, setData) => {
    const sortedFlowers = [...data].sort((a, b) => a.quantity - b.quantity);
    setData(sortedFlowers);
  },
};

export default utils;
