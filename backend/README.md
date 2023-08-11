# 🍑 Express.js with MongoDB backend

- [Express.js](https://expressjs.com/) - framework
- [MongoDB](https://www.mongodb.com/atlas/database) - database
- [Mongoose](https://mongoosejs.com/) - object modeling
- [Axios](https://github.com/axios/axios) - http client
- [cors for Express.js](https://github.com/expressjs/cors) - middleware
- [nodemon](https://github.com/remy/nodemon) - development dependency

## Development

### Environment variables

Make a copy of `.env.example` and name it `.env`  
When using docker you don't need to do any modifications for developing locally.

### Start the backend and a database

(Requires docker installed and the environment variables from the step above)

Start the backend and a local database:  
`make start`

Start the backend and a local database with clean dummy data:  
`make fresh`

Stop and remove backend and local database:  
`make clean`

---

#### Commands if not using makefile:

Install and run the backend using `docker compose up --build`  
If you want to populate your local database with dummy data from the fixtures use `docker compose --profile fresh up --build` instead.
