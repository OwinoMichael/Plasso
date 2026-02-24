import AIPanel from "@/components/AIPanel";
import Console from "@/components/Console";
import Editor from "@/components/Editor";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import axios from "@/services/auth-header";

import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';



// pages/Project.tsx
const Project = () => {

  interface OpenFile {
  id: string;
  name: string;
  content: string;
  language: string;
}

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string>('');
  const [showSidebar, setShowSidebar] = useState(true);
  const [showAIPanel, setShowAIPanel] = useState(true);
  const [showConsole, setShowConsole] = useState(true);
  const [openFiles, setOpenFiles] = useState<OpenFile[]>([]);
  const [activeFileId, setActiveFileId] = useState<string | null>(null);

  const handleFileSelect = async (fileId: string, fileName: string) => {

  // If already open → just activate tab
  const existing = openFiles.find(f => f.id === fileId);
  if (existing) {
    setActiveFileId(fileId);
    return;
  }

  try {
    const res = await axios.get(
      `${API_URL}/projects/${id}/files/${fileId}`
    );

    const file = res.data;

    const newFile: OpenFile = {
      id: fileId,
      name: fileName,
      content: file.content,
      language: file.language || "text"
    };

    setOpenFiles(prev => [...prev, newFile]);
    setActiveFileId(fileId);

  } catch (err) {
    console.error("Failed loading file", err);
  }
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
            <Editor
              openFiles={openFiles}
              activeFileId={activeFileId}
              setActiveFileId={setActiveFileId}
            />
            {showAIPanel && <AIPanel onClose={() => setShowAIPanel(false)} />}
          </div>
          {showConsole && <Console onClose={() => setShowConsole(false)} />}
        </div>
      </div>
    </div>
  );
};

export default Project; 