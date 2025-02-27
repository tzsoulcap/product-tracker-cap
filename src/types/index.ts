
export interface Category {
  id: number;
  name: string;
  description: string | null;
}

export interface Supplier {
  id: number;
  name: string;
  contact_info: string | null;
  created_at: string;
}

export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  category_id: number;
  supplier_id: number;
  created_at: string;
  category?: Category;
  supplier?: Supplier;
}

export interface Inventory {
  id: number;
  product_id: number;
  quantity: number;
  last_updated: string;
  product?: Product;
}

export interface SidebarItem {
  title: string;
  path: string;
  icon: React.ComponentType;
}

export interface DataTableColumn<T> {
  title: string;
  field: keyof T | ((row: T) => React.ReactNode);
  sortable?: boolean;
  className?: string;
}
