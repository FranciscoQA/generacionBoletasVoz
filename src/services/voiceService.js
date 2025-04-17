const speech = require('@google-cloud/speech');
const client = new speech.SpeechClient();
 
const transcribeAudio = async (audioBuffer) => {
    try {
        const audio = {
            content: audioBuffer.toString('base64'),
        };
 
        const config = {
            encoding: 'LINEAR16', // Cambia este valor según el formato del audio
            sampleRateHertz: 16000,
            languageCode: 'es-PE', // Idioma español (Perú)
        };
 
        const request = {
            audio,
            config,
        };
 
        const [response] = await client.recognize(request);
        const transcription = response.results
            .map(result => result.alternatives[0].transcript)
            .join(' ');
        return transcription;
    } catch (error) {
        console.error('Error al transcribir audio:', error.message);
        throw new Error('Error al procesar el audio.');
    }
};
 
module.exports = { transcribeAudio };