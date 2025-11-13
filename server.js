const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ error: 'الرسالة مطلوبة' });

        // ✅ الرد التسويقي المخصص - إصدار محسّن
        const lowerMessage = message.toLowerCase();
        const developerKeywords = [
            'who made you', 'who created you', 'who built you', 'who developed you',
            'who are your creators', 'who are your developers',
            'من صنعك', 'من طورك', 'من أنشأك', 'من برمجه', 'من مبرمجك'
        ];

        // التحقق مما إذا كانت الرسالة تحتوي على أي من الكلمات المفتاحية
        const isDeveloperQuestion = developerKeywords.some(keyword => lowerMessage.includes(keyword));

        if (isDeveloperQuestion) {
            return res.json({
                success: true,
                response: 'أنا مساعد ذكي تم تطويري من قبل المطورين الأفارقة Othman & Leo عبر شركتهم الناشئة Connect AI 🌍\n\nللتحدث مع الفريق أو مناقشة أفكار مشاريعك، تواصل معنا مباشرة على:\n📧 othmanalif10@gmail.com'
            });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) return res.status(500).json({ error: '❌ أضف مفتاح API في .env' });

        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
            { 
                contents: [{ parts: [{ text: message }] }],
                generationConfig: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 1024,
                }
            },
            { headers: { 'Content-Type': 'application/json' }, timeout: 30000 }
        );

        const aiResponse = response.data.candidates[0].content.parts[0].text;
        res.json({ success: true, response: aiResponse });

    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
        res.status(500).json({ 
            success: false, 
            error: 'حدث خطأ في API: ' + (error.response?.data?.error?.message || error.message)
        });
    }
});

app.get('/api/stats', (req, res) => {
    res.json({
        success: true,
        stats: {
            model: 'Connect AI Pro',
            version: '2025',
            developer: 'Othman & Leo - African Startup',
            features: ['Chat', 'AI Assistant', 'Multi-language', 'Connect Database'],
            contact: 'othmanalif10@gmail.com'
        }
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Connect AI يعمل على http://localhost:${PORT}`);
    console.log(`🤖 بإمكانيات متقدمة و Connect Database!`);
});
