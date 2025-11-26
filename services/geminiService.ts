import { GoogleGenAI } from "@google/genai";
import { GameTransaction } from "../types";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzeSpendingHabits = async (games: GameTransaction[]): Promise<string> => {
  try {
    const ai = getClient();
    
    // Prepare a simplified dataset for the model to save tokens
    const dataSummary = games.map(g => ({
      title: g.title,
      buy: g.purchasePrice,
      date: g.purchaseDate,
      shop: g.retailer,
      sold: g.isSold,
      sellPrice: g.salePrice || 0,
      net: g.isSold ? g.purchasePrice - (g.salePrice || 0) : 'owned'
    }));

    const prompt = `
      我是一个PS5游戏玩家，这是我的游戏买卖记录 (JSON格式):
      ${JSON.stringify(dataSummary)}

      请作为一个理财顾问兼资深游戏玩家，用幽默风趣的中文帮我分析一下：
      1. 我的总消费习惯如何？是不是"败家"？
      2. 我在回血（二手卖出）方面做得怎么样？
      3. 基于我的购买商铺和频率，给出一两个简短的省钱建议或游戏推荐方向。
      
      请保持回复在300字以内，使用Markdown格式。
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "暂时无法生成分析，请稍后再试。";
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "AI 分析服务暂时不可用，请检查网络或 API Key 设置。";
  }
};