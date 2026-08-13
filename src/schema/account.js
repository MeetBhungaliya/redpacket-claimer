import z from "zod";

const addAccountSchema = z.object({
  label: z.string().min(2).max(50),
  curl: z.string().min(1, { message: "CURL is required" }),
});

const headerSchema = z.record(z.string(), z.any());

const addTelegramAccountSchema = z.object({
  number: z.string().regex(/^\+91\d{10}$/, {
    message: "Invalid number",
  }),
  code: z
    .string()
    .length(5, { message: "Code must be exactly 5 characters long" }),
});

export { addAccountSchema, headerSchema, addTelegramAccountSchema };
