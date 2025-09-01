# AI Configuration Usage Guide

## Overview

The AI Configuration feature allows administrators to manage AI model settings without modifying code. This guide explains how to use the API endpoints to configure AI models for the Industrial Safety Monitoring System.

## Configuration File

The system uses a centralized configuration file located at:

```
server/config/ai-models.config.js
```

This file contains settings for all AI detection models including:
- Base paths for model files
- Individual model configurations (path, version, file, enabled status)
- Detection thresholds
- Processing settings

## API Endpoints

### 1. Get All AI Configurations

**Endpoint:** `GET /api/ai-config`

**Authentication:** Requires valid JWT token

**Description:** Retrieves all current AI model configurations

**Sample Response:**
```json
{
  "success": true,
  "data": {
    "basePath": "/path/to/models",
    "models": {
      "ppeDetection": {
        "path": "/path/to/models/ppe-detection",
        "version": "1.0.0",
        "file": "model.bin",
        "enabled": true,
        "threshold": 0.75
      },
      "fallDetection": {
        "path": "/path/to/models/fall-detection",
        "version": "1.0.0",
        "file": "model.bin",
        "enabled": true,
        "threshold": 0.8
      },
      "fireDetection": {
        "path": "/path/to/models/fire-detection",
        "version": "1.0.0",
        "file": "model.bin",
        "enabled": true,
        "threshold": 0.7
      },
      "restrictedAreaDetection": {
        "path": "/path/to/models/restricted-area-detection",
        "version": "1.0.0",
        "file": "model.bin",
        "enabled": true,
        "threshold": 0.85
      }
    },
    "processingSettings": {
      "frameInterval": 5,
      "batchSize": 10
    }
  }
}
```

### 2. Update Model Path

**Endpoint:** `PUT /api/ai-config/model-path`

**Authentication:** Requires valid JWT token with admin privileges

**Request Body:**
```json
{
  "modelType": "ppeDetection",
  "newPath": "/custom/path/to/ppe-detection"
}
```

**Description:** Updates the file path for a specific AI model

**Sample Response:**
```json
{
  "success": true,
  "message": "Model path updated successfully",
  "data": {
    "modelType": "ppeDetection",
    "path": "/custom/path/to/ppe-detection"
  }
}
```

### 3. Update Model Threshold

**Endpoint:** `PUT /api/ai-config/threshold`

**Authentication:** Requires valid JWT token with admin privileges

**Request Body:**
```json
{
  "modelType": "ppeDetection",
  "threshold": 0.85
}
```

**Description:** Updates the detection threshold for a specific AI model

**Sample Response:**
```json
{
  "success": true,
  "message": "Model threshold updated successfully",
  "data": {
    "modelType": "ppeDetection",
    "threshold": 0.85
  }
}
```

### 4. Toggle Model Enabled Status

**Endpoint:** `PATCH /api/ai-config/:modelType/toggle`

**Authentication:** Requires valid JWT token with admin privileges

**URL Parameters:**
- `modelType`: The type of model to toggle (e.g., ppeDetection, fallDetection)

**Description:** Toggles the enabled status of a specific AI model

**Sample Response:**
```json
{
  "success": true,
  "message": "Model status toggled successfully",
  "data": {
    "modelType": "ppeDetection",
    "enabled": false
  }
}
```

## Testing with Postman

A Postman collection is provided for testing the AI configuration endpoints. The collection is located at:

```
server/tests/Industrial_Safety_Monitor_API.postman_collection.json
```

To use the collection:

1. Import the collection into Postman
2. Set the `baseUrl` variable to your server URL (default: http://localhost:5000)
3. Use the Login request to obtain an authentication token
4. The token will be automatically set for subsequent requests
5. Test the AI configuration endpoints

## Common Use Cases

### Changing Model Paths for Testing

During development or testing, you may need to point the system to different model files:

1. Get the current configuration using `GET /api/ai-config`
2. Update the model path using `PUT /api/ai-config/model-path`
3. Verify the change by getting the configuration again

### Adjusting Detection Sensitivity

To fine-tune detection sensitivity:

1. Start with the default threshold values
2. If you're getting too many false positives, increase the threshold using `PUT /api/ai-config/threshold`
3. If you're missing detections, decrease the threshold
4. Test and adjust as needed

### Disabling Models Temporarily

To temporarily disable a model without removing it:

1. Use `PATCH /api/ai-config/:modelType/toggle` to disable the model
2. The model will remain in the configuration but won't be used for detection
3. Toggle it back on when needed

## Troubleshooting

### Model Not Loading

If a model fails to load:

1. Verify the path is correct using `GET /api/ai-config`
2. Ensure the model file exists at the specified path
3. Check server logs for specific error messages
4. Update the path if needed using `PUT /api/ai-config/model-path`

### Permission Issues

If you receive a 403 Forbidden response:

1. Ensure you're using a valid JWT token
2. Verify the user has admin privileges
3. Check that the token hasn't expired

## Best Practices

1. Always test configuration changes in a development environment before applying to production
2. Document any custom paths or thresholds for team reference
3. Consider the impact on system performance when adjusting thresholds
4. Regularly backup the configuration file before making significant changes