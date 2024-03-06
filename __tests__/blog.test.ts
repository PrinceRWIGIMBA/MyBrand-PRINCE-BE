import supertest from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { createToken } from '../utils/generateToken';
import createServer from '../utils/server';
import User from '../model/User';
import Blog from '../model/Blog';

import dotenv from "dotenv";

dotenv.config();


// Mock Cloudinary upload function
jest.mock('../config/cloudinary', () => {
  return jest.fn().mockImplementation(() => {
    return {
      secure_url: 'https://res.cloudinary.com/duy0lhike/image/upload/v1708864244/mock_image.jpg',
      // Add any other required fields based on your response
    };
  });
});

const cloudinaryUpload = require('../config/cloudinary');




//const userId = new mongoose.Types.ObjectId().toString();
const app = createServer();
mongoose.set('strictQuery', false);

//let userEmail="";

let blogId="";
let token="";
let r = (Math.random() + 1).toString(36).substring(5);

let userEmail="";
function generateRandomEmail() {
  const username = Math.random().toString(36).substring(2, 10); // Random username
  const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com'];
  const domain = domains[Math.floor(Math.random() * domains.length)]; // Random domain
  return `${username}@${domain}`;
}

userEmail=generateRandomEmail();

export const blogPayload = {
    "data": {
      "title": "programmings",
      "description": "nd typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It w",
      "contents": "nd typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It w",
      "image": "https://res.cloudinary.com/duy0lhike/image/upload/v1708864244/smjjochbgpt1i8bstndo.jpg"
    }
  };
  

 // userEmail=userEmail;
// export const userPayload = {

//   firstname:"prince",
//   lastname:"kamana",
//   email:generateRandomEmail(),
//   password: "prince31234",
//   role:"admin"
// };


//let jwt: string; 


  beforeAll(async () => {
    //const mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(process.env.MONGODB_URL as string);

    //const user = await User.create(userPayload);
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
    email : generateRandomEmail(),
    password : "prince21234" 
   })  
  expect(response.statusCode).toBe(200);    
  });
});



describe('given the user is  logged in', () => {
  it('should return a 200 and a blog ', async () => {
  const response= await supertest(app).post('/api/auth/login')
  .send({ email : "prince@gmail.com",password : "Prince@1234" })
  
  expect(response.statusCode).toBe(200);
  expect(response.body).toHaveProperty('token');
    token=`Bearer ${response.body.token}`       
  });
});

describe('get all the users', () => {
  it('should return a 200 and a users ', async () => {
  const response= await supertest(app).get('/api/auth/Users')
  .set('Authorization', token)
  
  expect(response.statusCode).toBe(200);  
  });
});

describe('logout the logged in user', () => {
  it('should return a 200 ', async () => {
  const response= await supertest(app).post('/api/auth/logout')
  .set('Authorization', token)
  
  expect(response.statusCode).toBe(200);  
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

      describe('update blog', () => {
        it('should return a 200', async () => {
          const response = await supertest(app)
            .put(`/api/blogs/${blogId}`)
            .set('Authorization', token)
            .send({ title: 'this blog is updated with this one' });
      
          //console.log('Update Blog Response:', response.body); // Add this for debugging
      
          // Add a check for potential token expiration or invalid token
          if (response.statusCode === 401) {
            console.error('Unauthorized. Check token validity or expiration.');
          }
     
          if (response.statusCode !== 200) {
            console.error('Update Blog failed. Status Code:', response.statusCode);
          }
      
          expect(response.statusCode).toBe(200);
        });
      });
      



      
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

 


      describe('  if you are unauthenticated to like blog', () => {
        
      
        it('should return a 401 and  ', async () => {
        const response= await supertest(app).post(`/api/blogs/like/${blogId}`)
       
      
        expect(response.statusCode).toBe(401);
        });
      });
      describe('  if you are unauthenticated to dislike blog', () => {
        blogId="65ddb6d76d7280c1085c4761";
      
        it('should return a 401 and', async () => {
        const response= await supertest(app).post(`/api/blogs/dislike/${blogId}`)
       
      
        expect(response.statusCode).toBe(401)
        });
      });
  
  
    
     




   //comments


    describe('add comment to blog', () => {
    
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
    

    let commentId="";

    describe('get all  comment ', () => {
      it('should return a  and a comment ', async () => {
      const response= await supertest(app).get(`/api/comments`)
      expect(response.statusCode).toBe(200);
      commentId=response.body.data[0]._id;
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


let messageId='';

describe('get all  message', () => {
  it('should return a 200 and a message ', async () => {
  const response= await supertest(app).get(`/api/messages/`)
  .set('Authorization',token)
  expect(response.statusCode).toBe(200);

  messageId=response.body.data[0]._id;
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
  email:userEmail,
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