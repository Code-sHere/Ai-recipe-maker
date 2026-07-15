"use server";

import { proTierLimit, freePantryScans } from "@/lib/arcjet";
import { checkUser } from "@/lib/checkUser";
import { GoogleGenerativeAI } from "@google/generative-ai";

const STRAPI_URL =
    process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";

const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);


export async function scanPantryImage(formData) {
    try {
        const user = await checkUser();
        if (!user) {
            throw new Error("User not LogedIn");
        }

        const isPro = user.subscriptionTier === "pro";

        //Apply arcjet rate limit based on tier

        const arcjetClient = isPro ? proTierLimit : freePantryScans;

        // create a request object for arcjet
        const req = await request();

        const decision = await arcjetClient.protect(req, {
            userId: user.clerkId,
            requested: 1,
        });

        if (decision.isDenied()) {
            if (decision.reason.isRateLimit()) {
                throw new Error(`
                    Monthly scan limit reached, please upgrade to pro tier to continue. ${isPro ? "please contact support if you need more scans." : "Upgrade now."}`)
            }
            throw new Error("Request denied by security system. Please try again later.");
        }

        const imageFile = formData.get("image");
        if (!imageFile) {
            throw new Error("No image file found");
        }

        // convert image into base64 string to gemini
        const bytes = await imageFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64Image = buffer.toString("base64");

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash-lite",
        })

        const prompt = `You are a professional chef and ingredient recognition expert. Analyze this image of a pantry/fridge and identify all visible food ingredients.

Return ONLY a valid JSON array with this exact structure (no markdown, no explanations):
[
  {
    "name": "ingredient name",
    "quantity": "estimated quantity with unit",
    "confidence": 0.95
  }
]

Rules:
- Only identify food ingredients (not containers, utensils, or packaging)
- Be specific (e.g., "Cheddar Cheese" not just "Cheese")
- Estimate realistic quantities (e.g., "3 eggs", "1 cup milk", "2 tomatoes")
- Confidence should be 0.7-1.0 (omit items below 0.7)
- Maximum 20 items
- Common pantry staples are acceptable (salt, pepper, oil)
`;

        const result = await model.generateContent([
            prompt, {
                inlineData: {
                    mineType: imageFile.type,
                    data: base64Image
                }
            }
        ])

        const response = await result.response;
        const text = response.text;

        let ingredient;
        try {
            const cleanText = text
                .replace(/```json\n?/g, "")
                .replace(/```\n?/g, "")
                .trim();
            ingredient = JSON.parse(cleanText);
        } catch (error) {
            console.error("Error parsing JSON:", error);
            throw new Error("Error parsing ingredients");
        }

        if(!Array.isArray(ingredient) || ingredient.length === 0){
            throw new Error("No ingredients found");
        }

        return{
            success: true,
            ingredient: ingredient.slice(0, 20),
            scansLimit: isPro ? "unlimited" : 10,
            message: `Found${ingredient.length} ingredients!`,
        }

    } catch (error) {
        console.error("Error scanning pantry:", error);
        throw new Error(error.message || "Failed to scan pantry");
    }
}
