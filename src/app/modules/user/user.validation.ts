import z, { email } from "zod";

const createUserSchema = z.object({
  name: z.string(),
  email: z
    .email({ message: "Invalid email address format " })
    .min(5, { message: "email must be atleast 5  charecter log" })
    .max(100, { message: "email can not exceed 100 charcter" }),
  password: z.string().min(6, { message: "password must be 6 charecter long" }),
});
