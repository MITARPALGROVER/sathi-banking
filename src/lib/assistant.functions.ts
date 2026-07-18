import { createServerFn } from "@tanstack/react-start";
import { generateText, stepCountIs, tool } from "ai";
import { z } from "zod";

import { createLovableAiGatewayProvider, createAiProvider } from "./ai-gateway.server";

export type AssistantAction =
  | { kind: "checkBalance"; spoken: string }
  | { kind: "showTransactions"; filter?: "all" | "credit" | "debit"; spoken: string }
  | { kind: "navigate"; to: string; spoken: string }
  | { kind: "prefillSend"; recipient: string; amount?: number; spoken: string }
  | { kind: "prefillBill"; category: string; spoken: string }
  | { kind: "explain"; topic: string; spoken: string }
  | { kind: "clarify"; question: string };

const CONTACT_HINTS = ["Priya Sharma", "Arjun Verma", "Meera Iyer", "Rohan Das", "Neha Kapoor"];

const SYSTEM = `You are Sathi, a calm, careful banking voice assistant for first-time digital-finance users in India.
The user may speak English, Hindi, Hinglish, Punjabi, Bengali, or Tamil — reply in the SAME language they used.

Your job: read the user's transcript and call EXACTLY ONE tool that best represents their intent.
- Money-moving actions (send, pay bill) NEVER execute directly — you only PREFILL a confirmation screen. Say "please confirm on screen" in the spoken reply.
- If the request is ambiguous (missing recipient, missing amount, unclear intent), call the "clarify" tool with a short spoken question instead of guessing.
- Never invent amounts. If the user did not name an amount, leave it out.
- Known contact names include: ${CONTACT_HINTS.join(", ")}. If the user names one, use that exact name.
- For balance/transactions/help, use the corresponding tool.
- Keep spoken replies under 20 words. Calm, warm, plain.`;

const askAssistantInput = z.object({
  transcript: z.string().min(1),
  locale: z.string().default("en"),
});

export const askAssistant = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => askAssistantInput.parse(data))
  .handler(async ({ data }): Promise<AssistantAction> => {
    const key = process.env.AI_API_KEY || process.env.LOVABLE_API_KEY || process.env.OPENAI_API_KEY;
    if (!key) {
      throw new Error(
        "Missing AI API Key. Please configure AI_API_KEY, LOVABLE_API_KEY, or OPENAI_API_KEY in your environment variables.",
      );
    }
    const baseUrl = process.env.AI_BASE_URL;
    const modelName = process.env.AI_MODEL || "google/gemini-3.5-flash";

    const gateway = createAiProvider(key, baseUrl);
    const model = gateway(modelName);

    let result: AssistantAction | null = null;

    const tools = {
      checkBalance: tool({
        description: "Show the user's current account balance.",
        inputSchema: z.object({ spoken: z.string() }),
        execute: async ({ spoken }) => {
          result = { kind: "checkBalance", spoken };
          return "ok";
        },
      }),
      showTransactions: tool({
        description: "Show the user's recent transactions. Optionally filter to credits or debits.",
        inputSchema: z.object({
          filter: z.enum(["all", "credit", "debit"]).default("all"),
          spoken: z.string(),
        }),
        execute: async ({ filter, spoken }) => {
          result = { kind: "showTransactions", filter, spoken };
          return "ok";
        },
      }),
      prefillSend: tool({
        description:
          "Prefill the Send Money confirmation screen for a recipient (and amount if known). Does NOT send.",
        inputSchema: z.object({
          recipient: z.string(),
          amount: z.number().positive().nullable(),
          spoken: z.string(),
        }),
        execute: async ({ recipient, amount, spoken }) => {
          result = { kind: "prefillSend", recipient, amount: amount ?? undefined, spoken };
          return "ok";
        },
      }),
      prefillBill: tool({
        description:
          "Prefill the Bill Pay screen for a category (electricity, mobile, dth, water, gas).",
        inputSchema: z.object({
          category: z.string(),
          spoken: z.string(),
        }),
        execute: async ({ category, spoken }) => {
          result = { kind: "prefillBill", category, spoken };
          return "ok";
        },
      }),
      navigate: tool({
        description:
          "Navigate to a screen. Allowed paths: /app, /app/send, /app/receive, /app/bills, /app/history, /app/cards, /app/profile, /help",
        inputSchema: z.object({ to: z.string(), spoken: z.string() }),
        execute: async ({ to, spoken }) => {
          result = { kind: "navigate", to, spoken };
          return "ok";
        },
      }),
      explain: tool({
        description:
          "Briefly explain a finance concept (UPI, IFSC, OTP, NEFT, etc.) in the user's language.",
        inputSchema: z.object({ topic: z.string(), spoken: z.string() }),
        execute: async ({ topic, spoken }) => {
          result = { kind: "explain", topic, spoken };
          return "ok";
        },
      }),
      clarify: tool({
        description:
          "Ask a short clarifying question when the user's intent is ambiguous or a required detail is missing.",
        inputSchema: z.object({ question: z.string() }),
        execute: async ({ question }) => {
          result = { kind: "clarify", question };
          return "ok";
        },
      }),
    };

    try {
      await generateText({
        model,
        system: SYSTEM,
        prompt: `User (locale=${data.locale}) said: "${data.transcript}"`,
        tools,
        stopWhen: stepCountIs(2),
      });
    } catch (err) {
      console.error("assistant error", err);
      return { kind: "clarify", question: "I couldn't understand that. Please try again." };
    }

    return result ?? { kind: "clarify", question: "Could you say that again?" };
  });
