import React, { useState } from 'react';
import { X, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ExecutionResult {
  stdout: string | null;
  stderr: string | null;
  status: string;
  time: number;
  memory: number;
}

interface ConsoleProps {
  onClose: () => void;
  result: ExecutionResult | null;
  isRunning: boolean;
}

const Console: React.FC<ConsoleProps> = ({ onClose, result, isRunning }) => {
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

      <div className="p-3 font-mono text-xs overflow-auto h-[calc(100%-42px)]">

        {activeTab === 'output' && (
          <>
            {isRunning && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="w-3 h-3 animate-spin" />
                Running...
              </div>
            )}

            {!isRunning && !result && (
              <div className="text-muted-foreground">
                Press Run to execute your code.
              </div>
            )}

            {!isRunning && result && (
              <>
                {/* Status + meta */}
                <div className="flex items-center gap-3 mb-2">
                  <span className={`font-semibold ${
                    result.status === 'Accepted' ? 'text-green-500' : 'text-red-400'
                  }`}>
                    ● {result.status}
                  </span>
                  <span className="text-muted-foreground">
                    {result.time}s · {result.memory}KB
                  </span>
                </div>

                {/* stdout */}
                {result.stdout && (
                  <pre className="text-foreground whitespace-pre-wrap">{result.stdout}</pre>
                )}

                {/* stderr / compile error */}
                {result.stderr && (
                  <pre className="text-red-400 whitespace-pre-wrap mt-1">{result.stderr}</pre>
                )}

                {/* No output */}
                {!result.stdout && !result.stderr && (
                  <div className="text-muted-foreground">No output.</div>
                )}
              </>
            )}
          </>
        )}

        {activeTab === 'problems' && (
          <>
            {result?.stderr ? (
              <pre className="text-red-400 whitespace-pre-wrap">{result.stderr}</pre>
            ) : (
              <div className="text-muted-foreground">No problems detected.</div>
            )}
          </>
        )}
      </div>
    </div>
  );
};