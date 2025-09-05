import axios from 'axios';

export default async function handler(req, res) {
  try {
    const { id } = req.query;
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    
    let response;
    switch (req.method) {
      case 'GET':
        response = await axios.get(`${backendUrl}/api/properties/${id}`, {
          headers: req.headers,
        });
        break;
      case 'PUT':
        response = await axios.put(`${backendUrl}/api/properties/${id}`, req.body, {
          headers: req.headers,
        });
        break;
      case 'DELETE':
        response = await axios.delete(`${backendUrl}/api/properties/${id}`, {
          headers: req.headers,
        });
        break;
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    res.status(200).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      error: error.message,
      details: error.response?.data,
    });
  }
} 