import { openclawClient } from '../openclawClient';

export const analyzeImageWithGemini = async (base64Image: string, prompt: string): Promise<string> => {
    const imagePayload = `Analisis imej berikut (base64 JPEG): ${base64Image}`;
    const response = await openclawClient.chatCompletion(
        [
            {
                role: 'system',
                content: 'Anda pembantu vision QuranPulse. Analisis kandungan imej berdasarkan arahan pengguna dan beri jawapan padat dalam Bahasa Melayu.'
            },
            {
                role: 'user',
                content: `${prompt}\n\n${imagePayload}`
            }
        ],
        {
            temperature: 0.4,
            max_tokens: 1024
        }
    );

    return response || 'Maaf, Ustazah tidak dapat mengecam gambar tersebut.';
};
