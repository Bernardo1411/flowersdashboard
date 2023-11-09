import axios from 'axios';

const API_BASE_URL = 'http://192.168.0.7:5001';
const userAPI = {
  signupUser: async (userData) => {
    const response = await axios.post(`${API_BASE_URL}/user/signup`, userData);

    return response.data;
  },

  signinUser: async (userData) => {
    const response = await axios.post(`${API_BASE_URL}/user/signin`, userData);

    return response.data;
  },

  addFlower: async (flowerData, token) => {
    const response = await axios.post(`${API_BASE_URL}/user/addflower`, flowerData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  },

  getUser: async (token) => {
    const response = await axios.get(`${API_BASE_URL}/user`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  },

  getFlowers: async (token) => {
    const response = await axios.get(`${API_BASE_URL}/user/getflowers`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  },

  sellFlowers: async (flowerId, quantityToSell, token) => {
    const response = await axios.post(
      `${API_BASE_URL}/user/sellflower`,
      { flowerId, quantityToSell },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    return response.data;
  },

  editFlower: async (flowerData, token) => {
    const response = await axios.put(`${API_BASE_URL}/user/editflower`, flowerData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  },
};

export default userAPI;
