import React from 'react';
import { Users, ArrowRight, Code } from 'lucide-react';

export function CollaborationProjectsSection({ projects = [], onViewAll, onSelectProject }) {
  return (
    <div className="dashboard-card projects-widget-card">
      <div className="card-header-row">
        <div>
          <h3 className="card-title">Projects Seeking Collaborators</h3>
          <p className="card-subtitle">Cross-campus tech initiatives looking for team members</p>
        </div>
        <button
          type="button"
          className="link-btn"
          onClick={onViewAll}
        >
          <span>Explore All</span>
          <ArrowRight size={14} />
        </button>
      </div>

      <div className="projects-card-list">
        {projects.length === 0 ? (
          <p className="empty-hint">No active recruitment posts found.</p>
        ) : (
          projects.map((project) => (
            <div key={project.id} className="project-list-item" id={`project-item-${project.id}`}>
              <div className="project-header-row">
                <div className="project-title-wrapper">
                  <h4 className="project-title">{project.title}</h4>
                  <div className="project-creator-line">
                    <span>By {project.creator?.name}</span>
                    <span className="dot-separator">•</span>
                    <span className="creator-college">{project.creator?.college}</span>
                  </div>
                </div>

                <span className={`status-badge ${project.recruitmentStatus === 'open' ? 'badge-success' : 'badge-neutral'}`}>
                  {project.recruitmentStatus === 'open' ? 'Recruiting' : 'Filled'}
                </span>
              </div>

              <p className="project-desc">{project.description}</p>

              <div className="project-footer-row">
                <div className="tech-tags-list">
                  {project.technologies?.slice(0, 3).map((tech) => (
                    <span key={tech} className="tech-tag">
                      <Code size={11} />
                      {tech}
                    </span>
                  ))}
                  {project.technologies?.length > 3 && (
                    <span className="tech-tag-overflow">
                      +{project.technologies.length - 3}
                    </span>
                  )}
                </div>

                <div className="project-action-group">
                  <span className="team-size-indicator">
                    <Users size={12} />
                    {project.teamSize}
                  </span>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline"
                    onClick={() => onSelectProject(project)}
                  >
                    View Project
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
