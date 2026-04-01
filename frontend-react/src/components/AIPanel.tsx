import React, { useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Sparkles, X, Loader2, AlertTriangle, Lightbulb, CheckCircle, Info } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

interface ReviewItem {
  type: 'warning' | 'suggestion' | 'info';
  title: string;
  message: string;
  line: number | null;
}

interface AIPanelProps {
  onClose: () => void;
  activeFileId: string | null;
}

const typeConfig = {
  warning: {
    icon: AlertTriangle,
    color: 'text-yellow-400',
    bg: 'bg-yellow-400/10',
    border: 'border-yellow-400/20',
  },
  suggestion: {
    icon: Lightbulb,
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
    border: 'border-blue-400/20',
  },
  info: {
    icon: CheckCircle,
    color: 'text-green-400',
    bg: 'bg-green-400/10',
    border: 'border-green-400/20',
  },
};

const AIPanel: React.FC<AIPanelProps> = ({ onClose, activeFileId }) => {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasRun, setHasRun] = useState(false);

  const userStr = localStorage.getItem('user');
  const token = userStr ? JSON.parse(userStr).token : null;

  const runAnalysis = async () => {
    if (!activeFileId) return;
    setIsLoading(true);
    setError(null);

    try {
      const res = await axios.post(
        `${API_URL}/ai-analysis/`,
        activeFileId,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'text/plain',
          },
        }
      );
      setReviews(res.data);
      setHasRun(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Analysis failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const warnings   = reviews.filter(r => r.type === 'warning');
  const suggestions = reviews.filter(r => r.type === 'suggestion');
  const infos      = reviews.filter(r => r.type === 'info');

  return (
    <div className="w-80 border-l border-border flex flex-col bg-card">

      {/* Header */}
      <div className="p-3 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold">AI CODE REVIEW</h3>
        </div>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={onClose}>
          <X className="w-3 h-3" />
        </Button>
      </div>

      {/* Summary bar — only show after run */}
      {hasRun && !isLoading && (
        <div className="flex items-center justify-around px-3 py-2 border-b border-border text-xs">
          <span className="text-yellow-400">{warnings.length} warnings</span>
          <span className="text-blue-400">{suggestions.length} suggestions</span>
          <span className="text-green-400">{infos.length} good</span>
        </div>
      )}

      {/* Body */}
      <div className="flex-1 overflow-auto p-3 space-y-2">

        {/* Loading */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <span className="text-xs">Analyzing your code...</span>
          </div>
        )}

        {/* Error */}
        {error && !isLoading && (
          <div className="p-3 rounded bg-destructive/10 border border-destructive/20 text-xs text-destructive">
            {error}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !error && !hasRun && (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-muted-foreground">
            <Sparkles className="w-8 h-8 opacity-30" />
            <p className="text-xs text-center">
              {activeFileId
                ? 'Click "Run Analysis" to review the active file.'
                : 'Open a file to start AI review.'}
            </p>
          </div>
        )}

        {/* No issues */}
        {!isLoading && hasRun && reviews.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-green-400">
            <CheckCircle className="w-8 h-8" />
            <p className="text-xs">No issues found. Great code!</p>
          </div>
        )}

        {/* Review items */}
        {!isLoading && reviews.map((review, idx) => {
          const config = typeConfig[review.type] ?? typeConfig.info;
          const Icon = config.icon;
          return (
            <div
              key={idx}
              className={`p-3 rounded border ${config.bg} ${config.border}`}
            >
              <div className="flex items-start gap-2">
                <Icon className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${config.color}`} />
                <div className="flex-1 min-w-0">
                  <div className={`text-xs font-semibold ${config.color} mb-0.5`}>
                    {review.title}
                  </div>
                  <div className="text-xs text-muted-foreground leading-relaxed">
                    {review.message}
                  </div>
                  {review.line && (
                    <div className="text-xs text-muted-foreground mt-1 opacity-70">
                      Line {review.line}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-border">
        <Button
          className="w-full text-sm"
          onClick={runAnalysis}
          disabled={isLoading || !activeFileId}
        >
          {isLoading
            ? <><Loader2 className="w-3 h-3 mr-2 animate-spin" /> Analyzing...</>
            : <><Sparkles className="w-3 h-3 mr-2" /> {hasRun ? 'Re-run Analysis' : 'Run Analysis'}</>
          }
        </Button>
      </div>
    </div>
  );
};

export default AIPanel;