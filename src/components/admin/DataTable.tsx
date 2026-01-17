import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (item: T) => void;
}

function DataTable<T extends { id: string | number }>({ 
  data, 
  columns, 
  onRowClick 
}: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border/50">
            {columns.map((col) => (
              <th 
                key={col.key} 
                className={cn(
                  "text-right py-4 px-4 text-sm font-medium text-muted-foreground",
                  col.className
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr 
              key={item.id} 
              className={cn(
                "border-b border-border/30 transition-colors",
                onRowClick && "cursor-pointer hover:bg-muted/30"
              )}
              onClick={() => onRowClick?.(item)}
            >
              {columns.map((col) => (
                <td key={col.key} className={cn("py-4 px-4", col.className)}>
                  {col.render 
                    ? col.render(item) 
                    : String((item as Record<string, unknown>)[col.key] ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {data.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          لا توجد بيانات
        </div>
      )}
    </div>
  );
}

export default DataTable;
