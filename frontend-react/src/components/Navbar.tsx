import React from 'react';
import { Button } from '@/components/ui/button';
import { Terminal, Home, Upload, Download, Share2, Sparkles, Play, PanelLeft, PanelRight, PanelBottom } from 'lucide-react';

interface NavbarProps {
  projectName: string;
  onHome: () => void;
  onToggleSidebar: () => void;
  onToggleAI: () => void;
  onToggleConsole: () => void;
  showSidebar: boolean;
  showAIPanel: boolean;
  showConsole: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ 
  projectName, 
  onHome, 
  onToggleSidebar,
  onToggleAI, 
  onToggleConsole,
  showSidebar,
  showAIPanel,
  showConsole 
}) => {
  return (
    <div className="h-14 border-b border-border flex items-center justify-between px-4">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onHome}>
          <Home className="w-4 h-4" />
        </Button>
        <div className="flex items-center gap-2">
          <Terminal className="w-6 h-6 text-primary" />
          <span className="text-xl font-bold">CodeSync</span>
        </div>
        <span className="text-sm text-muted-foreground">Project: {projectName}</span>
      </div>
      
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onToggleSidebar}
          className={showSidebar ? 'text-primary' : ''}
        >
          <PanelLeft className="w-4 h-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onToggleConsole}
          className={showConsole ? 'text-primary' : ''}
        >
          <PanelBottom className="w-4 h-4" />
        </Button>
        <div className="w-px h-6 bg-border mx-1"></div>
        <Button variant="ghost" size="sm">
          <Upload className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm">
          <Download className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm">
          <Share2 className="w-4 h-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onToggleAI}
          className={showAIPanel ? 'text-primary' : ''}
        >
          <Sparkles className="w-4 h-4 mr-2" />
          AI Review
        </Button>
        <Button variant="default" size="sm">
          <Play className="w-4 h-4 mr-2" />
          Run Code
        </Button>
      </div>
    </div>
  );
};

export default Navbar;