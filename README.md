# 📄 NTNUI Admin application form

IT2901 Informatics project II - spring 2022 @ NTNU.

Proof of concept application form app for development of an npm package for easier utilization of [NTNUI API](https://api.ntnui.no/).

## Development

The project requires Node version 16.14.0.

To lint and check code style, run `npm run check`. Fix linting and styling issues by running `npm run fix`.

### Environment variables

The project requires a set of environment variables added to an `.env` file in the /backend folder.

```sh
# .env
DB_URI="CONNECTION STRING HERE"
```

#### ☁ Set up MongoDB Atlas

Set up a cluster and database on [MongoDB Atlas](https://docs.atlas.mongodb.com/getting-started/) and add the credentials to the `.env` file.

1. Log in to [MongoDB](https://account.mongodb.com/account/login)
2. Find the database you created on MongoDB Atlas
3. Go to "Network access" in the tab to the left
4. Click "Add IP Address"
5. Open for all IPs or click "Add current IP address"
6. Click "Connect"
7. Click "Connect using MongoDB Compass"
8. Ignore step 1, copy the connection string
9. Make a copy of the file `.env.example` and change it to `.env`
10. Put in the connection string for `DB_URI`
11. Change `<password>` to the database password you set in Part 4 of the [MongoDB Atlas guide](https://docs.atlas.mongodb.com/getting-started/)

### ✨ React with TypeScript frontend

To install all required dependencies and run the application locally, run `npm run frontend`. For more details check out [frontend/README.md](frontend/README.md).

### 🍑 Express.js with MongoDB backend

To run backend locally, run `npm run backend`. For more details check out [backend/README.md](backend/README.md).

### 📦 TypeScript npm package

The package is included in the `/package` folder. After development is complete it will be published to npm and can be installed with `npm install ntnui-tools`.
