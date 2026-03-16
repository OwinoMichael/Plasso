import AIPanel from "@/components/AIPanel";
import Console from "@/components/Console";
import Editor from "@/components/Editor";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import axios from "@/services/auth-header";
import type { OpenFile } from "@/types/editor";
import authService  from '../services/AuthService'

import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';


const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:8080/ws';

interface ActiveUser {
  userId: string;
  username: string;
  color: string;
  fileId: string;
  cursor?: { line: number; column: number };
}

const USER_COLORS = ['#85E4FF', '#00FF88', '#FF6B9D', '#FFD700', '#FF8C42'];

// pages/Project.tsx
const Project = () => {

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const user = authService.getCurrentUser(); // your existing auth

  const stompClient = useRef<Client | null>(null);

  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string>('');
  const [showSidebar, setShowSidebar] = useState(true);
  const [showAIPanel, setShowAIPanel] = useState(true);
  const [showConsole, setShowConsole] = useState(true);
  const [openFiles, setOpenFiles] = useState<OpenFile[]>([]);
  const [activeFileId, setActiveFileId] = useState<string | null>(null);
  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);
  const [isAddingCollaborator, setIsAddingCollaborator] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  const userStr = localStorage.getItem('user');
  const token = userStr ? JSON.parse(userStr).token : null;

  // ── Connect STOMP on mount ──────────────────────────────────────────
useEffect(() => {
  if (!id || !user?.id) return;

  const client = new Client({
    webSocketFactory: () => new SockJS(WS_URL),
    reconnectDelay: 3000,
    connectHeaders: {
      Authorization: `Bearer ${token}`,
    },
    onConnect: () => {
      stompClient.current = client;
      console.log('WS connected');
    },
    onStompError: (frame) => {
      console.error('STOMP error:', frame.headers['message'], frame.body);
    },
    onDisconnect: () => console.log('WS disconnected'),
  });

  client.activate();
  stompClient.current = client;

  return () => {
    if (activeFileId && stompClient.current?.connected) {
      stompClient.current.publish({
        destination: '/app/file.leave',
        body: JSON.stringify({ fileId: activeFileId, projectId: id, userId: user.id }),
      });
    }
    client.deactivate();
  };
}, [id]);

// ── Join file: subscribe to edits + presence ────────────────────────
const joinFile = (fileId: string) => {
  const client = stompClient.current;
  if (!client?.connected || !id || !user?.id) return;

  if (activeFileId && activeFileId !== fileId) {
    client.publish({
      destination: '/app/file.leave',
      body: JSON.stringify({ fileId: activeFileId, projectId: id, userId: user.id }),
    });
  }

  client.subscribe(
    `/topic/project/${id}/file/${fileId}/edits`,
    (msg) => {
      const edit = JSON.parse(msg.body);
      if (edit.editorUserId === user.id) return;

      setOpenFiles(prev =>
        prev.map(f =>
          f.id === fileId ? { ...f, content: edit.content, isDirty: false } : f
        )
      );
    }
  );

  client.subscribe(
    `/topic/project/${id}/file/${fileId}/presence`,
    (msg) => {
      const presence = JSON.parse(msg.body);
      // presence.viewers is now List<ViewerInfo> with {userId, username}
      setActiveUsers(
        presence.viewers.map((viewer: { userId: string; username: string }, i: number) => ({
          userId: viewer.userId,
          username: viewer.userId === user.id ? 'You' : viewer.username,
          color: USER_COLORS[i % USER_COLORS.length],
          fileId,
        }))
      );
    }
  );

  client.subscribe(
    `/topic/project/${id}/file/${fileId}/cursors`,
    (msg) => {
      const cursor = JSON.parse(msg.body);
      if (cursor.userId === user.id) return;

      setActiveUsers(prev => {
        const exists = prev.find(u => u.userId === cursor.userId);

        if (exists) {
          // Update existing user's cursor
          return prev.map(u =>
            u.userId === cursor.userId
              ? { ...u, cursor: { line: cursor.line, column: cursor.column } }
              : u
          );
        } else {
          // User not in list yet — add them with cursor
          return [...prev, {
            userId: cursor.userId,
            username: cursor.username,
            color: USER_COLORS[prev.length % USER_COLORS.length],
            fileId,
            cursor: { line: cursor.line, column: cursor.column },
          }];
        }
      });
    }
  );

  client.publish({
    destination: '/app/file.join',
    body: JSON.stringify({
      fileId,
      projectId: id,
      userId: user.id,
      username: user.username,
    }),
  });
};

