# 🍑 Express.js with MongoDB backend

- [Express.js](https://expressjs.com/) - framework
- [MongoDB](https://www.mongodb.com/atlas/database) - database
- [Mongoose](https://mongoosejs.com/) - object modeling
- [Axios](https://github.com/axios/axios) - http client
- [cors for Express.js](https://github.com/expressjs/cors) - middleware
- [nodemon](https://github.com/remy/nodemon) - development dependency

## Developement

Install and run the backend using `docker compose up`  
If you change the fixtures afterwards you have to run `docker compose up --build` to reload the new fixtures to the image.

### Environment variables

Make a copy of `.env.example` and name it `.env`  
When using docker you don't need to do any modifications for developing locally.
