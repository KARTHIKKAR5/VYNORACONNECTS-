import React from 'react';

// Reusable ProjectCard sub-component accepting props
function ProjectCard({ title, description, technologies, teamStatus }) {
  return (
    <div className="preview-card project-card">
      <div className="preview-card-top">
        <h4 className="preview-card-title">{title}</h4>
        <span className="badge badge-project">{teamStatus}</span>
      </div>

      <p className="preview-card-desc">{description}</p>

      {technologies && technologies.length > 0 && (
        <div className="tech-tags-list">
          {technologies.map((tech) => (
            <span key={tech} className="tech-tag">
              #{tech}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function ProjectPreview({ projects }) {
  // Realistic campus projects
  const defaultProjects = [
    {
      id: 'proj-1',
      title: 'Vynora Campus Assistant',
      description: 'An AI-powered timetable scheduler and campus navigation mobile app.',
      technologies: ['React', 'Node.js', 'PostgreSQL', 'Tailwind'],
      teamStatus: 'Looking for 1 Dev'
    },
    {
      id: 'proj-2',
      title: 'Decentralized Peer Study Hub',
      description: 'Web3 verified course note-sharing network with tokenized contributor karma.',
      technologies: ['Solidity', 'React', 'IPFS', 'Ethers.js'],
      teamStatus: 'Team Full'
    }
  ];

  const projectList = projects !== undefined ? projects : defaultProjects;

  return (
    <section className="preview-section">
      <div className="section-header">
        <h3 className="section-main-heading">Recent Projects</h3>
        <span className="section-badge">{projectList.length} active</span>
      </div>

      {projectList.length === 0 ? (
        <div className="empty-state-card">
          <span className="empty-state-icon">📂</span>
          <p className="empty-state-text">No active projects to display.</p>
          <span className="empty-state-sub">Start a project or join a peer team from the Quick Actions!</span>
        </div>
      ) : (
        <div className="preview-grid">
          {projectList.map((project) => (
            <ProjectCard
              key={project.id}
              title={project.title}
              description={project.description}
              technologies={project.technologies}
              teamStatus={project.teamStatus}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default ProjectPreview;
