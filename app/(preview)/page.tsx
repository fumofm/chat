"use client";

import { ReactNode, useRef, useState } from "react";
import { useActions } from "ai/rsc";
import { Message } from "@/components/message";
import { useScrollToBottom } from "@/components/use-scroll-to-bottom";
import { motion } from "framer-motion";
import { PRESET_CONVERSATIONS, PresetConversation } from "@/components/preset-conversations";

export default function Home() {
  const { sendMessage } = useActions();

  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<Array<ReactNode>>([]);
  const [currentSuggestedActions, setCurrentSuggestedActions] = useState<any[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();

  const initialSuggestedActions = PRESET_CONVERSATIONS.map(conv => ({
    title: conv.title,
    label: conv.label,
    action: conv.action,
    conversation: conv,
  }));

  const executePresetConversation = async (conversation: PresetConversation) => {
    // Add preset conversation messages as suggested follow-ups
    const allMessages = [...conversation.messages];

    // Send the first message
    const firstMessage = allMessages[0];
    const userMsg = (
      <Message
        key={messages.length}
        role="user"
        content={firstMessage}
      />
    );
    setMessages((prev) => [...prev, userMsg]);

    const response: ReactNode = await sendMessage(firstMessage);
    setMessages((prev) => [...prev, response]);

    // Set up follow-up prompts with remaining conversation messages + additional prompts
    const remainingMessages = allMessages.slice(1).map((msg, idx) => ({
      title: idx === 0 ? "Ask about" : "Tell me",
      label: msg.length > 40 ? msg.substring(0, 40) + "..." : msg,
      action: msg,
    }));

    const allFollowUps = [
      ...remainingMessages,
      ...(conversation.followUpPrompts || []),
    ];

    if (allFollowUps.length > 0) {
      setCurrentSuggestedActions(allFollowUps.slice(0, 4));
    } else {
      setCurrentSuggestedActions([]);
    }
  };

  return (
    <div className="flex flex-row justify-center pb-20 h-dvh bg-zinc-50 dark:bg-zinc-950">
      <div className="flex flex-col justify-between gap-4">
        <div
          ref={messagesContainerRef}
          className="flex flex-col gap-3 h-full w-dvw items-center overflow-y-scroll"
        >
          {messages.length === 0 && (
            <motion.div className="h-[350px] px-4 w-full md:w-[500px] md:px-0 pt-20">
              <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-8 flex flex-col gap-6 bg-gradient-to-br from-white to-zinc-50 dark:from-zinc-900 dark:to-zinc-800">
                <div className="flex flex-col items-center gap-3">
                  <div className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
                    LAND ROVER
                  </div>
                  <div className="text-sm text-zinc-600 dark:text-zinc-400 tracking-wide">
                    ABOVE AND BEYOND
                  </div>
                </div>
                <div className="h-px bg-gradient-to-r from-transparent via-zinc-300 dark:via-zinc-600 to-transparent" />
                <p className="text-center text-zinc-700 dark:text-zinc-300 text-sm leading-relaxed">
                  Welcome to your personalized Land Rover experience. I&apos;m here to help you explore our legendary lineup of luxury SUVs, each designed to conquer any terrain while delivering unparalleled comfort and sophistication.
                </p>
                <p className="text-center text-xs text-zinc-500 dark:text-zinc-400">
                  Ask me anything about our vehicles, schedule a test drive, or explore our current inventory.
                </p>
              </div>
            </motion.div>
          )}
          {messages.map((message) => message)}
          <div ref={messagesEndRef} />
        </div>

        <div className="grid sm:grid-cols-2 gap-2 w-full px-4 md:px-0 mx-auto md:max-w-[500px] mb-4">
          {messages.length === 0 &&
            initialSuggestedActions.map((action, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.01 * index }}
                key={index}
                className={index > 1 ? "hidden sm:block" : "block"}
              >
                <button
                  onClick={async () => {
                    await executePresetConversation(action.conversation);
                  }}
                  className="w-full text-left border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-300 rounded-lg p-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex flex-col"
                >
                  <span className="font-medium">{action.title}</span>
                  <span className="text-zinc-500 dark:text-zinc-400">
                    {action.label}
                  </span>
                </button>
              </motion.div>
            ))}
          {messages.length > 0 && currentSuggestedActions.length > 0 &&
            currentSuggestedActions.map((action, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.01 * index }}
                key={`followup-${index}`}
                className={index > 1 ? "hidden sm:block" : "block"}
              >
                <button
                  onClick={async () => {
                    setMessages((messages) => [
                      ...messages,
                      <Message
                        key={messages.length}
                        role="user"
                        content={action.action}
                      />,
                    ]);
                    const response: ReactNode = await sendMessage(
                      action.action,
                    );
                    setMessages((messages) => [...messages, response]);
                    setCurrentSuggestedActions([]);
                  }}
                  className="w-full text-left border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-300 rounded-lg p-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex flex-col"
                >
                  <span className="font-medium">{action.title}</span>
                  <span className="text-zinc-500 dark:text-zinc-400">
                    {action.label}
                  </span>
                </button>
              </motion.div>
            ))}
        </div>

        <form
          className="flex flex-col gap-2 relative items-center"
          onSubmit={async (event) => {
            event.preventDefault();

            setMessages((messages) => [
              ...messages,
              <Message key={messages.length} role="user" content={input} />,
            ]);
            setInput("");

            const response: ReactNode = await sendMessage(input);
            setMessages((messages) => [...messages, response]);
          }}
        >
          <input
            ref={inputRef}
            className="bg-zinc-100 rounded-md px-2 py-1.5 w-full outline-none dark:bg-zinc-700 text-zinc-800 dark:text-zinc-300 md:max-w-[500px] max-w-[calc(100dvw-32px)]"
            placeholder="Send a message..."
            value={input}
            onChange={(event) => {
              setInput(event.target.value);
            }}
          />
        </form>
      </div>
    </div>
  );
}
