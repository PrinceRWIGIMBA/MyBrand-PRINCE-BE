// import { Express, Request, Response } from 'express';
// import swaggerJsdoc from 'swagger-jsdoc';
// import swaggerUi from 'swagger-ui-express';
// import log from './logger'

// import packageInfo from '../package.json'; 

// const options: swaggerJsdoc.Options = {
//   definition: {
//     openapi: "3.0.0",
//     info: {
//       title: "MY BRAND PRINCE API Docs",
//       version: packageInfo.version,
//     },
//     components: {
//       securitySchemas: {
//         bearerAuth: {
//           type: "http",
//           schema: "bearer",
//           bearerFormat: "JWT",
//         },
//       },
//     },
//     security: [
//       {
//         bearerAuth: [],
//       },
//     ],
//   },
//   apis:["./routes.ts"]
// };

// const swaggerSpec =swaggerJsdoc(options)

// function  swaggerDocs(app:Express,port:number){
// //swagger page

// app.use('.docs',swaggerUi.serve,swaggerUi.setup(swaggerSpec))




// //Docs in JSON format

// app.get('docs.json',(req:Request,res:Response)=>{
//     res.setHeader('connect-type','application/json');
//     res.send(swaggerSpec);
// });

// log.info(`Docs available at http://localhost:${port}/docs`);
// }

// export default swaggerDocs;
