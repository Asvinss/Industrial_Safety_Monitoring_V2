# Industrial Safety Monitor - Backend

This is the backend server for the Industrial Safety Monitor application. It provides API endpoints for managing cameras, violations, users, and analytics.

## Technologies Used

- Node.js
- Express.js
- MySQL
- Sequelize ORM
- JWT Authentication

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v5.7 or higher)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=industrial_safety_db
DB_PORT=3306

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=24h
```

Replace `your_password` and `your_jwt_secret_key_here` with your actual MySQL password and a secure random string for JWT signing.

### 3. Set Up the Database

#### Option 1: Using the SQL Script

```bash
npm run db:setup
```

This will run the SQL script to create the database and tables.

#### Option 2: Using Sequelize

```bash
npm run db:init
```

This will use Sequelize to sync the models with the database and create sample data.

### 4. Start the Server

#### Development Mode (with auto-reload)

```bash
npm run dev
```

#### Production Mode

```bash
npm start
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get token
- `GET /api/auth/me` - Get current user profile
- `POST /api/auth/logout` - Logout

### Users

- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `PUT /api/users/:id/password` - Update user password
- `DELETE /api/users/:id` - Delete user (Admin only)

### Cameras

- `GET /api/cameras` - Get all cameras
- `GET /api/cameras/:id` - Get camera by ID
- `POST /api/cameras` - Create a new camera
- `PUT /api/cameras/:id` - Update a camera
- `DELETE /api/cameras/:id` - Delete a camera
- `POST /api/cameras/:id/models` - Assign detection models to a camera
- `GET /api/cameras/:id/models` - Get all detection models for a camera

### Detection Models

- `GET /api/models` - Get all detection models
- `GET /api/models/:id` - Get detection model by ID
- `POST /api/models` - Create a new detection model (Admin only)
- `PUT /api/models/:id` - Update a detection model (Admin only)
- `DELETE /api/models/:id` - Delete a detection model (Admin only)
- `GET /api/models/:id/cameras` - Get cameras using this model

### Violations

- `GET /api/violations` - Get all violation reports
- `GET /api/violations/:id` - Get violation report by ID
- `POST /api/violations` - Create a new violation report
- `PUT /api/violations/:id` - Update a violation report
- `DELETE /api/violations/:id` - Delete a violation report
- `GET /api/violations/stats` - Get violation statistics

### Analytics

- `GET /api/analytics/dashboard` - Get dashboard summary data
- `GET /api/analytics/trends` - Get violation trends over time
- `GET /api/analytics/by-type` - Get violations by type
- `GET /api/analytics/by-location` - Get violations by location
- `GET /api/analytics/safety-score` - Get safety score
- `GET /api/analytics/export` - Export violation data

## Default Admin User

After initialization, you can log in with the following credentials:

- Email: admin@safety.com
- Password: admin123

## License

MIT