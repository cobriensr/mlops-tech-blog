import { NextApiRequest, NextApiResponse } from "next";

// pages/api/resubscribe.js
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const response = await fetch(
      `${process.env.LAMBDA_API_URL}/api/resubscribe`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req.body)
      }
    );

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Resubscribe proxy error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}