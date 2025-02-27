import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { getProductsWithRelations, formatCurrency } from "@/lib/data";
import { Product } from "@/types";

const Products = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ [key: string]: string }>({});
  const [suppliers, setSuppliers] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:8000/products');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:8000/categories');
        const data = await response.json();
        const categoryMap = data.reduce((acc: { [key: string]: string }, category: { id: string, name: string }) => {
          acc[category.id] = category.name;
          return acc;
        }, {});
        setCategories(categoryMap);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    const fetchSuppliers = async () => {
      try {
        const response = await fetch('http://localhost:8000/suppliers');
        const data = await response.json();
        const supplierMap = data.reduce((acc: { [key: string]: string }, supplier: { id: string, name: string }) => {
          acc[supplier.id] = supplier.name;
          return acc;
        }, {});
        setSuppliers(supplierMap);
      } catch (error) {
        console.error('Error fetching suppliers:', error);
      }
    };

    fetchProducts();
    fetchCategories();
    fetchSuppliers();
  }, []);

  const columns = [
    { title: "Name", field: "name" as keyof Product, sortable: true },
    { title: "Category", field: (row: Product) => categories[row.category_id] || "N/A" },
    { title: "Supplier", field: (row: Product) => suppliers[row.supplier_id] || "N/A" },
    { 
      title: "Price", 
      field: (row: Product) => formatCurrency(row.price),
      className: "font-medium"
    },
    { 
      title: "Created", 
      field: (row: Product) => new Date(row.created_at).toLocaleDateString() 
    },
  ];

  return (
    <div className="space-y-6 animate-enter">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="mt-2 text-muted-foreground">
            Manage your product catalog.
          </p>
        </div>
        <div className="flex space-x-4">
          <Button 
            className="mt-4 md:mt-0" 
            onClick={() => navigate("/products/add")}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
          <Button 
            className="mt-4 md:mt-0" 
            onClick={() => navigate("/products/add-excel")}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Product with Excel
          </Button>
        </div>
      </div>

      <DataTable
        data={products}
        columns={columns}
        onRowClick={(row) => navigate(`/products/${row.id}`)}
        searchField="name"
        emptyMessage="No products found. Add your first product to get started."
      />
    </div>
  );
};

export default Products;
