
import React, { useState } from 'react';
import { Textarea } from "@/components/ui/textarea";

interface MessageInputProps {
  onSendMessage: (message: string) => void;
}

export const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    onSendMessage(newMessage);
    setNewMessage("");
  };

  return (
    <form onSubmit={handleSendMessage} className="p-4 border-t border-border bg-white">
      <div className="flex items-center gap-2 bg-background rounded-full p-2 shadow-soft">
        <Textarea
          placeholder="اكتب رسالتك هنا..."
          className="flex-1 bg-transparent outline-none px-2 resize-none overflow-hidden p-0 min-h-0 h-10 text-right border-none"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          dir="rtl"
          rows={1}
          style={{
            direction: "rtl",
            textAlign: "right",
            lineHeight: "2.5rem"
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              if (newMessage.trim()) {
                handleSendMessage(e);
              }
            }
          }}
        />
        <button 
          type="submit"
          className={`p-2 rounded-full transition-colors ${newMessage.trim() ? 'bg-uqu-green-600 text-white' : 'bg-gray-200 text-gray-400'}`}
          disabled={!newMessage.trim()}
        >
          <svg className="w-5 h-5 transform rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" />
          </svg>
        </button>
      </div>
    </form>
  );
};
