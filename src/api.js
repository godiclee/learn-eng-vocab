import axios from 'axios';

const instance = axios.create({
  baseURL: (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') 
    ? "/api" : "http://localhost:5000/api"
});

export default instance;