import React from 'react';
import { FileCode, Clock, Users, Star } from 'lucide-react';

interface ProjectCardProps {
  project: {
    id: string;
    name: string;
    lastModified: string;
    collaborators: number;
    language: string;
  };
  onClick: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  return (
    <div 
      className="p-6 rounded-lg border border-border bg-card hover:bg-accent cursor-pointer transition-colors"
      onClick={onClick}
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
  );
};

export default ProjectCard;

