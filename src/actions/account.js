"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const createAccount = async (payload) => {
  const { label, data, fingerprint } = payload;

  try {
    const accounts = await prisma.account.findMany({
      select: {
        data: true,
      },
    });

    const isSameAccountData = accounts.some(
      (accountData) =>
        JSON.stringify(accountData.data.headers) ===
        JSON.stringify(data.headers)
    );

    if (isSameAccountData) return new Error("Account exist");

    const user = await prisma.account.create({
      data: { label, data, fingerprint },
    });

    revalidatePath("/", "layout");
    return user;
  } catch (error) {
    return null;
  }
};

export { createAccount };

