
import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { 
  Package, 
  Database, 
  Tags, 
  Truck, 
  Home, 
  ChevronLeft, 
  ChevronRight 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarItem } from "@/types";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const sidebarItems: SidebarItem[] = [
  { title: "Dashboard", path: "/", icon: Home },
  { title: "Products", path: "/products", icon: Package },
  { title: "Categories", path: "/categories", icon: Tags },
  { title: "Suppliers", path: "/suppliers", icon: Truck },
  { title: "Inventory", path: "/inventory", icon: Database },
];

const Sidebar = ({ isOpen, toggleSidebar }: SidebarProps) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && isMobile && (
        <div 
          className="fixed inset-0 z-30 bg-black/25 backdrop-blur-sm lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-full w-64 transform border-r border-border bg-sidebar text-sidebar-foreground transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:pt-16`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between p-4 lg:hidden">
            <span className="text-xl font-medium">ProductPanda</span>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleSidebar}
              aria-label="Close sidebar"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </div>

          {/* Sidebar content */}
          <div className="flex-1 overflow-y-auto py-4">
            <nav className="mt-2 px-3">
              <ul className="space-y-1">
                {sidebarItems.map((item) => (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        `flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${
                          isActive
                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                            : "text-sidebar-foreground"
                        }`
                      }
                      end={item.path === "/"}
                    >
                      {/* Use a function to render the icon component */}
                      {React.createElement(item.icon, { className: "mr-3 h-5 w-5" })}
                      <span>{item.title}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Sidebar footer */}
          <div className="border-t border-border p-4">
            <div className="hidden lg:block">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={toggleSidebar}
              >
                <ChevronLeft className={`mr-2 h-4 w-4 transition-transform ${isOpen ? "" : "rotate-180"}`} />
                <span>Collapse</span>
              </Button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
