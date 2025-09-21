import OpenAI from '@openai/api';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { name } = JSON.parse(event.body);

        const prompt = `
            You are an AI assistant writing a professional contact message for a user named ${name}. 
            The user wants to connect with Victoria Wilson-Sey about a potential opportunity. 
            Write a concise, friendly, and professional-sounding message draft (around 3-4 sentences). 
            The message should express interest in Victoria's profile and suggest a brief chat. 
            Do not include placeholders like "[Your Name]" or "[Your Company]". Just write the message body itself.
        `;

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "system", content: prompt }],
            max_tokens: 150,
            temperature: 0.7,
        });

        const draft = response.choices[0].message.content.trim();
        return {
            statusCode: 200,
            body: JSON.stringify({ draft }),
        };
    } catch (error) {
        console.error('Error with OpenAI API:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to generate AI draft.' }),
        };
    }
};
