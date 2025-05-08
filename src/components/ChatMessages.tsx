
import React, { useState, useEffect, useRef } from 'react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "@/components/ui/use-toast";
import { Bot, User, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: string;
}

interface LostItem {
  id: string;
  name: string;
  description: string;
  location: string;
  date: string;
  contactInfo: string;
  status: "pending" | "found" | "closed";
  createdAt: string;
}

// Bot questions flow for lost item reporting
const reportFlow = [
  "ما هو اسم العنصر المفقود؟",
  "أين فقدت هذا العنصر؟ (المبنى، القاعة، إلخ)",
  "متى فقدت هذا العنصر؟ (التاريخ التقريبي)",
  "هل يمكنك إعطاء وصف مفصل للعنصر المفقود؟ (اللون، الشكل، أي علامات مميزة)",
  "كيف يمكننا التواصل معك؟ (الرجاء تقديم رقم الهاتف أو البريد الإلكتروني)"
];

const initialMessages: Message[] = [
  { 
    id: "1", 
    content: "مرحبا بك في بوت المفقودات بجامعة أم القرى! لتقديم بلاغ عن مفقودات، الرجاء وصف العنصر المفقود بشكل مختصر.", 
    sender: "bot", 
    timestamp: "09:00" 
  },
];

export const ChatMessages = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [reportingStep, setReportingStep] = useState(-1);
  const [lostItemData, setLostItemData] = useState<Partial<LostItem>>({});
  const [isReportComplete, setIsReportComplete] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

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
        content: reportFlow[0],
        sender: "bot",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 1000);
  };

  const processUserResponse = (userResponse: string, currentStep: number) => {
    const updatedLostItem = { ...lostItemData };
    
    // Process user response based on the current step
    switch (currentStep) {
      case 0:
        updatedLostItem.name = userResponse;
        break;
      case 1:
        updatedLostItem.location = userResponse;
        break;
      case 2:
        updatedLostItem.date = userResponse;
        break;
      case 3:
        updatedLostItem.description = userResponse;
        break;
      case 4:
        updatedLostItem.contactInfo = userResponse;
        break;
    }
    
    setLostItemData(updatedLostItem);
    
    // Move to the next step or complete the report
    if (currentStep < reportFlow.length - 1) {
      const nextStep = currentStep + 1;
      setReportingStep(nextStep);
      setIsTyping(true);
      
      setTimeout(() => {
        const botMsg: Message = {
          id: Date.now().toString() + "-bot",
          content: reportFlow[nextStep],
          sender: "bot",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, botMsg]);
        setIsTyping(false);
      }, 1000);
    } else {
      // Reporting is complete, generate summary
      completeReport(updatedLostItem);
    }
  };

  const completeReport = (reportData: Partial<LostItem>) => {
    setIsTyping(true);
    
    setTimeout(() => {
      // Create a complete lost item object
      const completeLostItem: LostItem = {
        id: Date.now().toString(),
        name: reportData.name || "",
        description: reportData.description || "",
        location: reportData.location || "",
        date: reportData.date || "",
        contactInfo: reportData.contactInfo || "",
        status: "pending",
        createdAt: new Date().toISOString(),
      };
      
      // Store in localStorage (simulating a database)
      const existingItems = JSON.parse(localStorage.getItem("lostItems") || "[]");
      localStorage.setItem("lostItems", JSON.stringify([...existingItems, completeLostItem]));
      
      // Generate summary message
      const summaryMsg = `
        **تم استلام طلبك بنجاح! ملخص البيانات:**
        
        **العنصر المفقود:** ${completeLostItem.name}
        **الوصف:** ${completeLostItem.description}
        **المكان:** ${completeLostItem.location}
        **التاريخ:** ${completeLostItem.date}
        **معلومات الاتصال:** ${completeLostItem.contactInfo}
        
        **رقم البلاغ:** #${completeLostItem.id.slice(0, 8)}
        
        سيتم مراجعة طلبك من قبل المسؤول، وسيتم التواصل معك في حال العثور على العنصر المفقود.
      `;
      
      const botMsg: Message = {
        id: Date.now().toString() + "-bot",
        content: summaryMsg,
        sender: "bot",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
      setIsReportComplete(true);
      
      // Notify the user
      toast({
        title: "تم تقديم البلاغ بنجاح",
        description: `رقم البلاغ: #${completeLostItem.id.slice(0, 8)}`,
        duration: 5000,
      });
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

    // Start reporting flow immediately or continue if already in progress
    if (reportingStep === -1) {
      startReportingFlow();
    } 
    // If already in reporting flow, process the user's response
    else if (reportingStep >= 0 && reportingStep < reportFlow.length) {
      processUserResponse(newMessage, reportingStep);
    }
  };

  const goToAdmin = () => {
    navigate('/admin');
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
        {messages.map((message) => (
          <div key={message.id} className={`flex items-start gap-3 mb-4 ${message.sender === "user" ? "flex-row-reverse" : ""}`}>
            <Avatar className={`${message.sender === "bot" ? "bg-uqu-green-600" : "bg-gray-200"} flex items-center justify-center`}>
              <AvatarFallback>
                {message.sender === "user" ? (
                  <User className="h-5 w-5 text-gray-500" />
                ) : (
                  <Bot className="h-5 w-5 text-white" />
                )}
              </AvatarFallback>
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
          <div className="flex items-start gap-3 mb-4">
            <Avatar className="bg-uqu-green-600 flex items-center justify-center">
              <AvatarFallback>
                <Bot className="h-5 w-5 text-white" />
              </AvatarFallback>
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
        
        {isReportComplete && (
          <div className="flex justify-center mt-4">
            <Button 
              onClick={goToAdmin}
              className="bg-uqu-green-600 text-white hover:bg-uqu-green-700"
            >
              <FileText className="w-5 h-5 ml-2" />
              الانتقال إلى صفحة الإدارة
            </Button>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="p-4 border-t border-border bg-white">
        <div className="flex items-center gap-2 bg-background rounded-full p-2 shadow-soft">
          <input
            type="text"
            placeholder="اكتب رسالتك هنا..."
            className="flex-1 bg-transparent outline-none px-2 text-right dir-rtl"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            dir="rtl"
            style={{ direction: "rtl", textAlign: "right" }}
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

export default ChatMessages;
