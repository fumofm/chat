export interface PresetMessage {
  role: "user" | "assistant";
  content: string;
  tool?: string;
  toolArgs?: any;
}

export interface PresetConversation {
  title: string;
  label: string;
  action: string;
  messages: PresetMessage[];
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
      {
        role: "user",
        content: "Tell me about the Range Rover Sport",
      },
      {
        role: "assistant",
        content: "The Range Rover Sport is an exceptional blend of performance and luxury. Let me show you the details of our 2025 model.",
        tool: "showVehicleDetails",
        toolArgs: { model: "Range Rover Sport" },
      },
      {
        role: "assistant",
        content: "The Range Rover Sport SE Dynamic combines breathtaking performance with refined luxury. It features a powerful 3.0L Mild Hybrid I6 engine delivering 395 horsepower, paired with our Dynamic Handling Pack for an exhilarating driving experience. Inside, you'll find the state-of-the-art Pivi Pro infotainment system and the renowned Meridian Sound System. The Terrain Response 2 system ensures confident handling across any surface.",
      },
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
      {
        role: "user",
        content: "Show me all available Land Rover vehicles",
      },
      {
        role: "assistant",
        content: "I'd be delighted to show you our complete Land Rover lineup. We have an exceptional selection available.",
        tool: "showInventory",
        toolArgs: {},
      },
      {
        role: "assistant",
        content: "Here's our current inventory featuring the finest Land Rover vehicles. We have the Range Rover Sport, the flagship Range Rover Autobiography, the legendary Defender 110, the versatile Discovery Sport, and the elegant Range Rover Velar. Each vehicle represents the pinnacle of British automotive engineering, combining luxury with legendary capability.",
      },
      {
        role: "user",
        content: "Which one is best for families?",
      },
      {
        role: "assistant",
        content: "For families, I'd highly recommend the Discovery Sport. It offers a unique 5+2 seating configuration, providing versatility for growing families or those who need extra passenger capacity. The Defender 110 is also an excellent family choice, offering rugged capability with spacious, practical interiors. Both vehicles include advanced safety features, hands-free power tailgates for easy loading, and ample cargo space for family adventures.",
      },
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
        label: "safety features?",
        action: "What safety features do these vehicles have?",
      },
    ],
  },
  {
    title: "Compare",
    label: "Defender vs Range Rover Sport",
    action: "Compare the Defender 110 and Range Rover Sport",
    messages: [
      {
        role: "user",
        content: "Compare the Defender 110 and Range Rover Sport",
      },
      {
        role: "assistant",
        content: "Excellent question! Both are exceptional vehicles with distinct personalities. Let me show you a detailed comparison.",
        tool: "compareModels",
        toolArgs: { models: ["Defender 110", "Range Rover Sport"] },
      },
      {
        role: "assistant",
        content: "The Defender 110 and Range Rover Sport represent two different approaches to Land Rover's legendary capability. The Defender 110 is our most rugged and utilitarian model, built for adventure with exceptional off-road prowess, configurable terrain response, and practical features like roof rails and wade sensing. Starting at $71,900, it's the choice for those who prioritize capability and versatility.\n\nThe Range Rover Sport, starting at $89,500, focuses on performance and refined luxury. It offers a more powerful engine with 395 HP, dynamic handling characteristics, and a sportier driving experience while maintaining excellent off-road capability. Both share advanced technology like Pivi Pro infotainment and Terrain Response systems.",
      },
      {
        role: "user",
        content: "Which one has better fuel efficiency?",
      },
      {
        role: "assistant",
        content: "Both vehicles feature the same 3.0L Mild Hybrid I6 engine with 395 horsepower, which includes mild hybrid technology to optimize fuel efficiency. The Defender 110, being slightly lighter and more aerodynamically efficient in its design philosophy, may have a marginal advantage in everyday driving conditions. However, both deliver comparable fuel economy for their class, with the mild hybrid system providing smooth power delivery and improved efficiency during city driving through regenerative braking and electric assist.",
      },
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
      {
        role: "user",
        content: "I'd like to schedule a test drive for the Range Rover Sport",
      },
      {
        role: "assistant",
        content: "Wonderful! There's nothing quite like experiencing the Range Rover Sport firsthand. Let me help you schedule your test drive.",
        tool: "scheduleTestDrive",
        toolArgs: { model: "Range Rover Sport" },
      },
      {
        role: "assistant",
        content: "I've prepared a test drive form for you. Please fill in your details and preferred date, and one of our Land Rover specialists will contact you shortly to confirm your appointment. During your test drive, you'll have the opportunity to experience the Range Rover Sport's dynamic handling, powerful acceleration, and refined interior firsthand.",
      },
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
