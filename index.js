import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';  

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const ai = new GoogleGenAI(process.env.GEMINI_API_KEY);

const GEMINI_MODEL = 'gemini-2.5-flash';

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.post('/api/chat', async (req, res) => {
    const { conversation } = req.body;
    
    try {
        if (!conversation || !Array.isArray(conversation)) throw new Error('Message must be an array!');

        const contents = conversation.map(({ role, text }) => ({ 
            role, 
            parts: [{ text }] 
        }));
        
        const response = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents,
            config: {
                temperature: 0.9,
                systemInstruction: "Jawab dalam bahasa Indonesia.",
            },
        });

        res.status(200).json({ result: response.text });
    } catch (error) {
        console.error('Error generating content:', error);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
}); 