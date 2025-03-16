"use client";

import { ReactNode, useRef, useState, useEffect } from "react";
import { useActions } from "ai/rsc";
import { Message } from "@/components/message";
import { useScrollToBottom } from "@/components/use-scroll-to-bottom";
import { motion, AnimatePresence } from "framer-motion";
import { MasonryIcon, VercelIcon } from "@/components/icons";
import Link from "next/link";

// Importar GSAP de manera dinámica para evitar problemas con SSR
let gsap: any;
if (typeof window !== 'undefined') {
  import('gsap').then((module) => {
    gsap = module.default;
  });
}

export default function Home() {
  const { sendMessage } = useActions();

  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<Array<ReactNode>>([]);
  const [isInitial, setIsInitial] = useState(true);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();
  const cursorRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const suggestedActions = [
    { title: "View all", label: "my cameras", action: "View all my cameras" },
    { title: "Show me", label: "my smart home hub", action: "Show me my smart home hub" },
    {
      title: "How much",
      label: "electricity have I used this month?",
      action: "Show electricity usage",
    },
    {
      title: "How much",
      label: "water have I used this month?",
      action: "Show water usage",
    },
  ];

  useEffect(() => {
    if (!gsap) return;

    // Efecto de brillo del cursor
    const handleMouseMove = (e: MouseEvent) => {
      if (cursorRef.current) {
        gsap.to(cursorRef.current, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.2,
          ease: "power2.out"
        });
      }
    };

    // Animación del borde brillante
    const animateBorder = () => {
      if (containerRef.current) {
        gsap.to(containerRef.current, {
          '--border-position': '360deg',
          duration: 4,
          repeat: -1,
          ease: "none"
        });
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    animateBorder();

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputRef.current?.value || !gsap) return;

    const message = inputRef.current.value;
    setInput("");

    // Añadir el mensaje del usuario
    setMessages((messages) => [
      ...messages,
      <Message key={messages.length} role="user" content={message} />,
    ]);

    // Animación de desplazamiento
    gsap.to(containerRef.current, {
      y: 50,
      opacity: 0,
      duration: 0.5,
      ease: "power2.out",
      onComplete: async () => {
        // Enviar mensaje y recibir respuesta
        const response = await sendMessage(message);
        setMessages((messages) => [...messages, response]);
        
        // Limpiar input y animar regreso
        inputRef.current!.value = '';
        gsap.to(containerRef.current, {
          y: 0,
          opacity: 1,
          duration: 0.5,
          ease: "power2.in"
        });
      }
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    if (isInitial && e.target.value.length > 0) {
      setIsInitial(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      {/* Cursor brillante */}
      <motion.div
        ref={cursorRef}
        className="pointer-events-none fixed w-64 h-64 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
          transform: 'translate(-50%, -50%)'
        }}
      />

      <main className="flex-1 flex flex-col h-screen">
        {/* Encabezado animado */}
        <AnimatePresence>
          {isInitial && (
            <motion.header
              className="pt-10 pb-6 px-4"
              initial={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <motion.h1
                className="text-4xl md:text-6xl font-bold text-center mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-transparent bg-clip-text gradient-text"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                ¿Qué quieres construir?
              </motion.h1>
              <motion.p
                className="text-lg md:text-xl text-center text-gray-300"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                Prompt, ejecuta, edita y despliega aplicaciones full-stack web y móviles.
              </motion.p>
            </motion.header>
          )}
        </AnimatePresence>

        {/* Área de chat */}
        <div className={`flex-1 flex flex-col justify-${messages.length === 0 ? 'center' : 'end'} px-4 max-w-4xl mx-auto w-full`}>
          {/* Mensajes */}
          <div
            ref={messagesContainerRef}
            className="flex-1 flex flex-col gap-6 overflow-y-auto py-6 min-h-0"
          >
            {messages.map((message, i) => (
              <div key={i} className="fade-in flex justify-center">
                <div className="max-w-2xl w-full bg-gray-800/40 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-gray-700/50">
                  <div className="prose prose-invert max-w-none text-base md:text-lg font-normal text-white/95">
                    {message}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Área de entrada */}
          <div className="w-full py-6">
            <div
              ref={containerRef}
              className="relative max-w-2xl mx-auto glow"
              style={{
                '--border-position': '0deg',
              } as any}
            >
              <form onSubmit={handleSubmit} className="relative">
                <div className="relative flex items-end gap-2">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    className="w-full p-4 pr-16 rounded-2xl bg-gray-800/50 backdrop-blur-lg border border-gray-700/50 focus:outline-none focus:border-purple-500 transition-all duration-300 resize-none text-white text-base md:text-lg"
                    placeholder="¿Cómo puedo ayudarte hoy?"
                    rows={2}
                    style={{
                      boxShadow: '0 0 40px rgba(123, 31, 162, 0.1)'
                    }}
                  />
                  <button
                    type="submit"
                    className="absolute right-3 bottom-3 p-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 flex items-center justify-center group"
                    aria-label="Enviar mensaje"
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 24 24" 
                      fill="currentColor" 
                      className="w-5 h-5 transform group-hover:translate-x-0.5 transition-all duration-200"
                    >
                      <path d="M3.478 2.404a.75.75 0 00-.926.941l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.404z" />
                    </svg>
                  </button>
                </div>
              </form>
            </div>

            {/* Acciones sugeridas */}
            {messages.length === 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto mt-6">
                {suggestedActions.map((action, index) => (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    onClick={() => {
                      if (inputRef.current) {
                        inputRef.current.value = action.action;
                        handleSubmit({ preventDefault: () => {} } as React.FormEvent);
                      }
                    }}
                    className="p-4 rounded-lg bg-gray-800/50 backdrop-blur-lg border border-gray-700 hover:border-purple-500 transition-all duration-300"
                  >
                    <span className="font-medium text-white">{action.title}</span>
                    <span className="text-gray-400 ml-2">{action.label}</span>
                  </motion.button>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
