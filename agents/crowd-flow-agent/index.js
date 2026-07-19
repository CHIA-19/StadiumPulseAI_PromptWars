import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const systemInstruction = `You are the Crowd-Flow Management Agent for StadiumPulse AI. 
You ingest gate turnstile rates (fans/min) and predict congestion status. 
If a gate influx exceeds 250 fans/minute, flag it as CRITICAL congestion and recommend fan redirection to the nearest CALM gate.`;

app.post('/api/predict', async (req, res) => {
  try {
    const { gates } = req.body; // Array of { gate: string, influx: number }
    
    // Call Gemini to predict congestion patterns
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [{ role: 'user', parts: [{ text: JSON.stringify(gates) }] }],
      config: {
        systemInstruction: { parts: [{ text: systemInstruction }] },
        temperature: 0.1
      }
    });

    res.json({
      predictions: response.text,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Crowd Flow Agent Error:', error);
    res.status(500).json({ error: 'Failed to predict crowd flow' });
  }
});

const PORT = process.env.PORT || 8081;
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Crowd-Flow Agent running on port ${PORT}`);
  });
}
export default app;
