import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  role: "user" | "bot";
  content: string;
  timestamp?: Date;
}

export const ChatMessage = ({ role, content, timestamp }: ChatMessageProps) => {
  const isBot = role === "bot";

  return (
    <div className={cn(
      "flex gap-3 px-4 py-3 animate-slide-up",
      isBot ? "justify-start" : "justify-end"
    )}>
      {isBot && (
        <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-md animate-scale-in">
          <Bot className="w-5 h-5 text-white" />
        </div>
      )}
      
      <div className={cn(
        "group max-w-[75%] rounded-3xl px-5 py-3.5 transition-smooth hover:scale-[1.02]",
        isBot 
          ? "bg-chat-bot-bg text-chat-bot-fg rounded-tl-md shadow-md border border-border/50" 
          : "bg-gradient-primary text-white rounded-tr-md shadow-lg"
      )}>
        <p className="text-[0.9375rem] leading-relaxed whitespace-pre-wrap">{content}</p>
        {timestamp && (
          <span className={cn(
            "text-xs mt-1.5 block opacity-60 group-hover:opacity-80 transition-smooth",
            isBot ? "text-muted-foreground" : "text-white"
          )}>
            {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
      </div>

      {!isBot && (
        <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-primary/10 backdrop-blur-sm flex items-center justify-center border border-primary/20 animate-scale-in">
          <User className="w-5 h-5 text-primary" />
        </div>
      )}
    </div>
  );
};