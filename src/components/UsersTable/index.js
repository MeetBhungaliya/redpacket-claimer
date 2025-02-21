import DataTable from "@/components/DataTable";
import { columns } from "./columns";

const index = ({ data, totalRecords }) => {
  return (
    <DataTable
      data={data}
      columns={columns}
      totalRecords={totalRecords}
      filters={{
        search: [
          {
            column_name: "user_name",
            placeholder: "Search owner name...",
          },
        ],
        columns: [
          {
            accessorKey: "label",
            title: "Account Label",
            options: [{ label: "Meet", value: "Meet" }],
          },
        ],
      }}
    />
  );
};

export default index;
