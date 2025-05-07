
import React, { useState, useRef } from 'react';
import Header from "@/components/Header";
import ChatMessages from "@/components/ChatMessages";
import QuickActions from "@/components/QuickActions";

const Index = () => {
  const [message, setMessage] = useState("");
  const chatMessagesRef = useRef<any>(null);

  const handleQuickAction = (actionText: string) => {
    setMessage(actionText);
    if (chatMessagesRef.current) {
      const inputElement = chatMessagesRef.current.querySelector('input');
      if (inputElement) {
        inputElement.value = actionText;
        const event = new Event('input', { bubbles: true });
        inputElement.dispatchEvent(event);
      }
      
      // Focus on the input element
      inputElement?.focus();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      <Header />
      <div className="flex-1 overflow-hidden" ref={chatMessagesRef}>
        <ChatMessages />
      </div>
      <QuickActions onSelectAction={handleQuickAction} />
    </div>
  );
};

export default Index;
