import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { Bot, FileSearch, Check, X, Search } from "lucide-react";
import AdminChatbot from "@/components/AdminChatbot";

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

interface FoundItem {
  id: string;
  name: string;
  description: string;
  location: string;
  date: string;
  status: "available" | "claimed";
  createdAt: string;
}

const Admin = () => {
  const [lostItems, setLostItems] = useState<LostItem[]>([]);
  const [foundItems, setFoundItems] = useState<FoundItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"lost" | "found" | "chat">("lost");
  const [selectedLostItem, setSelectedLostItem] = useState<LostItem | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Load lost items from localStorage
    const savedLostItems = JSON.parse(localStorage.getItem("lostItems") || "[]");
    setLostItems(savedLostItems);

    // Load found items from localStorage
    const savedFoundItems = JSON.parse(localStorage.getItem("foundItems") || "[]");
    setFoundItems(savedFoundItems);
  }, []);

  const goToHome = () => {
    navigate('/');
  };

  const filterItems = (items: any[], term: string) => {
    if (!term) return items;
    return items.filter(item => 
      item.name.toLowerCase().includes(term.toLowerCase()) || 
      item.description.toLowerCase().includes(term.toLowerCase())
    );
  };

  const findMatches = (lostItem: LostItem) => {
    setSelectedLostItem(lostItem);
    
    // Enhanced matching algorithm based on keywords and partial matches
    const matches = foundItems.filter(foundItem => {
      // Split descriptions and names into keywords
      const lostKeywords = [
        ...lostItem.name.toLowerCase().split(/\s+/),
        ...lostItem.description.toLowerCase().split(/\s+/)
      ].filter(word => word.length > 2); // Filter out very short words
      
      const foundKeywords = [
        ...foundItem.name.toLowerCase().split(/\s+/),
        ...foundItem.description.toLowerCase().split(/\s+/)
      ].filter(word => word.length > 2);
      
      // Calculate keyword match score (how many words match)
      let matchScore = 0;
      lostKeywords.forEach(lostWord => {
        foundKeywords.forEach(foundWord => {
          // Check for partial matches
          if (lostWord.includes(foundWord) || foundWord.includes(lostWord)) {
            matchScore++;
          }
        });
      });
      
      // Also check category/type match (e.g., wallet, phone, etc.)
      const hasTypeMatch = 
        lostItem.name.toLowerCase().includes(foundItem.name.toLowerCase()) || 
        foundItem.name.toLowerCase().includes(lostItem.name.toLowerCase());
      
      // Check location similarity
      const locationMatch = 
        lostItem.location.toLowerCase().includes(foundItem.location.toLowerCase()) || 
        foundItem.location.toLowerCase().includes(lostItem.location.toLowerCase());
      
      // Return true if there's a reasonable match (using a threshold)
      return (matchScore >= 1) || hasTypeMatch || locationMatch;
    });
    
    if (matches.length > 0) {
      toast({
        title: "وجدنا تطابقات محتملة!",
        description: `تم العثور على ${matches.length} عناصر مشابهة للعنصر المفقود "${lostItem.name}"`,
        duration: 5000,
      });
      
      // Highlight matching items by scrolling to them
      setTimeout(() => {
        document.getElementById(`found-item-${matches[0].id}`)?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
        setActiveTab("found");
      }, 1000);
    } else {
      toast({
        title: "لم يتم العثور على تطابقات",
        description: `لا توجد عناصر مشابهة للعنصر المفقود "${lostItem.name}" في قاعدة البيانات حالياً`,
        duration: 5000,
      });
    }
  };

  const markAsFound = (lostItem: LostItem, foundItem?: FoundItem) => {
    // Update the lost item status
    const updatedLostItems = lostItems.map(item => 
      item.id === lostItem.id ? {...item, status: "found" as const} : item
    );
    setLostItems(updatedLostItems);
    localStorage.setItem("lostItems", JSON.stringify(updatedLostItems));
    
    // Update the found item status if provided
    if (foundItem) {
      const updatedFoundItems = foundItems.map(item => 
        item.id === foundItem.id ? {...item, status: "claimed" as const} : item
      );
      setFoundItems(updatedFoundItems);
      localStorage.setItem("foundItems", JSON.stringify(updatedFoundItems));
    }
    
    toast({
      title: "تم تحديث الحالة بنجاح",
      description: `تم تغيير حالة العنصر "${lostItem.name}" إلى "تم العثور عليه"`,
      duration: 3000,
    });
  };

  const closeReport = (lostItem: LostItem) => {
    const updatedLostItems = lostItems.map(item => 
      item.id === lostItem.id ? {...item, status: "closed" as const} : item
    );
    setLostItems(updatedLostItems);
    localStorage.setItem("lostItems", JSON.stringify(updatedLostItems));
    
    toast({
      title: "تم إغلاق البلاغ",
      description: `تم إغلاق البلاغ الخاص بالعنصر "${lostItem.name}"`,
      duration: 3000,
    });
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "found": return "bg-green-100 text-green-800";
      case "closed": return "bg-gray-100 text-gray-800";
      case "available": return "bg-blue-100 text-blue-800";
      case "claimed": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending": return "قيد الانتظار";
      case "found": return "تم العثور عليه";
      case "closed": return "مغلق";
      case "available": return "متاح";
      case "claimed": return "تم استلامه";
      default: return status;
    }
  };

  const handleFoundItemAdded = (newItem: FoundItem) => {
    const updatedFoundItems = [...foundItems, newItem];
    setFoundItems(updatedFoundItems);
    localStorage.setItem("foundItems", JSON.stringify(updatedFoundItems));
    setActiveTab("found");
    
    toast({
      title: "تم إضافة العنصر بنجاح",
      description: `تمت إضافة "${newItem.name}" إلى قائمة العناصر التي تم العثور عليها`,
      duration: 3000,
    });
  };

  const filteredLostItems = filterItems(lostItems, searchTerm);
  const filteredFoundItems = filterItems(foundItems, searchTerm);

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-uqu-green-700">لوحة إدارة المفقودات</h1>
        <Button onClick={goToHome} variant="outline">
          العودة للصفحة الرئيسية
        </Button>
      </div>
      
      <div className="flex mb-6 border-b">
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'lost' ? 'text-uqu-green-700 border-b-2 border-uqu-green-700' : 'text-gray-500'}`}
          onClick={() => setActiveTab('lost')}
        >
          المفقودات
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'found' ? 'text-uqu-green-700 border-b-2 border-uqu-green-700' : 'text-gray-500'}`}
          onClick={() => setActiveTab('found')}
        >
          الموجودات
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'chat' ? 'text-uqu-green-700 border-b-2 border-uqu-green-700' : 'text-gray-500'}`}
          onClick={() => setActiveTab('chat')}
        >
          إضافة موجودات
        </button>
      </div>

      {activeTab !== 'chat' && (
        <div className="mb-4 relative">
          <Search className="h-5 w-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="البحث عن عناصر..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-4 pr-10 py-2 border rounded-md w-full text-right"
            dir="rtl"
          />
        </div>
      )}

      {activeTab === 'lost' && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">العنصر</TableHead>
                <TableHead className="text-right">الوصف</TableHead>
                <TableHead className="text-right">المكان</TableHead>
                <TableHead className="text-right">التاريخ</TableHead>
                <TableHead className="text-right">معلومات الاتصال</TableHead>
                <TableHead className="text-right">الحالة</TableHead>
                <TableHead className="text-right">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLostItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    لا توجد عناصر مفقودة حالياً
                  </TableCell>
                </TableRow>
              ) : (
                filteredLostItems.map((item) => (
                  <TableRow key={item.id} className={selectedLostItem?.id === item.id ? 'bg-blue-50' : ''}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="max-w-xs truncate">{item.description}</TableCell>
                    <TableCell>{item.location}</TableCell>
                    <TableCell>{item.date}</TableCell>
                    <TableCell>{item.contactInfo}</TableCell>
                    <TableCell>
                      <span className={`px-3 py-1 rounded-full text-xs ${getStatusBadgeClass(item.status)}`}>
                        {getStatusText(item.status)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => findMatches(item)}
                          disabled={item.status !== "pending"}
                          className="text-blue-600 border-blue-600 hover:bg-blue-50"
                        >
                          <FileSearch className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => markAsFound(item)}
                          disabled={item.status !== "pending"}
                          className="text-green-600 border-green-600 hover:bg-green-50"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => closeReport(item)}
                          disabled={item.status !== "pending"}
                          className="text-red-600 border-red-600 hover:bg-red-50"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {activeTab === 'found' && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">العنصر</TableHead>
                <TableHead className="text-right">الوصف</TableHead>
                <TableHead className="text-right">المكان</TableHead>
                <TableHead className="text-right">تاريخ العثور</TableHead>
                <TableHead className="text-right">الحالة</TableHead>
                <TableHead className="text-right">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFoundItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    لا توجد عناصر تم العثور عليها حالياً
                  </TableCell>
                </TableRow>
              ) : (
                filteredFoundItems.map((item) => (
                  <TableRow key={item.id} id={`found-item-${item.id}`}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="max-w-xs truncate">{item.description}</TableCell>
                    <TableCell>{item.location}</TableCell>
                    <TableCell>{item.date}</TableCell>
                    <TableCell>
                      <span className={`px-3 py-1 rounded-full text-xs ${getStatusBadgeClass(item.status)}`}>
                        {getStatusText(item.status)}
                      </span>
                    </TableCell>
                    <TableCell>
                      {selectedLostItem && item.status === "available" && (
                        <Button 
                          size="sm" 
                          onClick={() => markAsFound(selectedLostItem, item)}
                          className="bg-uqu-green-600 hover:bg-uqu-green-700 text-white"
                        >
                          ربط بالبلاغ المحدد
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {activeTab === 'chat' && (
        <AdminChatbot onItemAdded={handleFoundItemAdded} />
      )}
    </div>
  );
};

export default Admin;
