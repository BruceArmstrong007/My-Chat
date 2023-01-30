import { object, number, TypeOf } from 'zod';

export const contactSchema = object({
    body : object({
        user_id: number(),
        contact_id: number(),
    })
})

export type contactSchemaType = TypeOf<typeof contactSchema>;
