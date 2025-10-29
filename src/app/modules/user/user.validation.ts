import z from "zod";

export const createPatientZodSchema = z.object({
  password: z.string(),
  patient: z.object({
    name: z.string(),
    email: z
      .string({
        error: "Email is required!",
      })
      .email(),
    contactNumber: z
      .string({
        error: "Contact number is required!",
      })
      .optional(),
    address: z
      .string({
        error: "address is required",
      })
      .optional(),
  }),
});

export const createAdminZodSchema = z.object({
  password: z.string(),
  admin: z.object({
    name: z.string({ error: "name is required" }),
    email: z
      .string({ error: "Email is required!" })
      .email("Invalid email format"),

    contactNumber: z
      .string({ error: " constact number is required" })
      .optional(),
    address: z.string().optional(),
  }),
});
