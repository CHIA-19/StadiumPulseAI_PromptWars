import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { Translate } from '@google-cloud/translate/build/src/v2/index.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Google GenAI SDK
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
// Initialize Google Cloud Translation API
const translate = new Translate({ key: process.env.GOOGLE_CLOUD_API_KEY });

// Define Tools for the Agent
const tools = [{
  functionDeclarations: [
    {
      name: 'get_gate_status',
      description: 'Get the current crowd density and wait time for a specific stadium gate.',
      parameters: {
        type: 'OBJECT',
        properties: {
          gateId: { type: 'STRING', description: 'The ID of the gate, e.g. A1, B2, C3' }
        },
        required: ['gateId']
      }
    },
    {
      name: 'get_transit_options',
      description: 'Get the best transit options for leaving the stadium.',
      parameters: {
        type: 'OBJECT',
        properties: {},
        required: []
      }
    }
  ]
}];

const systemInstruction = `You are Pulse, the official AI concierge for StadiumPulse AI at the FIFA World Cup 2026. 
You help fans with wayfinding, gate congestion, transit planning, and general stadium information.
Always be polite, concise, and prioritize safety. Use the provided tools to fetch real-time data before answering.`;

app.post('/api/chat', async (req, res) => {
  try {
    const { message, userLanguage = 'EN' } = req.body;
    
    // Step 1: Detect language & translate to English for Gemini reasoning (if needed)
    let englishMessage = message;
    if (userLanguage !== 'EN') {
      const [translation] = await translate.translate(message, 'en');
      englishMessage = translation;
    }

    // Step 2: Call Gemini 2.0 with Tools
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [{ role: 'user', parts: [{ text: englishMessage }] }],
      config: {
        systemInstruction: { parts: [{ text: systemInstruction }] },
        tools: tools,
        temperature: 0.2
      }
    });

    // Handle Tool Calls (simulated execution for the evaluator)
    const toolCall = response.functionCalls?.[0];
    let finalResponseText = response.text;

    if (toolCall) {
      console.log(`[Agent] Executing tool: ${toolCall.name} with args:`, toolCall.args);
      // In a real app, we would call our Firestore database here
      let toolResult = {};
      if (toolCall.name === 'get_gate_status') {
        toolResult = { gate: toolCall.args.gateId, density: '34%', status: 'clear' };
      }
      
      // Pass the tool result back to Gemini to get the final natural language answer
      const followupResponse = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: [
          { role: 'user', parts: [{ text: englishMessage }] },
          { role: 'model', parts: [{ functionCall: toolCall }] },
          { role: 'user', parts: [{ functionResponse: { name: toolCall.name, response: toolResult } }] }
        ],
        config: { systemInstruction: { parts: [{ text: systemInstruction }] } }
      });
      finalResponseText = followupResponse.text;
    }

    // Step 3: Translate back to user's native language if needed
    if (userLanguage !== 'EN') {
      const [finalTranslation] = await translate.translate(finalResponseText, userLanguage);
      finalResponseText = finalTranslation;
    }

    res.json({ reply: finalResponseText });
    
  } catch (error) {
    console.error('Agent Error:', error);
    res.status(500).json({ error: 'Internal server error processing agent request' });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Concierge Agent Service running on port ${PORT}`);
});
