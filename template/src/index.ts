import express, { Request, Response } from 'express';
import { CommandManager } from './shared/commands/CommandManager';

const app = express();
const port = process.env.PORT || 3000;

// Initialize command manager
const commandManager = new CommandManager();

app.use(express.json());

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Command execution endpoint
app.post('/api/execute', async (req: Request, res: Response) => {
  try {
    const { command, args } = req.body;
    const result = await commandManager.execute(command, args);
    res.json({ success: true, result });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    });
  }
});

// List available commands
app.get('/api/commands', (req: Request, res: Response) => {
  res.json({ commands: commandManager.listCommands() });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
}); 