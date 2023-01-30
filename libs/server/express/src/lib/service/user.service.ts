import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function findUser(data : string | number, select : any){
    const where = (typeof(data) === 'string' ? {
        username : data
        } : {
            id : data
        });
        
    return prisma.user.findFirst({
        where : where,
        select
    });
}


export async function findUsers(where : object, select : any){

    return prisma.user.findMany({
        where,
        select
    });
}

export async function updateUser(id : number, data : object){
  return prisma.user.update({
        where: {
        id: id
        },
        data: data
    });
}

export async function createUser(data: any){
   return prisma.user.create({
        data : data
    });     
}