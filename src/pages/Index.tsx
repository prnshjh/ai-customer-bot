import { useState, useEffect, useRef } from "react";
import { MessageSquare } from "lucide-react";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { TypingIndicator } from "@/components/TypingIndicator";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  id: string;
  role: "user" | "bot";
  content: string;
  timestamp: Date;
}

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionId, setSessionId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [showEscalation, setShowEscalation] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Initialize session on mount
  useEffect(() => {
    const initSession = async () => {
      const { data, error } = await supabase
        .from("sessions")
        .insert({})
        .select()
        .single();

      if (error) {
        console.error("Error creating session:", error);
        toast({
          title: "Error",
          description: "Failed to initialize chat session",
          variant: "destructive",
        });
        return;
      }

      setSessionId(data.id);

      // Load existing messages
      const { data: existingMessages } = await supabase
        .from("messages")
        .select("*")
        .eq("session_id", data.id)
        .order("created_at", { ascending: true });

      if (existingMessages) {
        setMessages(
          existingMessages.map((msg) => ({
            id: msg.id,
            role: msg.sender as "user" | "bot",
            content: msg.content,
            timestamp: new Date(msg.created_at),
          }))
        );
      }

      // Add welcome message
      if (!existingMessages || existingMessages.length === 0) {
        const welcomeMsg: Message = {
          id: "welcome",
          role: "bot",
          content: "Hello! 👋 I'm your AI support assistant. How can I help you today?",
          timestamp: new Date(),
        };
        setMessages([welcomeMsg]);
      }
    };

    initSession();
  }, [toast]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSendMessage = async (content: string) => {
    if (!sessionId) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setShowEscalation(false);

    try {
      const { data, error } = await supabase.functions.invoke("chat", {
        body: { sessionId, message: content },
      });

      if (error) throw error;

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "bot",
        content: data.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);

      // Show escalation button if AI suggests it
      if (data.needsEscalation) {
        setShowEscalation(true);
      }

      // Show FAQ indicator if applicable
      if (data.fromFaq) {
        toast({
          title: "FAQ Answer",
          description: "This response is from our knowledge base",
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send message",
        variant: "destructive",
      });

      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "bot",
        content: "I apologize, but I'm having trouble processing your request. Please try again or escalate to a human agent.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      setShowEscalation(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEscalate = async () => {
    if (!sessionId || messages.length === 0) return;

    const lastUserMessage = [...messages].reverse().find((m) => m.role === "user");
    if (!lastUserMessage) return;

    try {
      const { data, error } = await supabase.functions.invoke("escalate", {
        body: { sessionId, userMessage: lastUserMessage.content },
      });

      if (error) throw error;

      toast({
        title: "Escalated",
        description: data.message,
      });

      const escalationMessage: Message = {
        id: Date.now().toString(),
        role: "bot",
        content: "Your conversation has been escalated to our human support team. They will reach out to you shortly. Is there anything else I can help you with in the meantime?",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, escalationMessage]);
      setShowEscalation(false);
    } catch (error) {
      console.error("Error escalating:", error);
      toast({
        title: "Error",
        description: "Failed to escalate conversation",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      {/* Header */}
      <header className="bg-gradient-header text-white shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-20"></div>
        <div className="container mx-auto px-6 py-5 relative">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">AI Customer Support</h1>
              <p className="text-sm text-white/90 font-medium mt-0.5">Powered by Gemini AI • Available 24/7</p>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Container */}
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto max-w-4xl py-6 px-4">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              role={message.role}
              content={message.content}
              timestamp={message.timestamp}
            />
          ))}
          {isLoading && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="container mx-auto max-w-4xl">
        <ChatInput
          onSendMessage={handleSendMessage}
          onEscalate={handleEscalate}
          disabled={isLoading || !sessionId}
          showEscalation={showEscalation}
        />
      </div>
    </div>
  );
};

export default Index;