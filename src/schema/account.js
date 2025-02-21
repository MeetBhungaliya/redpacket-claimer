import z from "zod";

const addAccountSchema = z.object({
  label: z.string().min(2).max(50),
  curl: z.string().min(1, { message: "CURL is required" }),
});

const headerSchema = z.object({
  "bnc-uuid": z
    .string({ message: "bnc-uuid is missing" })
    .uuid({ message: "bnc-uuid is invalid" }),
  csrftoken: z.string({ message: "csrftoken is missing" }),
  "device-info": z.string({ message: "device-info is missing" }),
  "fvideo-id": z.string({ message: "fvideo-id is missing" }),
  "fvideo-token": z.string({ message: "fvideo-token is missing" }),
  cookie: z.string({ message: "cookie is missing" }),
  clienttype: z.string({ message: "clienttype is missing" }),
});

const addTelegramAccountSchema = z.object({
  number: z.string().regex(/^\+91\d{10}$/, {
    message: "Invalid number",
  }),
  code: z
    .string()
    .length(5, { message: "Code must be exactly 5 characters long" }),
});

export { addAccountSchema, headerSchema, addTelegramAccountSchema };
