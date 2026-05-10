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

## Testing & Dev Tools

- Jest – JavaScript testing framework
- Supertest – API testing for Express endpoints
- GitHub Actions – CI/CD automation for running tests and deployments

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
Open http://localhost:5173 in your browser to access the application.

## Project structure:

```
FlowZone/
├── backend/
│   ├── config/            # Database and app configuration
│   ├── controllers/       # Request handlers (business logic)
│   ├── middleware/        # Auth, error handling, etc.
│   ├── models/            # Mongoose schemas
│   ├── routes/            # API routes
│   ├── utils/             # Helper functions (JWT, config, etc.)
│   ├── __tests__/         # Backend tests (Jest + Supertest)
│   ├── app.js             # Express app setup
│   ├── index.js           # Server entry point
│   ├── jest.setup.js      # Test setup (Mongo memory DB, etc.)
│   ├── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # API calls / utilities
│   │   ├── utils/         # Helper functions
│   │   ├── App.tsx        # Main React component
│   │   └── main.tsx       # Entry point
│   ├── public/            # Static assets
│   ├── dist/              # Production build (GitHub Pages)
│   ├── package.json
│
├── .github/
│   └── workflows/         # GitHub Actions CI/CD pipelines
│       ├── backend-ci.yml
│       └── frontend-deploy.yml
│
├── README.md
└── .gitignore
```
