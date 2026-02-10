import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Terminal, Settings, Plus, FolderPlus, Users, Sparkles, FileCode, Clock, Star, LogOut, User } from 'lucide-react';
import ProjectCard from '../components/ProjectCard';
import StatCard from '../components/StatCard';
import AuthService from '@/services/AuthService';

const Home = () => {
  const navigate = useNavigate();

  const projects = [
    { id: '1', name: 'React Dashboard', lastModified: '2 hours ago', collaborators: 3, language: 'TypeScript' },
    { id: '2', name: 'Python API', lastModified: '1 day ago', collaborators: 2, language: 'Python' },
    { id: '3', name: 'ML Model Training', lastModified: '3 days ago', collaborators: 1, language: 'Python' },
    { id: '4', name: 'Node Backend', lastModified: '5 days ago', collaborators: 4, language: 'JavaScript' }
  ];

  const handleLogout = () => {
    try {
      // Call AuthService logout to clear tokens/user data
      AuthService.logout();
      
      // Clear any additional local storage items if needed
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      sessionStorage.clear(); // Optional: clear session storage
      
      // Clear any application state if using context/Redux
      // Example: clearUserContext(); 
      
      // Show logout message (optional)
      console.log('Logged out successfully');
      
      // Redirect to login page with replace to prevent going back
      navigate('/login', { replace: true });
      
      // Optional: Show success toast/notification
      // toast.success('Logged out successfully');
      
    } catch (error) {
      console.error('Logout error:', error);
      
      // Still redirect to login even if logout fails
      navigate('/login', { replace: true });
      
      // Optional: Show error toast
      // toast.error('Error during logout');
    }
  };

  return (
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
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-semibold cursor-pointer hover:opacity-80 transition-opacity">
                U
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
            <Button className="gap-2" onClick={() => navigate('/project/new')}>
              <Plus className="w-4 h-4" />
              New Project
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            <StatCard 
              label="Total Projects" 
              value={projects.length} 
              icon={<FolderPlus className="w-4 h-4 text-muted-foreground" />} 
            />
            <StatCard 
              label="Active Collaborators" 
              value={8} 
              icon={<Users className="w-4 h-4 text-muted-foreground" />} 
            />
            <StatCard 
              label="Code Reviews" 
              value={23} 
              icon={<Sparkles className="w-4 h-4 text-muted-foreground" />} 
            />
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
                    <ProjectCard 
                      key={project.id} 
                      project={project}
                      onClick={() => navigate(`/project/${project.id}`)}
                    />
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
};

export default Home;