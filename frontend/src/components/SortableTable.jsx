import React from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';

const SortableTable = ({ columns, data, sorting, setSorting }) => {
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualSorting: true, // Delegating sorting to the backend
  });

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-md">
      <table className="w-full border-collapse text-left text-sm text-slate-300">
        <thead className="bg-slate-950-80 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const canSort = header.column.getCanSort();
                const isSorted = header.column.getIsSorted();
                
                return (
                  <th
                    key={header.id}
                    className={`px-6 py-4 font-medium transition-colors ${
                      canSort ? 'cursor-pointer hover:bg-slate-800-50 hover:text-white select-none' : ''
                    }`}
                    onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                  >
                    <div className="flex items-center gap-2">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {canSort && (
                        <span className="transition-opacity">
                          {isSorted === 'asc' ? (
                            <ChevronUp className="w-4 h-4 text-indigo-400" />
                          ) : isSorted === 'desc' ? (
                            <ChevronDown className="w-4 h-4 text-indigo-400" />
                          ) : (
                            <ChevronsUpDown className="w-4 h-4 text-slate-500 hover:text-slate-300" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-slate-800-40 bg-slate-900-20">
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="hover:bg-slate-800-20 transition-colors">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="text-center py-12 text-slate-500 font-medium">
                No matching records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SortableTable;
