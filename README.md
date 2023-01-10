# 📄 NTNUI Admin admission form

NTNUI Opptak was initially a semester project in the university course [IT2901 Informatics Project II during spring 2022 at the Norwegian University of Science and Technology](https://www.ntnu.edu/studies/courses/IT2901/2021). Today, it is actively developed and maintained by a project group in NTNUI Sprint and it is the official admission system for all administrative committees in NTNUI at [opptak.ntnui.no](https://opptak.ntnui.no).

## About the application

The application is a dynamic admission form with automatic access control using [NTNUI API](https://api.ntnui.no/) (NTNUIs membership system) authorization and roles. It uses a prototype npm package [ntnui-tools](https://github.com/NTNUI/ntnui-tools) to login and fetch users, roles and committees from NTNUI's central membership system.

The defined access roles are "organizer", "election committee" and/or role in one or more administrative committees.

The **organizer** is currently synonymous to a user that is part of the main board. They have the following permissions:

- Can change the admission status of all committees except the main board itself
- Can see all applications except applications to the main board
- Can edit the admission period
- Can wipe all admission data, including applications to the main board (GDPR wipe)

The organizers (main board) can not see any part of the application indicating that the candidate is applying to the main board, thus the status and committee-attributes are not visible in any way.

The **election committee** is directly connected to the election committee group in the membership system. The election committee has the following permissions:

- Can change the admission status of the main board
- Can see the applications to all committees
- Can change the statuses for the applications to the main board

Normal **administrative committes** have the following permissions:

- Can change the admission status (open/closed) of their own committee(s)
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

The project is built using Node version 16.14.0.

The root folder contains wrapper scripts to run the frontend and backend resepctively, as well as tools for linting and code style checking both frontend and backend source code. For more information on development environment variables and other useful details, check out [frontend/README.md](frontend/README.md) and [backend/README.md](backend/README.md).

To lint and check code style, use `npm run check`. Fix linting and styling issues by running `npm run fix`.

### ✨ React with TypeScript frontend

`npm run frontend` will automatically install React and all supporting dependencies, and run the web app. For more details check out [frontend/README.md](frontend/README.md).

### 🍑 Express.js with MongoDB backend

Backend requires a set of environment variables to connect to MongoDB. `npm run backend` will automatically install and run the server. For more details check out [backend/README.md](backend/README.md).

### 📦 TypeScript npm package

The package ntnui-tools is extracted to its own repository [NTNUI/ntnui-tools](https://github.com/NTNUI/ntnui-tools) and published to the [npm registry](https://www.npmjs.com/package/ntnui-tools). It is installed as a normal package using npm.
