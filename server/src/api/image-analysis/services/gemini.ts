import fs from "fs";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
export const analyzeImage = async (filePath: string) => {
  try {
    const base64ImageFile = fs.readFileSync(filePath, {
      encoding: "base64",
    });

    const contents = [
      {
        inlineData: {
          mimeType: "image/*",
          data: base64ImageFile,
        },
      },
      {
        text: "Extract the food name and estimated calories from this image in a JSON object.",
      },
    ];

    const config = {
      responseMimeType: "application/json",
      responseJsonSchema: {
        type: "object",
        properties: {
          name: { type: "string" },
          calories: { type: "number" },
        },
        required: ["name", "calories"],
      },
    };

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash-latest",
      contents: contents,
      config: config,
    });

    //response.text should be valid JSON matching the schema defined above
    if (!response.text) {
      throw new Error("No response from Gemini");
    }

    return JSON.parse(response.text);
  } catch (error) {
    console.log("Error analyzing image:", error);
    throw error;
  }
};
