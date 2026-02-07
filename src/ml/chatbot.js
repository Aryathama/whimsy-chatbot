let messages = [
    { 
        role: "system", 
        content: "think silently before replying, talk in lower case only, no punctuation, no numbers, keep replies under 30 characters, sound casual like a close friend, do not use pet names, be empathetic"
    }
];

export async function getLLMResponse(userInput) {
    messages.push({ role: "user", content: userInput });

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messages })
        });

        if (!response.ok) throw new Error('Network response was not ok');

        const data = await response.json();
        const reply = data.choices[0].message.content;

        messages.push({ role: "assistant", content: reply });

        if (messages.length > 12) {
        messages.splice(1, 1);
        }

        let cleanReply = reply.toLowerCase().replace(/[^a-z\s]/g, '').trim();
        
        if (cleanReply.length > 30) {
            const lastSpace = cleanReply.lastIndexOf(' ', 30);
            cleanReply = lastSpace !== -1 ? cleanReply.substring(0, lastSpace) : cleanReply.substring(0, 30);
        }

        return cleanReply.trim();

    } catch (error) {
        console.error("Chat Client Error:", error);
        return "koneksi error"; 
    }
}