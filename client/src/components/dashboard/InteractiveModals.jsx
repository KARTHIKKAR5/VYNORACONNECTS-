import React, { useState } from 'react';
import {
  X,
  Calendar,
  MapPin,
  Users,
  Check,
  Send,
  Code,
  Compass,
} from 'lucide-react';

export function EventDetailModal({ event, onClose }) {
  const [registered, setRegistered] = useState(false);

  if (!event) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <span className="modal-badge">{event.type}</span>
            <h3 className="modal-title">{event.title}</h3>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <div className="modal-meta-grid">
            <div className="modal-meta-card">
              <Calendar size={16} />
              <div>
                <span className="meta-label">Date & Time</span>
                <span className="meta-value">{event.formattedDate || new Date(event.date).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="modal-meta-card">
              <MapPin size={16} />
              <div>
                <span className="meta-label">Location / Stream</span>
                <span className="meta-value">{event.location}</span>
              </div>
            </div>
            <div className="modal-meta-card">
              <Users size={16} />
              <div>
                <span className="meta-label">Host Organization</span>
                <span className="meta-value">{event.organizer || event.club}</span>
              </div>
            </div>
          </div>

          <p className="modal-description">
            Join cross-campus peers for an immersive hands-on session. Network with organizers, participate in live workshops, and compete for community recognition.
          </p>

          {registered && (
            <div className="alert-box alert-success">
              <Check size={16} />
              <span>You have successfully registered! Pass added to your campus calendar.</span>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-outline" onClick={onClose}>
            Close
          </button>
          <button
            type="button"
            className={`btn ${registered ? 'btn-connected' : 'btn-primary'}`}
            onClick={() => setRegistered(!registered)}
          >
            {registered ? (
              <>
                <Check size={16} />
                <span>Pass Confirmed</span>
              </>
            ) : (
              <span>Register Now (Free)</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export function ProjectDetailModal({ project, onClose }) {
  const [requestSent, setRequestSent] = useState(false);
  const [selectedRole, setSelectedRole] = useState(project?.openRoles?.[0] || 'Contributor');

  if (!project) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <span className="modal-badge">{project.recruitmentStatus === 'open' ? 'Recruiting' : 'Closed'}</span>
            <h3 className="modal-title">{project.title}</h3>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <div className="creator-profile-box">
            {project.creator?.avatar && (
              <img src={project.creator.avatar} alt={project.creator.name} className="creator-avatar" />
            )}
            <div>
              <div className="creator-name">Led by {project.creator?.name}</div>
              <div className="creator-campus">{project.creator?.college}</div>
            </div>
          </div>

          <p className="modal-description">{project.description}</p>

          <div className="tech-stack-section">
            <span className="section-label">Technologies Used:</span>
            <div className="tech-tags-list">
              {project.technologies?.map((tech) => (
                <span key={tech} className="tech-tag">
                  <Code size={12} />
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {project.openRoles?.length > 0 && (
            <div className="role-selection-box">
              <span className="section-label">Select Open Role to Apply:</span>
              <div className="role-pills">
                {project.openRoles.map((role) => (
                  <button
                    key={role}
                    type="button"
                    className={`role-pill ${selectedRole === role ? 'active' : ''}`}
                    onClick={() => setSelectedRole(role)}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>
          )}

          {requestSent && (
            <div className="alert-box alert-success">
              <Check size={16} />
              <span>Application sent to {project.creator?.name}! They will review your GitHub & profile.</span>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-outline" onClick={onClose}>
            Close
          </button>
          <button
            type="button"
            className={`btn ${requestSent ? 'btn-connected' : 'btn-primary'}`}
            onClick={() => setRequestSent(!requestSent)}
          >
            {requestSent ? (
              <>
                <Check size={16} />
                <span>Request Submitted</span>
              </>
            ) : (
              <>
                <Send size={15} />
                <span>Join Team as {selectedRole}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export function MentorDetailModal({ mentor, onClose }) {
  const [requested, setRequested] = useState(false);

  if (!mentor) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <span className="modal-badge">Verified Mentor</span>
            <h3 className="modal-title">{mentor.name}</h3>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <div className="creator-profile-box">
            {mentor.avatar && <img src={mentor.avatar} alt={mentor.name} className="creator-avatar" />}
            <div>
              <div className="creator-name">{mentor.title || mentor.name}</div>
              <div className="creator-campus">{mentor.collegeOrCompany}</div>
            </div>
          </div>

          <div className="modal-meta-card" style={{ marginTop: '16px' }}>
            <Calendar size={16} />
            <div>
              <span className="meta-label">Office Hours & Slots</span>
              <span className="meta-value">{mentor.availability}</span>
            </div>
          </div>

          <div className="tech-stack-section" style={{ marginTop: '16px' }}>
            <span className="section-label">Mentorship Topics:</span>
            <div className="tech-tags-list">
              {mentor.expertise?.map((exp) => (
                <span key={exp} className="expertise-badge">
                  {exp}
                </span>
              ))}
            </div>
          </div>

          {requested && (
            <div className="alert-box alert-success" style={{ marginTop: '16px' }}>
              <Check size={16} />
              <span>Mentorship session requested! A calendar invite will be dispatched.</span>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-outline" onClick={onClose}>
            Close
          </button>
          <button
            type="button"
            className={`btn ${requested ? 'btn-connected' : 'btn-primary'}`}
            onClick={() => setRequested(!requested)}
          >
            {requested ? (
              <>
                <Check size={16} />
                <span>Session Requested</span>
              </>
            ) : (
              <>
                <Compass size={15} />
                <span>Request 1-on-1 Guidance</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export function CreateProjectModal({ onClose, onCreated }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    technologies: '',
    openRoles: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) return;
    setSubmitted(true);
    setTimeout(() => {
      onCreated?.({
        id: `prj-local-${Date.now()}`,
        title: formData.title,
        description: formData.description,
        creator: { name: 'Karthik', college: 'SR University' },
        technologies: formData.technologies.split(',').map((t) => t.trim()).filter(Boolean),
        teamSize: '1/4 Members',
        recruitmentStatus: 'open',
      });
      onClose();
    }, 1200);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <span className="modal-badge">Initiate Collaboration</span>
            <h3 className="modal-title">Create Inter-College Project</h3>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label" htmlFor="project-title-input">Project Title *</label>
              <input
                id="project-title-input"
                className="input-field"
                placeholder="e.g. Distributed Student Study Room Protocol"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="project-desc-input">Description & Problem Statement *</label>
              <textarea
                id="project-desc-input"
                className="input-field textarea-field"
                rows={3}
                placeholder="Explain what your team is building and how it helps students..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="project-tech-input">Tech Stack (comma separated)</label>
              <input
                id="project-tech-input"
                className="input-field"
                placeholder="React, Node.js, WebSockets, Python"
                value={formData.technologies}
                onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="project-roles-input">Open Roles Needed</label>
              <input
                id="project-roles-input"
                className="input-field"
                placeholder="Frontend Developer, Cloud Architect, Designer"
                value={formData.openRoles}
                onChange={(e) => setFormData({ ...formData, openRoles: e.target.value })}
              />
            </div>

            {submitted && (
              <div className="alert-box alert-success">
                <Check size={16} />
                <span>Project published! Recruiting cross-campus team members.</span>
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitted}>
              {submitted ? 'Publishing...' : 'Publish Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
