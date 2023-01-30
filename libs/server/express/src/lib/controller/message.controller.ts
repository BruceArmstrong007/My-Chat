import {Request, Response} from 'express';
import { findMessages } from '../service/message.service';

export async function load(req: Request,res: Response){
    try{
        const input = req?.body;
        const messages = await findMessages({
            OR : [
            {
                from: {
                equals : input.user_id
                },
                to: {
                equals : input.contact_id
                }
            },
            {
            from: {
                equals : input.contact_id
            },
            to: {
                equals : input.user_id
            }
            }
        ]
        });
        
        return res.status(200).json({success:true, data : {messages}});
    }
    catch (e: any){
        return res.status(409).json({success: false, message: e.message });
    }
}
