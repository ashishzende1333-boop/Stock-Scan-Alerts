import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { setupAuth, registerAuthRoutes } from "./replit_integrations/auth";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup Auth
  await setupAuth(app);
  registerAuthRoutes(app);

  // Products
  app.get(api.products.list.path, async (req, res) => {
    const products = await storage.getProducts();
    res.json(products);
  });

  app.get(api.products.get.path, async (req, res) => {
    const product = await storage.getProduct(Number(req.params.id));
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  });

  app.get(api.products.getBySku.path, async (req, res) => {
    const product = await storage.getProductBySku(req.params.sku);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  });

  app.post(api.products.create.path, async (req, res) => {
    try {
      const input = api.products.create.input.parse(req.body);
      const product = await storage.createProduct(input);
      res.status(201).json(product);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      // Check for unique constraint violation on SKU
      if (err instanceof Error && err.message.includes('unique constraint')) {
        return res.status(400).json({
          message: 'SKU must be unique',
          field: 'sku'
        });
      }
      throw err;
    }
  });

  app.put(api.products.update.path, async (req, res) => {
    try {
      const input = api.products.update.input.parse(req.body);
      const product = await storage.updateProduct(Number(req.params.id), input);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.json(product);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.delete(api.products.delete.path, async (req, res) => {
    await storage.deleteProduct(Number(req.params.id));
    res.status(204).send();
  });

  // Transactions
  app.get(api.transactions.list.path, async (req, res) => {
    const transactions = await storage.getTransactions();
    res.json(transactions);
  });

  app.post(api.transactions.create.path, async (req, res) => {
    try {
      const input = api.transactions.create.input.parse(req.body);
      const transaction = await storage.createTransaction(input);
      res.status(201).json(transaction);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  // Seed data
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const products = await storage.getProducts();
  if (products.length === 0) {
    console.log('Seeding database...');
    
    const p1 = await storage.createProduct({
      sku: 'WIDGET-001',
      name: 'Standard Widget',
      description: 'A standard industrial widget used in assembly.',
      quantity: 150,
      minQuantity: 20,
      location: 'A-01-01',
      imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=200'
    });

    const p2 = await storage.createProduct({
      sku: 'BOLT-M8',
      name: 'M8 Hex Bolt',
      description: 'Stainless steel M8 hex bolt, 50mm.',
      quantity: 10, // Low stock!
      minQuantity: 50,
      location: 'B-02-15',
      imageUrl: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&q=80&w=200'
    });

    const p3 = await storage.createProduct({
      sku: 'SENSOR-PROX',
      name: 'Proximity Sensor',
      description: 'Inductive proximity sensor, 12V.',
      quantity: 5, // Very low stock!
      minQuantity: 10,
      location: 'C-05-02',
      imageUrl: 'https://images.unsplash.com/photo-1563770094-11802d26d405?auto=format&fit=crop&q=80&w=200'
    });

    await storage.createTransaction({
      productId: p1.id,
      type: 'IN',
      quantity: 150
    });

    await storage.createTransaction({
      productId: p2.id,
      type: 'IN',
      quantity: 10
    });
    
    await storage.createTransaction({
      productId: p3.id,
      type: 'IN',
      quantity: 5
    });

    console.log('Database seeded!');
  }
}
