
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { getProductsWithRelations, formatCurrency } from "@/lib/data";
import { Product } from "@/types";

const Products = () => {
  const navigate = useNavigate();
  const [products] = useState(getProductsWithRelations());

  const columns = [
    { title: "Name", field: "name" as keyof Product, sortable: true },
    { title: "Category", field: (row: Product) => row.category?.name || "N/A" },
    { title: "Supplier", field: (row: Product) => row.supplier?.name || "N/A" },
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
        <Button 
          className="mt-4 md:mt-0" 
          onClick={() => navigate("/products/add")}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
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
