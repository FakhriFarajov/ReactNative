import { z } from "zod";

export const signUpSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters long"),
    surname: z.string().min(2, "Surname must be at least 2 characters long"),
    email: z
        .string()
        .min(1, "Email is required")
        .email("Invalid email address"),
    password: z
        .string()
        .min(1, "Password is required")
        .min(8, "Password must be at least 8 characters long"),
});

export type SignUpSchemaType = z.infer<typeof signUpSchema>;

