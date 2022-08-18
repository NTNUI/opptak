# 📄 NTNUI Admin admission form

Semester project in the course [IT2901 Informatics Project II](https://www.ntnu.edu/studies/courses/IT2901/2021), spring 2022 @ Norwegian University of Science and Technology.

## About the application

This is a proof of concept application for development and usage of an npm package, [ntnui-tools](https://github.com/NTNUI/ntnui-tools), an API wrapper for easier utilization of [NTNUI API](https://api.ntnui.no/).

The application is a dynamic admission form with automatic access control using [NTNUI API](https://api.ntnui.no/) (NTNUIs membership system) authorization and roles. The admission form itself is dynamic and uses ntnui-tools to fetch committees from the NTNUI API.

The roles within the application are differentiated "organizer", "election committee" and normal administrative committees.

The organizer is synonymous to a user that is part of the **main board**. They have the following permissions:

- Can change the admission status of all committees except the main board
- Can see all applications except applications to the main board
- Can edit the admission period
- Can wipe the admission data

The organizers (main board) can not see any part of the application indicating that the candidate is applying to the main board, thus the status and committee-attributes are not visible in any way.

The **election committee** is directly connected to the election committee in the membership system. The election committee has the following permissions:

- Can change the admission status of the main board
- Can see the applications to all committees
- Can change the statuses for the applications to the main board

The **normal administrative committes** have the following permissions:

- Can change the admission status of their own committees
- Can _only_ see applications that include their own committee
- Can change the statuses for the applications to their own committees

The normal administrative committes experience the same form of censorship from indications of the main board as the organizers experience.

### Permission table

|              role               | Admission period |       Admission status       |                     Application visibility                      | Application status | Wipe admission data |
| :-----------------------------: | :--------------: | :--------------------------: | :-------------------------------------------------------------: | :----------------: | :-----------------: |
|     organizer (main board)      |       Edit       | Change all except main board |                All committees except main board                 | Cannot change any  |         Yes         |
|       election committee        |       View       |      Change main board       |                         All committees                          | Change main board  |         No          |
| normal administrative committee |       View       |       Change their own       | Applications that include their own committee except main board |  Change their own  |         No          |

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
