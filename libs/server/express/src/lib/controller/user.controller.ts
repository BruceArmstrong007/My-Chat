import {Request, Response} from 'express';
import { selectWithoutCredential } from '../selector/user.selector';
import { findUser,findUsers,updateUser } from '../service/user.service';
import * as bcrypt from 'bcrypt';

export async function user(req: Request,res: Response){
    try {
        const userPayload = res.locals.userPayload;

        //Update refresh token in DB
        const user = await findUser(userPayload.id,selectWithoutCredential)

        //User not found
        if(!user){
            return res.status(400).json({ success : false, message : "Unauthenticated."});
        }
        const contact : any[] = user?.contact;
        const contacts = [];
        if(contact){
            for(let i = 0; i < contact.length;i++){
                const cont = await findUser(contact[i]?.contact_id,{
                    id : true,
                    username : true,
                    image : true
                })
                contacts.push({
                ...cont,
                status : contact[i]?.status
                })

            }
        }


        return res.status(200).json({success: true,data: {...user,contact:contacts}})
    } catch (e: any) {
    return res.status(409).json({success: false, message: e.message });
    }
}

export async function update(req: Request,res: Response){
    try {
    const input = req?.body;
    //Finding user from DB
    const user = await findUser(input?.username,selectWithoutCredential)

    if(!user){
       return res.status(404).json({message : "User not found.", success : false})
    }


    //Updating user details in DB and getting user details without credentials
    await updateUser(user?.id,{
    username: input?.username,
    image: input?.image,
    bio: input?.bio,
    });

    return res.status(200).json({ success : true, message : "Profile updated successfully."});

    } catch (e: any) {
    return res.status(409).json({success: false, message: e.message });
    }
}

export async function find(req: Request,res: Response){
    try {
    const input = req?.body;
    //Getting user from DB
    const user = await findUsers(
         {
        username : {
            contains : input.username
        }
        },
        selectWithoutCredential
    );

    return res.status(200).json({data: user, success: true});

    } catch (e: any) {
    return res.status(409).json({success: false, message: e.message });
    }
}

export async function resetPassword(req: Request,res: Response){
    try {
    const input = req?.body;

    //Hash the password
    const hashedPassword = await bcrypt.hash(input?.password, Number(process.env.SALT_ROUNDS));

    //Create user in DB and return it without password
    await updateUser(input?.id,{ password : hashedPassword });

    return res.status(200).json({ success : true , message : 'User password updated successfully.'});

    } catch (e: any) {
    return res.status(409).json({success: false, message: e.message });
    }
}
