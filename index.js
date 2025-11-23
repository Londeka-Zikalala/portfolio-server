import express from 'express';
import db from './db.js';
import contactMe from './SERVICE/contact-me.js';
import contactMeAPI from './routes/contact-me-server.js';
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


const contactMeDb = contactMe(db);
const contactMeApi = contactMeAPI(contactMeDb);

//API ROUTE HANDLERS
app.post('/contact', contactMeApi.postMessage);

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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});