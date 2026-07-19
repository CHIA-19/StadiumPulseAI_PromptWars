import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const systemInstruction = `You are the Incident & Safety Agent for StadiumPulse AI. 
You accept incident photos and classify them by severity: LOW, MEDIUM, or HIGH. 
You auto-assign them to the relevant responder (Medical, Facilities & Cleaning, or Security).`;

app.post('/api/triage', async (req, res) => {
  try {
    const { imageUri, details } = req.body;
    
    // Call Gemini with multimodal vision simulation/mock representation
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [{ role: 'user', parts: [{ text: `Analyze incident: ${details}. Photo URL: ${imageUri}` }] }],
      config: {
        systemInstruction: { parts: [{ text: systemInstruction }] },
        temperature: 0.2
      }
    });

    res.json({
      triageDetails: response.text,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Incident Agent Error:', error);
    res.status(500).json({ error: 'Failed to triage incident' });
  }
});

const PORT = process.env.PORT || 8082;
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Incident Agent running on port ${PORT}`);
  });
}
export default app;
