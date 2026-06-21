import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const executeCode = async (code, language, stdin = '') => {
  const res = await axios.post(`${BASE_URL}/api/execute`, {
    code,
    language,
    stdin,
  });
  return res.data;
};

export const reviewCode = async (code, language) => {
  const res = await axios.post(`${BASE_URL}/api/review`, { code, language });
  return res.data;
};