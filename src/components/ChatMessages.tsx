
import React, { useState, useEffect, useRef } from 'react';
import { Avatar } from "@/components/ui/avatar";
import { toast } from "@/components/ui/use-toast";

interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: string;
}

const initialMessages: Message[] = [
  { 
    id: "1", 
    content: "مرحبا بك في بوت المفقودات بجامعة أم القرى! كيف يمكنني مساعدتك؟", 
    sender: "bot", 
    timestamp: "09:00" 
  },
];

const typingResponses = [
  "يمكنك تقديم بلاغ عن مفقودات من خلال وصف العنصر المفقود ومكان وتاريخ فقدانه.",
  "يمكنك البحث في قاعدة بيانات المفقودات عن طريق وصف العنصر الذي تبحث عنه.",
  "لقد تم تسجيل بلاغك وسيتم التواصل معك في حال العثور على المفقودات.",
  "نعم، يمكنك تحديث معلومات بلاغك أو إلغاؤه من خلال رقم البلاغ المرسل إلى بريدك الإلكتروني."
];

export const ChatMessages = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getRandomResponse = () => {
    return typingResponses[Math.floor(Math.random() * typingResponses.length)];
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
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const botMsg: Message = {
        id: Date.now().toString() + "-bot",
        content: getRandomResponse(),
        sender: "bot",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
      toast({
        description: "تم استلام رد جديد",
        duration: 2000,
      });
    }, 1500);
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
        {messages.map((message) => (
          <div key={message.id} className={`flex items-start gap-2 mb-4 ${message.sender === "user" ? "flex-row-reverse" : ""}`}>
            <Avatar className="w-8 h-8 mt-1">
              <img 
                src={message.sender === "user" 
                  ? "https://images.unsplash.com/photo-1649972904349-6e44c42644a7"
                  : "https://www.uqu.edu.sa/App_Themes/uqu/img/logo.png"
                } 
                alt={message.sender === "user" ? "المستخدم" : "بوت المفقودات"} 
                className="object-cover"
              />
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
            <Avatar className="w-8 h-8 mt-1">
              <img 
                src="https://www.uqu.edu.sa/App_Themes/uqu/img/logo.png"
                alt="بوت المفقودات" 
                className="object-cover"
              />
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

export default ChatMessages;
