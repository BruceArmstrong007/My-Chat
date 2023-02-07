import express, {Request, Response, Router} from 'express';
import { login, register, logout, accessToken } from './controller/auth.controller';
import { unfriend ,request, accept } from './controller/contact.controller';
import { load } from './controller/message.controller';
import { user, update, find, resetPassword } from './controller/user.controller';
import validate from './middleware/requestValidator';
import verifyToken from './middleware/tokenVerification';
import { loginSchema, registerSchema } from './schema/auth.schema';
import { contactSchema } from './schema/contact.schema';
import { findUserSchema, resetPasswordSchema, updateUserSchema } from './schema/user.schema';

export const expressRoutes : Router = express.Router();
const authRoutes : Router = express.Router();
expressRoutes.use('/auth',authRoutes);
const userRoutes : Router = express.Router();
expressRoutes.use('/user',userRoutes);
userRoutes.use(verifyToken);
const contactRoutes : Router = express.Router();
expressRoutes.use('/contact',contactRoutes);
contactRoutes.use(verifyToken);
const messageRoutes : Router = express.Router();
expressRoutes.use('/message',messageRoutes);
messageRoutes.use(verifyToken);


export const CLIENT_URL = process.env.NODE_ENV == 'production' ? process.env.WEB_CLIENT_URL : process.env.LOCAL_CLIENT_URL;

// Health Check
expressRoutes.get('/',(req : Request,res : Response)=> res.json({success : true, message : 'API is working!'}));

// Auth Routes
authRoutes.post('/login',validate(loginSchema),login);
authRoutes.post('/register',validate(registerSchema),register);
authRoutes.get('/logout',verifyToken,logout);
authRoutes.get('/accessToken',accessToken);

// User Routes
userRoutes.get('/',verifyToken,user);
userRoutes.post('/update',validate(updateUserSchema),update);
userRoutes.post('/find',validate(findUserSchema),find);
userRoutes.post('/resetPassword',validate(resetPasswordSchema),resetPassword);

// Contact Routes
contactRoutes.post('/request',validate(contactSchema),request);
contactRoutes.post('/accept',validate(contactSchema),accept);
contactRoutes.post('/unfriend',validate(contactSchema),unfriend);

// Message Routes
messageRoutes.post('/',validate(contactSchema),load);




