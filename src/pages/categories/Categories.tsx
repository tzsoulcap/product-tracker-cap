
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { categories } from "@/lib/data";
import { Category } from "@/types";

const Categories = () => {
  const navigate = useNavigate();
  const [data] = useState(categories);

  const columns = [
    { title: "Name", field: "name" as keyof Category, sortable: true },
    { 
      title: "Description", 
      field: (row: Category) => row.description || "No description", 
      className: "max-w-md truncate"
    },
    {
      title: "Products",
      field: (row: Category) => "0", // In a real app, this would be a count of products
      className: "text-center"
    },
  ];

  return (
    <div className="space-y-6 animate-enter">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <p className="mt-2 text-muted-foreground">
            Manage product categories.
          </p>
        </div>
        <Button 
          className="mt-4 md:mt-0" 
          onClick={() => navigate("/categories/add")}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      <DataTable
        data={data}
        columns={columns}
        onRowClick={(row) => navigate(`/categories/${row.id}`)}
        searchField="name"
        emptyMessage="No categories found. Add your first category to get started."
      />
    </div>
  );
};

export default Categories;
