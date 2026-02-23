// components/Sidebar.tsx
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { FileCode, Plus, FolderPlus, Users, ChevronRight, ChevronDown, X, Loader2 } from 'lucide-react';
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
              className="flex items-center gap-1 px-2 py-1 hover:bg-accent cursor-pointer rounded text-sm"
              style={{ paddingLeft: `${level * 12 + 8}px` }}
              onClick={() => toggleFolder(node.id)}
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
              <span>{node.name}</span>
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
          className={`flex items-center gap-2 px-2 py-1 hover:bg-accent cursor-pointer rounded text-sm ${
            selectedFile === node.id ? 'bg-accent' : ''
          }`}
          style={{ paddingLeft: `${level * 12 + 24}px` }}
          onClick={() => onFileSelect(node.id, node.name)}
        >
          <FileCode className="w-4 h-4" />
          <span>{node.name}</span>
          {node.mainFile && (
            <span className="ml-auto text-xs text-primary">main</span>
          )}
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
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <Plus className="w-3 h-3" />
            </Button>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <FolderPlus className="w-3 h-3" />
            </Button>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={onClose}>
              <X className="w-3 h-3" />
            </Button>
          </div>
        </div>

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