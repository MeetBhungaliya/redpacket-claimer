"use client";

import { Checkbox } from "../ui/checkbox";
import ColumnHeader from "@/components/DataTable/ColumnHeader";
import RowActions from "@/components/DataTable/RowActions";

export const columns = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: "label",
    header: ({ column }) => (
      <ColumnHeader column={column} title="Account label" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("label")}
          </span>
        </div>
      );
    },
  },

  {
    accessorKey: "user.name",
    header: ({ column }) => (
      <ColumnHeader column={column} title="Account owner" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.original.user.name}
          </span>
        </div>
      );
    },
  },

  {
    id: "actions",
    cell: ({ row }) => <RowActions row={row} />,
  },
];
