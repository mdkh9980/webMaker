import { Sandbox } from "@e2b/code-interpreter";
import { AgentResult, Message } from "@inngest/agent-kit";

export async function getSandbox(sandboxId: string) {
  return await Sandbox.connect(sandboxId);
}

export function lastAssistantTextMessageContent(result: AgentResult): string | undefined {
  const lastIdx = result.output.findLastIndex(
    (message) => message.role === "assistant"
  );
  if (lastIdx === -1) return undefined;

  const msg = result.output[lastIdx] as Message;
  if (msg.type !== "text") return undefined;

  const content = msg.content;
  if (typeof content === "string") {
    return content;
  } else if (Array.isArray(content)) {
    return content.map((c) => c.text).join("");
  }
  return undefined;
}
