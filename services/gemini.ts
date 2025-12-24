import { GoogleGenAI } from "@google/genai";

const getClient = () => {
    // In a real scenario, handle this gracefully. 
    // We assume process.env.API_KEY is available as per instructions.
    // If empty, the call will fail, which we catch.
    const apiKey = process.env.API_KEY || '';
    return new GoogleGenAI({ apiKey });
};

export const generateProjectDescription = async (title: string, keywords: string): Promise<string> => {
    if (!process.env.API_KEY) {
        return "Vui lòng cấu hình API Key để sử dụng tính năng AI.";
    }

    try {
        const ai = getClient();
        const model = 'gemini-3-flash-preview';
        
        const prompt = `
        Bạn là một chuyên gia nội dung cho portfolio của Editor/Videographer chuyên nghiệp.
        Hãy viết một đoạn mô tả ngắn gọn (khoảng 3-4 câu), hấp dẫn, chuyên nghiệp bằng Tiếng Việt cho dự án sau:
        
        Tên dự án: ${title}
        Từ khóa/Kỹ thuật: ${keywords}
        
        Văn phong: Hiện đại, nghệ thuật, tập trung vào kỹ thuật dựng và cảm xúc hình ảnh.
        `;

        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
        });

        return response.text || "";
    } catch (error) {
        console.error("Gemini AI Error:", error);
        return "Không thể tạo nội dung tự động lúc này.";
    }
};