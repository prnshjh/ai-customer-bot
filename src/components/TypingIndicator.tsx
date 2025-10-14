import { Bot } from "lucide-react";

export const TypingIndicator = () => {
  return (
    <div className="flex gap-3 p-4 animate-fade-in">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow">
        <Bot className="w-5 h-5 text-white" />
      </div>
      
      <div className="bg-chat-bot-bg text-chat-bot-fg rounded-2xl rounded-tl-none px-4 py-3 shadow-message">
        <div className="flex gap-1.5">
          <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce [animation-delay:0ms]"></span>
          <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce [animation-delay:150ms]"></span>
          <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce [animation-delay:300ms]"></span>
        </div>
      </div>
    </div>
  );
};