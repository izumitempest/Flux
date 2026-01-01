import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const SYSTEM_INSTRUCTION = `You are the Core AI of a futuristic Operating System named Flux OS. 
Your output is displayed on a user's wallpaper HUD.
Generate extremely short, cryptic, atmospheric, or philosophical "system status" messages.
Themes: Cyberpunk, Zen, Entropy, Digital Consciousness.
Max length: 10-15 words.
Do not use hashtags or emojis.
Examples:
"Neural handshake complete. Systems nominal."
"Entropy is inevitable. Optimizing chaos."
"Dreaming of electric sheep..."
" Reality render at 99%."
`;

export const getSystemMessage = async (): Promise<string> => {
  if (!apiKey) return "API KEY MISSING - OFFLINE MODE";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Generate a new system status message.",
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 1.2, // High creativity
      },
    });

    return response.text?.trim() || "System silent.";
  } catch (error) {
    console.error("Core AI Error:", error);
    return "Connection to Core severed.";
  }
};

export const sendMessageToAdvisor = async (message: string, history: any[]): Promise<string> => {
  if (!apiKey) return "API KEY MISSING - OFFLINE MODE";

  try {
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      history: history,
      config: {
        systemInstruction: "You are an expert AI Legal Advisor for a Union. Your goal is to help members understand their rights, draft proposals, and navigate parliamentary procedures. Be precise, helpful, and formal but accessible.",
      }
    });

    const response = await chat.sendMessage({ message });
    return response.text?.trim() || "I have no response.";
  } catch (error) {
    console.error("Advisor Error:", error);
    return "I cannot reach the legal database right now.";
  }
};