import AIPanel from "@/components/AIPanel";
import Console from "@/components/Console";
import Editor from "@/components/Editor";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import axios from "@/services/auth-header";
import type { OpenFile } from "@/types/editor";

import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';



// pages/Project.tsx
const Project = () => {

  

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string>('');
  const [showSidebar, setShowSidebar] = useState(true);
  const [showAIPanel, setShowAIPanel] = useState(true);
  const [showConsole, setShowConsole] = useState(true);
  const [openFiles, setOpenFiles] = useState<OpenFile[]>([]);
  const [activeFileId, setActiveFileId] = useState<string | null>(null);
   const [isAddingCollaborator, setIsAddingCollaborator] = useState(false);

  // Implement the add collaborator function
  const handleAddCollaborator = async (emailOrUsername: string) => {
    if (!emailOrUsername.trim()) {
      toast.error("Please enter an email or username");
      return;
    }

    setIsAddingCollaborator(true);
    
    try {
      await axios.post(
        `${API_URL}/projects/${id}/add-collabs`,
        emailOrUsername, // Send raw string as required by backend
        {
          headers: {
            'Content-Type': 'text/plain', // Important! Backend expects raw string
          },
        }
      );

      toast.success("Collaborator added successfully");

      // Optionally refresh project data or update UI
      // fetchProjectDetails();

    } catch (error: any) {
      console.error('Failed to add collaborator:', error);
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data || 
                          'Failed to add collaborator';
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      
      // Re-throw so the dialog knows it failed
      throw error;
    } finally {
      setIsAddingCollaborator(false);
    }
  };

  const handleFileSelect = async (fileId: string, fileName: string) => {

  // const newFile: OpenFile = {
  //   id: fileId,
  //   name: fileName,
  //   content: file.content,
  //   language: file.language || "text",
  //   isDirty: false
  // };

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
      language: file.language || "text",
      isDirty: false
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
        onAddCollaborator={handleAddCollaborator} showConsole={false}     />

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
              setOpenFiles={setOpenFiles}
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