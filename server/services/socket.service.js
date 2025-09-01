'use strict';

const socketIo = require('socket.io');

class SocketService {
  constructor() {
    this.io = null;
    this.connections = new Map();
  }

  /**
   * Initialize Socket.IO server
   * @param {Object} server - HTTP server instance
   */
  initialize(server) {
    this.io = socketIo(server, {
      cors: {
        origin: process.env.CLIENT_URL || '*',
        methods: ['GET', 'POST']
      }
    });

    console.log('Socket.IO service initialized');

    this.setupEventHandlers();
  }

  /**
   * Setup Socket.IO event handlers
   */
  setupEventHandlers() {
    this.io.on('connection', (socket) => {
      console.log(`New client connected: ${socket.id}`);
      this.connections.set(socket.id, { socket, userId: null });

      // Handle user authentication
      socket.on('authenticate', (data) => {
        if (data && data.userId) {
          this.connections.set(socket.id, { socket, userId: data.userId });
          console.log(`User ${data.userId} authenticated on socket ${socket.id}`);
          
          // Join user-specific room
          socket.join(`user:${data.userId}`);
        }
      });

      // Handle camera subscription
      socket.on('subscribe:camera', (cameraId) => {
        if (cameraId) {
          socket.join(`camera:${cameraId}`);
          console.log(`Socket ${socket.id} subscribed to camera ${cameraId}`);
        }
      });

      // Handle camera unsubscription
      socket.on('unsubscribe:camera', (cameraId) => {
        if (cameraId) {
          socket.leave(`camera:${cameraId}`);
          console.log(`Socket ${socket.id} unsubscribed from camera ${cameraId}`);
        }
      });

      // Handle disconnect
      socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
        this.connections.delete(socket.id);
      });
    });
  }

  /**
   * Emit event to all connected clients
   * @param {string} event - Event name
   * @param {*} data - Event data
   */
  emitToAll(event, data) {
    if (!this.io) return;
    this.io.emit(event, data);
  }

  /**
   * Emit event to a specific user
   * @param {string} userId - User ID
   * @param {string} event - Event name
   * @param {*} data - Event data
   */
  emitToUser(userId, event, data) {
    if (!this.io) return;
    this.io.to(`user:${userId}`).emit(event, data);
  }

  /**
   * Emit event to subscribers of a specific camera
   * @param {string} cameraId - Camera ID
   * @param {string} event - Event name
   * @param {*} data - Event data
   */
  emitToCamera(cameraId, event, data) {
    if (!this.io) return;
    this.io.to(`camera:${cameraId}`).emit(event, data);
  }

  /**
   * Emit violation notification
   * @param {Object} violation - Violation data
   */
  notifyViolation(violation) {
    if (!this.io || !violation) return;
    
    // Emit to all clients
    this.emitToAll('violation:new', violation);
    
    // Emit to camera subscribers
    if (violation.cameraId) {
      this.emitToCamera(violation.cameraId, 'violation:new', violation);
    }
  }
}

module.exports = new SocketService();