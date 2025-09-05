import axios from 'axios';

export default async function handler(req, res) {
  try {
    // Adjust the backend URL as needed
    const backendUrl = process.env.BACKEND_URL || 'https://147.93.84.104';
    const response = await axios.get(`${backendUrl}/api/properties`, {
      headers: req.headers,
      params: req.query,
    });
    res.status(200).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      error: error.message,
      details: error.response?.data,
    });
  }
} 