import React, { useEffect, useState } from 'react';
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
import { Terminal, Settings, Plus, FolderPlus, Users, Sparkles, FileCode, Clock, Star, LogOut, User, Loader2 } from 'lucide-react';
import ProjectCard from '../components/ProjectCard';
import StatCard from '../components/StatCard';
import AuthService from '@/services/AuthService';
import axios from '@/services/auth-header';
import CreateProjectDialog from './CreateProjectDialog';

const API_URL = import.meta.env.REACT_APP_API_URL || 'http://localhost:8080';

interface Project {
  id: string;
  name: string;
  lastModified: string;
  collaborators: number;
  language: string;
}


const Home = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalProjects, setTotalProjects] = useState(0);

  useEffect(() => {
    fetchProjects();
  }, [page]);

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);

    try {
      const user = AuthService.getCurrentUser();
      
      if (!user || !user.id) {
        navigate('/login');
        return;
      }

      const response = await axios.get(`${API_URL}/projects/`, {
        params: {
          userId: user.id,
          page: page,
          size: 10,
          sortBy: 'updatedAt',
          sortDirection: 'DESC'
        }
      });

      // Map backend response to frontend format
      const mappedProjects = response.data.content.map((project: any) => ({
        id: project.id,
        name: project.name,
        lastModified: formatDate(project.updatedAt),
        collaborators: project.collaborators?.length || 0,
        language: project.language || 'Unknown'
      }));

      setProjects(mappedProjects);
      setTotalPages(response.data.totalPages);
      setTotalProjects(response.data.totalElements);
    } catch (error: any) {
      console.error('Error fetching projects:', error);
      setError('Failed to load projects. Please try again.');
      
      // If unauthorized, redirect to login
      if (error.response?.status === 401) {
        AuthService.logout();
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const handleLogout = () => {
    try {
      AuthService.logout();
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      sessionStorage.clear();
      
      console.log('Logged out successfully');
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/login', { replace: true });
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
            <CreateProjectDialog onProjectCreated={fetchProjects} />
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            <StatCard 
              label="Total Projects" 
              value={totalProjects} 
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
                {loading ? (
                  <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : error ? (
                  <div className="text-center py-20">
                    <p className="text-red-500 mb-4">{error}</p>
                    <Button onClick={fetchProjects} variant="outline">
                      Try Again
                    </Button>
                  </div>
                ) : projects.length === 0 ? (
                  <div className="text-center py-20">
                    <FileCode className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No projects yet</h3>
                    <p className="text-muted-foreground mb-4">Create your first project to get started</p>
                    <CreateProjectDialog 
                      trigger={
                        <Button>
                          <Plus className="w-4 h-4 mr-2" />
                          Create Project
                        </Button>
                      }
                      onProjectCreated={fetchProjects}
                    />
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      {projects.map(project => (
                        <ProjectCard 
                          key={project.id} 
                          project={project}
                          onClick={() => navigate(`/project/${project.id}`)}
                        />
                      ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-center gap-2 mt-6">
                        <Button 
                          variant="outline" 
                          size="sm"
                          disabled={page === 0}
                          onClick={() => setPage(page - 1)}
                        >
                          Previous
                        </Button>
                        <span className="text-sm text-muted-foreground">
                          Page {page + 1} of {totalPages}
                        </span>
                        <Button 
                          variant="outline" 
                          size="sm"
                          disabled={page === totalPages - 1}
                          onClick={() => setPage(page + 1)}
                        >
                          Next
                        </Button>
                      </div>
                    )}
                  </>
                )}
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