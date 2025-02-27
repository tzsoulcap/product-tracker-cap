import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Category } from "@/types";

const Categories = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:8000/categories');
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const categories = await response.json();
        setData(categories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

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
        <div className="flex space-x-4">
          <Button 
            className="mt-4 md:mt-0" 
            onClick={() => navigate("/categories/add")}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Button>
          <Button 
            className="mt-4 md:mt-0" 
            onClick={() => navigate("/categories/add-excel")}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Category with Excel
          </Button>
        </div>
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
