import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mangaRoutes from './routes/manga';
import chapterRoutes from './routes/chapter';
import proxyRoutes from './proxy/imageProxy';

export const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/manga', mangaRoutes);
app.use('/api/chapter', chapterRoutes);
app.use('/api/proxy', proxyRoutes);

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ error: 'Internal Server Error' });
});

if (require.main === module) {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Manga Reader API listening on port ${PORT}`);
  });
}
