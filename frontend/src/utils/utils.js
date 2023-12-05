const utils = {
  // Help function to format the date
  convertToNormalDate: (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const normalDate = new Date(dateString).toLocaleDateString('pt-BR', options);
    return normalDate;
  },
  // Help function responsible to list the elements of a list by lote
  sortByLote: (data, setData) => {
    const sortedFlowers = [...data].sort((a, b) => a.lote.localeCompare(b.lote));
    setData(sortedFlowers);
  },
  // Help function responsible to list the elements of a list by validity
  sortByValidity: (data, setData) => {
    const sortedFlowers = [...data]
      .sort((a, b) => new Date(a.validity) - new Date(b.validity));
    setData(sortedFlowers);
  },
  // Help function responsible to list the elements of a list by price
  sortByPrice: (data, setData) => {
    const sortedFlowers = [...data].sort((a, b) => a.price - b.price);
    setData(sortedFlowers);
  },
  // Help function responsible to list the elements of a list by quantity
  sortByQuantity: (data, setData) => {
    const sortedFlowers = [...data].sort((a, b) => a.quantity - b.quantity);
    setData(sortedFlowers);
  },
};

export default utils;
