import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

export function createAiProvider(apiKey: string, baseURL?: string) {
  const url = baseURL || "https://api.openai.com/v1";
  const isLovable = url.includes("lovable.dev");
  const headers: Record<string, string> = {};

  if (isLovable) {
    headers["Lovable-API-Key"] = apiKey;
    headers["X-Lovable-AIG-SDK"] = "vercel-ai-sdk";
  }

  return createOpenAICompatible({
    name: isLovable ? "lovable" : "custom-openai-compatible",
    baseURL: url,
    headers,
    apiKey,
  });
}

export function createLovableAiGatewayProvider(lovableApiKey: string) {
  return createAiProvider(lovableApiKey, "https://ai.gateway.lovable.dev/v1");
}
