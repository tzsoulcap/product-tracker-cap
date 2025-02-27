
import { useState, useMemo } from "react";
import { ChevronDown, ChevronUp, Filter } from "lucide-react";
import { DataTableColumn } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DataTableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  onRowClick?: (row: T) => void;
  searchField?: keyof T | string | ((row: T) => string);
  emptyMessage?: string;
}

function DataTable<T>({
  data,
  columns,
  onRowClick,
  searchField,
  emptyMessage = "No data available",
}: DataTableProps<T>) {
  const [sortField, setSortField] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [searchTerm, setSearchTerm] = useState("");

  const handleSort = (field: keyof T) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredData = useMemo(() => {
    let filtered = [...data];

    // Apply search filter if searchField is provided
    if (searchField && searchTerm) {
      filtered = filtered.filter((row) => {
        // If searchField is a function, use it to get the searchable value
        if (typeof searchField === "function") {
          const value = searchField(row);
          return value.toLowerCase().includes(searchTerm.toLowerCase());
        }
        
        // If searchField is a simple property of T
        if (typeof searchField === "string" && searchField in row) {
          const value = row[searchField as keyof T];
          if (typeof value === "string") {
            return value.toLowerCase().includes(searchTerm.toLowerCase());
          } else if (typeof value === "number") {
            return value.toString().includes(searchTerm);
          }
        }
        
        return false;
      });
    }

    // Apply sorting
    if (sortField) {
      filtered.sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];

        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortDirection === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        } else if (
          (typeof aValue === "number" && typeof bValue === "number") ||
          (typeof aValue === "boolean" && typeof bValue === "boolean")
        ) {
          if (sortDirection === "asc") {
            return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
          } else {
            return bValue < aValue ? -1 : bValue > aValue ? 1 : 0;
          }
        }
        return 0;
      });
    }

    return filtered;
  }, [data, searchTerm, sortField, sortDirection, searchField]);

  return (
    <div className="w-full animate-enter">
      {searchField && (
        <div className="mb-4 flex items-center">
          <Input
            type="text"
            placeholder="Search..."
            className="max-w-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      )}

      <div className="rounded-md border border-border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                {columns.map((column, index) => {
                  const columnField =
                    typeof column.field === "function"
                      ? null
                      : (column.field as keyof T);

                  return (
                    <th
                      key={index}
                      className={`whitespace-nowrap px-4 py-3.5 text-left text-sm font-medium text-primary ${
                        column.className || ""
                      }`}
                    >
                      {column.sortable && columnField ? (
                        <button
                          onClick={() => handleSort(columnField)}
                          className="flex items-center font-medium"
                        >
                          {column.title}
                          <span className="ml-1">
                            {sortField === columnField ? (
                              sortDirection === "asc" ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )
                            ) : (
                              <ChevronDown className="h-4 w-4 opacity-30" />
                            )}
                          </span>
                        </button>
                      ) : (
                        column.title
                      )}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className={`border-t border-border hover:bg-muted/30 ${
                      onRowClick ? "cursor-pointer" : ""
                    }`}
                    onClick={() => onRowClick && onRowClick(row)}
                  >
                    {columns.map((column, colIndex) => (
                      <td
                        key={colIndex}
                        className={`px-4 py-3 text-sm ${column.className || ""}`}
                      >
                        {typeof column.field === "function"
                          ? column.field(row)
                          : (row[column.field as keyof T] as React.ReactNode)}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-4 py-6 text-center text-muted-foreground"
                  >
                    {emptyMessage}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export { DataTable };
