export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.substring(7);
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://147.93.84.104';

    // Forward the request to your backend
    const response = await fetch(`${backendUrl}/api/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return res.status(response.status).json({
        message: errorData.message || 'Failed to fetch profile',
        status: response.status
      });
    }

    const profileData = await response.json();
    return res.status(200).json(profileData);

  } catch (error) {
    console.error('Profile API error:', error);
    return res.status(500).json({
      message: 'Internal server error',
      error: error.message
    });
  }
}
