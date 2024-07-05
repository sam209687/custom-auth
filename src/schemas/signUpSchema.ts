import { z } from "zod";


export const usernameValidation = z
        .string()
        .min(2, "minimum 2 characters required")
        .max(20, "maximum 20 characters only")
        .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain any special charactes")

        export const signUpSchema = z.object(
            {
                username : usernameValidation,

                phone : z.string()
                .min(10, {message : "Minimum 10 digits required"})
                .max(10, { message : "not more that 10 digits"}),


                email : z.string().email({message : "Invalid email address"}),

                password : z.string().min(6, {message :"Minimus 6 character required"}),
                
                confirm_password : z.string().min(6, {message :"Minimus 6 character required"}),
            })
            .refine((data) => data.password === data.confirm_password, {
                path : ["confirm_password"],
            });