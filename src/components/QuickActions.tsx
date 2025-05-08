
import React from 'react';

interface QuickActionProps {
  onSelectAction: (action: string) => void;
}

const QuickActions: React.FC<QuickActionProps> = ({ onSelectAction }) => {
  const quickAction = { text: "الإبلاغ عن مفقودات", value: "أريد الإبلاغ عن مفقودات" };

  return (
    <div className="px-4 py-3 bg-white border-t border-border">
      <div className="flex justify-center">
        <button
          onClick={() => onSelectAction(quickAction.value)}
          className="py-2 px-6 bg-uqu-green-600 text-white rounded-full text-sm transition-colors hover:bg-uqu-green-700 font-medium"
        >
          {quickAction.text}
        </button>
      </div>
    </div>
  );
};

export default QuickActions;
