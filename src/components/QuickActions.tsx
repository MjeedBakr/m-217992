
import React from 'react';

interface QuickActionProps {
  onSelectAction: (action: string) => void;
}

const QuickActions: React.FC<QuickActionProps> = ({ onSelectAction }) => {
  const quickActions = [
    { text: "الإبلاغ عن مفقودات", value: "أريد الإبلاغ عن مفقودات" },
    { text: "البحث عن مفقودات", value: "أبحث عن مفقودات" },
    { text: "متابعة بلاغ سابق", value: "أريد متابعة بلاغ قدمته سابقاً" },
    { text: "العثور على شيء ما", value: "عثرت على شيء وأريد تسليمه" }
  ];

  return (
    <div className="px-4 py-3 bg-white border-t border-border">
      <h3 className="text-sm font-bold mb-2 text-uqu-green-600">اختيارات سريعة:</h3>
      <div className="flex flex-wrap gap-2">
        {quickActions.map((action, index) => (
          <button
            key={index}
            onClick={() => onSelectAction(action.value)}
            className="py-1 px-3 bg-uqu-green-100 text-uqu-green-700 rounded-full text-sm transition-colors hover:bg-uqu-green-200"
          >
            {action.text}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
