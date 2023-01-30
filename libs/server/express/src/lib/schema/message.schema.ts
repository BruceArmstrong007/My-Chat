import { object, string, number, TypeOf } from 'zod';

export const messageSchema = object({
    body: object({
        id: string(),
        from : number(),
        to : number(),
        message: string().min(1),
    })
});

export type messageSchemaType = TypeOf<typeof messageSchema>;
