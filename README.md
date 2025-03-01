Web Application named Quest, a simple job board for college students using MERN.

# Quest Web App

A job application platform built with React, Node.js, and MongoDB.

## Features

- User authentication (job seekers and employers)
- Job posting and management for employers
- Job application submission with file upload
- Application status tracking
- Application feedback system

## Tech Stack

- Frontend: React, TypeScript, Vite
- Backend: Node.js, Express
- Database: MongoDB
- File Storage: Local/AWS S3 (configurable)

## Getting Started

### Prerequisites

- Node.js
- MongoDB
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone <repository-url>
```

2. Install dependencies for frontend

```bash
cd questapp
npm install
```

3. Install dependencies for backend

```bash
cd questappbackend
npm install
```

4. Create .env files for both frontend and backend with necessary environment variables
5. In the 'questappbackend' folder:
  - Create a folder named 'uploads', and inside of 'uploads' create a folder named 'coverLetters'.

6. Start the development servers

```bash
# Frontend
cd questapp
npm run dev

# Backend
cd questappbackend
npm run dev
```

## Environment Variables

### Frontend (.env)

```plaintext
VITE_BACKEND_URL=http://localhost:5000
```

### Backend (.env)

```plaintext
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
BASE_URL=http://localhost:5000
```
