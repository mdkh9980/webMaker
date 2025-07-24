import { openai, createAgent } from "@inngest/agent-kit";
import { inngest } from "./client";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event }) => {
    const summarize = createAgent({
      name: "summarizer",
      system: "You are an expert summarizer.  You summarize in 5 words.",
      model: openai({ model: "gpt-4.1-nano"}),
    });

    const { output } = await summarize.run(
      `Summarize the following text : ${event.data.value}`
    );
    return output
  }
);