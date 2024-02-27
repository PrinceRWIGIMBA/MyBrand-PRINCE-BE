import supertest from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { createToken } from '../utils/generateToken';
import createServer from '../utils/server';
import User from '../model/User';

import dotenv from "dotenv";

dotenv.config();





//const userId = new mongoose.Types.ObjectId().toString();
const app = createServer();
mongoose.set('strictQuery', false);

let userEmail="";

let blogId="";
let token="";
let r = (Math.random() + 1).toString(36).substring(5);
export const blogPayload = {
    "data": {
      "title": "programmings",
      "description": "nd typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It w",
      "contents": "nd typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It w",
      "image": "https://res.cloudinary.com/duy0lhike/image/upload/v1708864244/smjjochbgpt1i8bstndo.jpg"
    }
  };
  

  userEmail=`${r}@gmail.com`;
export const userPayload = {

  firstname:"prince",
  lastname:"kamana",
  email: userEmail,
  password: "prince31234",
  role:"admin"
};


//let jwt: string; 


  beforeAll(async () => {
    //const mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(process.env.MONGODB_URL as string);

    const user = await User.create(userPayload);
    //console.log('Created User:', user);
    // Generate JWT token before tests
    //jwt = createToken(user.id);
    //console.log(user._id);
  });



  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });


//Authentication

describe('given the user is not logged in', () => {
  it('should return a 401', async () => {
    const { statusCode } = await supertest(app).post("/api/blogs");
    expect(statusCode).toBe(401);
  });
});

describe('wrong password while login', () => {
  it('should return a 401 and a blog ', async () => {
  const response= await supertest(app).post('/api/auth/login')
  .send({ email : "prince2@gmail.com",password : "prince212350" })
  
  expect(response.statusCode).toBe(401);    
  });
});



describe('register user', () => {
  it('should return a 200 and a blog ', async () => {
  const response= await supertest(app).post('/api/auth/signup')
  .send({ 

    firstname: "prince2",
    lastname : "rwigimba2",
    email : userEmail,
    password : "prince21234" 
   })
  
  expect(response.statusCode).toBe(200);    
  });
});



