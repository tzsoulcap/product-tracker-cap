
import { Category, Supplier, Product, Inventory } from "../types";

export const categories: Category[] = [
  { id: 1, name: "Electronics", description: "Electronic devices and accessories" },
  { id: 2, name: "Clothing", description: "Apparel and accessories" },
  { id: 3, name: "Home & Kitchen", description: "Home goods and kitchen appliances" },
  { id: 4, name: "Books", description: "Books, e-books, and audiobooks" },
  { id: 5, name: "Toys", description: "Toys and games for all ages" },
];

export const suppliers: Supplier[] = [
  { id: 1, name: "TechSupply Co.", contact_info: "contact@techsupply.com", created_at: "2023-01-15T08:30:00Z" },
  { id: 2, name: "Fashion Wholesalers", contact_info: "info@fashionwholesalers.com", created_at: "2023-02-20T10:15:00Z" },
  { id: 3, name: "HomeGoods Inc.", contact_info: "sales@homegoods.com", created_at: "2023-03-05T09:45:00Z" },
  { id: 4, name: "BookWorld", contact_info: "orders@bookworld.com", created_at: "2023-03-15T11:30:00Z" },
  { id: 5, name: "Joy Toys", contact_info: "support@joytoys.com", created_at: "2023-04-10T14:20:00Z" },
];

export const products: Product[] = [
  {
    id: 1,
    name: "Laptop Pro",
    description: "High-performance laptop for professionals",
    price: 1299.99,
    category_id: 1,
    supplier_id: 1,
    created_at: "2023-05-10T14:30:00Z",
  },
  {
    id: 2,
    name: "Designer T-Shirt",
    description: "Premium cotton t-shirt",
    price: 29.99,
    category_id: 2,
    supplier_id: 2,
    created_at: "2023-05-12T10:45:00Z",
  },
  {
    id: 3,
    name: "Smart Coffee Maker",
    description: "Wi-Fi enabled programmable coffee maker",
    price: 129.99,
    category_id: 3,
    supplier_id: 3,
    created_at: "2023-05-15T09:20:00Z",
  },
  {
    id: 4,
    name: "Bestseller Novel",
    description: "Award-winning fiction novel",
    price: 19.99,
    category_id: 4,
    supplier_id: 4,
    created_at: "2023-05-18T16:10:00Z",
  },
  {
    id: 5,
    name: "Building Blocks Set",
    description: "Creative building blocks for children",
    price: 34.99,
    category_id: 5,
    supplier_id: 5,
    created_at: "2023-05-20T11:30:00Z",
  },
  {
    id: 6,
    name: "Wireless Earbuds",
    description: "Noise-cancelling wireless earbuds",
    price: 89.99,
    category_id: 1,
    supplier_id: 1,
    created_at: "2023-05-22T13:45:00Z",
  },
  {
    id: 7,
    name: "Winter Jacket",
    description: "Waterproof winter jacket",
    price: 149.99,
    category_id: 2,
    supplier_id: 2,
    created_at: "2023-05-25T15:20:00Z",
  },
  {
    id: 8,
    name: "Stainless Steel Cookware Set",
    description: "10-piece cookware set",
    price: 199.99,
    category_id: 3,
    supplier_id: 3,
    created_at: "2023-05-28T08:50:00Z",
  },
];

export const inventory: Inventory[] = [
  { id: 1, product_id: 1, quantity: 25, last_updated: "2023-06-01T09:00:00Z" },
  { id: 2, product_id: 2, quantity: 150, last_updated: "2023-06-01T09:05:00Z" },
  { id: 3, product_id: 3, quantity: 40, last_updated: "2023-06-01T09:10:00Z" },
  { id: 4, product_id: 4, quantity: 200, last_updated: "2023-06-01T09:15:00Z" },
  { id: 5, product_id: 5, quantity: 75, last_updated: "2023-06-01T09:20:00Z" },
  { id: 6, product_id: 6, quantity: 60, last_updated: "2023-06-01T09:25:00Z" },
  { id: 7, product_id: 7, quantity: 45, last_updated: "2023-06-01T09:30:00Z" },
  { id: 8, product_id: 8, quantity: 30, last_updated: "2023-06-01T09:35:00Z" },
];

// Helper functions to get related data
export const getProductsWithRelations = (): Product[] => {
  return products.map(product => ({
    ...product,
    category: categories.find(c => c.id === product.category_id),
    supplier: suppliers.find(s => s.id === product.supplier_id)
  }));
};

export const getInventoryWithRelations = (): Inventory[] => {
  return inventory.map(inv => ({
    ...inv,
    product: products.find(p => p.id === inv.product_id)
  }));
};

// Function to format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

// Function to format date
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};
