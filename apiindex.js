// Simple Express server for Vercel
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// Test route
app.get('/api/products', (req, res) => {
  res.json({ 
    message: 'API is working!',
    products: [
      { id: 1, name: 'Steel Sheet', quantity: 85 },
      { id: 2, name: 'Copper Wire', quantity: 45 }
    ]
  });
});

// Catch-all for other API routes
app.all('/api/*', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

export default app;