import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileCode, Plus, FolderPlus, Users, ChevronRight, ChevronDown, X } from 'lucide-react';

interface SidebarProps {
  selectedFile: string;
  onFileSelect: (file: string) => void;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ selectedFile, onFileSelect, onClose }) => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['root']));

  const fileTree = {
    name: 'root',
    type: 'folder',
    children: [
      {
        name: 'src',
        type: 'folder',
        children: [
          { name: 'main.py', type: 'file' },
          { name: 'utils.py', type: 'file' },
          { name: 'config.json', type: 'file' }
        ]
      },
      {
        name: 'tests',
        type: 'folder',
        children: [
          { name: 'test_main.py', type: 'file' }
        ]
      },
      { name: 'README.md', type: 'file' }
    ]
  };

  const activeUsers = [
    { name: 'You', color: '#85E4FF', cursor: { line: 15, col: 23 } },
    { name: 'Alice', color: '#00FF88', cursor: { line: 8, col: 12 } },
    { name: 'Bob', color: '#FF6B9D', cursor: { line: 22, col: 5 } }
  ];

  const toggleFolder = (path: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedFolders(newExpanded);
  };

  const renderFileTree = (node: any, path: string = '', level: number = 0) => {
    const currentPath = path ? `${path}/${node.name}` : node.name;
    const isExpanded = expandedFolders.has(currentPath);

    if (node.type === 'folder') {
      return (
        <div key={currentPath}>
          <div
            className="flex items-center gap-1 px-2 py-1 hover:bg-accent cursor-pointer rounded text-sm"
            style={{ paddingLeft: `${level * 12 + 8}px` }}
            onClick={() => toggleFolder(currentPath)}
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
            <span>{node.name}</span>
          </div>
          {isExpanded && node.children && (
            <div>
              {node.children.map((child: any) => renderFileTree(child, currentPath, level + 1))}
            </div>
          )}
        </div>
      );
    }

    return (
      <div
        key={currentPath}
        className={`flex items-center gap-2 px-2 py-1 hover:bg-accent cursor-pointer rounded text-sm ${
          selectedFile === node.name ? 'bg-accent' : ''
        }`}
        style={{ paddingLeft: `${level * 12 + 24}px` }}
        onClick={() => onFileSelect(node.name)}
      >
        <FileCode className="w-4 h-4" />
        <span>{node.name}</span>
      </div>
    );
  };

  return (
    <div className="w-64 border-r border-border flex flex-col bg-sidebar">
      <div className="p-3 border-b border-sidebar-border">
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
        {renderFileTree(fileTree)}
      </div>
      
      <div className="p-3 border-t border-sidebar-border mt-auto">
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
