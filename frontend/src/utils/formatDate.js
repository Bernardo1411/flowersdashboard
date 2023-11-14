const utils = {
  convertToNormalDate: (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const normalDate = new Date(dateString).toLocaleDateString('pt-BR', options);
    return normalDate;
  },
};

export default utils;
