
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const receiptSchema = {
  type: Type.OBJECT,
  properties: {
    merchant: { type: Type.STRING, description: "Name of the store" },
    date: { type: Type.STRING, description: "Date on receipt in YYYY-MM-DD format" },
    total: { type: Type.NUMBER, description: "Total amount paid" },
    category: { type: Type.STRING, description: "Reasonable category for this expense" }
  },
  required: ["merchant", "date", "total", "category"]
};

export async function extractReceiptData(base64Image: string) {
  const model = 'gemini-3-flash-preview';
  
  const response = await ai.models.generateContent({
    model,
    contents: {
      parts: [
        { 
          inlineData: { 
            mimeType: "image/jpeg", 
            data: base64Image.includes(',') ? base64Image.split(',')[1] : base64Image 
          } 
        },
        { text: "Extract merchant, date, total, and category from this receipt. Return JSON." }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: receiptSchema
    }
  });

  const text = response.text;
  if (!text) throw new Error("No text returned from Gemini");
  return JSON.parse(text);
}
