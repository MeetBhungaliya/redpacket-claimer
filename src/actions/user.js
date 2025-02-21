"use server";

import { prisma } from "@/lib/prisma";

const getUser = async (data) => {
  const { fingerprint } = data;

  try {
    const user = await prisma.user.findFirstOrThrow({
      where: { fingerprint },
    });
    return user;
  } catch (error) {
    return null;
  }
};

const isUsernameAvailabel = async (data) => {
  const { name } = data;

  try {
    const user = await prisma.user.findFirst({
      where: { name },
    });

    return user ? false : true;
  } catch (error) {
    console.log(error, "error from server");
    return null;
  }
};

const createUser = async (data) => {
  const { fingerprint, name } = data;

  try {
    const user = await prisma.user.create({
      data: { fingerprint, name },
    });

    return user;
  } catch (error) {
    return null;
  }
};

export { createUser, getUser, isUsernameAvailabel };
