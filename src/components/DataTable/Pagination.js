import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect } from "react";
import { useStep } from "usehooks-ts";

const Pagination = ({ table, totalRecords }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = +searchParams.get("page") || 1;
  const limit = +searchParams.get("limit") || 10;
  const totalPages = Math.ceil(totalRecords / limit);

  const [, helpers] = useStep(totalPages);

  useEffect(() => {
    helpers.setStep(page);

    if (!searchParams.has("page") && !searchParams.has("limit")) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", 1);
      params.set("limit", 10);
      return router.push(pathname + "?" + params.toString());
    }

    if (!searchParams.has("page")) {
      return updateQueryString("page", 1);
    }

    if (!searchParams.has("limit")) {
      return updateQueryString("limit", 10);
    }

    if (isNaN(+searchParams.get("page"))) {
      return updateQueryString("page", 1);
    }
    if (isNaN(+searchParams.get("limit"))) {
      return updateQueryString("limit", 10);
    }
  }, [page, limit]);

  const updateQueryString = useCallback(
    (name, value) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return router.push(pathname + "?" + params.toString());
    },
    [searchParams]
  );

  const handleChangePage = (page) => {
    helpers.setStep(page);
    updateQueryString("page", page);
  };

  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex-1 text-sm text-muted-foreground">
        {table.getFilteredSelectedRowModel().rows.length} of&nbsp;
        {table.getFilteredRowModel().rows.length} row(s) selected.
      </div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={limit.toString()}
            onValueChange={(value) => updateQueryString("limit", value)}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={limit.toString()} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {page} of {totalPages}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => handleChangePage(1)}
            disabled={!helpers.canGoToPrevStep}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => handleChangePage(page - 1)}
            disabled={!helpers.canGoToPrevStep}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => handleChangePage(page + 1)}
            disabled={!helpers.canGoToNextStep}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => handleChangePage(totalPages)}
            disabled={!helpers.canGoToNextStep}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
