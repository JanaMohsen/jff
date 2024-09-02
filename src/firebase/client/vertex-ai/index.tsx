import {getGenerativeModel} from "@firebase/vertexai-preview";
import {vertexAI} from "@/firebase/client/config";
import {MAX_DISCOUNT_PERCENTAGE} from "@/constants";

export const defaultPersonalizedDiscount = {
    discount: 0,
    message: "Failed to generate discount. You can get a discount next time!"
}

export type PersonalizedDiscount = {
    discount: number;
    message: string;
}

export const getPersonalizedDiscount = async (total: number, orderHistory: any): Promise<PersonalizedDiscount> => {
    try {
        const model = getGenerativeModel(vertexAI, {model: "gemini-1.5-flash"});
        const prompt = [
            "I run a women's fashion store.",
            "Generate a personalized discount for the user based on their order total and order history.",
            `Order total: ${total}.`,
            `Max discount: ${MAX_DISCOUNT_PERCENTAGE}.`,
            `Order history: ${JSON.stringify(orderHistory)}. If empty, it's a first-time user.`,
            "Provide only a JSON object with `discount` percentage and a `message` about the discount.",
        ].join(" ");
        const result = await model.generateContent(prompt);
        const cleanedText = result.response.text()
            .replace(/^```json\n/, '')
            .replace(/\n```$/, '')
            .trim();
        const parsedResponse = JSON.parse(cleanedText);
        return {
            discount: Math.min(MAX_DISCOUNT_PERCENTAGE, parsedResponse.discount),
            message: parsedResponse.message
        };
    } catch (e) {
        return defaultPersonalizedDiscount;
    }
}
