// components/Sidebar.tsx
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileCode, Plus, FolderPlus, Users, ChevronRight, ChevronDown, X, Loader2, Trash2, Star } from 'lucide-react';
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
  const [showCreateFileDialog, setShowCreateFileDialog] = useState(false);
  const [showCreateFolderDialog, setShowCreateFolderDialog] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [newFolderName, setNewFolderName] = useState('');
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null);

  const handleCreateFile = async () => {
    if (!newFileName.trim()) return;

    try {
      await axios.post(`${API_URL}/projects/${projectId}/files/create-file`, {
        name: newFileName,
        parentId: selectedParentId,
        language: getLanguageFromExtension(newFileName),
        content: ''
      });

      setNewFileName('');
      setShowCreateFileDialog(false);
      fetchFileTree(); // Refresh tree
    } catch (error) {
      console.error('Error creating file:', error);
    }
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;

    try {
      await axios.post(`${API_URL}/projects/${projectId}/files/create-folder`, {
        name: newFolderName,
        parentId: selectedParentId
      });

      setNewFolderName('');
      setShowCreateFolderDialog(false);
      fetchFileTree();
    } catch (error) {
      console.error('Error creating folder:', error);
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

  const renderFileTree = (nodes: FileTreeNode[], level: number = 0): React.ReactNode => {
    return nodes.map(node => {
      const isExpanded = expandedFolders.has(node.id);

      if (node.folder) {
        return (
          <div key={node.id}>
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
                <span>{node.name}</span>
              </div>
              <button
                onClick={(e) => handleDeleteFile(node.id, e)}
                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-destructive/10 rounded"
              >
                <Trash2 className="w-3 h-3 text-destructive" />
              </button>
            </div>
            {isExpanded && node.children && node.children.length > 0 && (
              <div>{renderFileTree(node.children, level + 1)}</div>
            )}
          </div>
        );
      }

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
              onClick={() => setShowCreateFileDialog(true)}
            >
              <Plus className="w-3 h-3" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0"
              onClick={() => setShowCreateFolderDialog(true)}
            >
              <FolderPlus className="w-3 h-3" />
            </Button>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={onClose}>
              <X className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Create File Dialog */}
        {showCreateFileDialog && (
          <div className="mb-3 p-2 bg-muted rounded">
            <Input
              placeholder="filename.js"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCreateFile()}
              autoFocus
            />
            <div className="flex gap-2 mt-2">
              <Button size="sm" onClick={handleCreateFile}>Create</Button>
              <Button size="sm" variant="outline" onClick={() => setShowCreateFileDialog(false)}>Cancel</Button>
            </div>
          </div>
        )}

        {/* Create Folder Dialog */}
        {showCreateFolderDialog && (
          <div className="mb-3 p-2 bg-muted rounded">
            <Input
              placeholder="folder name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCreateFolder()}
              autoFocus
            />
            <div className="flex gap-2 mt-2">
              <Button size="sm" onClick={handleCreateFolder}>Create</Button>
              <Button size="sm" variant="outline" onClick={() => setShowCreateFolderDialog(false)}>Cancel</Button>
            </div>
          </div>
        )}

        {/* File Tree */}
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : (
          renderFileTree(fileTree)
        )}
      </div>
      
      {/* Active Users - existing code */}
    </div>
  );
};

export default Sidebar;