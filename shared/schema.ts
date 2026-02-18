import { pgTable, text, serial, integer, boolean, timestamp, varchar, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Import auth schema to re-export
export * from "./models/auth";

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  sku: text("sku").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  quantity: integer("quantity").notNull().default(0),
  minQuantity: integer("min_quantity").notNull().default(5), // Low stock threshold
  location: text("location"),
  imageUrl: text("image_url"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull(), // Foreign key references products.id
  type: text("type").notNull(), // 'IN', 'OUT', 'ADJUSTMENT'
  quantity: integer("quantity").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

// Relations
export const productsRelations = relations(products, ({ many }) => ({
  transactions: many(transactions),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  product: one(products, {
    fields: [transactions.productId],
    references: [products.id],
  }),
}));

// Schemas
export const insertProductSchema = createInsertSchema(products).omit({ id: true, updatedAt: true });
export const insertTransactionSchema = createInsertSchema(transactions).omit({ id: true, timestamp: true });

// Types
export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;

export type CreateProductRequest = InsertProduct;
export type UpdateProductRequest = Partial<InsertProduct>;
