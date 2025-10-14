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
    <div className="border-t border-border bg-card p-4 space-y-3">
      {showEscalation && (
        <Button
          onClick={onEscalate}
          variant="outline"
          size="sm"
          className="w-full gap-2 text-accent border-accent hover:bg-accent hover:text-accent-foreground transition-smooth"
        >
          <AlertCircle className="w-4 h-4" />
          Escalate to Human Support
        </Button>
      )}
      
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          disabled={disabled}
          className="flex-1 transition-smooth focus:ring-2 focus:ring-primary"
        />
        <Button
          type="submit"
          disabled={disabled || !message.trim()}
          size="icon"
          className={cn(
            "bg-gradient-primary hover:shadow-glow transition-smooth",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
};