import { z } from "zod";


export const usernameValidation = z
        .string()
        .min(2, "minimum 2 characters required")
        .max(2, "maximum 20 characters only")
        .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain any special charactes")

        export const signUpSchema = z.object(
            {
                username : usernameValidation,
                email : z.string().email({message : "Invalid email address"}),
                password : z.string().min(6, {message :"Minimus 6 character required"}),
            }
        )