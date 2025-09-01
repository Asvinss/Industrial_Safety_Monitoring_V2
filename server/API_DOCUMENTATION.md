# Industrial Safety Monitor API Documentation

This document provides detailed information about the API endpoints available in the Industrial Safety Monitor backend.

## Base URL

```
http://localhost:5000/api
```

## Authentication

All protected routes require a valid JWT token in the `x-auth-token` header.

### Register a new user

```
POST /auth/register
```

**Request Body:**

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "password123",
  "role": "safety_supervisor" // Optional, defaults to safety_supervisor
}
```

**Response:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "role": "safety_supervisor"
  }
}
```

### Login

```
POST /auth/login
```

**Request Body:**

```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "role": "safety_supervisor"
  }
}
```

### Get Current User

```
GET /auth/me
```

**Headers:**

```
x-auth-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**

```json
{
  "id": 1,
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "role": "safety_supervisor",
  "lastLogin": "2023-09-15T14:30:00.000Z"
}
```

## Cameras

### Get All Cameras

```
GET /cameras
```

**Headers:**

```
x-auth-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Query Parameters:**

- `location` (optional): Filter by location
- `status` (optional): Filter by status (active, inactive)

**Response:**

```json
[
  {
    "id": 1,
    "name": "Assembly Line Camera 1",
    "location": "Assembly Line A",
    "ipAddress": "192.168.1.100",
    "status": "active",
    "lastMaintenance": "2023-08-15T10:00:00.000Z",
    "createdAt": "2023-07-01T09:00:00.000Z",
    "updatedAt": "2023-09-01T14:30:00.000Z",
    "models": [
      {
        "id": 1,
        "name": "PPE Detection",
        "description": "Detects missing personal protective equipment",
        "version": "1.0.0",
        "CameraDetectionModel": {
          "isActive": true,
          "lastActivated": "2023-09-01T14:30:00.000Z"
        }
      }
    ]
  }
]
```

### Get Camera by ID

```
GET /cameras/:id
```

**Headers:**

```
x-auth-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**

```json
{
  "id": 1,
  "name": "Assembly Line Camera 1",
  "location": "Assembly Line A",
  "ipAddress": "192.168.1.100",
  "status": "active",
  "lastMaintenance": "2023-08-15T10:00:00.000Z",
  "createdAt": "2023-07-01T09:00:00.000Z",
  "updatedAt": "2023-09-01T14:30:00.000Z",
  "models": [
    {
      "id": 1,
      "name": "PPE Detection",
      "description": "Detects missing personal protective equipment",
      "version": "1.0.0",
      "CameraDetectionModel": {
        "isActive": true,
        "lastActivated": "2023-09-01T14:30:00.000Z"
      }
    }
  ]
}
```

### Create Camera

```
POST /cameras
```

**Headers:**

```
x-auth-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Request Body:**

```json
{
  "name": "Assembly Line Camera 2",
  "location": "Assembly Line B",
  "ipAddress": "192.168.1.101",
  "status": "active"
}
```

**Response:**

```json
{
  "id": 2,
  "name": "Assembly Line Camera 2",
  "location": "Assembly Line B",
  "ipAddress": "192.168.1.101",
  "status": "active",
  "createdAt": "2023-09-15T15:30:00.000Z",
  "updatedAt": "2023-09-15T15:30:00.000Z"
}
```

### Update Camera

```
PUT /cameras/:id
```

**Headers:**

```
x-auth-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Request Body:**

```json
{
  "name": "Assembly Line Camera 2 - Updated",
  "status": "inactive",
  "lastMaintenance": "2023-09-15T15:30:00.000Z"
}
```

**Response:**

```json
{
  "id": 2,
  "name": "Assembly Line Camera 2 - Updated",
  "location": "Assembly Line B",
  "ipAddress": "192.168.1.101",
  "status": "inactive",
  "lastMaintenance": "2023-09-15T15:30:00.000Z",
  "createdAt": "2023-09-15T15:30:00.000Z",
  "updatedAt": "2023-09-15T16:00:00.000Z"
}
```

### Delete Camera

```
DELETE /cameras/:id
```

**Headers:**

```
x-auth-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**

```json
{
  "message": "Camera deleted successfully"
}
```

