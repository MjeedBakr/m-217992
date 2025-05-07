
import React from 'react';
import { Avatar } from "@/components/ui/avatar";
import { User } from "lucide-react";

const Header = () => {
  return (
    <div className="header-shadow bg-white p-3 flex items-center justify-between">
      <div className="flex items-center">
        <img 
          src="/lovable-uploads/990c4a83-37d2-4cbe-991b-d38c886c60af.png" 
          alt="شعار جامعة أم القرى" 
          className="h-14 w-auto ml-3"
        />
        <div>
          <h1 className="font-bold text-lg text-uqu-green-600">بوت المفقودات</h1>
          <p className="text-xs text-muted">جامعة أم القرى</p>
        </div>
      </div>
      <Avatar className="w-10 h-10 bg-gray-200">
        <User className="h-6 w-6 text-gray-500" />
      </Avatar>
    </div>
  );
};

export default Header;
