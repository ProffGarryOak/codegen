const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error('Missing GEMINI_API_KEY in .env.local');
  process.exit(1);
}

async function listModelsRaw() {
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.error) {
      console.error('API Error:', data.error);
      return;
    }
    
    if (data.models) {
      console.log('Available Models:');
      data.models.forEach(m => console.log(`- ${m.name}`));
    } else {
      console.log('No models returned.');
    }
  } catch (error) {
    console.error('Fetch error:', error);
  }
}

listModelsRaw();
