import { db } from "./db";
import {
  products,
  transactions,
  type Product,
  type InsertProduct,
  type Transaction,
  type InsertTransaction,
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";
// Import auth storage to re-export
export * from "./replit_integrations/auth/storage";

export interface IStorage {
  // Products
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  getProductBySku(sku: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, updates: Partial<InsertProduct>): Promise<Product>;
  deleteProduct(id: number): Promise<void>;

  // Transactions
  getTransactions(): Promise<(Transaction & { product?: Product })[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
}

export class DatabaseStorage implements IStorage {
  // Products
  async getProducts(): Promise<Product[]> {
    return await db.select().from(products).orderBy(products.name);
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async getProductBySku(sku: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.sku, sku));
    return product;
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [product] = await db.insert(products).values(insertProduct).returning();
    return product;
  }

  async updateProduct(id: number, updates: Partial<InsertProduct>): Promise<Product> {
    const [product] = await db
      .update(products)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(products.id, id))
      .returning();
    return product;
  }

  async deleteProduct(id: number): Promise<void> {
    await db.delete(products).where(eq(products.id, id));
  }

  // Transactions
  async getTransactions(): Promise<(Transaction & { product?: Product })[]> {
    return await db.query.transactions.findMany({
      orderBy: [desc(transactions.timestamp)],
      with: {
        product: true
      },
      limit: 50
    });
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    // 1. Create transaction record
    const [transaction] = await db.insert(transactions).values(insertTransaction).returning();
    
    // 2. Update product quantity automatically
    const product = await this.getProduct(insertTransaction.productId);
    if (product) {
      let newQuantity = product.quantity;
      if (insertTransaction.type === 'IN') {
        newQuantity += insertTransaction.quantity;
      } else if (insertTransaction.type === 'OUT') {
        newQuantity -= insertTransaction.quantity;
      } else if (insertTransaction.type === 'ADJUSTMENT') {
        // For adjustment, we might interpret quantity as the delta or the absolute value
        // Let's assume adjustment is a delta (can be negative)
        newQuantity += insertTransaction.quantity;
      }
      
      await this.updateProduct(product.id, { quantity: newQuantity });
    }

    return transaction;
  }
}

export const storage = new DatabaseStorage();
