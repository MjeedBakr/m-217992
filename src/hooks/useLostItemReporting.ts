
import { useState } from 'react';
import { toast } from "@/components/ui/use-toast";
import { ChatMessage } from "@/components/chat/Message";

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

export const useLostItemReporting = (
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>
) => {
  const [reportingStep, setReportingStep] = useState(-1);
  const [lostItemData, setLostItemData] = useState<Partial<LostItem>>({});
  const [isTyping, setIsTyping] = useState(false);
  const [isReportComplete, setIsReportComplete] = useState(false);

  const startReportingFlow = () => {
    setReportingStep(0);
    setIsTyping(true);
    
    setTimeout(() => {
      const botMsg: ChatMessage = {
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
        const botMsg: ChatMessage = {
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
      
      const botMsg: ChatMessage = {
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

  const handleNewUserMessage = (newMessage: string) => {
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      content: newMessage,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);

    // Start reporting flow immediately or continue if already in progress
    if (reportingStep === -1) {
      startReportingFlow();
    } 
    // If already in reporting flow, process the user's response
    else if (reportingStep >= 0 && reportingStep < reportFlow.length) {
      processUserResponse(newMessage, reportingStep);
    }
  };

  return {
    isTyping,
    reportingStep,
    isReportComplete,
    handleNewUserMessage
  };
};