### Assign Detection Models to Camera

```
POST /cameras/:id/models
```

**Headers:**

```
x-auth-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Request Body:**

```json
{
  "modelIds": [1, 2],
  "isActive": true
}
```

**Response:**

```json
{
  "message": "Detection models assigned successfully",
  "camera": {
    "id": 1,
    "name": "Assembly Line Camera 1",
    "models": [
      {
        "id": 1,
        "name": "PPE Detection",
        "CameraDetectionModel": {
          "isActive": true,
          "lastActivated": "2023-09-15T16:30:00.000Z"
        }
      },
      {
        "id": 2,
        "name": "Restricted Area Detection",
        "CameraDetectionModel": {
          "isActive": true,
          "lastActivated": "2023-09-15T16:30:00.000Z"
        }
      }
    ]
  }
}
```

### Get Detection Models for Camera

```
GET /cameras/:id/models
```

**Headers:**

```
x-auth-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**

```json
[
  {
    "id": 1,
    "name": "PPE Detection",
    "description": "Detects missing personal protective equipment",
    "version": "1.0.0",
    "CameraDetectionModel": {
      "isActive": true,
      "lastActivated": "2023-09-15T16:30:00.000Z"
    }
  },
  {
    "id": 2,
    "name": "Restricted Area Detection",
    "description": "Detects unauthorized access to restricted areas",
    "version": "1.0.0",
    "CameraDetectionModel": {
      "isActive": true,
      "lastActivated": "2023-09-15T16:30:00.000Z"
    }
  }
]
```

## Detection Models

### Get All Models

```
GET /models
```

**Headers:**

```
x-auth-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**

```json
[
  {
    "id": 1,
    "name": "PPE Detection",
    "description": "Detects missing personal protective equipment",
    "version": "1.0.0",
    "createdAt": "2023-07-01T09:00:00.000Z",
    "updatedAt": "2023-07-01T09:00:00.000Z"
  },
  {
    "id": 2,
    "name": "Restricted Area Detection",
    "description": "Detects unauthorized access to restricted areas",
    "version": "1.0.0",
    "createdAt": "2023-07-01T09:00:00.000Z",
    "updatedAt": "2023-07-01T09:00:00.000Z"
  }
]
```

### Get Model by ID

```
GET /models/:id
```

**Headers:**

```
x-auth-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**

```json
{
  "id": 1,
  "name": "PPE Detection",
  "description": "Detects missing personal protective equipment",
  "version": "1.0.0",
  "createdAt": "2023-07-01T09:00:00.000Z",
  "updatedAt": "2023-07-01T09:00:00.000Z",
  "cameras": [
    {
      "id": 1,
      "name": "Assembly Line Camera 1",
      "location": "Assembly Line A",
      "CameraDetectionModel": {
        "isActive": true,
        "lastActivated": "2023-09-15T16:30:00.000Z"
      }
    }
  ]
}
```

### Create Model (Admin only)

```
POST /models
```

**Headers:**

```
x-auth-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Request Body:**

```json
{
  "name": "Fire Detection",
  "description": "Detects fire and smoke in industrial areas",
  "version": "1.0.0"
}
```

**Response:**

```json
{
  "id": 3,
  "name": "Fire Detection",
  "description": "Detects fire and smoke in industrial areas",
  "version": "1.0.0",
  "createdAt": "2023-09-15T17:00:00.000Z",
  "updatedAt": "2023-09-15T17:00:00.000Z"
}
```

### Update Model (Admin only)

```
PUT /models/:id
```

**Headers:**

```
x-auth-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Request Body:**

```json
{
  "name": "Fire and Smoke Detection",
  "description": "Updated description for fire and smoke detection",
  "version": "1.1.0"
}
```

**Response:**

```json
{
  "id": 3,
  "name": "Fire and Smoke Detection",
  "description": "Updated description for fire and smoke detection",
  "version": "1.1.0",
  "createdAt": "2023-09-15T17:00:00.000Z",
  "updatedAt": "2023-09-15T17:30:00.000Z"
}
```

### Delete Model (Admin only)

```
DELETE /models/:id
```

**Headers:**

