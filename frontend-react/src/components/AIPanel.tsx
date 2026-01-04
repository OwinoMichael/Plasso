import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, X } from 'lucide-react';

interface AIPanelProps {
  onClose: () => void;
}

const AIPanel: React.FC<AIPanelProps> = ({ onClose }) => {
  const reviews = [
    { type: 'warning', color: 'yellow', title: 'Warning', message: 'Consider adding PropTypes validation for the component', line: 4 },
    { type: 'suggestion', color: 'blue', title: 'Suggestion', message: 'Use useCallback to memoize the increment handler', line: 9 },
    { type: 'info', color: 'green', title: 'Good Practice', message: 'Clean component structure and naming conventions', line: null }
  ];

  return (
    <div className="w-80 border-l border-border flex flex-col bg-card">
      <div className="p-3 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          <h3 className="text-sm font-semibold">AI CODE REVIEW</h3>
        </div>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={onClose}>
          <X className="w-3 h-3" />
        </Button>
      </div>
      
      <div className="flex-1 overflow-auto p-3 space-y-3">
        {reviews.map((review, idx) => (
          <div key={idx} className="p-3 rounded bg-muted">
            <div className="flex items-start gap-2 mb-2">
              <div className={`w-1.5 h-1.5 rounded-full bg-${review.color}-500 mt-1.5`}></div>
              <div className="flex-1">
                <div className={`text-xs font-semibold text-${review.color}-600 dark:text-${review.color}-400 mb-1`}>
                  {review.title}
                </div>
                <div className="text-xs text-muted-foreground">{review.message}</div>
                {review.line && <div className="text-xs text-muted-foreground mt-1">Line {review.line}</div>}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-3 border-t border-border">
        <Button className="w-full text-sm">
          <Sparkles className="w-3 h-3 mr-2" />
          Run Full Analysis
        </Button>
      </div>
    </div>
  );
};

export default AIPanel;