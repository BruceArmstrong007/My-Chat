import {Request, Response} from 'express';
import * as bcrypt from 'bcrypt';
import { TokenPayload } from '../schema/token.schema';
import { createUser, findUser, updateUser } from '../service/user.service';
import { signJwt, verifyJwt } from '../utils/jwt.utils';
import { selectUserExist, selectUserWithPassword, selectUserWithToken } from '../selector/user.selector';

export async function login(req: Request,res: Response){
    try {
        const input = req.body;

        //Finding user
        const user:any = await findUser(input.username,selectUserWithPassword);

        //If user not found
        if (!user) {
            return res.status(400).json({success: false, message : "Invalid username or password."});
        }

        //Compare password
        const isEqual = await bcrypt.compare(input.password, user.password);

        //If password not equal
        if (!isEqual) {
            return res.status(400).json({success: false, message : "Invalid username or password."});
        }

        //Generate jwt
        const payload: TokenPayload = { id: user.id, username: user.username};
        const token = await signJwt(payload, process.env.AUTHTOKENSECRET, { expiresIn: 60 * 60 * 24 });

        //Generate and attach refresh token with response
        const refreshToken = await signJwt({ id: user.id }, process.env.REFRESHTOKENSECRET, { expiresIn: 60 * 60 * 24 });
        
        console.info( process.env.WEB_CLIENT_URL + "/");
        await res.cookie('refreshToken', refreshToken, {sameSite: 'none',httpOnly:true, secure: true ,maxAge : 10000000});

        //Saving refresh token in DB
        await updateUser(user.id,{refreshToken});

        //Returning token
        return res.status(200).json({ success: true, data : {token}, message : "User successfully logged in." });
    } catch (e: any) {
    return res.status(409).json({success: false, message: e.message });
    }
}

export async function register(req: Request,res: Response){
    try {
    const input = req.body;

    //Hash the password
    const hashedPassword = await bcrypt.hash(input.password, Number(process.env.SALT_ROUNDS));

    //Finding user from DB
    const user = await findUser(input.username,selectUserExist);

    if(user){
    return res.status(400).json({success: false, message: 'Username already exist, try a different one.'});
    }

    //Create user in DB and return it without password
    await createUser({ username : input.username, password : hashedPassword })

    return res.status(200).json({ success : true, message : 'User registered successfully.'});

    } catch (e: any) {
    return res.status(409).json({success: false, message: e.message });
    }
}

export async function logout(req: Request,res: Response){
    try {
        const userPayload = res.locals.userPayload;
        
        //Update refresh token in DB
        await updateUser(userPayload.id,{refreshToken:null})
      
        //Update refresh token in response
        await res.clearCookie('refreshToken')
        return res.status(200).json({success : true, message: "Logged out successfully."});
      
    } catch (e: any) {
    return res.status(409).json({success: false, message: e.message });
    }
}

export async function accessToken(req: Request,res: Response){
    try {
    //Getting refresh token from cookies
    const refreshToken = req?.cookies?.refreshToken;

    if(!refreshToken){
        return res.status(400).json({success: false, message: 'Session expired.' });
    }

    //Verify refresh token and get ID
    const { valid,expired,decoded,error } = await verifyJwt(refreshToken,process.env.REFRESHTOKENSECRET);
    
    if(!valid && expired){
        return res.status(400).json({ success: false, message: error.message });
    }
    
    const user = await findUser(decoded.id, selectUserWithToken);

    //Unauthorized
    if (!user || user.refreshToken !== refreshToken) {  
        return res.status(400).json({success: false, message : "Unauthorized."});
    }
    
    const payload: TokenPayload = { id: user.id, username: user.username };

    //Generate new jwt token
    const token = await signJwt(payload, process.env.AUTHTOKENSECRET, { expiresIn: 60 * 60 * 24 });


    //Generate new refresh token
    const newRefreshToken = await signJwt({ id: user.id }, process.env.REFRESHTOKENSECRET, { expiresIn: 60 * 60 * 24 });

    //Update refresh token in DB
    await updateUser(user.id,{refreshToken : newRefreshToken});
        
    //Send new refresh token as cookie in response
    await res.cookie('refreshToken', newRefreshToken, {sameSite: 'none',httpOnly:true, secure: true, maxAge : 10000000});

    return res.status(200).json({ success: true, data : {token} });
    } catch (e: any) {
    return res.status(409).json({success: false, message: e.message });
    }
}