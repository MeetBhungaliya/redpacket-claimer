import { fetchAccounts } from "@/api/client";
import AddAccount from "@/components/Account";
import Header from "@/components/Header";
import UsersTable from "@/components/UsersTable";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export default function App() {
  const [page] = useState(1);
  const [limit] = useState(10);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["accounts", page, limit],
    queryFn: () => fetchAccounts(page, limit),
  });

  const accounts = data?.accounts || [];
  const totalCount = data?.totalCount || 0;

  return (
    <div className="h-dvh flex flex-col overflow-hidden">
      <Header />
      <section className="h-full px-10 py-1 overflow-hidden flex flex-col">
        <div className="my-4 space-x-4 text-end">
          <AddAccount />
        </div>
        {isLoading ? (
          <div className="flex-1 flex flex-col justify-center items-center gap-4">
            <Skeleton className="w-full h-12" />
            <Skeleton className="w-full h-12" />
            <Skeleton className="w-full h-12" />
          </div>
        ) : isError ? (
          <div className="h-full w-full flex justify-center items-center text-red-500 font-semibold">
            Error loading accounts: {error?.message || "Server Error"}
          </div>
        ) : accounts.length === 0 && totalCount === 0 ? (
          <div className="h-full w-full flex justify-center items-center">
            <p className="scroll-m-20 text-2xl font-semibold tracking-tight">
              No Data Found
            </p>
          </div>
        ) : (
          <UsersTable data={accounts} totalRecords={totalCount} />
        )}
      </section>
    </div>
  );
}
