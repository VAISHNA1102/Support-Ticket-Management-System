# Support Ticket Management System

A full-stack web application that helps users raise and track support tickets while allowing administrators to manage tickets, prioritize issues, monitor progress, and communicate with users.

## 🚀 Live Demo

- **Frontend:** https://support-ticket-management-system-alpha.vercel.app
- **Backend API:** https://support-ticket-backend-4h7r.onrender.com/
- **GitHub Repository:** https://github.com/VAISHNA1102/Support-Ticket-Management-System

## 📌 Features

### Authentication & Authorization
- User registration and login.
- JWT-based authentication.
- Password hashing using bcrypt.
- Role-based access control for USER and ADMIN.
- Protected routes and API endpoints.

### User Features
- Create support tickets.
- View personal tickets.
- Update or delete tickets while their status is OPEN.
- View ticket details.
- Add and view comments.
- Track ticket status and activity history.

### Admin Features
- View and manage all support tickets.
- Update ticket status and priority.
- Search tickets.
- Filter tickets by status and priority.
- View dashboard statistics.
- Monitor ticket activity.

### Ticket Management
- Ticket categories: TECHNICAL, BILLING, GENERAL, OTHER.
- Priority levels: LOW, MEDIUM, HIGH.
- Ticket statuses: OPEN, IN_PROGRESS, RESOLVED, CLOSED.
- Automatic activity logging through an event-driven workflow.

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React.js, Vite, JavaScript |
| Styling | Tailwind CSS, CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | JWT, bcryptjs |
| Validation | Zod (dependency included) |
| API Communication | Axios |
| Routing | React Router DOM |
| Icons | Lucide React |
| Deployment | Vercel, Render |
| Database Hosting | MongoDB Atlas |
| API Testing | Postman |

## 🏗️ Project Architecture

```text
support-ticket-system/
│
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
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── docs/
│   └── Support-Ticket-Management-System.postman_collection.json
│
├── .gitignore
└── README.md
```

## ⚙️ Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js
- npm
- MongoDB Atlas account or a local MongoDB instance
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/VAISHNA1102/Support-Ticket-Management-System.git

cd Support-Ticket-Management-System
```

### 2. Backend Setup

Navigate to the backend folder:

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
ADMIN_EMAIL=your_admin_email
ADMIN_PASSWORD=your_admin_password
```

Replace the placeholder values with your own configuration.

Start the backend development server:

```bash
npm run dev
```

The backend will run at:

`http://localhost:5000`

Health check:

`http://localhost:5000/`

### 3. Create an Admin Account

Configure `ADMIN_EMAIL` and `ADMIN_PASSWORD` in your backend `.env` file.

Run:

```bash
npm run create-admin
```

This creates the administrator account using the configured credentials.

### 4. Frontend Setup

Open another terminal and navigate to the frontend folder:

```bash
cd frontend
npm install
```

Create a `.env` file inside the `frontend` folder:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend development server:

```bash
npm run dev
```

The frontend will run at:

`http://localhost:5173`

## 🔗 API Documentation

Base URL:

`https://support-ticket-backend-4h7r.onrender.com/api`

### Authentication APIs

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Register a user |
| POST | `/auth/login` | Login |

### User Ticket APIs

| Method | Endpoint | Description |
|---|---|---|
| POST | `/tickets` | Create a ticket |
| GET | `/tickets/my-tickets` | Get logged-in user's tickets |
| GET | `/tickets/:id` | Get ticket details |
| PUT | `/tickets/:id` | Update a ticket |
| DELETE | `/tickets/:id` | Delete a ticket |

### Admin APIs

| Method | Endpoint | Description |
|---|---|---|
| GET | `/admin/tickets` | View and filter all tickets |
| PATCH | `/admin/tickets/:id` | Update ticket status or priority |
| GET | `/admin/dashboard` | Get dashboard statistics |

### Comment APIs

| Method | Endpoint | Description |
|---|---|---|
| POST | `/comments/:ticketId` | Add a comment |
| GET | `/comments/:ticketId` | Get ticket comments |

### Activity APIs

| Method | Endpoint | Description |
|---|---|---|
| GET | `/activity/:ticketId` | Get ticket activity history |

**Note:** Protected endpoints require a valid JWT token in the Authorization header:

```text
Authorization: Bearer <your_token>
```

## 🔄 Event-Driven Workflow

The application uses Node.js EventEmitter to handle ticket-related events.

When an important action occurs, such as ticket creation, ticket updates, status changes, priority changes, or comments, an event is emitted.

The event listener processes these events and creates corresponding activity log records.

This provides a history of important actions performed on each ticket.

## 🗄️ Database Models

The application uses MongoDB with Mongoose.

Main collections:

- **User:** Stores user details, email, hashed password, and role.
- **Ticket:** Stores ticket title, description, category, priority, status, and creator reference.
- **Comment:** Stores comments associated with tickets and their authors.
- **ActivityLog:** Stores ticket-related events and the users who performed them.

## 🔐 Security

- Passwords are hashed using bcryptjs.
- JWT authentication protects private APIs.
- Role-based middleware restricts administrator operations.
- Users can access and manage only their own tickets.
- Users can modify tickets only while their status is OPEN.
- Environment variables are used for sensitive configuration.
- `.env` files are excluded from version control.

## 🧪 API Testing

A Postman collection is included in:

```text
docs/Support-Ticket-Management-System.postman_collection.json
```

Import this collection into Postman to test the API endpoints.

## ☁️ Deployment

| Component | Platform |
|---|---|
| Frontend | Vercel |
| Backend | Render |
| Database | MongoDB Atlas |

The frontend communicates with the deployed backend using the `VITE_API_URL` environment variable.

## 🔮 Future Improvements

- Automated email notifications.
- Real-time ticket updates.
- Comprehensive automated testing.
- Advanced analytics and reporting.
- More detailed ticket assignment workflows.

## 👩‍💻 Author

**Vaishnavi Sirimalla**
- LinkedIn: https://www.linkedin.com/in/vaishnavi-sirimalla-89351322b/

---

If you find this project useful, feel free to explore the repository and share your feedback!
