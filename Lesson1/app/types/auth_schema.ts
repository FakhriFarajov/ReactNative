import { z } from 'zod'

export const signUpSchema = z.object({
  name: z.string().min(1, "Name is required"),
  surname: z.string().min(1, "Surname is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  phone: z.string().regex(/^[0-9+\-() ]{6,20}$/, "Invalid phone number").nonempty("Phone number is required"),
  address: z.string().nonempty("Address is required"),
  city: z.string().nonempty("City is required"),
})
export const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
})

export type SignUpInput = z.infer<typeof signUpSchema>
export type SignInInput = z.infer<typeof signInSchema>