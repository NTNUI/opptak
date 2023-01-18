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

Rename `.env.example` to `.env`  
When using docker you don't need to do any modifications

### ☁ Set up MongoDB Atlas

### ( Not necessary when using docker to run project)

Set up a cluster and database on [MongoDB Atlas](https://docs.atlas.mongodb.com/getting-started/) and add the credentials to the `.env` file.

1. Log in to [MongoDB](https://account.mongodb.com/account/login)
2. Find the database you created on MongoDB Atlas
3. Go to "Network access" in the tab to the left
4. Click "Add IP address"
5. Open for all IPs or click "Add current IP address"
6. Click "Connect"
7. Click "Connect using MongoDB Compass"
8. Ignore step 1, copy the connection string
9. Create an `.env` file in the backend folder and paste the connection string in the `DB_URI` variable
10. Change `<password>` to the database password you set in Part 4 of the [MongoDB Atlas guide](https://docs.atlas.mongodb.com/getting-started/)
