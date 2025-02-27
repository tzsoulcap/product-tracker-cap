import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Supplier } from "@/types";
import Select from 'react-select';

const Suppliers = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<Supplier[]>([]);
  const [selectedFields, setSelectedFields] = useState<string[]>(["name"]);
  const [sortField, setSortField] = useState<string>("name");
  const [sortOrder, setSortOrder] = useState<string>("asc");

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await fetch(`http://localhost:8000/suppliers?sortField=${sortField}&sortOrder=${sortOrder}`);
        if (!response.ok) {
          throw new Error('Failed to fetch suppliers');
        }
        const suppliers = await response.json();
        console.log(suppliers);
        setData(suppliers);
      } catch (error) {
        console.error('Error fetching suppliers:', error);
      }
    };

    fetchSuppliers();
  }, [sortField, sortOrder]);

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

  const fieldOptions = [
    { value: "name", label: "Name" },
    { value: "contact_info", label: "Contact Info" },
    { value: "created_at", label: "Added" },
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
        <div className="flex space-x-4">
          <Button 
            className="mt-4 md:mt-0" 
            onClick={() => navigate("/suppliers/add")}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Supplier
          </Button>
        </div>
      </div>

      <div className="flex space-x-4 mb-4">
        <div>
          <label htmlFor="fieldSelect" className="mr-2">Select fields to display:</label>
          <Select
            id="fieldSelect"
            isMulti
            options={fieldOptions}
            value={fieldOptions.filter(option => selectedFields.includes(option.value))}
            onChange={(selected) => {
              const values = selected ? selected.map(option => option.value) : [];
              setSelectedFields(values);
            }}
          />
        </div>
        <div>
          <label htmlFor="sortField" className="mr-2">Sort by:</label>
          <select id="sortField" value={sortField} onChange={(e) => setSortField(e.target.value)}>
            <option value="name">Name</option>
            <option value="contact_info">Contact Info</option>
            <option value="created_at">Added</option>
          </select>
        </div>
        <div>
          <label htmlFor="sortOrder" className="mr-2">Sort order:</label>
          <select id="sortOrder" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>

      <DataTable
        data={data}
        columns={columns.filter(column => selectedFields.includes(column.field as string))}
        onRowClick={(row) => navigate(`/suppliers/${row.id}`)}
        searchField="name"
        emptyMessage="No suppliers found. Add your first supplier to get started."
      />
    </div>
  );
};

export default Suppliers;
