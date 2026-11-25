# Support Ticket Management System

A full-stack web application that enables users to create and manage support tickets while allowing administrators to monitor, prioritize, and resolve customer issues.

## Features

### User
- User registration and login.
- JWT-based authentication.
- Create, view, update, and delete support tickets.
- Add comments to tickets.
- View ticket activity history.
- Edit tickets only while their status is OPEN.

### Admin
- View and manage all support tickets.
- Update ticket status and priority.
- Search tickets and filter by status and priority.
- View dashboard statistics.
- Monitor ticket activity history.

### Additional Features
- Role-based access control (USER and ADMIN).
- Password hashing using bcrypt.
- Event-driven ticket activity logging.
- Input validation and centralized error handling.
- Pagination for ticket listing.

## Tech Stack

**Frontend**
- React.js
- Vite
- Tailwind CSS
- Axios
- React Router
- Lucide React

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- EventEmitter

## Project Structure

```text
support-ticket-system/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── events/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── scripts/
│   ├── services/
│   ├── utils/
│   ├── .env
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── services/
│   └── package.json
│
└── README.md
```

## Installation and Setup

### Prerequisites
- Node.js and npm
- MongoDB database (local or MongoDB Atlas)
- Git

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd support-ticket-system
```

### 2. Set up the backend

```bash
cd backend
npm install
```

Create a `.env` file inside the backend directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
ADMIN_EMAIL=your_admin_email
ADMIN_PASSWORD=your_admin_password
```

Start the backend:

```bash
npm run dev
```

### 3. Set up the frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend will run at:

`http://localhost:5173`

The backend will run at:

`http://localhost:5000`

## Authentication and Authorization

The application uses JWT authentication.

- USER: Can manage their own support tickets and comments.
- ADMIN: Can view and manage all support tickets.
- Passwords are hashed using bcryptjs.
- Protected routes ensure that users can access only authorized resources.

## Ticket Workflow

Tickets can have the following statuses:

- OPEN
- IN_PROGRESS
- RESOLVED
- CLOSED

Available priorities:

- LOW
- MEDIUM
- HIGH

## Event-Driven Activity Tracking

The application uses Node.js EventEmitter to process ticket-related events.

Activities such as ticket creation, status changes, priority changes, and comments are recorded in the ActivityLog collection.

Users and administrators can view the activity history associated with a ticket.

## API Overview

Base URL: `http://localhost:5000/api`

| Module | Endpoint | Method |
|---|---|---|
| Authentication | `/auth/register` | POST |
| Authentication | `/auth/login` | POST |
| Tickets | `/tickets` | POST |
| Tickets | `/tickets/my-tickets` | GET |
| Tickets | `/tickets/:id` | GET |
| Tickets | `/tickets/:id` | PUT |
| Tickets | `/tickets/:id` | DELETE |
| Comments | `/comments/:ticketId` | GET |
| Comments | `/comments/:ticketId` | POST |
| Activity | `/activity/:ticketId` | GET |
| Admin | `/admin/tickets` | GET |
| Admin | `/admin/tickets/:id` | PATCH |
| Admin | `/admin/dashboard` | GET |

Protected endpoints require a valid JWT Bearer token.

## Security

- JWT-based authentication.
- Password hashing.
- Role-based authorization.
- Environment variables for sensitive configuration.
- Protected backend routes.

## Future Improvements

- Email notifications.
- Automated backend and frontend testing.
- Docker-based deployment.
- Persistent background event processing.
- Enhanced reporting and analytics.

## Author

Developed as a Full Stack Development project.