"use client";

import { ReactNode, useRef, useState, useEffect } from "react";
import { useActions } from "ai/rsc";
import { Message } from "@/components/message";
import { useScrollToBottom } from "@/components/use-scroll-to-bottom";
import { motion, AnimatePresence } from "framer-motion";
import { MasonryIcon, VercelIcon } from "@/components/icons";
import Link from "next/link";
import dynamic from 'next/dynamic';

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
  const [gsapLoaded, setGsapLoaded] = useState(false);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();
  const cursorRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('gsap').then((module) => {
        gsap = module.default;
        setGsapLoaded(true);
      });
    }
  }, []);

  useEffect(() => {
    if (!gsapLoaded || !gsap) return;

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
  }, [gsapLoaded]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputRef.current?.value || !gsapLoaded || !gsap) return;

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
    <div className="min-h-screen flex flex-col bg-black text-white relative overflow-hidden">
      {/* Gradiente superior */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-900/60 via-purple-800/5 to-transparent pointer-events-none" />

      {/* Cursor brillante */}
      <motion.div
        ref={cursorRef}
        className="pointer-events-none fixed w-64 h-64 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(168,85,247,0.05) 0%, rgba(168,85,247,0) 70%)',
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
                className="text-4xl md:text-6xl font-bold text-center mb-4 silver-shine"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                Creemos tu agente IA
              </motion.h1>
              <motion.p
                className="text-lg md:text-xl text-center text-gray-400"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                Revoluciona tu empresa con un agente IA personalizado
              </motion.p>
            </motion.header>
          )}
        </AnimatePresence>

        {/* Área de chat */}
        <div className={`flex-1 flex flex-col justify-${messages.length === 0 ? 'center' : 'end'} px-4 max-w-4xl mx-auto w-full relative z-10`}>
          {/* Mensajes */}
          <div
            ref={messagesContainerRef}
            className="flex-1 flex flex-col gap-6 overflow-y-auto py-6 min-h-0"
          >
            {messages.map((message, i) => (
              <div key={i} className="fade-in flex justify-center">
                <div className="max-w-2xl w-full bg-[#171717]/40 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-gray-800/50">
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
                  <div className="w-full relative rounded-2xl p-[0.5px] overflow-hidden animate-rotate-border bg-conic from-[#1a1a1a] via-purple-500 to-[#1a1a1a] from-[80%] via-[90%] to-[100%]">
                    <textarea
                      ref={inputRef}
                      value={input}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyDown}
                      className="w-full p-4 pr-16 rounded-2xl bg-black/100 backdrop-blur-sm outline-none focus:outline-none transition-all duration-300 resize-none text-white text-base md:text-lg block text-center"
                      placeholder="¿Cómo puedo ayudarte hoy?"
                      rows={2}
                      style={{
                        boxShadow: '0 0 40px rgba(168, 85, 247, 0.05)'
                      }}
                    />
                  </div>
                  <style jsx global>{`
                    @property --border-angle {
                      syntax: '<angle>';
                      inherits: false;
                      initial-value: 0deg;
                    }

                    .animate-rotate-border {
                      background: conic-gradient(from var(--border-angle), #1a1a1a, #1a1a1a 80%, #9333ea 90%, #1a1a1a 100%);
                      animation: border-rotate 3s linear infinite;
                    }

                    @keyframes border-rotate {
                      to {
                        --border-angle: 360deg;
                      }
                    }

                    .animate-rotate-border textarea {
                      margin: 0;
                      display: block;
                      position: relative;
                      z-index: 1;
                    }

                    textarea:focus::placeholder {
                      opacity: 0;
                      transition: opacity 0.2s ease;
                    }

                    textarea::placeholder {
                      text-align: center;
                      transition: opacity 0.2s ease;
                    }
                  `}</style>
                  <button
                    type="submit"
                    className={`absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-purple-600/20 hover:bg-purple-500/30 transition-all duration-300 flex items-center justify-center group z-10 ${!input.trim() ? 'opacity-0' : 'opacity-100'}`}
                    aria-label="Enviar mensaje"
                  >
                    <svg 
                      width="16" 
                      height="16" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      className="text-purple-400 group-hover:text-purple-300 transition-colors"
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14m-7-7l7 7-7 7"/>
                    </svg>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
