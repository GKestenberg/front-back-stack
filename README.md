# Full-Stack Messaging App

A real-time messaging application built with Go (backend) and Next.js (frontend).

## Project Structure

```
front-back-stack/
├── backend/           # Go API server
│   ├── handlers/      # HTTP request handlers
│   ├── models/        # Data models
│   ├── utils/         # Utility functions (JWT)
│   ├── main.go        # Main server file
│   └── go.mod         # Go dependencies
└── frontend/          # Next.js React app
    ├── components/    # React components
    ├── pages/         # Next.js pages
    ├── utils/         # API and auth utilities
    ├── styles/        # CSS styles
    └── package.json   # Node dependencies
```

## Features

- User registration and authentication
- JWT-based session management
- Real-time message display
- Profile picture support
- In-memory message storage
- Responsive UI design

## Running the Application

### Backend (Go)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   go mod tidy
   ```

3. Run the server:
   ```bash
   go run main.go
   ```

The backend will start on `http://localhost:8080`

### Frontend (Next.js)

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

The frontend will start on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/register` - Register a new user
- `POST /api/login` - Login user

### Messages (Protected)
- `GET /api/messages` - Get all messages
- `POST /api/messages` - Send a new message

## Usage

1. Start both backend and frontend servers
2. Open `http://localhost:3000` in your browser
3. Register a new account or login
4. Start messaging!

## Technologies Used

**Backend:**
- Go 1.21
- Gorilla Mux (routing)
- JWT authentication
- bcrypt (password hashing)
- CORS support

**Frontend:**
- Next.js 14
- React 18
- TypeScript
- Axios (HTTP client)
- Local storage for auth persistence