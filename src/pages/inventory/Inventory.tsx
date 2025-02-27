
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { getInventoryWithRelations, formatCurrency } from "@/lib/data";
import { Inventory } from "@/types";

const InventoryPage = () => {
  const navigate = useNavigate();
  const [inventory] = useState(getInventoryWithRelations());

  const getStockStatus = (quantity: number) => {
    if (quantity <= 10) {
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
          <AlertTriangle className="h-3 w-3" />
          Critical
        </Badge>
      );
    } else if (quantity <= 30) {
      return (
        <Badge variant="outline" className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
          Low
        </Badge>
      );
    } else {
      return (
        <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
          In Stock
        </Badge>
      );
    }
  };

  const columns = [
    { 
      title: "Product", 
      field: (row: Inventory) => row.product?.name || "Unknown", 
      sortable: true 
    },
    { 
      title: "Category", 
      field: (row: Inventory) => row.product?.category?.name || "N/A",
    },
    { 
      title: "Quantity", 
      field: "quantity" as keyof Inventory,
      className: "font-medium"
    },
    { 
      title: "Status", 
      field: (row: Inventory) => getStockStatus(row.quantity),
    },
    { 
      title: "Price", 
      field: (row: Inventory) => formatCurrency(row.product?.price || 0),
    },
    { 
      title: "Last Updated", 
      field: (row: Inventory) => new Date(row.last_updated).toLocaleDateString() 
    },
  ];

  const handleUpdateStock = (inventoryItem: Inventory) => {
    navigate(`/inventory/update/${inventoryItem.id}`);
  };

  // Define a search function to search by product name
  const searchByProductName = (row: Inventory): string => {
    return row.product?.name || "";
  };

  return (
    <div className="space-y-6 animate-enter">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory</h1>
          <p className="mt-2 text-muted-foreground">
            Track stock levels for your products.
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
        data={inventory}
        columns={columns}
        onRowClick={handleUpdateStock}
        searchField={searchByProductName}
        emptyMessage="No inventory data found. Add products to get started."
      />
    </div>
  );
};

export default InventoryPage;
