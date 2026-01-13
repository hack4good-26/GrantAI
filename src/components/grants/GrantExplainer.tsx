"use client";

import { useState, useRef, useEffect } from "react";
import { Grant } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { 
  Send, 
  Bot, 
  User, 
  Sparkles 
} from "lucide-react";

interface Message {
  role: string;
  content: string;
}

interface GrantExplainerProps {
  grant: Grant;
  initialMessages: Message[];
}

export default function GrantExplainer({ grant, initialMessages }: GrantExplainerProps) {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "This is a mock response. The AI would analyze the grant details and your question to provide a specific answer regarding eligibility, KPIs, or application strategy."
      }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="lg:w-[400px] border-l border-border bg-sidebar text-sidebar-foreground flex flex-col h-[500px] lg:h-full shadow-xl">
      <div className="p-4 border-b border-sidebar-border bg-sidebar flex items-center gap-2 sticky top-0 z-10">
        <Sparkles className="h-5 w-5 text-accent-foreground" />
        <h2 className="font-semibold">AI Grant Advisor</h2>
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="h-8 w-8 rounded-full bg-sidebar-accent flex items-center justify-center shrink-0">
              <Bot className="h-5 w-5 text-sidebar-accent-foreground" />
            </div>
            <div className="bg-card text-card-foreground p-3 rounded-lg rounded-tl-none shadow-sm text-sm border border-border">
              <p>Hello! I'm your AI assistant for the <strong>{grant.title}</strong>. Ask me anything about eligibility, application tips, or how to frame your proposal.</p>
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
              <div className={`p-3 rounded-lg shadow-sm text-sm max-w-[85%] border ${
                msg.role === 'user' 
                  ? 'bg-primary text-primary-foreground rounded-tr-none border-primary' 
                  : 'bg-card text-card-foreground rounded-tl-none border-border'
              }`}>
                <p>{msg.content}</p>
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
      </ScrollArea>

      <div className="p-4 border-t border-sidebar-border bg-sidebar">
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
        
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <Button 
            variant="outline" 
            size="sm" 
            className="whitespace-nowrap text-xs h-7"
            onClick={() => setInput("What are the eligibility criteria?")}
          >
            Eligibility?
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="whitespace-nowrap text-xs h-7"
            onClick={() => setInput("How do I improve my chances?")}
          >
            Winning tips
          </Button>
           <Button 
            variant="outline" 
            size="sm" 
            className="whitespace-nowrap text-xs h-7"
            onClick={() => setInput("Can I use this for staff salaries?")}
          >
            Funding scope
          </Button>
        </div>
      </div>
    </div>
  );
}
