'use strict';

require('dotenv').config();
const mysql = require('mysql2/promise');

async function testConnection() {
  let connection;
  try {
    // Create connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT
    });

    console.log('MySQL connection successful!');
    
    // Check if database exists
    const [rows] = await connection.execute(
      `SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = '${process.env.DB_NAME}'`
    );

    if (rows.length === 0) {
      console.log(`Database '${process.env.DB_NAME}' does not exist. Creating it now...`);
      await connection.execute(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
      console.log(`Database '${process.env.DB_NAME}' created successfully!`);
    } else {
      console.log(`Database '${process.env.DB_NAME}' already exists.`);
    }

    console.log('Connection test completed successfully!');
  } catch (error) {
    console.error('Database connection test failed:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Connection closed.');
    }
    process.exit(0);
  }
}

testConnection();