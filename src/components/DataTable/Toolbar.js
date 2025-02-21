import React, { Fragment } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Filters from "./Filters";
import { X } from "lucide-react";
import ViewOptions from "./ViewOptions";

const Toolbar = ({ table, filters }) => {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        {filters.hasOwnProperty("search")
          ? filters.search.map((field, index) => {
              return (
                <Input
                  key={index}
                  placeholder={field.placeholder}
                  value={
                    table.getColumn(field.column_name)?.getFilterValue() ?? ""
                  }
                  onChange={(event) =>
                    table
                      .getColumn(field.column_name)
                      ?.setFilterValue(event.target.value)
                  }
                  className="h-8 w-[150px] lg:w-[250px]"
                />
              );
            })
          : null}

        {filters.hasOwnProperty("columns")
          ? filters.columns.map((item, index) => {
              const column = table.getColumn(item.accessorKey);

              if (
                !column ||
                !Array.isArray(item.options) ||
                !Boolean(item.options.length)
              )
                return <Fragment key={index} />;

              return (
                <Filters
                  key={index}
                  column={column}
                  title={item.title}
                  options={item.options}
                />
              );
            })
          : null}

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X />
          </Button>
        )}
      </div>
      <ViewOptions table={table} />
    </div>
  );
};

export default Toolbar;
