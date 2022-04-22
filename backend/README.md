# 🍑 Express.js with MongoDB backend

## Developement

Install and run the backend using `npm install`, then `npm run app`, or simply run `npm run backend` from the project root folder. 

### Environment variables

Add environment variables to an `.env` file in the backend folder.

```sh
# .env

## NTNUI API URI (optional)
API_URI="https://api.ntnui.no"

## MongoDB connection string
DB_URI = "mongodb://<username>:<password>@<host>:<port>/<database>"
```

### ☁ Set up MongoDB Atlas

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
