import { GoogleGenAI } from "@google/genai";

export const generateGraduationWish = async (guestName: string, relationship: string): Promise<string> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.warn("API Key not found");
      return "Felicidades a los graduados por este gran logro.";
    }

    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `
      Escribe un mensaje de felicitación corto, elegante y emotivo (máximo 40 palabras) para una tarjeta de graduación de grado 11.
      Los graduados son Cristian Muñoz y Salome Quelal.
      El mensaje es de parte de: ${guestName}.
      La relación con ellos es: ${relationship} (ej. amigo, tío, primo, colega).
      El tono debe ser de celebración y orgullo.
      Solo devuelve el texto del mensaje, sin comillas.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text.trim();
  } catch (error) {
    console.error("Error generating wish:", error);
    return `¡Muchas felicidades Cristian y Salome! Les deseo lo mejor en esta nueva etapa. Con cariño, ${guestName}.`;
  }
};
