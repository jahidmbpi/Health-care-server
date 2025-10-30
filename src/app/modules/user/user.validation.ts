import { Gender } from "@prisma/client";
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

export const createDoctorZodSchema = z.object({
  password: z.string({ error: "Password is required" }),
  doctor: z.object({
    name: z.string({ error: "Name is required" }),
    email: z.string({ error: "Email is required" }),
    contactNumber: z.string({
      error: "Contact Number is required!",
    }),
    address: z.string({ error: "Address is required" }),
    registrationNumber: z.string({
      error: "Register number is required",
    }),
    experience: z.number().optional(),
    gender: z.enum(Object.values(Gender)),
    appoinmentFee: z.number({ error: "Appointment fee is required" }),
    qualification: z.string({ error: "Qualification is required" }),
    currentWorkingPlace: z.string({
      error: "Current working place is required",
    }),
    designation: z.string({ error: "Designation is required!" }),
  }),
});
