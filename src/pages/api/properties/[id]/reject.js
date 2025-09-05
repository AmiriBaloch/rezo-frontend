import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id } = req.query;
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const response = await axios.delete(`${backendUrl}/api/properties/${id}/reject`, {
      headers: req.headers,
    });
    res.status(200).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      error: error.message,
      details: error.response?.data,
    });
  }
} 