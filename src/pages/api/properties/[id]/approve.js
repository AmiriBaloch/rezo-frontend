import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'PATCH') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id } = req.query;
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const response = await axios.patch(`${backendUrl}/api/properties/${id}/approve`, req.body, {
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