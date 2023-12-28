import axios from 'axios';

const API_BASE_URL = 'https://lively-helmet-goat.cyclic.app/';
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

  sellFlowers: async (flowerData, token) => {
    const response = await axios.post(
      `${API_BASE_URL}/user/sellflower`,
      flowerData,
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

  deleteFlower: async (flowerId, token) => {
    const response = await axios.delete(`${API_BASE_URL}/user/deleteflower`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { flowerId }, // Send flowerId in the request body
    });

    return response.data;
  },
};

export default userAPI;
