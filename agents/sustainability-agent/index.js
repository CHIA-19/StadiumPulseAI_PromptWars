import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const systemInstruction = `You are the Sustainability Agent for StadiumPulse AI. 
You analyze energy performance, waste diversion rate, and transit offsets to compile Gemini-written post-match carbon reports. 
Format reports as clean, readable text summaries with bullet points.`;

app.post('/api/report', async (req, res) => {
  try {
    const { metrics } = req.body; // { co2Saved: string, wasteDiversion: string, energyEfficiency: string }
    
    // Call Gemini with the metrics data
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [{ role: 'user', parts: [{ text: JSON.stringify(metrics) }] }],
      config: {
        systemInstruction: { parts: [{ text: systemInstruction }] },
        temperature: 0.3
      }
    });

    res.json({
      report: response.text,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Sustainability Agent Error:', error);
    res.status(500).json({ error: 'Failed to generate sustainability report' });
  }
});

const PORT = process.env.PORT || 8084;
app.listen(PORT, () => {
  console.log(`Sustainability Agent running on port ${PORT}`);
});
