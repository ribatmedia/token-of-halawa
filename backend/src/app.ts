import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { errorHandler } from './middleware/error';
import { standardLimiter } from './middleware/rate-limiter';

// Import route modules
import authRoutes from './routes/auth';
import donorRoutes from './routes/donor';
import donationRoutes from './routes/donation';
import campaignRoutes from './routes/campaign';
import publicRoutes from './routes/public';
import developerRoutes from './routes/developer';
import { PublicController } from './controllers/public';

const app = express();

// Security Middlewares
app.use(helmet());
app.use(cors({
  origin: '*', // Customize this for production environments
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Compression & Body Parser
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Global Rate Limiter
app.use(standardLimiter);

// Health Check API
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', uptime: process.uptime(), timestamp: new Date() });
});

// Mounting Module API Routers
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/donors', donorRoutes);
app.use('/api/v1/donations', donationRoutes);
app.use('/api/v1/campaigns', campaignRoutes);
app.use('/api/v1/public', publicRoutes);
app.use('/api/v1/developer', developerRoutes);
app.get('/api/v1/campaigners', PublicController.getCampaigners);

// Error Handling Middleware
app.use(errorHandler);

export default app;
