"use client";

import { useState, useRef, useEffect } from "react";
import { Grant } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import * as Dialog from "@radix-ui/react-dialog";
import { explainerApi } from "@/lib/api";
import {
  Send,
  Bot,
  User,
  Sparkles,
  X
} from "lucide-react";

interface Message {
  role: string;
  content: string;
}

interface GrantExplainerProps {
  grant: Grant;
}

export default function GrantExplainer({ grant }: GrantExplainerProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isTyping) return;

    const question = input.trim();
    const userMessage = { role: "user", content: question };
    
    // Prepare history BEFORE adding current message (history contains previous messages only)
    const historyForApi = messages.map(msg => ({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: msg.content,
    }));

    // Add user message to UI immediately
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      // Call the API with history (previous messages) and current question
      const response = await explainerApi.explain(grant.id, question, historyForApi);

      // Add AI response to messages
      setMessages(prev => [...prev, {
        role: "assistant",
        content: response.answer || "I apologize, but I could not generate a response. Please try again."
      }]);
    } catch (error: any) {
      // Display error message in chat
      const errorMessage = error.response?.data?.error || 
                          error.message || 
                          "Failed to get AI response. Please try again.";
      
      setMessages(prev => [...prev, {
        role: "assistant",
        content: `Sorry, I encountered an error: ${errorMessage}`
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <Button
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg"
        aria-label={isOpen ? "Close AI Grant Advisor" : "Open AI Grant Advisor"}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Sparkles className="h-6 w-6" />}
      </Button>

      <Dialog.Root open={isOpen} onOpenChange={setIsOpen} modal={false}>
        <Dialog.Portal>
        <Dialog.Content 
          className="fixed bottom-24 right-6 z-50 w-[calc(100%-3rem)] max-w-[420px] outline-none"
          onInteractOutside={(e) => e.preventDefault()}
        >
          <div className="flex h-[70vh] max-h-[75vh] flex-col overflow-hidden rounded-2xl border border-border bg-sidebar text-sidebar-foreground shadow-2xl shadow-black/50">
            <div className="flex items-center justify-between border-b border-sidebar-border bg-sidebar px-4 py-3">
              <div className="flex items-center gap-2 min-w-0">
                <div className="h-8 w-8 rounded-full bg-sidebar-accent flex items-center justify-center shrink-0">
                  <Sparkles className="h-4 w-4 text-sidebar-accent-foreground" />
                </div>
                <div className="min-w-0">
                  <Dialog.Title className="text-sm font-semibold">
                    AI Grant Advisor
                  </Dialog.Title>
                  <p className="text-xs text-muted-foreground truncate">
                    Ask about {grant.title || "this grant"}
                  </p>
                </div>
              </div>
              <Dialog.Close asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <X className="h-4 w-4" />
                </Button>
              </Dialog.Close>
            </div>

            <div className="flex-1 min-h-0">
              <div ref={scrollRef} className="h-full overflow-y-auto px-4 py-4">
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="h-8 w-8 rounded-full bg-sidebar-accent flex items-center justify-center shrink-0">
                      <Bot className="h-5 w-5 text-sidebar-accent-foreground" />
                    </div>
                    <div className="bg-card text-card-foreground p-3 rounded-lg rounded-tl-none shadow-sm text-sm border border-border max-w-[85%] min-w-0">
                      <p className="whitespace-pre-wrap break-words">
                        Hello! I'm your AI assistant for the <strong>{grant.title || "this grant"}</strong>. Ask me anything about eligibility, application tips, or how to frame your proposal.
                      </p>
                    </div>
                  </div>

                  {messages.map((msg, idx) => (
                    <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
                        msg.role === 'user' ? 'bg-primary/20' : 'bg-sidebar-accent'
                      }`}>
                        {msg.role === 'user' ? (
                          <User className="h-5 w-5 text-primary" />
                        ) : (
                          <Bot className="h-5 w-5 text-sidebar-accent-foreground" />
                        )}
                      </div>
                      <div className={`p-3 rounded-lg shadow-sm text-sm max-w-[85%] min-w-0 border ${
                        msg.role === 'user' 
                          ? 'bg-primary text-primary-foreground rounded-tr-none border-primary' 
                          : 'bg-card text-card-foreground rounded-tl-none border-border'
                      }`}>
                        <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                      </div>
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex gap-3">
                      <div className="h-8 w-8 rounded-full bg-sidebar-accent flex items-center justify-center shrink-0">
                        <Bot className="h-5 w-5 text-sidebar-accent-foreground" />
                      </div>
                      <div className="bg-card text-card-foreground p-3 rounded-lg rounded-tl-none shadow-sm text-sm border border-border flex items-center gap-1">
                        <span className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="border-t border-sidebar-border bg-sidebar px-4 py-3">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Input
                  placeholder="Ask a question..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 bg-background"
                />
                <Button type="submit" size="icon" disabled={!input.trim() || isTyping}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
              
              <div className="mt-3 flex flex-wrap gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  type="button"
                  className="whitespace-nowrap text-xs h-7"
                  onClick={() => setInput("What are the eligibility criteria?")}
                >
                  Eligibility?
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  type="button"
                  className="whitespace-nowrap text-xs h-7"
                  onClick={() => setInput("How do I improve my chances?")}
                >
                  Winning tips
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  type="button"
                  className="whitespace-nowrap text-xs h-7"
                  onClick={() => setInput("Can I use this for staff salaries?")}
                >
                  Funding scope
                </Button>
              </div>
            </div>
          </div>
        </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
