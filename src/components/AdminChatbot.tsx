
import React, { useState, useEffect, useRef } from 'react';
import { Avatar } from "@/components/ui/avatar";
import { Bot, User } from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: string;
}

interface FoundItem {
  id: string;
  name: string;
  description: string;
  location: string;
  date: string;
  status: "available" | "claimed";
  createdAt: string;
}

interface AdminChatbotProps {
  onItemAdded: (item: FoundItem) => void;
}

const foundFlow = [
  "ما هو اسم العنصر الذي تم العثور عليه؟",
  "أين تم العثور على هذا العنصر؟ (المبنى، القاعة، إلخ)",
  "متى تم العثور على هذا العنصر؟ (التاريخ التقريبي)",
  "هل يمكنك إعطاء وصف مفصل للعنصر؟ (اللون، الشكل، أي علامات مميزة)"
];

const initialMessages: Message[] = [
  { 
    id: "1", 
    content: "مرحبا بك في بوت إدخال الموجودات! الرجاء وصف العنصر الذي تم العثور عليه.", 
    sender: "bot", 
    timestamp: "09:00" 
  },
];

const AdminChatbot: React.FC<AdminChatbotProps> = ({ onItemAdded }) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [reportingStep, setReportingStep] = useState(-1);
  const [foundItemData, setFoundItemData] = useState<Partial<FoundItem>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const startReportingFlow = () => {
    setReportingStep(0);
    setIsTyping(true);
    
    setTimeout(() => {
      const botMsg: Message = {
        id: Date.now().toString() + "-bot",
        content: foundFlow[0],
        sender: "bot",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 1000);
  };

  const processUserResponse = (userResponse: string, currentStep: number) => {
    const updatedFoundItem = { ...foundItemData };
    
    // Process user response based on the current step
    switch (currentStep) {
      case 0:
        updatedFoundItem.name = userResponse;
        break;
      case 1:
        updatedFoundItem.location = userResponse;
        break;
      case 2:
        updatedFoundItem.date = userResponse;
        break;
      case 3:
        updatedFoundItem.description = userResponse;
        break;
    }
    
    setFoundItemData(updatedFoundItem);
    
    // Move to the next step or complete the report
    if (currentStep < foundFlow.length - 1) {
      const nextStep = currentStep + 1;
      setReportingStep(nextStep);
      setIsTyping(true);
      
      setTimeout(() => {
        const botMsg: Message = {
          id: Date.now().toString() + "-bot",
          content: foundFlow[nextStep],
          sender: "bot",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, botMsg]);
        setIsTyping(false);
      }, 1000);
    } else {
      // Reporting is complete, generate summary and add item
      completeReport(updatedFoundItem);
    }
  };

  const completeReport = (reportData: Partial<FoundItem>) => {
    setIsTyping(true);
    
    setTimeout(() => {
      // Create a complete found item object
      const completeFoundItem: FoundItem = {
        id: Date.now().toString(),
        name: reportData.name || "",
        description: reportData.description || "",
        location: reportData.location || "",
        date: reportData.date || "",
        status: "available",
        createdAt: new Date().toISOString(),
      };
      
      // Generate summary message
      const summaryMsg = `
        **تم إدخال العنصر بنجاح! ملخص البيانات:**
        
        **العنصر:** ${completeFoundItem.name}
        **الوصف:** ${completeFoundItem.description}
        **المكان:** ${completeFoundItem.location}
        **التاريخ:** ${completeFoundItem.date}
        
        تم إضافة العنصر إلى قائمة الموجودات.
      `;
      
      const botMsg: Message = {
        id: Date.now().toString() + "-bot",
        content: summaryMsg,
        sender: "bot",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
      
      // Call the callback to add the item to the parent component
      onItemAdded(completeFoundItem);
      
      // Reset for the next item
      setTimeout(() => {
        const resetMsg: Message = {
          id: Date.now().toString() + "-bot",
          content: "هل تريد إضافة عنصر آخر تم العثور عليه؟",
          sender: "bot",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        
        setMessages(prev => [...prev, resetMsg]);
        setReportingStep(-1);
        setFoundItemData({});
      }, 2000);
    }, 1500);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, userMsg]);
    setNewMessage("");

    // If reporting flow hasn't started yet, start it
    if (reportingStep === -1) {
      startReportingFlow();
    } 
    // If already in reporting flow, process the user's response
    else if (reportingStep >= 0 && reportingStep < foundFlow.length) {
      processUserResponse(newMessage, reportingStep);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-[600px] border rounded-lg overflow-hidden">
      <div className="bg-uqu-green-600 text-white py-3 px-4 text-center">
        <h2 className="text-lg font-bold">بوت إدخال الموجودات</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide bg-gray-50">
        {messages.map((message) => (
          <div key={message.id} className={`flex items-start gap-2 mb-4 ${message.sender === "user" ? "flex-row-reverse" : ""}`}>
            <Avatar className={`w-8 h-8 mt-1 ${message.sender === "bot" ? "bg-uqu-green-600" : "bg-gray-200"}`}>
              {message.sender === "user" ? (
                <User className="h-5 w-5 text-gray-500" />
              ) : (
                <Bot className="h-5 w-5 text-white" />
              )}
            </Avatar>
            <div className="flex flex-col gap-1 max-w-[75%]">
              <div className={`message-bubble ${message.sender === "user" ? "sent" : "received"}`}>
                {message.content}
              </div>
              <div className={`text-xs text-muted ${message.sender === "user" ? "text-left" : "text-right"}`}>
                {message.timestamp}
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex items-start gap-2 mb-4">
            <Avatar className="w-8 h-8 mt-1 bg-uqu-green-600">
              <Bot className="h-5 w-5 text-white" />
            </Avatar>
            <div className="message-bubble received">
              <div className="typing">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="p-4 border-t border-border bg-white">
        <div className="flex items-center gap-2 bg-background rounded-full p-2 shadow-soft">
          <input
            type="text"
            placeholder="اكتب رسالتك هنا..."
            className="flex-1 bg-transparent outline-none px-2 text-right"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            dir="rtl"
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
    </div>
  );
};

export default AdminChatbot;
