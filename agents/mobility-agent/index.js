import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const systemInstruction = `You are the Mobility Agent for StadiumPulse AI. 
You calculate transit itineraries from MetLife Stadium and assign green/eco friendliness ratings. 
Prioritize zero-carbon options like walking and cycling or low-carbon rail options over driving.`;

app.post('/api/routes', async (req, res) => {
  try {
    const { destination, preferEco } = req.body;
    
    // Call Gemini with Maps directions input parameters
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [{ role: 'user', parts: [{ text: `Get routing to ${destination}. Eco preferred: ${preferEco}` }] }],
      config: {
        systemInstruction: { parts: [{ text: systemInstruction }] },
        temperature: 0.2
      }
    });

    res.json({
      itineraries: response.text,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Mobility Agent Error:', error);
    res.status(500).json({ error: 'Failed to retrieve mobility options' });
  }
});

const PORT = process.env.PORT || 8083;
app.listen(PORT, () => {
  console.log(`Mobility Agent running on port ${PORT}`);
});
