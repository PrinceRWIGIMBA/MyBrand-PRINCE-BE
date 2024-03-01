 [![CircleCI](https://dl.circleci.com/status-badge/img/gh/PrinceRWIGIMBA/MyBrand-PRINCE-BE/tree/main.svg?style=svg)](https://dl.circleci.com/status-badge/redirect/gh/PrinceRWIGIMBA/MyBrand-PRINCE-BE/tree/fr-be-mybland) [![Coverage Status](https://coveralls.io/repos/github/PrinceRWIGIMBA/MyBrand-PRINCE-BE/badge.svg?branch=fr-be-mybland)](https://coveralls.io/github/PrinceRWIGIMBA/MyBrand-PRINCE-BE?branch=fr-be-mybland)



MyBrand-PRINCE-BE APIs
This is the backend project of project called Mybrand-PRINCE which is blog project with Portifolio

Technology used



![Static Badge](https://img.shields.io/badge/NODE.JS-%2368A063?style=for-the-badge&logo=node.js&labelColor=black) ![Static Badge](https://img.shields.io/badge/Mongodb-%2368A063?style=for-the-badge&logo=mongodb&labelColor=black) ![Static Badge](https://img.shields.io/badge/TYPESCRIPT-%23007ACC?style=for-the-badge&logo=TYPESCRIPT&labelColor=black)  *Jwt *Joi

Api features
*Authentication using Json web token(JWT)& Authentication *Blog CRUD operations *Comment CRUD operation *Like and Dislike blog *Message CRUD operation

End points
Authentication
*Sign up *Log In

Admin
*Blog CRUD operations *Comment CRUD operation *Like and Dislike blog *Message CRUD operation

User
*Read blog *comment on blog *Like and Dislike blog *Send message

Test Locally
Authentications
Signup:http://localhost:3000/api/auth/signup Log In:http://localhost:3000/api/auth/login Blog .... Create(POST):http://localhost:3000/api/blogs/ Read all blogs(GET):http://localhost:3000/api/blogs/ Read single blog(GET):http://localhost:3000/api/blogs/ID Read delete blog(DELETE):http://localhost:3000/api/blogs/ Read update blog(PUT):http://localhost:3000/api/blogs/ID

Comment
Create(POST):http://localhost:3000/api/comments/ID Read all comments(GET):http://localhost:3000/api/comments/ Read single comment(Get):http://localhost:3000/api/comments/ID Update Comment(PUT):http://localhost:3000/api/comments/ID Delete comment(DELETE):http://localhost:3000/api/comments/ID

Likes and Dislikes
Like(post):http://localhost:3000/api/blogs/like/blogID Dislike(POST):http://localhost:3000/api/blogs/dislike/blogID

Blog .... Create(POST):http://localhost:3000/api/messages/ Read all messages(GET):http://localhost:3000/api/messages/ Read single message(GET):http://localhost:3000/api/messages/ID Read delete message(DELETE):http://localhost:3000/api/messages/ID Read update message(PUT):http://localhost:3000/api/messages/ID
