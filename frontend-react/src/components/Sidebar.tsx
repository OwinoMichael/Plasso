// components/Sidebar.tsx
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileCode, Plus, FolderPlus, Users, ChevronRight, ChevronDown, X, Loader2, Trash2, Star, FolderPlusIcon, FilePlus } from 'lucide-react';
import axios from '../services/auth-header';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

interface FileTreeNode {
  id: string;
  name: string;
  folder: boolean;
  language?: string;
  mainFile?: boolean;
  children: FileTreeNode[];
}

interface SidebarProps {
  projectId: string;
  selectedFile: string | null;
  onFileSelect: (fileId: string, fileName: string) => void;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ projectId, selectedFile, onFileSelect, onClose }) => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [fileTree, setFileTree] = useState<FileTreeNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  const [creatingFileInFolder, setCreatingFileInFolder] = useState<string | null>(null); // folder ID
  const [creatingFolderInFolder, setCreatingFolderInFolder] = useState<string | null>(null);
  const [showCreateFileAtRoot, setShowCreateFileAtRoot] = useState(false);
  const [showCreateFolderAtRoot, setShowCreateFolderAtRoot] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null);
  const [newFolderName, setNewFolderName] = useState('');

  const activeUsers = [
    { name: 'You', color: '#85E4FF', cursor: { line: 15, col: 23 } },
    { name: 'Alice', color: '#00FF88', cursor: { line: 8, col: 12 } },
    { name: 'Bob', color: '#FF6B9D', cursor: { line: 22, col: 5 } }
  ];

  useEffect(() => {
    fetchFileTree();
  }, [projectId]);

  const fetchFileTree = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${API_URL}/projects/${projectId}/files/file-tree`);
      setFileTree(response.data);
      
      // Auto-expand all folders initially
      const allFolderIds = new Set<string>();
      const collectFolderIds = (nodes: FileTreeNode[]) => {
        nodes.forEach(node => {
          if (node.folder) {
            allFolderIds.add(node.id);
            if (node.children) {
              collectFolderIds(node.children);
            }
          }
        });
      };
      collectFolderIds(response.data);
      setExpandedFolders(allFolderIds);
    } catch (error: any) {
      console.error('Error fetching file tree:', error);
      setError('Failed to load project files');
    } finally {
      setLoading(false);
    }
  };

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const getLanguageFromExtension = (filename: string): string => {
    const ext = filename.split('.').pop()?.toLowerCase();
    const map: Record<string, string> = {
      'js': 'javascript',
      'ts': 'typescript',
      'py': 'python',
      'java': 'java',
      'cpp': 'cpp',
      'c': 'c'
    };
    return map[ext || ''] || 'text';
  };

  const handleCreateFile = async (parentId: string | null) => {
    if (!newItemName.trim()) return;

    try {
      await axios.post(`${API_URL}/projects/${projectId}/files/create-file`, {
        name: newItemName.trim(),
        parentId: parentId,
        language: getLanguageFromExtension(newItemName),
        content: ''
      });

      setNewItemName('');
      setCreatingFileInFolder(null);
      setShowCreateFileAtRoot(false);
      fetchFileTree();
    } catch (error: any) {
      console.error('Error creating file:', error);
      alert(error.response?.data?.message || 'Failed to create file');
    }
  };

  const handleCreateFolder = async (parentId: string | null) => {
    if (!newItemName.trim()) return;

    try {
      await axios.post(`${API_URL}/projects/${projectId}/files/create-folder`, {
        name: newItemName.trim(),
        parentId: parentId
      });

      setNewItemName('');
      setCreatingFolderInFolder(null);
      setShowCreateFolderAtRoot(false);
      fetchFileTree();
    } catch (error: any) {
      console.error('Error creating folder:', error);
      alert(error.response?.data?.message || 'Failed to create folder');
    }
  };

  const handleDeleteFile = async (fileId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!confirm('Are you sure you want to delete this file/folder?')) return;

    try {
      await axios.delete(`${API_URL}/projects/${projectId}/files/${fileId}`);
      fetchFileTree();
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  const handleSetMainFile = async (fileId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    try {
      await axios.put(`${API_URL}/projects/${projectId}/files/${fileId}/set-main`);
      fetchFileTree();
    } catch (error) {
      console.error('Error setting main file:', error);
    }
  };

  

  

  const startCreatingFile = (folderId: string | null, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCreatingFileInFolder(folderId);
    setCreatingFolderInFolder(null);
    setShowCreateFileAtRoot(folderId === null);
    setShowCreateFolderAtRoot(false);
    setNewItemName('');
  };

  const startCreatingFolder = (folderId: string | null, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCreatingFolderInFolder(folderId);
    setCreatingFileInFolder(null);
    setShowCreateFolderAtRoot(folderId === null);
    setShowCreateFileAtRoot(false);
    setNewItemName('');
  };

  const cancelCreation = () => {
    setCreatingFileInFolder(null);
    setCreatingFolderInFolder(null);
    setShowCreateFileAtRoot(false);
    setShowCreateFolderAtRoot(false);
    setNewItemName('');
  };

  const renderFileTree = (nodes: FileTreeNode[], level: number = 0): React.ReactNode => {
    return nodes.map(node => {
      const isExpanded = expandedFolders.has(node.id);
      const isCreatingFileHere = creatingFileInFolder === node.id;
      const isCreatingFolderHere = creatingFolderInFolder === node.id;

      if (node.folder) {
        return (
          <div key={node.id}>
            {/* Folder Row */}
            <div
              className="flex items-center gap-1 px-2 py-1 hover:bg-accent cursor-pointer rounded text-sm group"
              style={{ paddingLeft: `${level * 12 + 8}px` }}
            >
              <div className="flex items-center gap-1 flex-1" onClick={() => toggleFolder(node.id)}>
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
                <FolderPlusIcon className="w-4 h-4" />
                <span>{node.name}</span>
              </div>
              
              {/* Folder Actions */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
                <button
                  onClick={(e) => startCreatingFile(node.id, e)}
                  className="p-1 hover:bg-primary/10 rounded"
                  title="New file in folder"
                >
                  <FilePlus className="w-3 h-3" />
                </button>
                <button
                  onClick={(e) => startCreatingFolder(node.id, e)}
                  className="p-1 hover:bg-primary/10 rounded"
                  title="New folder in folder"
                >
                  <FolderPlus className="w-3 h-3" />
                </button>
                <button
                  onClick={(e) => handleDeleteFile(node.id, e)}
                  className="p-1 hover:bg-destructive/10 rounded"
                  title="Delete folder"
                >
                  <Trash2 className="w-3 h-3 text-destructive" />
                </button>
              </div>
            </div>

            {/* Expanded Folder Contents */}
            {isExpanded && (
              <div>
                {/* Show creation input if creating in this folder */}
                {isCreatingFileHere && (
                  <div 
                    className="px-2 py-1 bg-muted/50 rounded mx-2 my-1"
                    style={{ marginLeft: `${(level + 1) * 12 + 8}px` }}
                  >
                    <Input
                      placeholder="filename.js"
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') handleCreateFile(node.id);
                        if (e.key === 'Escape') cancelCreation();
                      }}
                      onBlur={cancelCreation}
                      autoFocus
                      className="h-7 text-xs"
                    />
                  </div>
                )}

                {isCreatingFolderHere && (
                  <div 
                    className="px-2 py-1 bg-muted/50 rounded mx-2 my-1"
                    style={{ marginLeft: `${(level + 1) * 12 + 8}px` }}
                  >
                    <Input
                      placeholder="folder name"
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') handleCreateFolder(node.id);
                        if (e.key === 'Escape') cancelCreation();
                      }}
                      onBlur={cancelCreation}
                      autoFocus
                      className="h-7 text-xs"
                    />
                  </div>
                )}

                {/* Children */}
                {node.children && node.children.length > 0 && renderFileTree(node.children, level + 1)}
              </div>
            )}
          </div>
        );
      }

      // File Row
      return (
        <div
          key={node.id}
          className={`flex items-center gap-2 px-2 py-1 hover:bg-accent cursor-pointer rounded text-sm group ${
            selectedFile === node.id ? 'bg-accent' : ''
          }`}
          style={{ paddingLeft: `${level * 12 + 24}px` }}
        >
          <div className="flex items-center gap-2 flex-1" onClick={() => onFileSelect(node.id, node.name)}>
            <FileCode className="w-4 h-4" />
            <span>{node.name}</span>
          </div>
          
          {/* File Actions */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
            {!node.mainFile && (
              <button
                onClick={(e) => handleSetMainFile(node.id, e)}
                className="p-1 hover:bg-primary/10 rounded"
                title="Set as main file"
              >
                <Star className="w-3 h-3" />
              </button>
            )}
            {node.mainFile && (
              <span className="text-xs text-primary px-1">main</span>
            )}
            <button
              onClick={(e) => handleDeleteFile(node.id, e)}
              className="p-1 hover:bg-destructive/10 rounded"
              title="Delete file"
            >
              <Trash2 className="w-3 h-3 text-destructive" />
            </button>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="w-64 border-r border-border flex flex-col bg-sidebar">
      <div className="p-3 border-b border-sidebar-border flex-1 overflow-auto">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-sidebar-foreground">EXPLORER</h3>
          <div className="flex gap-1">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0"
              onClick={() => startCreatingFile(null)}
              title="New file at root"
            >
              <Plus className="w-3 h-3" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0"
              onClick={() => startCreatingFolder(null)}
              title="New folder at root"
            >
              <FolderPlus className="w-3 h-3" />
            </Button>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={onClose}>
              <X className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Root-level creation inputs */}
        {showCreateFileAtRoot && (
          <div className="mb-2 p-2 bg-muted/50 rounded">
            <Input
              placeholder="filename.js"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') handleCreateFile(null);
                if (e.key === 'Escape') cancelCreation();
              }}
              onBlur={cancelCreation}
              autoFocus
              className="h-7 text-xs"
            />
          </div>
        )}

        {showCreateFolderAtRoot && (
          <div className="mb-2 p-2 bg-muted/50 rounded">
            <Input
              placeholder="folder name"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') handleCreateFolder(null);
                if (e.key === 'Escape') cancelCreation();
              }}
              onBlur={cancelCreation}
              autoFocus
              className="h-7 text-xs"
            />
          </div>
        )}

        {/* File Tree */}
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-sm text-red-500 mb-2">{error}</p>
            <Button variant="outline" size="sm" onClick={fetchFileTree}>
              Retry
            </Button>
          </div>
        ) : fileTree.length === 0 ? (
          <div className="text-center py-8">
            <FileCode className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-xs text-muted-foreground">No files yet</p>
          </div>
        ) : (
          renderFileTree(fileTree)
        )}
      </div>
      
      <div className="p-3 border-t border-sidebar-border">
        <div className="flex items-center gap-2 mb-2">
          <Users className="w-4 h-4" />
          <span className="text-xs font-semibold">ACTIVE USERS</span>
        </div>
        {activeUsers.map((user, idx) => (
          <div key={idx} className="flex items-center gap-2 py-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: user.color }} />
            <span className="text-xs">{user.name}</span>
            <span className="text-xs text-muted-foreground ml-auto">Ln {user.cursor.line}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;