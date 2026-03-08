window.USE_LOCAL = false;

if (USE_LOCAL) {
    fetchAiResponse = async function() {
        const res = await fetch('http://localhost:11434/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'tinyllama',
                stream: false,
                messages: [
                    { role: 'system', content: 'You are Hoxip, created by RUDRA MISHRA.' },
                    ...messages.map(m => ({
                        role: m.role === 'model' ? 'assistant' : m.role,
                        content: m.content
                    }))
                ]
            })
        });
        const data = await res.json();
        return data.message.content;
    }
}
