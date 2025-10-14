import { useState } from "react";
import { Send, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onEscalate: () => void;
  disabled?: boolean;
  showEscalation?: boolean;
}

export const ChatInput = ({ onSendMessage, onEscalate, disabled, showEscalation }: ChatInputProps) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  return (
    <div className="border-t border-border/50 bg-card/95 backdrop-blur-glass p-5 space-y-3.5">
      {showEscalation && (
        <Button
          onClick={onEscalate}
          variant="outline"
          size="sm"
          className="w-full gap-2 text-accent border-accent/30 hover:bg-accent hover:text-accent-foreground hover:border-accent transition-smooth font-medium shadow-sm"
        >
          <AlertCircle className="w-4 h-4" />
          Escalate to Human Support
        </Button>
      )}
      
      <form onSubmit={handleSubmit} className="flex gap-3">
        <div className="flex-1 relative">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            disabled={disabled}
            className="pr-4 h-12 rounded-2xl bg-input border-border/50 transition-smooth focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-input text-[0.9375rem]"
          />
        </div>
        <Button
          type="submit"
          disabled={disabled || !message.trim()}
          size="icon"
          className={cn(
            "h-12 w-12 rounded-2xl bg-gradient-primary hover:shadow-lg hover:scale-105 transition-bounce",
            "disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100 shadow-md"
          )}
        >
          <Send className="w-5 h-5" />
        </Button>
      </form>
    </div>
  );
};