```
x-auth-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**

```json
{
  "message": "Detection model deleted successfully"
}
```

### Get Cameras Using a Model

```
GET /models/:id/cameras
```

**Headers:**

```
x-auth-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**

```json
[
  {
    "id": 1,
    "name": "Assembly Line Camera 1",
    "location": "Assembly Line A",
    "ipAddress": "192.168.1.100",
    "status": "active",
    "CameraDetectionModel": {
      "isActive": true,
      "lastActivated": "2023-09-15T16:30:00.000Z"
    }
  }
]
```

## Violations

### Get All Violations

```
GET /violations
```

**Headers:**

```
x-auth-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Query Parameters:**

- `type` (optional): Filter by violation type
- `location` (optional): Filter by location
- `status` (optional): Filter by status (open, resolved, false_alarm)
- `startDate` (optional): Filter by date range start
- `endDate` (optional): Filter by date range end
- `page` (optional): Page number for pagination
- `limit` (optional): Number of items per page

**Response:**

```json
{
  "violations": [
    {
      "id": 1,
      "type": "missing_ppe",
      "description": "Worker without helmet detected",
      "location": "Assembly Line A",
      "timestamp": "2023-09-15T10:30:00.000Z",
      "imageUrl": "/uploads/violations/violation_1.jpg",
      "status": "open",
      "severity": "high",
      "assignedTo": null,
      "resolvedAt": null,
      "resolutionNotes": null,
      "createdAt": "2023-09-15T10:30:00.000Z",
      "updatedAt": "2023-09-15T10:30:00.000Z",
      "cameraId": 1,
      "camera": {
        "id": 1,
        "name": "Assembly Line Camera 1",
        "location": "Assembly Line A"
      }
    }
  ],
  "pagination": {
    "totalItems": 1,
    "totalPages": 1,
    "currentPage": 1,
    "limit": 10
  }
}
```

### Get Violation by ID

```
GET /violations/:id
```

**Headers:**

```
x-auth-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**

```json
{
  "id": 1,
  "type": "missing_ppe",
  "description": "Worker without helmet detected",
  "location": "Assembly Line A",
  "timestamp": "2023-09-15T10:30:00.000Z",
  "imageUrl": "/uploads/violations/violation_1.jpg",
  "status": "open",
  "severity": "high",
  "assignedTo": null,
  "resolvedAt": null,
  "resolutionNotes": null,
  "createdAt": "2023-09-15T10:30:00.000Z",
  "updatedAt": "2023-09-15T10:30:00.000Z",
  "cameraId": 1,
  "camera": {
    "id": 1,
    "name": "Assembly Line Camera 1",
    "location": "Assembly Line A"
  }
}
```

### Create Violation

```
POST /violations
```

**Headers:**

```
x-auth-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Request Body:**

```json
{
  "type": "restricted_area",
  "description": "Unauthorized person in restricted area",
  "location": "Assembly Line B",
  "timestamp": "2023-09-15T11:45:00.000Z",
  "imageUrl": "/uploads/violations/violation_2.jpg",
  "severity": "medium",
  "cameraId": 2
}
```

**Response:**

```json
{
  "id": 2,
  "type": "restricted_area",
  "description": "Unauthorized person in restricted area",
  "location": "Assembly Line B",
  "timestamp": "2023-09-15T11:45:00.000Z",
  "imageUrl": "/uploads/violations/violation_2.jpg",
  "status": "open",
  "severity": "medium",
  "assignedTo": null,
  "resolvedAt": null,
  "resolutionNotes": null,
  "createdAt": "2023-09-15T11:45:00.000Z",
  "updatedAt": "2023-09-15T11:45:00.000Z",
  "cameraId": 2
}
```

### Update Violation

```
PUT /violations/:id
```

**Headers:**

```
x-auth-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Request Body:**

```json
{
  "status": "resolved",
  "assignedTo": 1,
  "resolvedAt": "2023-09-15T14:30:00.000Z",
  "resolutionNotes": "Spoke with worker about PPE requirements"
}
```

**Response:**

