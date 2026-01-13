"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { MOCK_GRANTS, MOCK_CHAT_HISTORY } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Calendar, 
  DollarSign, 
  Clock, 
  Send, 
  Bot, 
  User,
  ExternalLink,
  Sparkles
} from "lucide-react";

export default function GrantDetailPage() {
  const params = useParams();
  const id = Number(params.id);
  const grant = MOCK_GRANTS.find(g => g.id === id) || MOCK_GRANTS[0];

  const [messages, setMessages] = useState(MOCK_CHAT_HISTORY);
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
    <div className="flex flex-col lg:flex-row h-[calc(100vh-theme(spacing.16))] lg:h-screen lg:overflow-hidden">
      {/* Main Content - Left Side */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8 lg:h-full">
        <div className="max-w-3xl mx-auto space-y-8">
          <Link href="/grants">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Grants
            </Button>
          </Link>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline">{grant.source}</Badge>
              <Badge className="bg-green-100 text-green-800 border-none">Active</Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {grant.title}
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              {grant.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6 flex flex-col items-center text-center">
                <DollarSign className="h-8 w-8 text-primary mb-2" />
                <div className="text-sm text-muted-foreground font-medium uppercase tracking-wide">Funding Amount</div>
                <div className="font-bold text-lg mt-1">
                  ${grant.funding_min?.toLocaleString()} - ${grant.funding_max?.toLocaleString()}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 flex flex-col items-center text-center">
                <Calendar className="h-8 w-8 text-primary mb-2" />
                <div className="text-sm text-muted-foreground font-medium uppercase tracking-wide">Application Deadline</div>
                <div className="font-bold text-lg mt-1">
                  {new Date(grant.deadline || "").toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 flex flex-col items-center text-center">
                <Clock className="h-8 w-8 text-primary mb-2" />
                <div className="text-sm text-muted-foreground font-medium uppercase tracking-wide">Project Duration</div>
                <div className="font-bold text-lg mt-1">
                  {grant.duration_months} Months
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <section>
              <h3 className="text-2xl font-bold mb-3">Eligibility & Requirements</h3>
              <div className="prose max-w-none text-gray-700">
                <p>
                  To be eligible for this grant, applicants must be registered non-profit organizations or social enterprises. 
                  Projects must demonstrate clear community impact and alignment with national strategic goals.
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Registered charity or IPC status</li>
                  <li>At least 2 years of operational history</li>
                  <li>Clear project timeline and budget breakdown</li>
                  <li>Measurable outcome indicators</li>
                </ul>
              </div>
            </section>

            <Separator />

            <section>
              <h3 className="text-2xl font-bold mb-3">Key Performance Indicators (KPIs)</h3>
              <div className="prose max-w-none text-gray-700">
                <p>Successful applicants will be expected to track and report on the following metrics:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Number of beneficiaries reached</li>
                  <li>Percentage improvement in beneficiary well-being</li>
                  <li>Cost efficiency per beneficiary</li>
                  <li>Sustainability metrics post-funding</li>
                </ul>
              </div>
            </section>
            
            <div className="pt-4">
              <Button size="lg" className="w-full md:w-auto">
                Visit Official Grant Portal
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* AI Chat Sidebar - Right Side */}
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
              onClick={() => {
                setInput("What are the eligibility criteria?");
              }}
            >
              Eligibility?
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="whitespace-nowrap text-xs h-7"
              onClick={() => {
                setInput("How do I improve my chances?");
              }}
            >
              Winning tips
            </Button>
             <Button 
              variant="outline" 
              size="sm" 
              className="whitespace-nowrap text-xs h-7"
              onClick={() => {
                setInput("Can I use this for staff salaries?");
              }}
            >
              Funding scope
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
