
import React from 'react';
import { Download, CheckCircle2 } from 'lucide-react';
import { Project } from '../types';

interface ProjectCardProps {
  project: Project;
  onClick: (project: Project) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  return (
    <div 
      className="group glass rounded-xl overflow-hidden cursor-pointer hover:border-white/20 transition-all duration-300 relative"
      onClick={() => onClick(project)}
    >
      <div className="relative aspect-square overflow-hidden bg-slate-900">
        <img 
          src={project.coverImage} 
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        <div className="absolute top-2 left-2">
          <span className="px-1.5 py-0.5 rounded bg-slate-900/80 backdrop-blur-md text-[8px] font-bold uppercase tracking-wider text-sky-400 border border-sky-500/30">
            {project.category}
          </span>
        </div>

        {project.isVerified && (
          <div className="absolute top-2 right-2 bg-emerald-500 rounded-full p-0.5 shadow-lg">
            <CheckCircle2 className="w-2.5 h-2.5 text-white" />
          </div>
        )}
      </div>
      
      <div className="p-2.5">
        <h3 className="text-xs sm:text-sm font-bold text-white line-clamp-1 group-hover:text-sky-400 transition-colors">
          {project.title}
        </h3>
        
        <div className="mt-2 flex items-center justify-between gap-1">
          <div className="flex items-center gap-1.5 min-w-0">
            <img src={project.developer.avatar} className="w-4 h-4 rounded-full border border-white/10 shrink-0" alt="" />
            <span className="text-[10px] text-slate-500 truncate font-medium">
              {project.developer.name}
            </span>
          </div>
          <span className="text-[9px] text-slate-600 font-mono shrink-0">{project.fileSize}</span>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
