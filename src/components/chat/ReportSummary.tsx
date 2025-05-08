
import React from 'react';
import { useNavigate } from "react-router-dom";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export const ReportSummary: React.FC = () => {
  const navigate = useNavigate();
  
  const goToAdmin = () => {
    navigate('/admin');
  };

  return (
    <div className="flex justify-center mt-4">
      <Button 
        onClick={goToAdmin}
        className="bg-uqu-green-600 text-white hover:bg-uqu-green-700"
      >
        <FileText className="w-5 h-5 ml-2" />
        الانتقال إلى صفحة الإدارة
      </Button>
    </div>
  );
};
