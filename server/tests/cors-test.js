'use strict';

require('dotenv').config();
const axios = require('axios');

// Configuration
const API_URL = `http://localhost:${process.env.PORT || 5000}`;
const FRONTEND_URL = 'http://localhost:3001'; // Assuming frontend runs on port 3001

/**
 * Test CORS configuration between backend and frontend
 */
async function testCorsConfiguration() {
  console.log('Testing CORS configuration between backend and frontend...');
  console.log(`Backend API URL: ${API_URL}`);
  console.log(`Frontend URL: ${FRONTEND_URL}`);
  console.log('-------------------------------------------');

  try {
    // Test 1: Check if backend is running
    await testBackendConnection();

    // Test 2: Check if frontend can access backend API
    await testCorsAccess();

    console.log('\n✅ CORS configuration test passed!');
  } catch (error) {
    console.error('\n❌ CORS configuration test failed:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
  }
}

/**
 * Test backend connection
 */
async function testBackendConnection() {
  try {
    const response = await axios.get(`${API_URL}/`);
    console.log('✅ Backend connection successful');
    return response.data;
  } catch (error) {
    console.error('❌ Backend connection failed');
    throw error;
  }
}

/**
 * Test CORS access from frontend to backend
 */
async function testCorsAccess() {
  try {
    // Simulate a request from the frontend to the backend
    const response = await axios.get(`${API_URL}/api/auth/login`, {
      headers: {
        'Origin': FRONTEND_URL,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ CORS access successful');
    return true;
  } catch (error) {
    // Check if the error is related to CORS
    if (error.response && error.response.headers) {
      const corsHeaders = [
        'access-control-allow-origin',
        'access-control-allow-methods',
        'access-control-allow-headers'
      ];
      
      const hasCorsHeaders = corsHeaders.some(header => 
        error.response.headers[header] !== undefined
      );
      
      if (hasCorsHeaders) {
        console.log('✅ CORS headers are present, but request failed for other reasons');
        console.log('CORS Headers:', corsHeaders.map(header => 
          `${header}: ${error.response.headers[header]}`
        ).join('\n'));
        return true;
      }
    }
    
    console.error('❌ CORS access failed - No CORS headers found in response');
    throw error;
  }
}

// Run the tests
testCorsConfiguration();