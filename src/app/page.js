import AddAccount from "@/components/Account";
import UsersTable from "@/components/UsersTable";
import { prisma } from "@/lib/prisma";

export default async function Home({ searchParams }) {
  const search = await searchParams;

  const page = +search["page"] || 1;
  const limit = +search["limit"] || 10;

  const [accounts, totalCount] = await prisma.$transaction([
    prisma.account.findMany({
      skip: (+page - 1) * limit,
      take: +limit,
      select: {
        label: true,
        data: true,
        fingerprint: true,
        user: {
          select: {
            name: true,
            fingerprint: true,
          },
        },
      },
    }),
    prisma.account.count(),
  ]);

  return (
    <section className="h-full px-10 py-1 overflow-hidden">
      <div className="my-4 space-x-4 text-end">
        <AddAccount />
      </div>
      {Array.isArray(accounts) && accounts.length === 0 && totalCount === 0 ? (
        <div className="h-full w-full flex justify-center items-center">
          <p className="scroll-m-20 text-2xl font-semibold tracking-tight">
            No Data Found
          </p>
        </div>
      ) : (
        <UsersTable data={accounts} totalRecords={totalCount} />
      )}
    </section>
  );
}
