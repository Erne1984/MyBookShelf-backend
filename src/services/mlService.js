const fetch = require('node-fetch');
const AbortController = require('abort-controller');

const classifyReview = async (content) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000); 

    try {
        const response = await fetch('http://localhost:5000/classify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content }),
            signal: controller.signal,
        });

        clearTimeout(timeout);

        if (!response.ok) {
            throw new Error(`Erro ao comunicar com o serviço de ML: ${response.statusText}`);
        }

        const data = await response.json();
        return data.classification;
    } catch (error) {
        console.error('Erro ao comunicar com o serviço de ML:', error);
        throw new Error('Serviço de classificação indisponível');
    }
};

module.exports = { classifyReview };
