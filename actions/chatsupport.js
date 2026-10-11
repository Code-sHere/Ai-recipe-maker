"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { checkUser } from "@/lib/checkUser";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function chatsupport(message) {
  const user = await checkUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const model = genAI.getGenerativeModel({
    model: "gemini-3.5-flash",
  });

  const prompt = `
You are the official SERVD AI Support Assistant.

The logged in user is:
Name: ${user.name}
Email: ${user.email}

Only answer questions related to the SERVD application.

SERVD Features:
- AI Recipe Generator
- Recipe PDF Download
- Saved Recipes
- AI Cooking Assistant
- Recipe Search
- Authentication
- User Profile

If someone asks something unrelated, politely tell them that you only provide support for SERVD.

User Question:
${message}
`;

  const result = await model.generateContent(prompt);

  return result.response.text();
}