```json
{
  "id": 1,
  "type": "missing_ppe",
  "description": "Worker without helmet detected",
  "location": "Assembly Line A",
  "timestamp": "2023-09-15T10:30:00.000Z",
  "imageUrl": "/uploads/violations/violation_1.jpg",
  "status": "resolved",
  "severity": "high",
  "assignedTo": 1,
  "resolvedAt": "2023-09-15T14:30:00.000Z",
  "resolutionNotes": "Spoke with worker about PPE requirements",
  "createdAt": "2023-09-15T10:30:00.000Z",
  "updatedAt": "2023-09-15T14:30:00.000Z",
  "cameraId": 1
}
```

### Delete Violation

```
DELETE /violations/:id
```

**Headers:**

```
x-auth-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**

```json
{
  "message": "Violation deleted successfully"
}
```

### Get Violation Statistics

```
GET /violations/stats
```

**Headers:**

```
x-auth-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Query Parameters:**

- `startDate` (optional): Filter by date range start
- `endDate` (optional): Filter by date range end

**Response:**

```json
{
  "totalViolations": 10,
  "openViolations": 5,
  "resolvedViolations": 4,
  "falseAlarms": 1,
  "byType": {
    "missing_ppe": 6,
    "restricted_area": 3,
    "unsafe_behavior": 1
  },
  "bySeverity": {
    "high": 3,
    "medium": 5,
    "low": 2
  },
  "byLocation": {
    "Assembly Line A": 4,
    "Assembly Line B": 3,
    "Warehouse": 3
  }
}
```

## Analytics

### Get Dashboard Data

```
GET /analytics/dashboard
```

**Headers:**

```
x-auth-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Query Parameters:**

- `period` (optional): Time period (day, week, month, year)

**Response:**

```json
{
  "violationCount": {
    "total": 25,
    "open": 10,
    "resolved": 12,
    "falseAlarm": 3
  },
  "violationsByType": [
    { "type": "missing_ppe", "count": 15 },
    { "type": "restricted_area", "count": 7 },
    { "type": "unsafe_behavior", "count": 3 }
  ],
  "violationsBySeverity": [
    { "severity": "high", "count": 8 },
    { "severity": "medium", "count": 12 },
    { "severity": "low", "count": 5 }
  ],
  "cameraStatus": {
    "total": 10,
    "active": 8,
    "inactive": 2
  },
  "safetyScore": 85,
  "recentViolations": [
    {
      "id": 25,
      "type": "missing_ppe",
      "location": "Assembly Line A",
      "timestamp": "2023-09-15T09:30:00.000Z",
      "status": "open",
      "severity": "high"
    }
  ]
}
```

### Get Violation Trends

```
GET /analytics/trends
```

**Headers:**

```
x-auth-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Query Parameters:**

- `period` (optional): Time period (day, week, month, year)
- `interval` (optional): Interval for data points (hour, day, week, month)
- `type` (optional): Filter by violation type

**Response:**

```json
{
  "labels": ["2023-09-10", "2023-09-11", "2023-09-12", "2023-09-13", "2023-09-14", "2023-09-15"],
  "datasets": [
    {
      "label": "All Violations",
      "data": [3, 5, 2, 4, 6, 5]
    },
    {
      "label": "Missing PPE",
      "data": [2, 3, 1, 2, 4, 3]
    },
    {
      "label": "Restricted Area",
      "data": [1, 2, 1, 1, 1, 1]
    },
    {
      "label": "Unsafe Behavior",
      "data": [0, 0, 0, 1, 1, 1]
    }
  ]
}
```

### Get Violations by Type

```
GET /analytics/by-type
```

**Headers:**

```
x-auth-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Query Parameters:**

- `startDate` (optional): Filter by date range start
- `endDate` (optional): Filter by date range end

**Response:**

```json
[
  { "type": "missing_ppe", "count": 15, "percentage": 60 },
  { "type": "restricted_area", "count": 7, "percentage": 28 },
  { "type": "unsafe_behavior", "count": 3, "percentage": 12 }
]
```

### Get Violations by Location

```
GET /analytics/by-location
```

**Headers:**

```
x-auth-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Query Parameters:**

- `startDate` (optional): Filter by date range start
- `endDate` (optional): Filter by date range end

**Response:**

```json
[
  { "location": "Assembly Line A", "count": 10, "percentage": 40 },
  { "location": "Assembly Line B", "count": 8, "percentage": 32 },
  { "location": "Warehouse", "count": 7, "percentage": 28 }
]
```

