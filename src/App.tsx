
import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Sidebar from "./components/layout/Sidebar";
import Index from "./pages/Index";
import Products from "./pages/products/Products";
import AddProduct from "./pages/products/AddProduct";
import Categories from "./pages/categories/Categories";
import AddCategory from "./pages/categories/AddCategory";
import Suppliers from "./pages/suppliers/Suppliers";
import AddSupplier from "./pages/suppliers/AddSupplier";
import Inventory from "./pages/inventory/Inventory";
import UpdateInventory from "./pages/inventory/UpdateInventory";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="flex min-h-screen bg-background">
            <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
            <div className="flex w-full flex-1 flex-col lg:pl-64">
              <Navbar toggleSidebar={toggleSidebar} />
              <main className="flex-1 px-4 py-20 md:px-6 lg:px-8">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/products/add" element={<AddProduct />} />
                  <Route path="/categories" element={<Categories />} />
                  <Route path="/categories/add" element={<AddCategory />} />
                  <Route path="/suppliers" element={<Suppliers />} />
                  <Route path="/suppliers/add" element={<AddSupplier />} />
                  <Route path="/inventory" element={<Inventory />} />
                  <Route path="/inventory/update/:id" element={<UpdateInventory />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
