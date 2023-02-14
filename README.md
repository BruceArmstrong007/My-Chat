# Trying out new technologies - tRPC , prisma , zod , NX workspace , Tailwind , OnPush with Standalone components

# Note
  I dont like some of this things how it turned out since im learning tailwind as well as reactive angular with On Push

# Chat App - Features
 Auth with JWT \
 Find , add , remove friends, reject or accept friend request \
 Realtime notifications \
 Chat with friends \
 Change profile picture with url , password or username \
 Dark and light mode \
 Video Call Friends, mute audio / video on video call \
 File Transfer
 
 
# Commands to run the sever and client locally
1.) npm i \
2.) npm run db:generate \
3.) npm run db:migrate \
4.) npx nx serve client - starts angular client @ port 4200 \
5.) npx nx serve server - starts trpc http server @ port 3333 \
6.) npm run db:show - to host visual representation of sqlite DB @ port 5000




# Images
![image](https://user-images.githubusercontent.com/48177059/218684001-baee5bb1-9925-4afa-8ad5-bccfc9c59a91.png)
<img width="960" alt="image" src="https://user-images.githubusercontent.com/48177059/218681852-e285831b-775a-4bf1-8928-cf5419a1a4e5.png">
<img width="959" alt="image" src="https://user-images.githubusercontent.com/48177059/218678939-41bb4f0c-4bc8-49b7-8d4a-a885bcc9f1b6.png">
<img width="960" alt="image" src="https://user-images.githubusercontent.com/48177059/217805563-5ac2a9e9-a342-4e29-8d06-d774e6d47a43.png">
<img width="957" alt="image" src="https://user-images.githubusercontent.com/48177059/217785923-382ea051-fc89-45c2-80d9-22b2ccfdff3a.png">
<img width="960" alt="resetpassword" src="https://user-images.githubusercontent.com/48177059/213621138-4e94d9c2-0c0b-40bc-825e-f89d8b82a09f.png">
<img width="959" alt="profile" src="https://user-images.githubusercontent.com/48177059/213621142-851891d8-2b29-4feb-8115-827214b811d1.png">
<img width="960" alt="chat2" src="https://user-images.githubusercontent.com/48177059/213621146-580b7fc5-ea29-4fc6-b126-37ad34b1fe7f.png">
<img width="960" alt="chat" src="https://user-images.githubusercontent.com/48177059/213621148-40904a26-c0ea-481c-9ff2-571aea88ac46.png">
<img width="960" alt="friendlistpage2" src="https://user-images.githubusercontent.com/48177059/213621152-3212e612-ebc2-4d68-8817-81cce56a2fc8.png">
<img width="960" alt="friendlistpage" src="https://user-images.githubusercontent.com/48177059/213621154-2109c930-74f3-4cb5-a10e-721678450455.png">
<img width="960" alt="findfriends" src="https://user-images.githubusercontent.com/48177059/213621157-bfd6b97b-19ed-415e-bd26-624acb6be75a.png">
<img width="960" alt="loginpage" src="https://user-images.githubusercontent.com/48177059/213621160-f8bd9e1f-8a1f-476f-8964-04e3b79e8071.png">
<img width="960" alt="landingpage" src="https://user-images.githubusercontent.com/48177059/213621162-189d6d0c-0c1b-4072-b385-87f561d10350.png">
<img width="960" alt="registerpage" src="https://user-images.githubusercontent.com/48177059/213621167-74607e1f-98f1-4a96-a399-5bd71fc4ec0d.png">

# NX Commands
Express NX Server
npx nx generate @nrwl/express:application server --frontendProject=client --tags=scope:chat-app,type:server --no-interactive

Express NX Library
 npx nx generate @nrwl/node:library trpc --directory=server/trpc --importPath=@server/trpc --js --strict --tags=scope:server,type:trpc --testEnvironment=node --no-interactive 

Standalone NX Application
npx nx generate @nrwl/angular:application client --addTailwind --backendProject=server --e2eTestRunner=none --inlineStyle --inlineTemplate --routing --skipTests --standalone --standaloneConfig --tags=scope:chat-app,type:client --no-interactive 

Standalone NX Library - Component
npx nx generate @nrwl/angular:library core --directory=client --changeDetection=OnPush --importPath=@client/core --inlineStyle --inlineTemplate --lazy --routing --simpleModuleName --standalone --tags=scope:client,type:core --no-interactive  

Standalone NX Library - Module
npx nx generate @nrwl/angular:library core --style=none --directory=client --importPath=@client/core --simpleModuleName --tags=scope:client,type:core --no-interactive

Standalone NX Component
npx nx generate @nrwl/angular:component header --project=ui --changeDetection=OnPush --skipImport --standalone --no-interactive 


# ChatApp

✨ **This workspace has been generated by [Nx, a Smart, fast and extensible build system.](https://nx.dev)** ✨

## Development server

Run `nx serve client` for a dev server. Navigate to http://localhost:4200/. The app will automatically reload if you change any of the source files.

## Understand this workspace

Run `nx graph` to see a diagram of the dependencies of the projects.

## Remote caching

Run `npx nx connect-to-nx-cloud` to enable [remote caching](https://nx.app) and make CI faster.

## Further help

Visit the [Nx Documentation](https://nx.dev) to learn more.
