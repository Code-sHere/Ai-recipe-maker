"use client";

import React, { useState } from "react";
import { chatsupport } from "@/actions/chatsupport";
import { X } from "lucide-react";
import { AlertDialogCancel } from "@/components/ui/alert-dialog";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
    Bot,
    Send,
    MessageCircle,
    User,
} from "lucide-react";

export default function SupportChat() {

    console.log(process.env.GEMINI_API_KEY);

    const [messages, setMessages] = useState([
        {
            role: "assistant",
            content: "👋 Hello! I'm the SERVD AI Assistant. How can I help you today?",
        },
    ]);

    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    async function sendMessage() {
        if (!input.trim()) return;

        const question = input.trim();

        setMessages((prev) => [
            ...prev,
            {
                role: "user",
                content: question,
            },
        ]);

        setInput("");
        setLoading(true);

        try {
            const response = await chatsupport(question);

            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: response,
                },
            ]);
        } catch (error) {
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: error.message || "Something went wrong.",
                },
            ]);
        } finally {
            setLoading(false);
        }
    }

    return (
        <AlertDialog >
            <AlertDialogTrigger asChild>
                <Button
                    size="icon"
                    className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-xl z-50"
                >
                    <MessageCircle className="h-6 w-6" />
                </Button>
            </AlertDialogTrigger>

            <AlertDialogContent className="w-[90vw] max-w-4xl p-0 overflow-hidden rounded-2xl">

                {/* Header */}

                <div className="bg-orange-600 text-white p-4 flex items-center gap-3 p-2"><AlertDialogCancel asChild className="absolute p-2 right-2 top-5 bg-orange-600 rounded-full border-none p-1 hover:bg-white/30 transition-all">
                    <X className="h-5 w-5 cursor-pointer" />
                </AlertDialogCancel>

                    <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                        <Bot size={22} />
                    </div>

                    <div>
                        <h2 className="font-semibold">
                            SERVD AI Support
                        </h2>

                        <p className="text-xs opacity-80">
                            Online • Instant replies
                        </p>
                    </div>

                </div>

                {/* Chat */}

                <div className="h-[420px] overflow-y-auto bg-muted/20 p-4 space-y-4">

                    {messages.map((message, index) => (

                        <div
                            key={index}
                            className={`flex ${message.role === "user"
                                ? "justify-end"
                                : "justify-start"
                                }`}
                        >
                            {message.role === "assistant" && (
                                <div className="mr-2 mt-5 h-8 w-8 rounded-full bg-orange-600 text-white flex items-center justify-center">
                                    <Bot size={18} />
                                </div>
                            )}

                            <div
                                className={`rounded-2xl px-4 py-3 max-w-[75%] ${message.role === "user"
                                    ? "bg-primary text-white"
                                    : "bg-white shadow"
                                    }`}
                            >
                                {message.content}
                            </div>

                            {message.role === "user" && (
                                <div className="ml-2 h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                                    <User size={18} />
                                </div>
                            )}
                        </div>

                    ))}

                    {loading && (
                        <div className="flex items-center gap-2">

                            <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center">
                                <Bot size={18} />
                            </div>

                            <div className="bg-white px-4 py-3 rounded-xl shadow">
                                Thinking...
                            </div>

                        </div>
                    )}

                </div>

                {/* Input */}

                <div className="border-t p-3">

                    <div className="flex gap-2">

                        <Input
                            value={input}
                            disabled={loading}
                            placeholder="Ask anything about SERVD..."
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    sendMessage();
                                }
                            }}
                        />

                        <Button
                            size="icon"
                            disabled={loading}
                            variant="primary"
                            onClick={sendMessage}
                        >
                            <Send size={18} />
                        </Button>

                    </div>

                </div>

            </AlertDialogContent>
        </AlertDialog>
    );
}