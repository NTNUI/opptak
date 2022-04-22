# React frontend

- [React](https://reactjs.org/) with [TypeScript](https://www.typescriptlang.org/) - framework
- [Axios](https://github.com/axios/axios) - http client
- [ESLint](https://eslint.org/) and [prettier](https://prettier.io/) - lint and code formatting
- [Emotion](https://emotion.sh/) - styling library
- [Mantine](https://mantine.dev/) - component library
- [Router](https://reactrouter.com/) - routing

## Environment variables

Add environment variables to an `.env` file in the frontend folder to connect to the Express.js backend app.

```sh
# .env

## ID of the committee with organizer access
REACT_APP_ORGANIZER_ID = 9

## URL to the Express.js backend
REACT_APP_BASE_URL = 'http://localhost:8082'
```

## Scripts

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app). In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