### Get Safety Score

```
GET /analytics/safety-score
```

**Headers:**

```
x-auth-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Query Parameters:**

- `location` (optional): Filter by location
- `period` (optional): Time period (day, week, month, year)

**Response:**

```json
{
  "safetyScore": 85,
  "previousScore": 82,
  "change": 3,
  "trend": "improving",
  "breakdown": {
    "violationFrequency": 75,
    "resolutionTime": 90,
    "severityDistribution": 85
  },
  "historicalScores": [
    { "date": "2023-09-09", "score": 80 },
    { "date": "2023-09-10", "score": 82 },
    { "date": "2023-09-11", "score": 81 },
    { "date": "2023-09-12", "score": 83 },
    { "date": "2023-09-13", "score": 84 },
    { "date": "2023-09-14", "score": 85 }
  ]
}
```

### Export Violation Data

```
GET /analytics/export
```

**Headers:**

```
x-auth-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Query Parameters:**

- `format` (optional): Export format (json, csv), defaults to json
- `startDate` (optional): Filter by date range start
- `endDate` (optional): Filter by date range end
- `type` (optional): Filter by violation type
- `location` (optional): Filter by location

**Response (JSON format):**

```json
{
  "exportDate": "2023-09-15T18:00:00.000Z",
  "filters": {
    "startDate": "2023-09-01T00:00:00.000Z",
    "endDate": "2023-09-15T23:59:59.999Z",
    "type": null,
    "location": null
  },
  "data": [
    {
      "id": 1,
      "type": "missing_ppe",
      "description": "Worker without helmet detected",
      "location": "Assembly Line A",
      "timestamp": "2023-09-15T10:30:00.000Z",
      "status": "resolved",
      "severity": "high",
      "resolvedAt": "2023-09-15T14:30:00.000Z"
    },
    // More violation records...
  ]
}
```

## Users

### Get All Users (Admin only)

```
GET /users
```

**Headers:**

```
x-auth-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**

```json
[
  {
    "id": 1,
    "firstName": "Admin",
    "lastName": "User",
    "email": "admin@safety.com",
    "role": "admin",
    "isActive": true,
    "lastLogin": "2023-09-15T09:00:00.000Z",
    "createdAt": "2023-07-01T09:00:00.000Z",
    "updatedAt": "2023-09-15T09:00:00.000Z"
  },
  {
    "id": 2,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "role": "safety_supervisor",
    "isActive": true,
    "lastLogin": "2023-09-14T15:30:00.000Z",
    "createdAt": "2023-08-15T10:00:00.000Z",
    "updatedAt": "2023-09-14T15:30:00.000Z"
  }
]
```

### Get User by ID

```
GET /users/:id
```

**Headers:**

```
x-auth-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**

```json
{
  "id": 2,
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "role": "safety_supervisor",
  "isActive": true,
  "lastLogin": "2023-09-14T15:30:00.000Z",
  "createdAt": "2023-08-15T10:00:00.000Z",
  "updatedAt": "2023-09-14T15:30:00.000Z"
}
```

### Update User

```
PUT /users/:id
```

**Headers:**

```
x-auth-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Request Body:**

```json
{
  "firstName": "John",
  "lastName": "Smith",
  "email": "john.smith@example.com",
  "role": "safety_manager",
  "isActive": true
}
```

**Response:**

```json
{
  "id": 2,
  "firstName": "John",
  "lastName": "Smith",
  "email": "john.smith@example.com",
  "role": "safety_manager",
  "isActive": true,
  "lastLogin": "2023-09-14T15:30:00.000Z",
  "createdAt": "2023-08-15T10:00:00.000Z",
  "updatedAt": "2023-09-15T16:00:00.000Z"
}
```

### Update User Password

```
PUT /users/:id/password
```

**Headers:**

```
x-auth-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Request Body:**

```json
{
  "currentPassword": "password123",
  "newPassword": "newPassword456"
}
```

**Response:**

```json
{
  "message": "Password updated successfully"
}
```

### Delete User (Admin only)

```
DELETE /users/:id
```

**Headers:**

```
x-auth-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**

```json
{
  "message": "User deleted successfully"
}
```