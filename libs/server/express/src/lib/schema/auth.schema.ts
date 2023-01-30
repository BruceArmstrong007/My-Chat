import { object, string, TypeOf } from 'zod';

export const loginSchema = object({
    body : object({
        username : string().min(8).max(15),
        password : string().min(8).max(32)
    })
});

export type loginSchemaType = TypeOf<typeof loginSchema>;


export const registerSchema =  object({
    body : object({
        username : string().min(8).max(15),
        password : string().min(8).max(36),
        confirmPassword : string().min(8).max(36)
    })    
    }).refine(({ body }) => body.confirmPassword === body.password, {
        message: "Passwords do not match",
        path: ["passwordConfirmation"],
    });

export type registerSchemaType = TypeOf<typeof registerSchema>;

