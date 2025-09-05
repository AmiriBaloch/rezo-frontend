export default async function handler(req, res) {
  const { method } = req;
  const { id: conversationId } = req.query;

  if (!['GET', 'POST'].includes(method)) {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ message: 'Authorization header required' });
  }

  try {
    // Use env variable for backend URL
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://147.93.84.104';
    
    if (method === 'GET') {
      // Get messages for conversation
      const { limit, before } = req.query;
      const queryParams = new URLSearchParams();
      if (limit) queryParams.append('limit', limit);
      if (before) queryParams.append('before', before);
      
      const response = await fetch(`${backendUrl}/api/conversations/${conversationId}/messages?${queryParams}`, {
        method: 'GET',
        headers: {
          'Authorization': authorization,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        return res.status(response.status).json(data);
      }

      res.status(200).json(data);
    } else if (method === 'POST') {
      // Create new message
      const response = await fetch(`${backendUrl}/api/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': authorization,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req.body),
      });

      const data = await response.json();
      
      if (!response.ok) {
        return res.status(response.status).json(data);
      }

      res.status(201).json(data);
    }
  } catch (error) {
    console.error('Messages API error:', error);
    res.status(500).json({ 
      message: `Failed to ${method === 'GET' ? 'fetch' : 'create'} messages`,
      error: error.message 
    });
  }
} 