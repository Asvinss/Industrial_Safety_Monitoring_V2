'use strict';

require('dotenv').config();
const axios = require('axios');

// Configuration
const API_URL = `http://localhost:${process.env.PORT || 5000}`;
const FRONTEND_URL = 'http://localhost:3001'; // Assuming frontend runs on port 3001

// Test user credentials
const testUser = {
  email: 'admin@safety.com',
  password: 'admin123'
};

// Store auth token
let authToken = '';

/**
 * Run integration tests
 */
async function runIntegrationTests() {
  console.log('Starting backend-frontend integration tests...');
  console.log(`Backend API URL: ${API_URL}`);
  console.log(`Frontend URL: ${FRONTEND_URL}`);
  console.log('-------------------------------------------');

  try {
    // Test 1: Check if backend is running
    await testBackendConnection();

    // Test 2: Check if frontend is running
    await testFrontendConnection();

    // Test 3: Test authentication
    await testAuthentication();

    // Test 4: Test camera endpoints
    await testCameraEndpoints();

    // Test 5: Test violation endpoints
    await testViolationEndpoints();

    // Test 6: Test analytics endpoints
    await testAnalyticsEndpoints();

    console.log('\n✅ All integration tests passed!');
  } catch (error) {
    console.error('\n❌ Integration tests failed:', error.message);
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
 * Test frontend connection
 */
async function testFrontendConnection() {
  try {
    const response = await axios.get(FRONTEND_URL);
    console.log('✅ Frontend connection successful');
    return response.status === 200;
  } catch (error) {
    console.error('❌ Frontend connection failed');
    throw error;
  }
}

/**
 * Test authentication
 */
async function testAuthentication() {
  try {
    // Login
    const loginResponse = await axios.post(`${API_URL}/api/auth/login`, testUser);
    authToken = loginResponse.data.token;
    console.log('✅ Authentication successful');

    // Get current user
    const userResponse = await axios.get(`${API_URL}/api/auth/me`, {
      headers: { 'x-auth-token': authToken }
    });
    console.log(`✅ Current user: ${userResponse.data.firstName} ${userResponse.data.lastName}`);

    return true;
  } catch (error) {
    console.error('❌ Authentication failed');
    throw error;
  }
}

/**
 * Test camera endpoints
 */
async function testCameraEndpoints() {
  try {
    // Get all cameras
    const camerasResponse = await axios.get(`${API_URL}/api/cameras`, {
      headers: { 'x-auth-token': authToken }
    });
    console.log(`✅ Retrieved ${camerasResponse.data.length} cameras`);

    // If cameras exist, test getting a single camera
    if (camerasResponse.data.length > 0) {
      const cameraId = camerasResponse.data[0].id;
      const cameraResponse = await axios.get(`${API_URL}/api/cameras/${cameraId}`, {
        headers: { 'x-auth-token': authToken }
      });
      console.log(`✅ Retrieved camera: ${cameraResponse.data.name}`);
    }

    return true;
  } catch (error) {
    console.error('❌ Camera endpoints test failed');
    throw error;
  }
}

/**
 * Test violation endpoints
 */
async function testViolationEndpoints() {
  try {
    // Get all violations
    const violationsResponse = await axios.get(`${API_URL}/api/violations`, {
      headers: { 'x-auth-token': authToken }
    });
    console.log(`✅ Retrieved ${violationsResponse.data.length} violations`);

    // Get violation statistics
    const statsResponse = await axios.get(`${API_URL}/api/violations/stats`, {
      headers: { 'x-auth-token': authToken }
    });
    console.log('✅ Retrieved violation statistics');

    return true;
  } catch (error) {
    console.error('❌ Violation endpoints test failed');
    throw error;
  }
}

/**
 * Test analytics endpoints
 */
async function testAnalyticsEndpoints() {
  try {
    // Get dashboard data
    const dashboardResponse = await axios.get(`${API_URL}/api/analytics/dashboard`, {
      headers: { 'x-auth-token': authToken }
    });
    console.log('✅ Retrieved dashboard data');

    // Get safety score
    const safetyScoreResponse = await axios.get(`${API_URL}/api/analytics/safety-score`, {
      headers: { 'x-auth-token': authToken }
    });
    console.log(`✅ Retrieved safety score: ${safetyScoreResponse.data.safetyScore}`);

    return true;
  } catch (error) {
    console.error('❌ Analytics endpoints test failed');
    throw error;
  }
}

// Run the tests
runIntegrationTests();