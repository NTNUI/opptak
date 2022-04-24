# 📄 NTNUI Admin application form

Semester project in the course [IT2901 Informatics Project II](https://www.ntnu.edu/studies/courses/IT2901/2021), spring 2022 @ Norwegian University of Science and Technology.

This is a proof of concept application for development of an npm package for easier utilization of [NTNUI API](https://api.ntnui.no/). The application is a dynamic application form with automatic access control using [medlem.ntnui.no](https://medlem.ntnui.no/) authorization and roles.

## Development

The project requires Node version 16.14.0.

The root folder contains wrapper scripts to run the frontend and backend resepctively, as well as tools for linting and code style checking both frontend and backend source code.

To lint and check code style, use `npm run check`. Fix linting and styling issues by running `npm run fix`.

### ✨ React with TypeScript frontend

`npm run frontend` will automatically install React and all supporting dependencies, and run the web app. For more details check out [frontend/README.md](frontend/README.md).

### 🍑 Express.js with MongoDB backend

Backend requires a set of environment variables to connect to MongoDB. `npm run backend` will automatically install and run the server. For more details check out [backend/README.md](backend/README.md).

### 📦 TypeScript npm package

The package is published to the [npm registry](https://www.npmjs.com/package/ntnui-tools) and installed using `npm i ntnui-tools`.
