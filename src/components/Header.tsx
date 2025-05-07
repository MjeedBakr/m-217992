
import React from 'react';
import { Avatar } from "@/components/ui/avatar";

const Header = () => {
  return (
    <div className="header-shadow bg-white p-3 flex items-center justify-between">
      <div className="flex items-center">
        <img 
          src="https://www.uqu.edu.sa/App_Themes/uqu/img/logo.png" 
          alt="شعار جامعة أم القرى" 
          className="h-12 w-auto ml-3"
        />
        <div>
          <h1 className="font-bold text-lg text-uqu-green-600">بوت المفقودات</h1>
          <p className="text-xs text-muted">جامعة أم القرى</p>
        </div>
      </div>
      <Avatar className="w-10 h-10">
        <img 
          src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7" 
          alt="المستخدم" 
          className="object-cover"
        />
      </Avatar>
    </div>
  );
};

export default Header;
