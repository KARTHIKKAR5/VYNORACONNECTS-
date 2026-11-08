import React from 'react';
import { calculateAvailablePositions } from '../../services/projectsService.js';

export function ProjectCard({
  project,
  onSelect,
  onApply,
  isMember,
  isOwner,
  hasPendingApplication = false,
  isEligibleCampus = true,
}) {
  const availablePositions = calculateAvailablePositions(project);
  const isRecruiting = availablePositions > 0;
  const memberCount = project.team?.members?.length || 1;
  const maxCapacity = project.team?.maxCapacity || 8;

  return (
    <article className="project-card" aria-labelledby={`proj-title-${project.id}`}>
      {/* Card Header: Category & Recruitment Status */}
      <div className="card-top">
        <span className="category-badge">{project.category}</span>
        {isRecruiting ? (
          <span className="recruiting-pill" title={`${availablePositions} position(s) currently open`}>
            <span className="pill-dot active" />
            {availablePositions === 1 ? '1 Opening Available' : `${availablePositions} Openings Available`}
          </span>
        ) : (
          <span className="staffed-pill" title="All positions filled">
            <span className="pill-dot staffed" />
            Fully Staffed
          </span>
        )}
      </div>

      {/* Title & Tagline */}
      <h3 className="card-title" id={`proj-title-${project.id}`}>
        {project.title}
      </h3>
      <p className="card-tagline">{project.tagline}</p>

      {/* Technology Stack Tags */}
      {project.tags && project.tags.length > 0 && (
        <div className="card-tags" aria-label="Technology Stack">
          {project.tags.slice(0, 4).map((tag, idx) => (
            <span key={idx} className="tech-tag">
              #{tag}
            </span>
          ))}
          {project.tags.length > 4 && (
            <span className="tech-tag-more">+{project.tags.length - 4}</span>
          )}
        </div>
      )}

      {/* Footer Info: Lead & Team Capacity */}
      <div className="card-footer">
        <div className="lead-snippet">
          <div className="lead-avatar" aria-hidden="true">
            {project.lead?.avatar || project.lead?.name?.charAt(0) || 'U'}
          </div>
          <div className="lead-text">
            <span className="lead-name">{project.lead?.name}</span>
            <span className="lead-college">{project.lead?.college || 'Vynora Campus'}</span>
          </div>
        </div>

        <div className="capacity-indicator" title={`Team Capacity: ${memberCount} / ${maxCapacity}`}>
          <span className="capacity-count">{memberCount}/{maxCapacity}</span>
          <span className="capacity-label">members</span>
        </div>
      </div>

      {/* Actions */}
      <div className="card-actions">
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={() => onSelect(project)}
        >
          View Details
        </button>

        {isMember ? (
          <span className="member-badge">
            {isOwner ? 'Project Lead' : 'Team Member'}
          </span>
        ) : hasPendingApplication ? (
          <span className="pending-pill" title="Your application is under review">
            Application Pending
          </span>
        ) : !isEligibleCampus ? (
          <span className="restricted-pill" title={`Restricted to students from ${project.lead?.college || 'host campus'}`}>
            Campus Only
          </span>
        ) : isRecruiting ? (
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => onApply(project)}
          >
            Apply to Join
          </button>
        ) : (
          <span className="staffed-text">Positions Filled</span>
        )}
      </div>
    </article>
  );
}

export default ProjectCard;
