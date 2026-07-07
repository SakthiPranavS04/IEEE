import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import connectDB from './config/db.js';
import documentRoutes from './routes/documentRoutes.js';
import authRoutes from './routes/authRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import teamRoutes from './routes/teamRoutes.js';
import announcementRoutes from './routes/announcementRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import newsletterRoutes from './routes/newsletterRoutes.js';
import joinRoutes from './routes/joinRoutes.js';
import sponsorRoutes from './routes/sponsorRoutes.js';
import galleryRoutes from './routes/galleryRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import researchRoutes from './routes/researchRoutes.js';
import requestRoutes from './routes/requestRoutes.js';

import achievementRoutes from './routes/achievementRoutes.js';
import committeeRoutes from './routes/committeeRoutes.js';
import societyRoutes from './routes/societyRoutes.js';
import formtemplateRoutes from './routes/formtemplateRoutes.js';
import videoRoutes from './routes/videoRoutes.js';
import newsitemRoutes from './routes/newsitemRoutes.js';

import { errorHandler, notFound } from './middlewares/errorMiddleware.js';

dotenv.config();

console.log("MONGO_URI =", process.env.MONGO_URI);
console.log("Current directory =", process.cwd());

connectDB();

const app = express();

// Security Middlewares
app.use(helmet({ hsts: false }));
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(mongoSanitize());
app.use(xss());

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
});
app.use('/api', limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/join', joinRoutes);
app.use('/api/sponsors', sponsorRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/research', researchRoutes);
app.use('/api/requests', requestRoutes);

app.use('/api/achievements', achievementRoutes);
app.use('/api/committees', committeeRoutes);
app.use('/api/societies', societyRoutes);
app.use('/api/formtemplates', formtemplateRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/newsitems', newsitemRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
