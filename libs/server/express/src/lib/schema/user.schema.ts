import { object, string, number, TypeOf } from 'zod';

export const updateUserSchema =  object({
  body : object({
    username: string().min(6).max(15),
    image: string().optional(),
    bio: string().optional(),
    id: number(),
  })
  });

export type updateUserSchemaType = TypeOf<typeof updateUserSchema>;

export const findUserSchema =  object({
  body : object({
  username: string(),
  })
});

export type findUserSchemaType = TypeOf<typeof updateUserSchema>;


export const resetPasswordSchema = object({
  body : object({
    id : number(),
    username : string().min(8).max(15),
    password : string().min(8).max(36),
    confirmPassword : string().min(8).max(36)
  })
}).refine(({ body }) => body.confirmPassword === body.password, {
  message: "Passwords do not match",
  path: ["passwordConfirmation"],
});

export type resetPasswordSchemaType = TypeOf<typeof resetPasswordSchema>;

