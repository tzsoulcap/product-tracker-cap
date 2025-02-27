
import { useNavigate } from "react-router-dom";
import { 
  Package, 
  Tags, 
  Truck, 
  Database, 
  TrendingUp, 
  AlertTriangle 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { 
  products, 
  categories, 
  suppliers, 
  inventory,
  getProductsWithRelations,
  formatCurrency,
  formatDate
} from "@/lib/data";
import { Product } from "@/types";

const Dashboard = () => {
  const navigate = useNavigate();
  const productsWithRelations = getProductsWithRelations();
  
  // Calculate stats
  const totalProducts = products.length;
  const totalCategories = categories.length;
  const totalSuppliers = suppliers.length;
  const totalInventory = inventory.reduce((sum, item) => sum + item.quantity, 0);
  
  // Get low stock items (less than 30)
  const lowStockItems = inventory.filter(item => item.quantity < 30);
  
  // Recent products (top 5)
  const recentProducts = [...productsWithRelations]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);
  
  const productColumns = [
    { title: "Name", field: "name" as keyof Product, sortable: true },
    { title: "Category", field: (row: Product) => row.category?.name || "N/A" },
    { title: "Price", field: (row: Product) => formatCurrency(row.price) },
    { title: "Added", field: (row: Product) => formatDate(row.created_at) },
  ];

  return (
    <div className="space-y-8 animate-enter">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Overview of your product inventory system.
        </p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{totalProducts}</div>
              <div className="rounded-full bg-primary/10 p-2 text-primary">
                <Package className="h-5 w-5" />
              </div>
            </div>
            <Button 
              variant="ghost" 
              className="mt-4 w-full justify-start p-0 text-sm text-muted-foreground"
              onClick={() => navigate("/products")}
            >
              View all products →
            </Button>
          </CardContent>
        </Card>
        
        <Card className="card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{totalCategories}</div>
              <div className="rounded-full bg-primary/10 p-2 text-primary">
                <Tags className="h-5 w-5" />
              </div>
            </div>
            <Button 
              variant="ghost" 
              className="mt-4 w-full justify-start p-0 text-sm text-muted-foreground"
              onClick={() => navigate("/categories")}
            >
              View all categories →
            </Button>
          </CardContent>
        </Card>
        
        <Card className="card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Suppliers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{totalSuppliers}</div>
              <div className="rounded-full bg-primary/10 p-2 text-primary">
                <Truck className="h-5 w-5" />
              </div>
            </div>
            <Button 
              variant="ghost" 
              className="mt-4 w-full justify-start p-0 text-sm text-muted-foreground"
              onClick={() => navigate("/suppliers")}
            >
              View all suppliers →
            </Button>
          </CardContent>
        </Card>
        
        <Card className="card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Inventory
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{totalInventory.toLocaleString()}</div>
              <div className="rounded-full bg-primary/10 p-2 text-primary">
                <Database className="h-5 w-5" />
              </div>
            </div>
            <Button 
              variant="ghost" 
              className="mt-4 w-full justify-start p-0 text-sm text-muted-foreground"
              onClick={() => navigate("/inventory")}
            >
              View inventory details →
            </Button>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Products */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Recent Products</h2>
          <Button 
            variant="outline" 
            onClick={() => navigate("/products/add")}
          >
            Add Product
          </Button>
        </div>
        <DataTable
          data={recentProducts}
          columns={productColumns}
          onRowClick={(row) => navigate(`/products/${row.id}`)}
        />
      </div>
      
      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <Card className="border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950">
          <CardHeader>
            <CardTitle className="flex items-center text-amber-600 dark:text-amber-500">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Low Stock Alert
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {lowStockItems.map((item) => {
                const product = products.find(p => p.id === item.product_id);
                return (
                  <li key={item.id} className="flex items-center justify-between">
                    <span>{product?.name}</span>
                    <span className="font-medium text-amber-600 dark:text-amber-500">
                      {item.quantity} items left
                    </span>
                  </li>
                );
              })}
            </ul>
            <Button 
              variant="outline" 
              className="mt-4 border-amber-200 bg-amber-100 hover:bg-amber-200 dark:border-amber-800 dark:bg-amber-900 dark:hover:bg-amber-800"
              onClick={() => navigate("/inventory")}
            >
              Manage Inventory
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
