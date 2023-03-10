import {Request, Response} from 'express';
import { updateUser } from '../service/user.service';

export async function request(req: Request | any,res: Response){
    try {
    const input = req?.body;
    //on friend request updating contact table
    await updateUser(input?.user_id,{
        contact:{
            create: {
            contact_id :input.contact_id,
            status : 'sent',
            },
        }
        });

    await updateUser(input.contact_id,{
        contact:{
            create: {
            contact_id :input.user_id,
            status : 'received',
            },
        }
        });

    req.io.to(input.contact_id.toString()).emit("notification",{
        id : input.contact_id.toString(),
        type : "notification",
        category: "received",
        message : "Your have received a friend request."
    })
    return res.status(200).json({success: true, message : 'Friend request sent successfully.'});
    } catch (e: any) {
    return res.status(409).json({success: false, message: e.message });
    }
}

export async function accept(req: Request | any,res: Response){
    try {
    const input = req?.body;
    //on friend request updating contact table
    await updateUser(input.contact_id,{
        contact:{
            updateMany: {
            where:{
                contact_id : input.user_id
            },
            data:{
                status : 'friend',
            }
            },
        }
        });

    await updateUser(input.user_id,{
        contact:{
            updateMany: {
            where:{
                contact_id : input.contact_id
            },
            data:{
                status : 'friend',
            }
            },
        }
        });
    req.io.to(input.contact_id.toString()).emit("notification",{
            id : input.contact_id.toString(),
            type : "notification",
            category: "accepted",
            message : "Your friend request has been accepted."
        })

    return res.status(200).json({success: true, message : 'Friend accepted successfully.'});
    } catch (e: any) {
    return res.status(409).json({success: false, message: e.message });
    }
}

export async function unfriend(req: Request | any,res: Response){
    try {
    const input = req?.body;
    // delete contact table
    await updateUser(input.contact_id,{
        contact:{
            deleteMany: [{
            contact_id : input.user_id
            }]
        }
        });

    await updateUser(input.user_id,{
        contact:{
            deleteMany: [{
            contact_id : input.contact_id
            }]
        }
        });

    req.io.to(input.contact_id.toString()).emit("notification",{
            type : "notification",
            category: "removed",
            message : "User removed."
        })

    return res.status(200).json({success: true, message : 'User unfriend successfully.'});
    } catch (e: any) {
    return res.status(409).json({success: false, message: e.message });
    }
}
