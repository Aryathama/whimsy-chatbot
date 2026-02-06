export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { messages } = req.body;
    const GROQ_API_KEY = process.env.GROQ_API_KEY;

    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "llama-3.1-8b-instant",
                messages: messages,
                temperature: 0.6,
                stop: [".", "!", "?", "\n"] 
            })
        });

        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error.message);
        }

        res.status(200).json(data);
    } catch (error) {
        console.error('Serverless Error:', error);
        res.status(500).json({ error: 'Gagal menghubungi AI' });
    }
}