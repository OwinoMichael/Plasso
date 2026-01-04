import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Play, 
  Users, 
  MessageSquare, 
  FileCode, 
  Settings, 
  ChevronRight,
  ChevronDown,
  Sparkles,
  Terminal,
  Plus,
  FolderPlus,
  Upload,
  Download,
  Share2,
  Home,
  Clock,
  Star
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const CodeCollabUI = () => {
  const [currentView, setCurrentView] = useState<'dashboard' | 'editor'>('dashboard');
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['root']));
  const [selectedFile, setSelectedFile] = useState('main.py');
  const [showAIPanel, setShowAIPanel] = useState(true);

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

  const projects = [
    { id: 1, name: 'React Dashboard', lastModified: '2 hours ago', collaborators: 3, language: 'TypeScript' },
    { id: 2, name: 'Python API', lastModified: '1 day ago', collaborators: 2, language: 'Python' },
    { id: 3, name: 'ML Model Training', lastModified: '3 days ago', collaborators: 1, language: 'Python' },
    { id: 4, name: 'Node Backend', lastModified: '5 days ago', collaborators: 4, language: 'JavaScript' }
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
        onClick={() => setSelectedFile(node.name)}
      >
        <FileCode className="w-4 h-4" />
        <span>{node.name}</span>
      </div>
    );
  };

  const activeUsers = [
    { name: 'You', color: '#85E4FF', cursor: { line: 15, col: 23 } },
    { name: 'Alice', color: '#00FF88', cursor: { line: 8, col: 12 } },
    { name: 'Bob', color: '#FF6B9D', cursor: { line: 22, col: 5 } }
  ];

  // Dashboard View
  const DashboardView = () => (
    <div className="h-screen flex flex-col bg-background">
      {/* Top Nav */}
      <div className="h-16 border-b border-border flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <Terminal className="w-7 h-7 text-primary" />
          <span className="text-2xl font-bold">CodeSync</span>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4" />
          </Button>
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-semibold">
            U
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-6 space-y-6">
          {/* Header Actions */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Your Projects</h1>
              <p className="text-muted-foreground">Collaborate in real-time with your team</p>
            </div>
            <Button className="gap-2" onClick={() => setCurrentView('editor')}>
              <Plus className="w-4 h-4" />
              New Project
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-6 rounded-lg border border-border bg-card">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Total Projects</span>
                <FolderPlus className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="text-3xl font-bold">{projects.length}</div>
            </div>
            <div className="p-6 rounded-lg border border-border bg-card">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Active Collaborators</span>
                <Users className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="text-3xl font-bold">8</div>
            </div>
            <div className="p-6 rounded-lg border border-border bg-card">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Code Reviews</span>
                <Sparkles className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="text-3xl font-bold">23</div>
            </div>
          </div>

          {/* Projects List */}
          <div>
            <Tabs defaultValue="all" className="w-full">
              <TabsList>
                <TabsTrigger value="all">All Projects</TabsTrigger>
                <TabsTrigger value="recent">Recent</TabsTrigger>
                <TabsTrigger value="starred">Starred</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="mt-4">
                <div className="grid grid-cols-2 gap-4">
                  {projects.map(project => (
                    <div 
                      key={project.id}
                      className="p-6 rounded-lg border border-border bg-card hover:bg-accent cursor-pointer transition-colors"
                      onClick={() => setCurrentView('editor')}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <FileCode className="w-5 h-5" />
                          <h3 className="font-semibold text-lg">{project.name}</h3>
                        </div>
                        <Star className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {project.lastModified}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {project.collaborators}
                        </div>
                        <div className="px-2 py-0.5 rounded bg-primary/10 text-primary text-xs">
                          {project.language}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="recent" className="mt-4">
                <p className="text-muted-foreground text-center py-8">Recent projects will appear here</p>
              </TabsContent>
              
              <TabsContent value="starred" className="mt-4">
                <p className="text-muted-foreground text-center py-8">Starred projects will appear here</p>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );

  // Editor View
  const EditorView = () => (
    <div className="h-screen flex flex-col bg-background">
      {/* Top Navigation Bar */}
      <div className="h-14 border-b border-border flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setCurrentView('dashboard')}
          >
            <Home className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-2">
            <Terminal className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold">CodeSync</span>
          </div>
          <span className="text-sm text-muted-foreground">Project: React Dashboard</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <Upload className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Download className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Share2 className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setShowAIPanel(!showAIPanel)}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            AI Review
          </Button>
          <Button variant="default" size="sm">
            <Play className="w-4 h-4 mr-2" />
            Run Code
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - File Explorer */}
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
              </div>
            </div>
            {renderFileTree(fileTree)}
          </div>
          
          {/* Active Users */}
          <div className="p-3 border-t border-sidebar-border mt-auto">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4" />
              <span className="text-xs font-semibold">ACTIVE USERS</span>
            </div>
            {activeUsers.map((user, idx) => (
              <div key={idx} className="flex items-center gap-2 py-1">
                <div 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: user.color }}
                />
                <span className="text-xs">{user.name}</span>
                <span className="text-xs text-muted-foreground ml-auto">
                  Ln {user.cursor.line}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Code Editor Area */}
        <div className="flex-1 flex flex-col">
          {/* Tab Bar */}
          <div className="h-10 border-b border-border flex items-center px-2 bg-muted/30">
            <div className="px-3 py-1 rounded-t text-sm flex items-center gap-2 bg-background">
              <FileCode className="w-3 h-3" />
              {selectedFile}
            </div>
          </div>

          {/* Editor Content */}
          <div className="flex-1 flex">
            <div className="flex-1 p-4 font-mono text-sm overflow-auto bg-background">
              <div className="space-y-1">
                <div><span className="text-primary">import</span> <span className="text-chart-2">React</span> <span className="text-primary">from</span> <span className="text-chart-1">'react'</span>;</div>
                <div><span className="text-primary">import</span> {'{ useState }'} <span className="text-primary">from</span> <span className="text-chart-1">'react'</span>;</div>
                <div className="h-4"></div>
                <div><span className="text-primary">const</span> <span className="text-chart-2">App</span> = () {'=> {'}</div>
                <div className="pl-4"><span className="text-primary">const</span> [count, setCount] = <span className="text-chart-2">useState</span>(<span className="text-chart-1">0</span>);</div>
                <div className="h-4"></div>
                <div className="pl-4"><span className="text-primary">return</span> (</div>
                <div className="pl-8">{'<'}<span className="text-chart-2">div</span> <span className="text-primary">className</span>=<span className="text-chart-1">"container"</span>{'>'}</div>
                <div className="pl-12">{'<'}<span className="text-chart-2">h1</span>{'>'}Counter: {'{count}'}<span>{'</'}</span><span className="text-chart-2">h1</span>{'>'}</div>
                <div className="pl-12 relative">
                  {'<'}<span className="text-chart-2">button</span> <span className="text-primary">onClick</span>={'{() => setCount(count + 1)}'}{'>'}
                  <div className="absolute -left-2 w-0.5 h-5 bg-chart-2" title="Alice's cursor"></div>
                </div>
                <div className="pl-16">Increment</div>
                <div className="pl-12">{'</'}<span className="text-chart-2">button</span>{'>'}</div>
                <div className="pl-8">{'</'}<span className="text-chart-2">div</span>{'>'}</div>
                <div className="pl-4">);</div>
                <div>{'}'};</div>
                <div className="h-4"></div>
                <div><span className="text-primary">export default</span> App;</div>
              </div>
            </div>

            {/* AI Review Panel */}
            {showAIPanel && (
              <div className="w-80 border-l border-border flex flex-col bg-card">
                <div className="p-3 border-b border-border">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    <h3 className="text-sm font-semibold">AI CODE REVIEW</h3>
                  </div>
                </div>
                
                <div className="flex-1 overflow-auto p-3 space-y-3">
                  <div className="p-3 rounded bg-muted">
                    <div className="flex items-start gap-2 mb-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-1.5"></div>
                      <div className="flex-1">
                        <div className="text-xs font-semibold text-yellow-600 dark:text-yellow-400 mb-1">Warning</div>
                        <div className="text-xs text-muted-foreground">
                          Consider adding PropTypes validation for the component
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">Line 4</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded bg-muted">
                    <div className="flex items-start gap-2 mb-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5"></div>
                      <div className="flex-1">
                        <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">Suggestion</div>
                        <div className="text-xs text-muted-foreground">
                          Use useCallback to memoize the increment handler
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">Line 9</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded bg-muted">
                    <div className="flex items-start gap-2 mb-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5"></div>
                      <div className="flex-1">
                        <div className="text-xs font-semibold text-green-600 dark:text-green-400 mb-1">Good Practice</div>
                        <div className="text-xs text-muted-foreground">
                          Clean component structure and naming conventions
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-3 border-t border-border">
                  <Button className="w-full text-sm">
                    <Sparkles className="w-3 h-3 mr-2" />
                    Run Full Analysis
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Output Console */}
          <div className="h-48 border-t border-border bg-muted/30">
            <div className="flex items-center gap-4 px-3 py-2 border-b border-border">
              <button className="text-xs font-semibold">OUTPUT</button>
              <button className="text-xs text-muted-foreground hover:text-foreground">TERMINAL</button>
              <button className="text-xs text-muted-foreground hover:text-foreground">PROBLEMS</button>
            </div>
            <div className="p-3 font-mono text-xs text-muted-foreground">
              <div>$ npm run dev</div>
              <div className="text-green-500 mt-1">✓ Compiled successfully</div>
              <div className="mt-1">Local: http://localhost:3000</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return currentView === 'dashboard' ? <DashboardView /> : <EditorView />;
};

export default CodeCollabUI;