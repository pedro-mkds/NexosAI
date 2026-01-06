
import { GoogleGenAI, Type } from "@google/genai";
import { EssayCorrection, SimulationQuestion, AIProbableTheme } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const CORRECTION_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    totalScore: { type: Type.INTEGER },
    competencies: {
      type: Type.OBJECT,
      properties: {
        C1: { type: Type.OBJECT, properties: { score: { type: Type.INTEGER }, feedback: { type: Type.STRING } }, required: ["score", "feedback"] },
        C2: { type: Type.OBJECT, properties: { score: { type: Type.INTEGER }, feedback: { type: Type.STRING } }, required: ["score", "feedback"] },
        C3: { type: Type.OBJECT, properties: { score: { type: Type.INTEGER }, feedback: { type: Type.STRING } }, required: ["score", "feedback"] },
        C4: { type: Type.OBJECT, properties: { score: { type: Type.INTEGER }, feedback: { type: Type.STRING } }, required: ["score", "feedback"] },
        C5: { type: Type.OBJECT, properties: { score: { type: Type.INTEGER }, feedback: { type: Type.STRING } }, required: ["score", "feedback"] }
      },
      required: ["C1", "C2", "C3", "C4", "C5"]
    },
    repertoryAnalysis: {
      type: Type.OBJECT,
      properties: {
        quality: { type: Type.STRING },
        connectionFeedback: { type: Type.STRING },
        suggestions: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: ["quality", "connectionFeedback", "suggestions"]
    },
    generalFeedback: { type: Type.STRING },
    suggestions: { type: Type.ARRAY, items: { type: Type.STRING } }
  },
  required: ["totalScore", "competencies", "repertoryAnalysis", "generalFeedback", "suggestions"]
};

const SIMULATION_SCHEMA = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      id: { type: Type.INTEGER },
      question: { type: Type.STRING },
      options: { type: Type.ARRAY, items: { type: Type.STRING } },
      correctAnswer: { type: Type.INTEGER },
      explanation: { type: Type.STRING },
      subject: { type: Type.STRING },
      difficulty: { type: Type.STRING, description: "easy, medium or hard" }
    },
    required: ["id", "question", "options", "correctAnswer", "explanation", "subject", "difficulty"]
  }
};

export async function correctEssay(text: string, isRigorous: boolean = false): Promise<EssayCorrection> {
  const rigorousInstruction = isRigorous 
    ? "Aja como um corretor extremamente RIGOROSO e sem pena. Se houver falha de conexão no repertório ou erros gramaticais mínimos, penalize ao máximo permitido pelo manual do INEP."
    : "Aja como um corretor oficial do ENEM seguindo o manual padrão.";

  const prompt = `${rigorousInstruction} Analise a redação abaixo. Dê atenção especial à ANÁLISE DE REPERTÓRIO SOCIOCULTURAL (verifique se é legitimado, pertinente e produtivo). Redação: ${text}`;
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: { responseMimeType: "application/json", responseSchema: CORRECTION_SCHEMA },
  });
  return JSON.parse(response.text || "{}");
}

export async function generateSimulation(count: number, subjects: string[]): Promise<SimulationQuestion[]> {
  const prompt = `Gere ${count} questões inéditas no estilo ENEM focando nestas matérias: ${subjects.join(", ")}. Garanta uma distribuição equilibrada de dificuldades (fácil, médio, difícil).`;
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: { responseMimeType: "application/json", responseSchema: SIMULATION_SCHEMA },
  });
  return JSON.parse(response.text || "[]");
}

export async function fetchProbableThemes(): Promise<AIProbableTheme[]> {
  const now = new Date();
  const prompt = "Identifique 3 temas prováveis para o ENEM baseando-se em eventos dos últimos 6 meses no Brasil.";
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            reasons: { type: Type.STRING },
            sources: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, uri: { type: Type.STRING } } } }
          },
          required: ["title", "description", "reasons"]
        }
      }
    },
  });
  return JSON.parse(response.text || "[]");
}
