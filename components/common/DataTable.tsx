"use client";

import { ReactNode } from "react";

export type SortOrder = "asc" | "desc";

export interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (item: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string;
  emptyMessage?: string;
  sortField?: string;
  sortOrder?: SortOrder;
  onSort?: (field: string) => void;
  rowClassName?: string | ((item: T) => string);
  searchBar?: ReactNode;
}

function SortableHeader<T>({
  column,
  sortField,
  sortOrder,
  onSort,
}: {
  column: Column<T>;
  sortField?: string;
  sortOrder?: SortOrder;
  onSort?: (field: string) => void;
}) {
  const getSortIcon = () => {
    if (sortField !== column.key) return "⇅";
    return sortOrder === "asc" ? "↑" : "↓";
  };

  if (!column.sortable || !onSort) {
    return (
      <th
        className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
          column.className || ""
        }`}
      >
        {column.label}
      </th>
    );
  }

  return (
    <th
      onClick={() => onSort(column.key)}
      className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors select-none ${
        column.className || ""
      }`}
    >
      <div className="flex items-center gap-2">
        {column.label}
        <span className="text-gray-400">{getSortIcon()}</span>
      </div>
    </th>
  );
}

export default function DataTable<T>({
  data,
  columns,
  keyExtractor,
  emptyMessage = "No hay datos para mostrar",
  sortField,
  sortOrder,
  onSort,
  rowClassName = "hover:bg-gray-50",
  searchBar,
}: DataTableProps<T>) {
  return (
    <div className="bg-white rounded-lg shadow">
      {/* Barra de búsqueda opcional */}
      {searchBar && (
        <div className="p-6 border-b border-gray-200">{searchBar}</div>
      )}

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <SortableHeader
                  key={column.key}
                  column={column}
                  sortField={sortField}
                  sortOrder={sortOrder}
                  onSort={onSort}
                />
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-8 text-center text-gray-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr
                  key={keyExtractor(item)}
                  className={
                    typeof rowClassName === "function"
                      ? rowClassName(item)
                      : rowClassName
                  }
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={`px-6 py-4 ${column.className || ""}`}
                    >
                      {column.render
                        ? column.render(item)
                        : String(
                            (item as Record<string, unknown>)[column.key] || ""
                          )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
