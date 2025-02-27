
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { suppliers } from "@/lib/data";
import { Supplier } from "@/types";

const Suppliers = () => {
  const navigate = useNavigate();
  const [data] = useState(suppliers);

  const columns = [
    { title: "Name", field: "name" as keyof Supplier, sortable: true },
    { 
      title: "Contact Info", 
      field: (row: Supplier) => row.contact_info || "No contact information", 
    },
    { 
      title: "Added", 
      field: (row: Supplier) => new Date(row.created_at).toLocaleDateString() 
    },
    {
      title: "Products",
      field: (row: Supplier) => "0", // In a real app, this would be a count of products
      className: "text-center"
    },
  ];

  return (
    <div className="space-y-6 animate-enter">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Suppliers</h1>
          <p className="mt-2 text-muted-foreground">
            Manage your product suppliers.
          </p>
        </div>
        <Button 
          className="mt-4 md:mt-0" 
          onClick={() => navigate("/suppliers/add")}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Supplier
        </Button>
      </div>

      <DataTable
        data={data}
        columns={columns}
        onRowClick={(row) => navigate(`/suppliers/${row.id}`)}
        searchField="name"
        emptyMessage="No suppliers found. Add your first supplier to get started."
      />
    </div>
  );
};

export default Suppliers;
