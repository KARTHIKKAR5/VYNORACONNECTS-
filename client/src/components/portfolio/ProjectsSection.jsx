import React from 'react';

export function ProjectsSection({ projects }) {
  if (!projects || projects.length === 0) {
    return (
      <div className="card">
        <div className="empty-state-card">
          <span className="empty-state-icon">📁</span>
          <p className="empty-state-text">No projects added yet.</p>
          <span className="empty-state-sub">Projects added will appear here.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="card projects-section-card">
      <div className="card-header">
        <div>
          <h3 className="card-title">Featured Projects</h3>
          <p className="card-subtitle">Showcase of campus and software development projects</p>
        </div>
        <span className="badge badge-primary">{projects.length} Projects</span>
      </div>

      <div className="projects-grid">
        {projects.map((project) => (
          <div key={project.id || project.title} className="project-card">
            <div className="project-card-top">
              <span className={`status-pill ${project.status?.toLowerCase().includes('active') ? 'status-active' : 'status-complete'}`}>
                {project.status || 'Active'}
              </span>
              <span className="student-role-tag">Role: {project.role}</span>
            </div>

            <h4 className="project-title">{project.title}</h4>
            <p className="project-desc">{project.description}</p>

            <div className="project-tech-tags">
              {project.technologies?.map((tech) => (
                <span key={tech} className="tech-tag">
                  {tech}
                </span>
              ))}
            </div>

            <div className="project-links-row">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-link-btn"
                  title="View GitHub Repository"
                >
                  <span>🐙</span> Source Code
                </a>
              )}
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-link-btn primary"
                  title="Open Live Demonstration"
                >
                  <span>🚀</span> Live Demo
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProjectsSection;
