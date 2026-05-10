# Flow Zone 

A full-stack Pomodoro timer with per-user task tracking, built on the MERN stack.

UI originally created as an Introduction to Vibe Coding course project, extended with MongoDB and JWT authentication.

Flow Zone is a Pomodoro timer application built using React. It helps users manage their time effectively by breaking work into intervals, traditionally 25 minutes in length, separated by short breaks.

## Features
- Pomodoro timer with Focus, Short Break, and Long Break modes
- Task list with focus time tracking per task
- User authentication with JWT
- Tasks saved per user to MongoDB
- Anonymous use supported — tasks stored locally until sign in
- Audio notifications for work and break intervals.
- Dark mode for better user experience.

## Technologies Used
- React: A TypeScript-based library for building user interfaces.
- Tailwind CSS: A utility-first CSS framework for styling the application.
- MongoDB: A NoSQL database for storing user data and tasks.
- Express.js: A web application framework for Node.js to create the backend API.
- Node.js: A JavaScript runtime for building the backend server.
- Mongoose: An ODM (Object Data Modeling) library for MongoDB and Node.js.
- JWT (JSON Web Tokens): For user authentication and authorization.

## Prerequisites

- Node.js
- MongoDB running locally

## Installation

1. Clone the repository:
```bash
git clone https://github.com/vickneee/FlowZone.git
```

2. Navigate to the project directory:
```bash
cd FlowZone
```

3. Install dependencies for the backend:
```bash
cd backend
npm install
```

Create a .env file in /backend:
```env
PORT=4000
MONGO_URI=mongodb://localhost/flowzone
SECRET=your_jwt_secret
# SECRET: Generate Random Hex e.g https://www.browserling.com/tools/random-hex
```
4. Start the backend server:
```bash
npm start
```

5. Install dependencies for the frontend:
```bash
cd frontend
npm install
```

6. Start the frontend development server:
```bash
cd frontend
npm run dev
```
Open http://localhost:5173 or http://localhost:3000 in your browser to access the application.

## Project structure:

```
FlowZone/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── .env
│   ├── app.js
│   ├── index.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── utils/
│   │   ├── App.tsx
│   │   ├── index.css
│   │   └── main.tsx
│   └── package.json
│
├── README.md
└── .gitignore
```
