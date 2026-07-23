"use server";

import { freeMealRecommendation, proTierLimit } from "@/lib/arcjet";
import { checkUser } from "@/lib/checkUser";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { request, shield } from "@arcjet/next";

const STRAPI_URL =
    process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";

const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

console.log(process.env.GEMINI_API_KEY?.slice(0, 8))

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export async function getRecipesByPantryIngredients() {
    try {
        const user = await checkUser();
        if (!user) {
            throw new Error("User not authenticated");
        }
        const isPro = user.subscriptionTier === "pro";

        //Apply arcjet rate limit based on tier

        const arcjetClient = isPro ? proTierLimit : freeMealRecommendation;

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
        //get user's pantry itmes
        const pantryResponse = await fetch(
            `${STRAPI_URL}/api/pantry-items?filters[owner][id][$eq]=${user.id}`, {
            headers: {
                Authorization: `Bearer ${STRAPI_API_TOKEN}`,
            },
            cache: "no-store",
        },
        );

        if (!pantryResponse.ok) {
            throw new Error("Failed to fetch pantry items");
        }

        const pantryData = await pantryResponse.json();
        if (!pantryData.data || pantryData.data.length === 0) {
            return {
                success: false,
                message: "No pantry items found. Add some itmes into your pantry and try again.",
            };
        }

        const ingredients = pantryData.data.map((item) => item.name).join(",");

        const model = genAI.getGenerativeModel({
            model: "gemini-3.6-flash",
        });

        const prompt = `
You are a professional chef and recipe expert. Generate a detailed recipe for: "${normalizedTitle}"

CRITICAL: The "title" field MUST be EXACTLY: "${normalizedTitle}" (no changes, no additions like "Classic" or "Easy")

Return ONLY a valid JSON object with this exact structure (no markdown, no explanations):
{
  "title": "${normalizedTitle}",
  "description": "Brief 2-3 sentence description of the dish",
  "category": "Must be ONE of these EXACT values: breakfast, lunch, dinner, snack, dessert",
  "cuisine": "Must be ONE of these EXACT values: italian, chinese, mexican, indian, american, thai, japanese, mediterranean, french, korean, vietnamese, spanish, greek, turkish, moroccan, brazilian, caribbean, middle-eastern, british, german, portuguese, other",
  "prepTime": "Time in minutes (number only)",
  "cookTime": "Time in minutes (number only)",
  "servings": "Number of servings (number only)",
  "ingredients": [
    {
      "item": "ingredient name",
      "amount": "quantity with unit",
      "category": "Protein|Vegetable|Spice|Dairy|Grain|Other"
    }
  ],
  "instructions": [
    {
      "step": 1,
      "title": "Brief step title",
      "instruction": "Detailed step instruction",
      "tip": "Optional cooking tip for this step"
    }
  ],
  "nutrition": {
    "calories": "calories per serving",
    "protein": "grams",
    "carbs": "grams",
    "fat": "grams"
  },
  "tips": [
    "General cooking tip 1",
    "General cooking tip 2",
    "General cooking tip 3"
  ],
  "substitutions": [
    {
      "original": "ingredient name",
      "alternatives": ["substitute 1", "substitute 2"]
    }
  ]
}

IMPORTANT RULES FOR CATEGORY:
- Breakfast items (pancakes, eggs, cereal, etc.) → "breakfast"
- Main meals for midday (sandwiches, salads, pasta, etc.) → "lunch"
- Main meals for evening (heavier dishes, roasts, etc.) → "dinner"
- Light items between meals (chips, crackers, fruit, etc.) → "snack"
- Sweet treats (cakes, cookies, ice cream, etc.) → "dessert"

IMPORTANT RULES FOR CUISINE:
- Use lowercase only
- Pick the closest match from the allowed values
- If uncertain, use "other"

Guidelines:
- Make ingredients realistic and commonly available
- Instructions should be clear and beginner-friendly
- Include 6-10 detailed steps
- Provide practical cooking tips
- Estimate realistic cooking times
- Keep total instructions under 12 steps
`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text(); 

        let recipeSuggestions;

        try{
            const cleanText = text
            .replace(/```json\n?/g,"")
            .replace(/```\n?/g,"")
            .trim();
            recipeSuggestions = JSON.parse(cleanText);
        }catch(error){
            console.error("Error parsing recipe suggestions:", text);
            throw new Error(
                "Failed to parse recipe suggestions. Please try again later."
            )
        }

        return{
            success: true,
            recipe: recipeSuggestions,
            ingredientsUsed: ingredients,
            recommendationsLimits: isPro ? "Unlimited" : 5,
            message: `Found${recipeSuggestions.length} recipes you can make! right Now.`
        }
    }
    catch (error) {
        console.error("Error generating recipe suggestions:", error);
        throw new Error(
            "Failed to generate recipe suggestions. Please try again later."
        );
    }
}