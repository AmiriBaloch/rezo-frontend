export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Use env variable for backend URL
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://147.93.84.104';
    
    // Redirect to the backend Google OAuth endpoint
    res.redirect(`${backendUrl}/api/auth/google`);
  } catch (error) {
    console.error('Google OAuth API error:', error);
    res.status(500).json({ 
      message: 'Failed to redirect to Google OAuth',
      error: error.message 
    });
  }
} 