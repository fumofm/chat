export interface PresetConversation {
  title: string;
  label: string;
  action: string;
  messages: string[];
  followUpPrompts?: {
    title: string;
    label: string;
    action: string;
  }[];
}

export const PRESET_CONVERSATIONS: PresetConversation[] = [
  {
    title: "Show me",
    label: "the Range Rover Sport",
    action: "Tell me about the Range Rover Sport",
    messages: [
      "Tell me about the Range Rover Sport",
      "What makes it different from other models?",
    ],
    followUpPrompts: [
      {
        title: "Compare",
        label: "with the Defender",
        action: "How does the Range Rover Sport compare to the Defender 110?",
      },
      {
        title: "Schedule",
        label: "a test drive",
        action: "I'd like to schedule a test drive for the Range Rover Sport",
      },
      {
        title: "Tell me about",
        label: "financing options",
        action: "What financing options are available for the Range Rover Sport?",
      },
    ],
  },
  {
    title: "View",
    label: "available inventory",
    action: "Show me all available Land Rover vehicles",
    messages: [
      "Show me all available Land Rover vehicles",
      "Which one is best for families?",
      "Tell me more about the safety features",
    ],
    followUpPrompts: [
      {
        title: "Show me",
        label: "the Discovery Sport details",
        action: "Tell me more about the Discovery Sport",
      },
      {
        title: "Compare",
        label: "family-friendly models",
        action: "Compare the Discovery Sport and Defender 110",
      },
      {
        title: "What about",
        label: "cargo space?",
        action: "How much cargo space do these vehicles have?",
      },
    ],
  },
  {
    title: "Compare",
    label: "Defender vs Range Rover Sport",
    action: "Compare the Defender 110 and Range Rover Sport",
    messages: [
      "Compare the Defender 110 and Range Rover Sport",
      "Which one has better fuel efficiency?",
    ],
    followUpPrompts: [
      {
        title: "Tell me about",
        label: "off-road capabilities",
        action: "What are the off-road capabilities of the Defender?",
      },
      {
        title: "Show me",
        label: "the Range Rover Sport",
        action: "I want to see more details about the Range Rover Sport",
      },
      {
        title: "Schedule",
        label: "test drives for both",
        action: "Can I schedule test drives for both vehicles?",
      },
    ],
  },
  {
    title: "Schedule",
    label: "a test drive",
    action: "I'd like to schedule a test drive for the Range Rover Sport",
    messages: [
      "I'd like to schedule a test drive for the Range Rover Sport",
    ],
    followUpPrompts: [
      {
        title: "What should",
        label: "I expect during the test drive?",
        action: "What should I expect during the test drive?",
      },
      {
        title: "Can I",
        label: "test drive multiple models?",
        action: "Can I schedule test drives for multiple models?",
      },
      {
        title: "View",
        label: "other available models",
        action: "Show me other models I could test drive",
      },
    ],
  },
];
