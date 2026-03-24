import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Terminal, Home, Upload, Download, Share2, Sparkles, Play, PanelLeft, PanelRight, PanelBottom, UserPlus, FileCode, ChevronDown, Loader2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';


interface NavbarProps {
  projectName: string;
  onHome: () => void;
  onToggleSidebar: () => void;
  onToggleAI: () => void;
  onToggleConsole: () => void;
  showSidebar: boolean;
  showAIPanel: boolean;
  showConsole: boolean;
  onAddCollaborator: (emailOrUsername: string) => void;
  onRunFile: () => void;      // run active file only
  onRunProject: () => void;   // run all files from main
  isRunning: boolean;
  activeFileName?: string;
}

const Navbar: React.FC<NavbarProps> = ({ 
  projectName, 
  onHome, 
  onToggleSidebar,
  onToggleAI, 
  onToggleConsole,
  showSidebar,
  showAIPanel,
  showConsole,
  onAddCollaborator,
  isRunning,
  activeFileName,
  onRunProject,
  onRunFile

}) => {
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [collaboratorInput, setCollaboratorInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAddCollaborator = async () => {
    if (!collaboratorInput.trim()) return;
    
    setIsLoading(true);
    try {
      await onAddCollaborator(collaboratorInput);
      setCollaboratorInput('');
      setIsShareDialogOpen(false);
    } catch (error) {
      console.error('Failed to add collaborator:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
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
          
          {/* Share Button with Dialog */}
          <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm">
                <Share2 className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add Collaborator</DialogTitle>
                <DialogDescription>
                  Invite someone to collaborate on this project. Enter their email or username.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="collaborator" className="text-right">
                    User
                  </Label>
                  <Input
                    id="collaborator"
                    placeholder="Email or username"
                    className="col-span-3"
                    value={collaboratorInput}
                    onChange={(e) => setCollaboratorInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && collaboratorInput.trim()) {
                        handleAddCollaborator();
                      }
                    }}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  type="submit" 
                  onClick={handleAddCollaborator}
                  disabled={!collaboratorInput.trim() || isLoading}
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  {isLoading ? 'Adding...' : 'Add Collaborator'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onToggleAI}
            className={showAIPanel ? 'text-primary' : ''}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            AI Review
          </Button>
          {/* <Button variant="default" size="sm">
            <Play className="w-4 h-4 mr-2" />
            Run Code
          </Button> */}

          <div className="flex items-center">
            <Button
              variant="default"
              size="sm"
              onClick={onRunProject}
              disabled={isRunning}
              className="rounded-r-none"
            >
              {isRunning
                ? <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                : <Play className="w-4 h-4 mr-2" />
              }
              {isRunning ? 'Running...' : 'Run'}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="default"
                  size="sm"
                  className="rounded-l-none border-l border-primary-foreground/20 px-2"
                  disabled={isRunning}
                >
                  <ChevronDown className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onRunProject}>
                  <Play className="w-3 h-3 mr-2" />
                  Run Project (main file)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onRunFile} disabled={!activeFileName}>
                  <FileCode className="w-3 h-3 mr-2" />
                  Run {activeFileName || 'current file'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
        </div>
      </div>
    </>
  );
};

export default Navbar;