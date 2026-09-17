import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { evaluateTurn } from './server/evaluator';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      hasGeminiKey: !!process.env.GEMINI_API_KEY,
      timestamp: new Date().toISOString()
    });
  });

  // Turn evaluation endpoint
  app.post('/api/evaluate-turn', async (req, res) => {
    try {
      const { topicId, learnerInput, completedLinks, isTransfer } = req.body;
      const evaluation = await evaluateTurn({
        topicId: topicId || 'evaporative_cooling',
        learnerInput: learnerInput || '',
        completedLinks: Array.isArray(completedLinks) ? completedLinks : [],
        isTransfer: Boolean(isTransfer)
      });
      res.json(evaluation);
    } catch (error) {
      console.error('Error evaluating turn:', error);
      res.status(500).json({
        error: 'Failed to evaluate learning turn',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Vite development middleware or static production serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Socratic Science Tutor server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