describe('given the user is  logged in', () => {
  it('should return a 200 and a blog ', async () => {
  const response= await supertest(app).post('/api/auth/login')
  .send({ email : "prince2@gmail.com",password : "prince21234" })
  
  expect(response.statusCode).toBe(200);
  expect(response.body).toHaveProperty('token');
    token=`Bearer ${response.body.token}`       
  });
});


  //blogs


  describe('blog exist', () => {
    it("should return a 200, all blogs", async () => {
 
     const result= await supertest(app).get(`/api/blogs`).expect(200);
      blogId=result.body.data[0]._id;
    });
  });



    describe('blog does not exist', () => {
      it("should return a 404", async () => {
        const blogIds = '65d5ed3bac96b7bc4993a8da'
        await supertest(app).get(`/api/blogs/${blogIds}`).expect(404);
      });
    });
    
  describe('single blog ', () => {
    it("should return a 200, single blogs", async () => {
      const result=await supertest(app).get(`/api/blogs/${blogId}`)
     
     expect(200);
     expect(result.body);
    });
  });
    
      describe('getting all the blogs', () => {
        it('should return a 200', async () => {
          const { statusCode } = await supertest(app).get("/api/blogs");
          expect(statusCode).toBe(200); 
        });
      });


      describe('creating blog with unauthenticated user', () => {
        it('should return a 401', async () => {
          const { statusCode } = await supertest(app).post("/api/blogs/")
          .send({
            
              "title": "programmings",
              "description": "nd typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It w",
              "contents": "nd typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It w",
              "image": "https://res.cloudinary.com/duy0lhike/image/upload/v1708864244/smjjochbgpt1i8bstndo.jpg"
          })
          
          expect(statusCode).toBe(401);  
        });
      });

      describe(' update  blog', () => {
        blogId="65ddbec5385b0a57db9c8fd3";
  
        it('should return a 200', async () => {
        const response= await supertest(app).put(`/api/blogs/${blogId}`)
        .set('Authorization',token)
        .send({title:'this blog is updated with this one'})
        
        expect(response.statusCode).toBe(200);
        });
      });


      describe(' create  blog', () => {

        it('should return a 200', async () => {
        const response= await supertest(app).post(`/api/blogs/`)
        .set('Authorization',token)
        .send({  title: "programmings",
        description: "nd typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It w",
        contents: "nd typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It w",
        image: "https://res.cloudinary.com/duy0lhike/image/upload/v1708864244/smjjochbgpt1i8bstndo.jpg"})
        
        expect(response.statusCode).toBe(200);
        });
      });
   
      // like and dislike blog 
      
      describe(' like blog', () => {
        blogId="65db4ae4f4f250eb3ff04609";
      
        it('should return a 200  ', async () => {
        const response= await supertest(app).post(`/api/blogs/like/${blogId}`)
        .set('Authorization',token)
      
        expect(response.statusCode).toBe(200);
        });
      });

      describe(' dislike blog', () => {
        blogId="65ddb6d76d7280c1085c4761";
      
        it('should return a 200 and', async () => {
        const response= await supertest(app).post(`/api/blogs/dislike/${blogId}`)
        .set('Authorization',token)
      
        expect(response.statusCode).toBe(200);
        });
      });

      //if you are unauthenticated to like or dislike  blog


      describe('  if you are unauthenticated to like blog', () => {
        blogId="65db4ae4f4f250eb3ff04609";
      
        it('should return a 401 and  ', async () => {
        const response= await supertest(app).post(`/api/blogs/like/${blogId}`)
       
      
        expect(response.statusCode).toBe(401);
        });
      });
      describe('  if you are unauthenticated to dislike blog', () => {
        blogId="65ddb6d76d7280c1085c4761";
      
        it('should return a 401 and', async () => {
        const response= await supertest(app).post(`/api/blogs/dislike/${blogId}`)
       
      
        expect(response.statusCode).toBe(401);
        });
      });
  
  
    
     




   //comments


    describe('add comment to blog', () => {
      blogId="65db4ae4f4f250eb3ff04609";
    
      it('should return a 201 and a comment ', async () => {
      const response= await supertest(app).post(`/api/comments/${blogId}`)
      .set('Authorization',token)
      .send({ description: "this blog is good!"  })
      expect(response.statusCode).toBe(201);
      });
    });
    
    
    describe('add comment  unauthorized user', () => {
      it('should return a 401 and a comment ', async () => {
      const response= await supertest(app).post(`/api/comments/${blogId}`)
      .send({ description: "this blog is good!"  })
      expect(response.statusCode).toBe(401);
      });
    });
    
    
    
    describe(' add empty comment ', () => {
      it('should return a 500 and a comment ', async () => {
      const response= await supertest(app).post(`/api/comments/${blogId}`)
      .set('Authorization',token)
      .send({})
      expect(response.statusCode).toBe(500);
      });
    });
    

    let commentId="65dc936c86ab76141a5ab64a";

    describe('get all  comment ', () => {
      it('should return a  and a comment ', async () => {
      const response= await supertest(app).get(`/api/comments`)
      expect(response.statusCode).toBe(200);
      });
    });

  
    
    describe('get single  comment ', () => {
      it('should return a  and a comment ', async () => {
      const response= await supertest(app).get(`/api/comments/${commentId}`)
      expect(response.statusCode).toBe(200);
      });
    });

    describe(' update comment ', () => {
      it('should return a 200 and a comment ', async () => {
      const response= await supertest(app).put(`/api/comments/${commentId}`)
      .set('Authorization',token)
      .send({description:'this is uodated'})
      expect(response.statusCode).toBe(200);
      });
    });



    //messages


let messageId='65dca9241828ea1254afc552';

describe('get all  message', () => {
  it('should return a 200 and a message ', async () => {
  const response= await supertest(app).get(`/api/messages/`)
  .set('Authorization',token)
  expect(response.statusCode).toBe(200);
  });
});


describe('get a single   message', () => {
  it('should return a 200 and a message ', async () => {
  const response= await supertest(app).get(`/api/messages/${messageId}`)
  .set('Authorization',token)

  expect(response.statusCode).toBe(200);
  });
});

describe('create invalid message', () => {
  it('should return a 400 and a message ', async () => {
  const response= await supertest(app).post(`/api/messages/`)
  .set('Authorization',token)
  .send({
    username:"princeMessage",
  email:"prince07gmail.com",
  querie:"simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard "

  })

  expect(response.statusCode).toBe(400);
  });
});

describe('create existing message', () => {
  it('should return a 500 and a message ', async () => {
  const response= await supertest(app).post(`/api/messages/`)
  .set('Authorization',token)
  .send({
    username:"princeMessage",
  email:"prince07@gmail.com",
  querie:"simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard "

  })

  expect(response.statusCode).toBe(500);
  });
});


describe('create  message', () => {
  it('should return a 200 and a message ', async () => {
  const response= await supertest(app).post(`/api/messages/`)
  .set('Authorization',token)
  .send({
    username:"princeMessage",
  email:`${r}@gmail.com`,
  querie:"simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard "

  })

  expect(response.statusCode).toBe(200);
  });
});


describe('update message', () => {
  it('should return a 200 and a message ', async () => {
  const response= await supertest(app).put(`/api/messages/${messageId}`)
  .set('Authorization',token)
  .send({username:"princeMessage",
  email:"prince07@gmail.com",
  querie:"simply dummmy text of the printing and type"})

  expect(response.statusCode).toBe(200);
  });
});