import AIPanel from "@/components/AIPanel";
import Console from "@/components/Console";
import Editor from "@/components/Editor";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// pages/Project.tsx
const Project = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string>('');
  const [showSidebar, setShowSidebar] = useState(true);
  const [showAIPanel, setShowAIPanel] = useState(true);
  const [showConsole, setShowConsole] = useState(true);

  const handleFileSelect = (fileId: string, fileName: string) => {
    setSelectedFileId(fileId);
    setSelectedFileName(fileName);
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <Navbar 
        projectName={`Project ${id || 'New'}`}
        onHome={() => navigate('/home')}
        onToggleSidebar={() => setShowSidebar(!showSidebar)}
        onToggleAI={() => setShowAIPanel(!showAIPanel)}
        onToggleConsole={() => setShowConsole(!showConsole)}
        showSidebar={showSidebar}
        showAIPanel={showAIPanel}
        showConsole={showConsole}
      />

      <div className="flex-1 flex overflow-hidden">
        {showSidebar && id && (
          <Sidebar 
            projectId={id}
            selectedFile={selectedFileId}
            onFileSelect={handleFileSelect}
            onClose={() => setShowSidebar(false)}
          />
        )}

        <div className="flex-1 flex flex-col">
          <div className="flex-1 flex">
            <Editor selectedFile={selectedFileName} />
            {showAIPanel && <AIPanel onClose={() => setShowAIPanel(false)} />}
          </div>
          {showConsole && <Console onClose={() => setShowConsole(false)} />}
        </div>
      </div>
    </div>
  );
};

export default Project; 