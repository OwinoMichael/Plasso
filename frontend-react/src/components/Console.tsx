import React, { useState } from 'react';
import { X, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ConsoleProps {
  onClose: () => void;
}

const Console: React.FC<ConsoleProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('output');

  return (
    <div className="h-48 border-t border-border bg-muted/30">
      <div className="flex items-center justify-between px-3 py-2 border-b border-border">
        <div className="flex items-center gap-4">
          <button 
            className={`text-xs font-semibold ${activeTab === 'output' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            onClick={() => setActiveTab('output')}
          >
            OUTPUT
          </button>
          <button 
            className={`text-xs ${activeTab === 'terminal' ? 'text-foreground font-semibold' : 'text-muted-foreground hover:text-foreground'}`}
            onClick={() => setActiveTab('terminal')}
          >
            TERMINAL
          </button>
          <button 
            className={`text-xs ${activeTab === 'problems' ? 'text-foreground font-semibold' : 'text-muted-foreground hover:text-foreground'}`}
            onClick={() => setActiveTab('problems')}
          >
            PROBLEMS
          </button>
        </div>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={onClose}>
          <ChevronUp className="w-3 h-3" />
        </Button>
      </div>
      <div className="p-3 font-mono text-xs text-muted-foreground overflow-auto h-[calc(100%-42px)]">
        {activeTab === 'output' && (
          <>
            <div>$ npm run dev</div>
            <div className="text-green-500 mt-1">✓ Compiled successfully</div>
            <div className="mt-1">Local: http://localhost:3000</div>
          </>
        )}
        {activeTab === 'terminal' && (
          <div>Terminal ready. Type your commands here...</div>
        )}
        {activeTab === 'problems' && (
          <div className="text-muted-foreground">No problems detected</div>
        )}
      </div>
    </div>
  );
};

export default Console;