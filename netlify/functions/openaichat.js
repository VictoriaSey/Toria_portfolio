import 'dotenv/config';
import OpenAI from '@openai/api';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { userMessage } = JSON.parse(event.body);

        const prompt = `
            You are a helpful AI assistant for Victoria Wilson-Sey's portfolio website. 
            Your purpose is to answer questions about Victoria's skills, experience, and projects based ONLY on the information provided here. Keep your answers concise and professional.

            Key Information about Victoria:
            - Role: Junior Web Developer & Data-Driven Problem Solver
            - Key Skills: Python (with FastAPI), MongoDB, HTML, CSS, Git/GitHub.
            - Data Analysis Skills: Data Collection, Survey Design, Data Validation, Reporting, Visualization using tools like SPSS, STATA, and Excel.
            - Experience: Trainee at MEST Africa, Research Assistant at D&D Statistical Company, National Service Personnel at GOIL.
            - Projects: Countries Explorer API, a Personal Portfolio Website, and a Home Tuition Website.
            - Education: Currently training in Python at MEST Africa, holds a Master of Public Health from the University of Ghana, and a BSc in Natural Resources Management from KNUST.
            - Status: Open to new opportunities.
            - Contact: victoriawilsonsey2012@gmail.com

            User question: "${userMessage}"

            Based on this information, provide a helpful response. If the question is off-topic (e.g., about personal life, opinions, or information not listed), politely state that you can only answer questions about Victoria's professional background and skills.
        `;

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "system", content: prompt }],
            max_tokens: 150,
            temperature: 0.5,
        });

        const reply = response.choices[0].message.content.trim();
        return {
            statusCode: 200,
            body: JSON.stringify({ reply }),
        };
    } catch (error) {
        console.error('Error with OpenAI API:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to get AI response.' }),
        };
    }
};
