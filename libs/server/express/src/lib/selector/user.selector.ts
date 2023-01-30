import { Prisma } from "@prisma/client";

  export const selectWithoutCredential = Prisma.validator<Prisma.UserSelect>()({
    username: true,
    bio: true,
    image: true,
    id: true,
    password: false,
    contact: true
  })
  
  export const selectUserExist = Prisma.validator<Prisma.UserSelect>()({
    username: true,
    id: true
  }) 

  export const selectUserWithToken = Prisma.validator<Prisma.UserSelect>()({
    id : true,
    username: true,
    password: false,
    refreshToken: true
  })
  
  export const selectUserWithPassword = Prisma.validator<Prisma.UserSelect>()({
    id : true,
    username: true,
    password: true,
    refreshToken: true
  })
  