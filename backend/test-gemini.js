require('dotenv').config();
const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function test() {
  console.log('Groq Key present:', !!process.env.GROQ_API_KEY);

  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: 'Say hello in one sentence' }],
      max_tokens: 100,
    });
    console.log('SUCCESS:', completion.choices[0].message.content);
  } catch (err) {
    console.log('FAILED:', err.message);
  }
}

test().catch(console.error);