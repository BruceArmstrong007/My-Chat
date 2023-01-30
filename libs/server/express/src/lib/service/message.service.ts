import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function createMessage(data: any){
    return prisma.messages.create({
         data : data
     });     
}

export async function findMessages(where : object){
    return prisma.messages.findMany({
        where
    });
}