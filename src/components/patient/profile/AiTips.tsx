
import React from 'react';
import AiTip from './AiTip';

interface AiTipsProps {
  tips: Array<{
    id: number;
    text: string;
    action: string;
    actionLink: string;
  }>;
}

const AiTips: React.FC<AiTipsProps> = ({ tips }) => {
  return (
    <div>
      <h3 className="font-medium text-sm mb-3">AI tips</h3>
      <div className="space-y-3">
        {tips.map((tip) => (
          <AiTip 
            key={tip.id}
            id={tip.id}
            text={tip.text}
            action={tip.action}
            actionLink={tip.actionLink}
          />
        ))}
      </div>
    </div>
  );
};

export default AiTips;
