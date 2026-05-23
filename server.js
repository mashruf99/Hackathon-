require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Groq = require('groq-sdk');


const app = express();
app.use(express.json());
app.use(cors());


const groq = new Groq({ apiKey: process.env.API_KEY });
const diuData = require('./data.json');

app.get('/', (req, res) => {
    res.send("Running");
});

app.post('/api/recommend', async (req, res) => {
    const { budget, subjects, goals } = req.body;
    const userPrompt = `আমি Daffodil International University (DIU)-তে ভর্তি হতে চাই। আমার বাজেট: ${budget} BDT। পছন্দের সাবজেক্ট: ${subjects}। ফিউচার গোল: ${goals}।`;

    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `You are an expert student counselor at Daffodil International University (DIU). Use ONLY this dataset to recommend departments: ${JSON.stringify(diuData)}. Never recommend anything outside this data. Speak in a warm, friendly Bengali/Banglish tone.`
                },
                {
                    role: "user",
                    content: userPrompt
                }
            ],
            model: "llama-3.3-70b-versatile",
        });

        res.json({ aiOutput: chatCompletion.choices[0].message.content });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Groq API তে সমস্যা হচ্ছে।" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));