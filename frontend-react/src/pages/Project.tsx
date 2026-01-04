import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Editor from '../components/Editor';
import AIPanel from '../components/AIPanel';
import Console from '../components/Console';

const Project = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState('main.py');
  const [showSidebar, setShowSidebar] = useState(true);
  const [showAIPanel, setShowAIPanel] = useState(true);
  const [showConsole, setShowConsole] = useState(true);

  return (
    <div className="h-screen flex flex-col bg-background">
      <Navbar 
        projectName="React Dashboard"
        onHome={() => navigate('/')}
        onToggleSidebar={() => setShowSidebar(!showSidebar)}
        onToggleAI={() => setShowAIPanel(!showAIPanel)}
        onToggleConsole={() => setShowConsole(!showConsole)}
        showSidebar={showSidebar}
        showAIPanel={showAIPanel}
        showConsole={showConsole}
      />

      <div className="flex-1 flex overflow-hidden">
        {showSidebar && (
          <Sidebar 
            selectedFile={selectedFile}
            onFileSelect={setSelectedFile}
            onClose={() => setShowSidebar(false)}
          />
        )}

        <div className="flex-1 flex flex-col">
          <div className="flex-1 flex">
            <Editor selectedFile={selectedFile} />
            {showAIPanel && <AIPanel onClose={() => setShowAIPanel(false)} />}
          </div>
          {showConsole && <Console onClose={() => setShowConsole(false)} />}
        </div>
      </div>
    </div>
  );
};

export default Project;
