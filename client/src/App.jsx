import React, { useState, useEffect } from 'react';
import AppShell from './components/layout/AppShell.jsx';
import DiscoverStudentsPage from './modules/network/pages/DiscoverStudentsPage.jsx';
import StudentProfilePage from './modules/network/pages/StudentProfilePage.jsx';
import MyProfilePage from './modules/network/pages/MyProfilePage.jsx';
import EditProfilePage from './modules/network/pages/EditProfilePage.jsx';
import ConnectionsPage from './modules/network/pages/ConnectionsPage.jsx';
import networkApi from './modules/network/services/networkApi.js';

export default function App() {
  // Routes: 'discover' | 'connections' | 'profile' | 'profile_edit' | 'profile_privacy' | 'student_detail'
  const [currentRoute, setCurrentRoute] = useState('discover');
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [isLiveBackend, setIsLiveBackend] = useState(false);

  // Probe backend status on mount
  useEffect(() => {
    let mounted = true;
    networkApi.checkBackendHealth().then((isLive) => {
      if (mounted) {
        setIsLiveBackend(isLive);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  // Sync with browser hash route for direct URL support
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#\/?/, '');
      if (!hash || hash === 'network') {
        setCurrentRoute('discover');
        setSelectedStudentId(null);
      } else if (hash === 'network/connections') {
        setCurrentRoute('connections');
        setSelectedStudentId(null);
      } else if (hash.startsWith('students/')) {
        const id = hash.replace('students/', '');
        setSelectedStudentId(id);
        setCurrentRoute('student_detail');
      } else if (hash === 'profile') {
        setCurrentRoute('profile');
        setSelectedStudentId(null);
      } else if (hash === 'profile/edit') {
        setCurrentRoute('profile_edit');
        setSelectedStudentId(null);
      } else if (hash === 'profile/privacy') {
        setCurrentRoute('profile_privacy');
        setSelectedStudentId(null);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // initial check

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (route, param = null) => {
    if (route === 'discover') {
      window.location.hash = '#network';
    } else if (route === 'connections') {
      window.location.hash = '#network/connections';
    } else if (route === 'student_detail' && param) {
      window.location.hash = `#students/${param}`;
    } else if (route === 'profile') {
      window.location.hash = '#profile';
    } else if (route === 'profile_edit') {
      window.location.hash = '#profile/edit';
    } else if (route === 'profile_privacy') {
      window.location.hash = '#profile/privacy';
    }
  };

  // Map route to AppShell active sidebar tab
  const activeSidebarTab =
    currentRoute === 'discover'
      ? 'discover'
      : currentRoute === 'connections'
      ? 'connections'
      : 'profile';

  return (
    <AppShell
      activeTab={activeSidebarTab}
      setActiveTab={(tab) => navigateTo(tab)}
      isLiveBackend={isLiveBackend}
    >
      {currentRoute === 'discover' && (
        <DiscoverStudentsPage
          onSelectStudent={(student) => navigateTo('student_detail', student._id)}
        />
      )}

      {currentRoute === 'connections' && (
        <ConnectionsPage
          onSelectStudent={(student) => navigateTo('student_detail', student._id)}
        />
      )}

      {currentRoute === 'student_detail' && (
        <StudentProfilePage
          userId={selectedStudentId}
          onBack={() => navigateTo('discover')}
          onEditClick={() => navigateTo('profile_edit')}
        />
      )}

      {currentRoute === 'profile' && (
        <MyProfilePage
          initialTab="overview"
          onEditClick={() => navigateTo('profile_edit')}
        />
      )}

      {currentRoute === 'profile_privacy' && (
        <MyProfilePage
          initialTab="privacy"
          onEditClick={() => navigateTo('profile_edit')}
        />
      )}

      {currentRoute === 'profile_edit' && (
        <EditProfilePage
          onCancel={() => navigateTo('profile')}
          onSaveSuccess={() => navigateTo('profile')}
        />
      )}
    </AppShell>
  );
}
import {
  getProjects,
  createProject,
  updateProject,
  submitJoinRequest,
  getUserProjects,
  getUserPendingRequests,
  getUserInvitations,
  respondToInvitation,
} from './services/projectsService.js';
import { ProjectCard } from './components/teams/ProjectCard.jsx';
import { ProjectFilters } from './components/teams/ProjectFilters.jsx';
import { ProjectDetailsModal } from './components/teams/ProjectDetailsModal.jsx';
import { CreateProjectModal } from './components/teams/CreateProjectModal.jsx';
import { ApplyModal } from './components/teams/ApplyModal.jsx';
import { ApplicantManager } from './components/teams/ApplicantManager.jsx';
import { TeamManager } from './components/teams/TeamManager.jsx';
import { InviteModal } from './components/teams/InviteModal.jsx';
import { TaskManager } from './components/teams/TaskManager.jsx';

export function App() {
  const currentUserId = 'usr-current-student';
  const currentUserCollege = 'Vynora Institute of Technology';

  // Navigation Sub-Tabs
  const [activeTab, setActiveTab] = useState('explore'); // 'explore' | 'my-projects' | 'applications'

  // Discovery Filter State
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [tag, setTag] = useState('');
  const [recruitingOnly, setRecruitingOnly] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);

  // Data State
  const [projects, setProjects] = useState([]);
  const [totalProjects, setTotalProjects] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [myProjects, setMyProjects] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [myInvitations, setMyInvitations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [selectedProject, setSelectedProject] = useState(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState(null);
  const [applyModalProject, setApplyModalProject] = useState(null);
  const [applyInitialRoleId, setApplyInitialRoleId] = useState('');
  const [applicantManagerProject, setApplicantManagerProject] = useState(null);
  const [teamManagerProject, setTeamManagerProject] = useState(null);
  const [inviteModalProject, setInviteModalProject] = useState(null);
  const [taskManagerProject, setTaskManagerProject] = useState(null);

  // Global Notification Toast
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Set of project IDs with pending applications by this user
  const myPendingProjectIds = new Set(
    myApplications.filter(a => a.status === 'pending').map(a => a.projectId)
  );

  // Load Explore Projects
  const fetchExploreProjects = async () => {
    setIsLoading(true);
    try {
      const result = await getProjects({
        search,
        category,
        tag,
        recruitingOnly,
        sortBy,
        page: currentPage,
        limit: 9,
        currentUserId,
      });
      setProjects(result.data);
      setTotalProjects(result.total);
      setTotalPages(result.totalPages);
    } catch {
      showToast('Error loading projects catalog.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Load User Specific Data
  const fetchUserData = async () => {
    try {
      const [userProjs, userApps, userInvs] = await Promise.all([
        getUserProjects(currentUserId),
        getUserPendingRequests(currentUserId),
        getUserInvitations(currentUserId),
      ]);
      setMyProjects(userProjs);
      setMyApplications(userApps);
      setMyInvitations(userInvs);
    } catch {
      // Graceful fallback
    }
  };

  useEffect(() => {
    fetchExploreProjects();
  }, [search, category, tag, recruitingOnly, sortBy, currentPage]);

  useEffect(() => {
    fetchUserData();
  }, []);

  const refreshAllData = async () => {
    await Promise.all([fetchExploreProjects(), fetchUserData()]);
  };

  // Handlers
  const handleCreateOrUpdateProject = async (formData) => {
    if (projectToEdit) {
      const res = await updateProject(projectToEdit.id, formData, currentUserId);
      showToast(res.message);
      setProjectToEdit(null);
    } else {
      const res = await createProject(formData);
      showToast(res.message);
    }
    await refreshAllData();
  };

  const handleApplySubmit = async (projectId, applicationData) => {
    const res = await submitJoinRequest(projectId, applicationData);
    showToast(res.message);
    await refreshAllData();
  };

  const handleInvitationResponse = async (invitationId, decision) => {
    try {
      const res = await respondToInvitation(invitationId, decision, currentUserId);
      showToast(res.message);
      await refreshAllData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const resetFilters = () => {
    setSearch('');
    setCategory('All');
    setTag('');
    setRecruitingOnly(false);
    setSortBy('newest');
    setCurrentPage(1);
  };

  return (
    <div className="app-shell">
      {/* Toast Notification */}
      {toast && (
        <div className={`toast-notification toast-${toast.type}`} role="status">
          <span>{toast.message}</span>
          <button type="button" className="toast-close" onClick={() => setToast(null)}>
            &times;
          </button>
        </div>
      )}

      {/* Top Header / Branding */}
      <header className="header">
        <div className="container header-content">
          <div className="brand">
            <span className="brand-badge">VYNORA CONNECTS</span>
            <span className="brand-module">Teams &amp; Projects</span>
          </div>

          <div className="header-right-actions">
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => {
                setProjectToEdit(null);
                setCreateModalOpen(true);
              }}
            >
              + Create Project
            </button>
            <div className="user-profile-badge">
              <div className="user-avatar-circle">V</div>
              <span className="user-profile-name">Varsh</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Navigation Sub-Tabs */}
      <nav className="module-tabs-nav" aria-label="Module Views">
        <div className="container tabs-nav-container">
          <button
            type="button"
            className={`module-tab-btn ${activeTab === 'explore' ? 'active' : ''}`}
            onClick={() => setActiveTab('explore')}
          >
            Explore Projects
            <span className="tab-count">{totalProjects}</span>
          </button>

          <button
            type="button"
            className={`module-tab-btn ${activeTab === 'my-projects' ? 'active' : ''}`}
            onClick={() => setActiveTab('my-projects')}
          >
            My Projects &amp; Teams
            <span className="tab-count">{myProjects.length}</span>
          </button>

          <button
            type="button"
            className={`module-tab-btn ${activeTab === 'applications' ? 'active' : ''}`}
            onClick={() => setActiveTab('applications')}
          >
            Applications &amp; Invites
            {(myApplications.length > 0 || myInvitations.filter(i => i.status === 'pending').length > 0) && (
              <span className="tab-badge-alert">
                {myApplications.length + myInvitations.filter(i => i.status === 'pending').length}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="container main-content">
        {activeTab === 'explore' && (
          <div className="explore-view">
            {/* Hero Introduction */}
            <div className="hero-section">
              <h1 className="module-title">Discover Projects &amp; Form Cross-Campus Teams</h1>
              <p className="module-description">
                Browse inter-college projects, explore required technology stacks, find open roles matching your skills, and recruit passionate peers for hackathons and startups.
              </p>
            </div>

            {/* Filter Bar */}
            <ProjectFilters
              search={search}
              onSearchChange={setSearch}
              category={category}
              onCategoryChange={setCategory}
              tag={tag}
              onTagChange={setTag}
              recruitingOnly={recruitingOnly}
              onRecruitingToggle={setRecruitingOnly}
              sortBy={sortBy}
              onSortChange={setSortBy}
              onReset={resetFilters}
            />

            {/* Catalog Grid */}
            {isLoading ? (
              <div className="loading-grid">
                <div className="skeleton-card" />
                <div className="skeleton-card" />
                <div className="skeleton-card" />
              </div>
            ) : projects.length === 0 ? (
              <div className="empty-catalog-card">
                <div className="empty-state-icon" aria-hidden="true">
                  <div className="empty-state-dot" />
                </div>
                <h3 className="empty-state-title">No Projects Found</h3>
                <p className="empty-state-description">
                  {recruitingOnly
                    ? 'No projects currently have open positions matching your filter criteria.'
                    : 'No projects match your active keyword or category search.'}
                </p>
                <button type="button" className="btn btn-secondary btn-sm" onClick={resetFilters}>
                  Clear Search &amp; Filters
                </button>
              </div>
            ) : (
              <>
                <div className="projects-grid">
                  {projects.map(proj => {
                    const isMember = proj.team?.members?.some(m => m.userId === currentUserId);
                    const isOwner = proj.team?.members?.some(m => m.userId === currentUserId && m.role === 'owner');
                    const hasPendingApplication = myPendingProjectIds.has(proj.id);
                    const isEligibleCampus =
                      proj.visibility !== 'campus-only' ||
                      (proj.lead?.college && proj.lead.college.toLowerCase() === currentUserCollege.toLowerCase());

                    return (
                      <ProjectCard
                        key={proj.id}
                        project={proj}
                        isMember={isMember}
                        isOwner={isOwner}
                        hasPendingApplication={hasPendingApplication}
                        isEligibleCampus={isEligibleCampus}
                        onSelect={p => setSelectedProject(p)}
                        onApply={(p, rId) => {
                          setApplyModalProject(p);
                          setApplyInitialRoleId(rId || '');
                        }}
                      />
                    );
                  })}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="pagination-bar">
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      disabled={currentPage <= 1}
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    >
                      &larr; Previous
                    </button>
                    <span className="pagination-text">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      disabled={currentPage >= totalPages}
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    >
                      Next &rarr;
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* My Projects & Teams View */}
        {activeTab === 'my-projects' && (
          <div className="my-projects-view">
            <div className="section-title-row">
              <div>
                <h2 className="sub-view-title">My Projects &amp; Team Workspaces</h2>
                <p className="sub-view-desc">
                  Initiatives you have founded or joined as a team collaborator.
                </p>
              </div>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => {
                  setProjectToEdit(null);
                  setCreateModalOpen(true);
                }}
              >
                + Launch New Project
              </button>
            </div>

            {myProjects.length === 0 ? (
              <div className="empty-catalog-card">
                <h3 className="empty-state-title">You Haven't Joined Any Projects Yet</h3>
                <p className="empty-state-description">
                  Explore available projects across campuses to join an active initiative, or launch your own project and build a team.
                </p>
                <div className="empty-actions">
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => setActiveTab('explore')}
                  >
                    Browse Projects Catalog
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => {
                      setProjectToEdit(null);
                      setCreateModalOpen(true);
                    }}
                  >
                    Create Your First Project
                  </button>
                </div>
              </div>
            ) : (
              <div className="my-projects-list">
                {myProjects.map(proj => {
                  const userMember = proj.team?.members?.find(m => m.userId === currentUserId);
                  const isOwner = userMember?.role === 'owner';
                  const isManager = userMember?.role === 'manager';
                  const canManage = isOwner || isManager;

                  return (
                    <div key={proj.id} className="my-project-card">
                      <div className="my-project-main">
                        <div className="modal-badge-row">
                          <span className="category-badge">{proj.category}</span>
                          <span className={`member-role-badge role-${userMember?.role || 'member'}`}>
                            {isOwner ? 'Project Owner' : isManager ? 'Team Manager' : 'Team Member'}
                          </span>
                        </div>
                        <h3 className="my-project-title">{proj.title}</h3>
                        <p className="my-project-tagline">{proj.tagline}</p>
                        <div className="card-tags">
                          {proj.tags?.map((t, idx) => (
                            <span key={idx} className="tech-tag">#{t}</span>
                          ))}
                        </div>
                      </div>

                      <div className="my-project-stats">
                        <div className="stat-box">
                          <span className="stat-number">{proj.team?.members?.length || 1}</span>
                          <span className="stat-label">Teammates</span>
                        </div>
                        <div className="stat-box">
                          <span className="stat-number">{proj.openRoles?.length || 0}</span>
                          <span className="stat-label">Defined Roles</span>
                        </div>
                      </div>

                      <div className="my-project-actions">
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => setSelectedProject(proj)}
                        >
                          View Details
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => setTaskManagerProject(proj)}
                        >
                          Tasks Checklist
                        </button>
                        {canManage && (
                          <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            onClick={() => setTeamManagerProject(proj)}
                          >
                            Manage Team
                          </button>
                        )}
                        {canManage && (
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={() => setApplicantManagerProject(proj)}
                          >
                            Review Applicants
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Applications & Invitations View */}
        {activeTab === 'applications' && (
          <div className="applications-view">
            {/* Incoming Invitations */}
            <div className="invitations-section">
              <h2 className="sub-view-title">Direct Team Invitations</h2>
              <p className="sub-view-desc">Invitations sent directly to you by project leads.</p>

              {myInvitations.length === 0 ? (
                <p className="empty-inline-text">No active team invitations.</p>
              ) : (
                <div className="invitations-grid">
                  {myInvitations.map(inv => (
                    <div key={inv.id} className="invitation-card">
                      <div className="inv-header">
                        <div>
                          <h4 className="inv-title">{inv.projectTitle}</h4>
                          <p className="inv-role">Invited for role: <strong>{inv.roleTitle}</strong></p>
                          <p className="inv-by">From: {inv.invitedByName}</p>
                        </div>
                        <span className={`decision-badge badge-${inv.status}`}>
                          {inv.status.toUpperCase()}
                        </span>
                      </div>

                      {inv.message && <p className="inv-msg">"{inv.message}"</p>}

                      {inv.status === 'pending' && (
                        <div className="inv-actions">
                          <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            onClick={() => handleInvitationResponse(inv.id, 'rejected')}
                          >
                            Decline
                          </button>
                          <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            onClick={() => handleInvitationResponse(inv.id, 'accepted')}
                          >
                            Accept &amp; Join Team
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submitted Applications History */}
            <div className="applications-history-section" style={{ marginTop: '40px' }}>
              <h2 className="sub-view-title">My Submitted Applications</h2>
              <p className="sub-view-desc">Status of join requests submitted to project leads.</p>

              {myApplications.length === 0 ? (
                <p className="empty-inline-text">You have not submitted any project join requests yet.</p>
              ) : (
                <div className="applications-history-list">
                  {myApplications.map(app => (
                    <div key={app.id} className="history-card">
                      <div className="history-header">
                        <div>
                          <strong>{app.projectTitle}</strong> &bull; Applied for <strong>{app.roleTitle}</strong>
                          <p className="history-date">
                            Submitted on {new Date(app.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`decision-badge badge-${app.status}`}>
                          {app.status === 'accepted'
                            ? 'Accepted'
                            : app.status === 'rejected'
                            ? 'Declined'
                            : 'Under Review'}
                        </span>
                      </div>
                      <p className="history-feedback">Pitch: "{app.introduction}"</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      {selectedProject && (
        <ProjectDetailsModal
          project={selectedProject}
          currentUserId={currentUserId}
          hasPendingApplication={myPendingProjectIds.has(selectedProject.id)}
          isEligibleCampus={
            selectedProject.visibility !== 'campus-only' ||
            (selectedProject.lead?.college && selectedProject.lead.college.toLowerCase() === currentUserCollege.toLowerCase())
          }
          onClose={() => setSelectedProject(null)}
          onApply={(p, rId) => {
            setApplyModalProject(p);
            setApplyInitialRoleId(rId || '');
          }}
          onEdit={p => {
            setProjectToEdit(p);
            setCreateModalOpen(true);
          }}
          onManageTeam={p => setTeamManagerProject(p)}
          onViewTasks={p => setTaskManagerProject(p)}
        />
      )}

      {createModalOpen && (
        <CreateProjectModal
          projectToEdit={projectToEdit}
          onClose={() => {
            setCreateModalOpen(false);
            setProjectToEdit(null);
          }}
          onSave={handleCreateOrUpdateProject}
        />
      )}

      {applyModalProject && (
        <ApplyModal
          project={applyModalProject}
          initialRoleId={applyInitialRoleId}
          onClose={() => setApplyModalProject(null)}
          onSubmit={handleApplySubmit}
        />
      )}

      {applicantManagerProject && (
        <ApplicantManager
          project={applicantManagerProject}
          currentUserId={currentUserId}
          onClose={() => setApplicantManagerProject(null)}
          onApplicantReviewed={refreshAllData}
        />
      )}

      {teamManagerProject && (
        <TeamManager
          project={teamManagerProject}
          currentUserId={currentUserId}
          onClose={() => setTeamManagerProject(null)}
          onOpenInvite={p => setInviteModalProject(p)}
          onTeamUpdated={refreshAllData}
        />
      )}

      {inviteModalProject && (
        <InviteModal
          project={inviteModalProject}
          currentUserId={currentUserId}
          onClose={() => setInviteModalProject(null)}
          onInvitationSent={() => {
            showToast('Team invitation dispatched successfully!');
            refreshAllData();
          }}
        />
      )}

      {taskManagerProject && (
        <TaskManager
          project={taskManagerProject}
          currentUserId={currentUserId}
          onClose={() => setTaskManagerProject(null)}
        />
      )}

      {/* Footer */}
      <footer className="footer">
        <div className="container footer-content">
          <p>&copy; {new Date().getFullYear()} VYNORA CONNECTS. Inter-college student collaboration platform.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
