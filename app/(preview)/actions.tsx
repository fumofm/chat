import { Message, TextStreamMessage } from "@/components/message";
import { openai } from "@ai-sdk/openai";
import { CoreMessage, generateId } from "ai";
import {
  createAI,
  createStreamableValue,
  getMutableAIState,
  streamUI,
} from "ai/rsc";
import { ReactNode } from "react";
import { z } from "zod";
import { VehicleShowcase } from "@/components/vehicle-showcase";
import { InventoryView } from "@/components/inventory-view";
import { ComparisonView } from "@/components/comparison-view";
import { TestDriveForm } from "@/components/test-drive-form";
import { LAND_ROVER_INVENTORY } from "@/components/vehicle-data";

const customerInterests = {
  preferredModels: ["Range Rover Sport", "Defender 110"],
  budget: 100000,
  preferences: {
    luxury: true,
    offRoad: true,
    familyFriendly: true,
  },
};

async function sendMessage(message: string) {
  "use server";

  const aiState = getMutableAIState();

  aiState.update({
    ...aiState.get(),
    messages: [
      ...aiState.get().messages,
      { role: "user", content: message },
    ],
  });

  const contentStream = createStreamableValue("");
  const textComponent = <TextStreamMessage content={contentStream.value} />;

  const { value: stream } = await streamUI({
    model: openai("gpt-4o"),
    system: `\
      You are an expert Land Rover concierge assistant helping a customer explore Land Rover vehicles.
      The customer has expressed interest in Land Rover and is looking to learn more about the lineup.

      Key responsibilities:
      - Provide detailed, enthusiastic information about Land Rover vehicles
      - Help compare different models based on customer needs
      - Explain features, capabilities, and luxury amenities
      - Assist with scheduling test drives
      - Be professional, knowledgeable, and passionate about Land Rover heritage

      Tone: Professional, sophisticated, and helpful. Emphasize Land Rover's luxury, capability, and British heritage.
    `,
    messages: aiState.get().messages as CoreMessage[],
    text: async function* ({ content, done }) {
      if (done) {
        aiState.done({
          ...aiState.get(),
          messages: [
            ...aiState.get().messages,
            { role: "assistant", content },
          ],
        });

        contentStream.done();
      } else {
        contentStream.update(content);
      }

      return textComponent;
    },
    tools: {
      showVehicleDetails: {
        description: "Show detailed information about a specific Land Rover model",
        parameters: z.object({
          model: z.string().describe("The Land Rover model name"),
        }),
        generate: async function* ({ model }) {
          const toolCallId = generateId();
          const vehicle = LAND_ROVER_INVENTORY.find(v =>
            v.model.toLowerCase().includes(model.toLowerCase())
          ) || LAND_ROVER_INVENTORY[0];

          aiState.done({
            ...aiState.get(),
            messages: [
              ...aiState.get().messages,
              {
                role: "assistant",
                content: [
                  {
                    type: "tool-call",
                    toolCallId,
                    toolName: "showVehicleDetails",
                    args: { model },
                  },
                ],
              },
              {
                role: "tool",
                content: [
                  {
                    type: "tool-result",
                    toolName: "showVehicleDetails",
                    toolCallId,
                    result: vehicle,
                  },
                ],
              },
            ],
          });

          return <Message role="assistant" content={<VehicleShowcase vehicle={vehicle} />} />;
        },
      },
      showInventory: {
        description: "Display the complete Land Rover inventory available",
        parameters: z.object({}),
        generate: async function* ({}) {
          const toolCallId = generateId();

          aiState.done({
            ...aiState.get(),
            messages: [
              ...aiState.get().messages,
              {
                role: "assistant",
                content: [
                  {
                    type: "tool-call",
                    toolCallId,
                    toolName: "showInventory",
                    args: {},
                  },
                ],
              },
              {
                role: "tool",
                content: [
                  {
                    type: "tool-result",
                    toolName: "showInventory",
                    toolCallId,
                    result: LAND_ROVER_INVENTORY,
                  },
                ],
              },
            ],
          });

          return <Message role="assistant" content={<InventoryView vehicles={LAND_ROVER_INVENTORY} />} />;
        },
      },
      compareModels: {
        description: "Compare different Land Rover models side by side",
        parameters: z.object({
          models: z.array(z.string()).describe("Array of model names to compare"),
        }),
        generate: async function* ({ models }) {
          const toolCallId = generateId();
          const comparisonData = {
            models: models,
            categories: [
              {
                name: "Performance",
                specs: ["Turbocharged Engine", "All-Wheel Drive", "Terrain Response"],
              },
              {
                name: "Technology",
                specs: ["Pivi Pro Infotainment", "Digital Display", "Meridian Audio"],
              },
              {
                name: "Safety",
                specs: ["Adaptive Cruise", "Lane Keep Assist", "Blind Spot Monitor"],
              },
            ],
          };

          aiState.done({
            ...aiState.get(),
            messages: [
              ...aiState.get().messages,
              {
                role: "assistant",
                content: [
                  {
                    type: "tool-call",
                    toolCallId,
                    toolName: "compareModels",
                    args: { models },
                  },
                ],
              },
              {
                role: "tool",
                content: [
                  {
                    type: "tool-result",
                    toolName: "compareModels",
                    toolCallId,
                    result: comparisonData,
                  },
                ],
              },
            ],
          });

          return <Message role="assistant" content={<ComparisonView data={comparisonData} />} />;
        },
      },
      scheduleTestDrive: {
        description: "Schedule a test drive for a specific Land Rover model",
        parameters: z.object({
          model: z.string().describe("The Land Rover model for test drive"),
        }),
        generate: async function* ({ model }) {
          const toolCallId = generateId();

          aiState.done({
            ...aiState.get(),
            messages: [
              ...aiState.get().messages,
              {
                role: "assistant",
                content: [
                  {
                    type: "tool-call",
                    toolCallId,
                    toolName: "scheduleTestDrive",
                    args: { model },
                  },
                ],
              },
              {
                role: "tool",
                content: [
                  {
                    type: "tool-result",
                    toolName: "scheduleTestDrive",
                    toolCallId,
                    result: `Test drive form displayed for ${model}`,
                  },
                ],
              },
            ],
          });

          return <Message role="assistant" content={<TestDriveForm model={model} />} />;
        },
      },
    },
  });

  return stream;
};

export type UIState = Array<ReactNode>;

export type AIState = {
  chatId: string;
  messages: Array<CoreMessage>;
};

export const AI = createAI<AIState, UIState>({
  initialAIState: {
    chatId: generateId(),
    messages: [],
  },
  initialUIState: [],
  actions: {
    sendMessage,
  },
  onSetAIState: async ({ state, done }) => {
    "use server";

    if (done) {
      // save to database
    }
  },
});
