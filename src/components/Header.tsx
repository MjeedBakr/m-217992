
import React from 'react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User } from "lucide-react";

const Header = () => {
  return (
    <div className="header-shadow bg-white p-3 flex items-center justify-between">
      <div className="flex items-center">
        <img 
          src="/lovable-uploads/990c4a83-37d2-4cbe-991b-d38c886c60af.png" 
          alt="شعار جامعة أم القرى" 
          className="h-12 w-auto ml-3"
        />
        <div>
          <h1 className="font-bold text-lg text-uqu-green-600">بوت المفقودات</h1>
          <p className="text-xs text-muted">جامعة أم القرى</p>
        </div>
      </div>
      <Avatar className="w-9 h-9 bg-gray-200 flex items-center justify-center">
        <AvatarFallback>
          <User className="h-5 w-5 text-gray-500" />
        </AvatarFallback>
      </Avatar>
    </div>
  );
};

export default Header;