// ── Send edit via WS ────────────────────────────────────────────────
const sendEdit = (fileId: string, content: string) => {
  const client = stompClient.current;
  if (!client?.connected || !id || !user?.id) return;

  client.publish({
    destination: '/app/file.edit',
    body: JSON.stringify({
      fileId,
      projectId: id,
      userId: user.id,
      content,
      timestamp: Date.now(),
    }),
  });
};

// ── File select: load content + join WS file session ───────────────
const handleFileSelect = async (fileId: string, fileName: string) => {
  const existing = openFiles.find(f => f.id === fileId);
  if (existing) {
    setActiveFileId(fileId);
    joinFile(fileId);
    return;
  }

  try {
    const res = await axios.get(`${API_URL}/projects/${id}/files/${fileId}`);
    const file = res.data;

    setOpenFiles(prev => [...prev, {
      id: fileId,
      name: fileName,
      content: file.content,
      language: file.language || 'text',
      isDirty: false,
    }]);
    setActiveFileId(fileId);
    joinFile(fileId);
  } catch (err) {
    console.error('Failed loading file', err);
  }
};

const sendCursor = (fileId: string, line: number, column: number) => {
  const client = stompClient.current;
  if (!client?.connected || !id || !user?.id) return;

  client.publish({
    destination: '/app/file.cursor',
    body: JSON.stringify({
      fileId,
      projectId: id,
      userId: user.id,
      username: user.username,
      line,
      column,
    }),
  });
};

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
      
      toast.error(errorMessage);
      
      // Re-throw so the dialog knows it failed
      throw error;
    } finally {
      setIsAddingCollaborator(false);
    }
  };

  const handleRunProject = async () => {
    setIsRunning(true);
    setShowConsole(true);
    try {
      await runProject(id!, 'project'); // implement later
    } finally {
      setIsRunning(false);
    }
  };

  const handleRunFile = async () => {
    if (!activeFileId) return;
    setIsRunning(true);
    setShowConsole(true);
    try {
      await runProject(id!, 'file', activeFileId); // implement later
    } finally {
      setIsRunning(false);
    }
  };

//   const handleFileSelect = async (fileId: string, fileName: string) => {

//   // const newFile: OpenFile = {
//   //   id: fileId,
//   //   name: fileName,
//   //   content: file.content,
//   //   language: file.language || "text",
//   //   isDirty: false
//   // };

//   // If already open → just activate tab
//   const existing = openFiles.find(f => f.id === fileId);
//   if (existing) {
//     setActiveFileId(fileId);
//     return;
//   }

//   try {
//     const res = await axios.get(
//       `${API_URL}/projects/${id}/files/${fileId}`
//     );

//     const file = res.data;

//     const newFile: OpenFile = {
//       id: fileId,
//       name: fileName,
//       content: file.content,
//       language: file.language || "text",
//       isDirty: false
//     };

//     setOpenFiles(prev => [...prev, newFile]);
//     setActiveFileId(fileId);

//   } catch (err) {
//     console.error("Failed loading file", err);
//   }
// };

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
        onAddCollaborator={handleAddCollaborator}
        onRunFile={handleRunFile}
        onRunProject={handleRunProject}
        isRunning={isRunning}
        activeFileName={openFiles.find(f => f.id === activeFileId)?.name}
      />

      <div className="flex-1 flex overflow-hidden">
        {showSidebar && id && (
          <Sidebar 
            projectId={id}
            selectedFile={selectedFileId}
            onFileSelect={handleFileSelect}
            onClose={() => setShowSidebar(false)}
            activeUsers={activeUsers} 
          />
        )}

        <div className="flex-1 flex flex-col">
          <div className="flex-1 flex">
            <Editor
              openFiles={openFiles}
              setOpenFiles={setOpenFiles}
              activeFileId={activeFileId}
              setActiveFileId={setActiveFileId}
              onEdit={sendEdit} // ← WS edit sender
              onCursorChange={sendCursor}
              currentUserId={user?.id ?? ''}
              activeUsers={activeUsers}
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