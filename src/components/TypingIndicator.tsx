import { Bot } from "lucide-react";

export const TypingIndicator = () => {
  return (
    <div className="flex gap-3 px-4 py-3 animate-slide-up">
      <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-md animate-pulse">
        <Bot className="w-5 h-5 text-primary-foreground" />
      </div>
      
      <div className="bg-chat-bot-bg text-chat-bot-fg rounded-3xl rounded-tl-md px-5 py-4 shadow-md border border-border/50">
        <div className="flex gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-primary/70 animate-bounce [animation-delay:0ms]"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-primary/70 animate-bounce [animation-delay:150ms]"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-primary/70 animate-bounce [animation-delay:300ms]"></span>
        </div>
      </div>
    </div>
  );
};