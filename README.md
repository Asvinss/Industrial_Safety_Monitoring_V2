# Industrial Safety Monitoring System

A comprehensive web application for monitoring industrial safety using AI-powered camera detection systems.

## 🚀 Features

- **Real-time Safety Monitoring**: Monitor multiple cameras for safety violations in real-time
- **AI-powered Detection**: Detect various safety violations including:
  - PPE (Personal Protective Equipment) violations
  - Fall detection
  - Fire and smoke detection
  - Restricted area access
- **Camera Management**: Add, configure, and monitor IP cameras
- **Violation Reporting**: Automated reporting and notification of safety violations
- **Analytics Dashboard**: Visualize safety metrics and trends
- **User Management**: Role-based access control for administrators and safety managers
- **Real-time Notifications**: Instant alerts for critical safety violations via Socket.IO
- **AI Chat Assistance**: Get help and information through an AI-powered chat interface

## 🔧 Technology Stack

### Frontend
- React.js with React Router v6
- Material-UI and TailwindCSS for styling
- Chart.js and Recharts for analytics visualization
- Socket.IO client for real-time updates

### Backend
- Node.js with Express
- MySQL database with Sequelize ORM
- Socket.IO for real-time communication
- AI detection services integration

## 📋 Prerequisites

- Node.js (v14.x or higher)
- MySQL database
- npm or yarn

## 🚀 Getting Started

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/industrial_safety_monitor.git
   cd industrial_safety_monitor
   ```

2. Install dependencies for both frontend and backend
   ```bash
   # Install frontend dependencies
   npm install
   # or
   yarn
   
   # Install backend dependencies
   cd server
   npm install
   # or
   yarn
   ```

3. Set up environment variables
   - Create a `.env` file in the root directory for frontend
   - Create a `.env` file in the server directory for backend
   - Example environment variables:
     ```
     # Frontend .env
     VITE_API_URL=http://localhost:3001
     
     # Backend .env
     PORT=3001
     DB_HOST=localhost
     DB_USER=root
     DB_PASSWORD=yourpassword
     DB_NAME=industrial_safety
     JWT_SECRET=your_jwt_secret
     PHI_API_URL=http://localhost:8001
     ```

4. Set up the database
   ```bash
   # Create MySQL database
   mysql -u root -p
   CREATE DATABASE industrial_safety;
   exit
   
   # Run migrations (from server directory)
   npx sequelize-cli db:migrate
   ```

5. Start the development servers
   ```bash
   # Start backend server (from server directory)
   npm run dev
   # or
   yarn dev
   
   # Start frontend server (from root directory)
   npm run dev
   # or
   yarn dev
   ```
## 📁 Project Structure

```
industrial_safety_monitor/
├── public/                # Static assets
├── src/                   # Frontend source code
│   ├── components/        # Reusable UI components
│   │   └── ui/            # UI components like AlertToast, ModelBadge
│   ├── pages/             # Page components
│   │   ├── ai-chat-assistance/  # AI chat assistance page
│   │   ├── analytics/     # Analytics dashboard
│   │   ├── camera-management/  # Camera management
│   │   ├── live-monitoring/    # Live monitoring
│   │   ├── login/         # Authentication
│   │   ├── settings/      # User settings
│   │   └── violation-history/  # Violation reports
│   ├── utils/             # Utility functions and services
│   ├── App.jsx            # Main application component
│   ├── Routes.jsx         # Application routes
│   └── index.jsx          # Application entry point
├── server/                # Backend source code
│   ├── controllers/       # API controllers
│   ├── middleware/        # Express middleware
│   ├── models/            # Sequelize models
│   ├── routes/            # API routes
│   ├── services/          # Business logic services
│   └── server.js          # Express server setup
├── .env                   # Environment variables
```

## 🔌 API Documentation

The API provides endpoints for managing cameras, violations, users, and analytics.

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - Register new user (admin only)

### Cameras
- `GET /api/cameras` - Get all cameras
- `GET /api/cameras/:id` - Get camera by ID
- `POST /api/cameras` - Add new camera
- `PUT /api/cameras/:id` - Update camera
- `DELETE /api/cameras/:id` - Delete camera
- `GET /api/cameras/by-model/:modelId` - Get cameras with specific model
- `PATCH /api/cameras/:cameraId/models/:modelId/toggle` - Toggle model for camera

### Camera Models
- `GET /api/camera-models/:cameraId` - Get models assigned to a camera
- `POST /api/camera-models/:cameraId` - Assign models to a camera
- `DELETE /api/camera-models/:cameraId/:modelId` - Remove model from camera

### Violations
- `GET /api/violations` - Get all violations
- `GET /api/violations/:id` - Get violation by ID
- `POST /api/violations` - Create new violation report
- `PUT /api/violations/:id` - Update violation status

### Analytics
- `GET /api/analytics/violations` - Get violation statistics
- `GET /api/analytics/cameras` - Get camera performance metrics

### Models
- `GET /api/models` - Get all detection models
- `GET /api/models/:id` - Get model by ID
- `POST /api/models` - Create new model (admin only)
- `PUT /api/models/:id` - Update model (admin only)
- `DELETE /api/models/:id` - Delete model (admin only)

### System
- `GET /api/health` - Check API health
- `GET /api/database/test-connection` - Test database connection

## 🔄 Real-time Notifications

The application uses Socket.IO for real-time notifications and updates. This enables instant alerts for safety violations and camera status changes.

### Server-side Implementation

The Socket.IO server is implemented in `server/services/socket.service.js` and provides the following functionality:

- User authentication via JWT
- Camera subscription management
- Real-time violation notifications
- Camera status updates

### Client-side Implementation

The client-side Socket.IO implementation is in `src/utils/socketService.js` and provides:

- Connection management
- Event handling for violations and camera updates
- User authentication
- Camera subscription

### Integration Points

- Violation Controller: Sends notifications when new violations are detected
- Camera Controller: Notifies when camera models are updated
- AI Detection Service: Sends real-time alerts for detected violations
- Toast Container: Displays real-time notifications to users

## 🧩 Adding Routes

To add new routes to the application, update the `Routes.jsx` file:

```jsx
import { useRoutes } from "react-router-dom";
import HomePage from "pages/HomePage";
import AboutPage from "pages/AboutPage";

const ProjectRoutes = () => {
  let element = useRoutes([
    { path: "/", element: <HomePage /> },
    { path: "/about", element: <AboutPage /> },
    // Add more routes as needed
  ]);

  return element;
};
```

## 🎨 Styling

This project uses Tailwind CSS for styling. The configuration includes:

- Forms plugin for form styling
- Typography plugin for text styling
- Aspect ratio plugin for responsive elements
- Container queries for component-specific responsive design
- Fluid typography for responsive text
- Animation utilities

## 📱 Responsive Design

The app is built with responsive design using Tailwind CSS breakpoints.


## 📦 Deployment

Build the application for production:

```bash
npm run build
```

## 🤝 Contributing

Contributions are welcome! Here's how you can contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style and conventions
- Write tests for new features
- Update documentation as needed
- Make sure all tests pass before submitting a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - Frontend library
- [Express](https://expressjs.com/) - Backend framework
- [Socket.IO](https://socket.io/) - Real-time communication
- [Sequelize](https://sequelize.org/) - ORM for MySQL
- [Material-UI](https://mui.com/) - UI component library
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Chart.js](https://www.chartjs.org/) - Interactive charts
- [JWT](https://jwt.io/) - Authentication

Built with ❤️ on Rocket.new
