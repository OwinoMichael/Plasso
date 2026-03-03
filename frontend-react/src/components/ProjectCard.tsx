import React from 'react';
import { FileCode, Star, Clock, Users, Crown, User } from 'lucide-react';

interface ProjectCardProps {
  project: {
    id: string;
    name: string;
    description?: string;        // New field - project description
    lastModified: string;
    collaborators: number;
    language: string;
    userRole: 'OWNER' | 'COLLABORATOR';  // New field - to show user's role
  };
  onClick: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {

  // Debug: log the actual value
  console.log('Project:', project.name, 'userRole:', project.userRole, 'Type:', typeof project.userRole);
  console.log('role:', (project as any).role); // "OWNER"

    // This will show you EVERY field in the object
  console.log('Full project object:', JSON.stringify(project, null, 2));

  // Or for a more readable console view
  console.log('All project keys:', Object.keys(project));
  console.log('All project values:', Object.values(project));
  return (
    <div 
      className="p-6 rounded-lg border border-border bg-card hover:bg-accent cursor-pointer transition-colors"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <FileCode className="w-5 h-5" />
          <h3 className="font-semibold text-lg">{project.name}</h3>
          {/* Role badge */}
          <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${
            project.userRole === 'OWNER' 
              ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' 
              : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
          }`}>
            {project.userRole === 'OWNER' ? (
              <span className="flex items-center gap-1">
                <Crown className="w-3 h-3" /> Owner
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <User className="w-3 h-3" /> Collaborator
              </span>
            )}
          </span>
        </div>
        <Star className="w-4 h-4 text-muted-foreground hover:text-foreground" />
      </div>

      {/* Description field - if exists */}
      {project.description && (
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {project.description}
        </p>
      )}
      
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
  );
};

export default ProjectCard;

