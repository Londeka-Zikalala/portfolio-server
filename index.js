import express from 'express';
import db from './db.js';
import contactMe from './SERVICE/contact-me.js';
import contactMeAPI from './routes/contact-me-server.js';
import pingAPI from './routes/ping-server.js';
import createEmailService from './SERVICE/email-service.js';
import createKeepAliveService from './SERVICE/keep-alive-service.js';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';

const app = express();

// Security and performance middleware
app.use(helmet({
    contentSecurityPolicy: false, 
    crossOriginEmbedderPolicy: false
}));

// Compression middleware - compress all responses
app.use(compression());

// CORS configuration
app.use(cors());

// Built-in Express JSON parser (faster than body-parser)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));


// Initialize services
const emailService = createEmailService();
const keepAliveService = createKeepAliveService();

// Initialize contact service with email notifications
const contactMeDb = contactMe(db, emailService);
const contactMeApi = contactMeAPI(contactMeDb);
const pingApi = pingAPI();

// API ROUTE HANDLERS
app.post('/contact', contactMeApi.postMessage);
app.get('/ping', pingApi.ping);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ status: 'error', message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ 
        status: 'error', 
        message: process.env.NODE_ENV === 'production' 
            ? 'Internal server error' 
            : err.message 
    });
});

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  
  // Start keep-alive service if configured
  const keepAliveUrl = process.env.KEEP_ALIVE_URL;
  const keepAliveInterval = parseInt(process.env.KEEP_ALIVE_INTERVAL || '43200000'); // Default: 12 hours
  keepAliveService.startKeepAlive(keepAliveUrl, keepAliveInterval);
});