import React, { useState, useEffect } from 'react';
import { getProjectTasks, createProjectTask, updateProjectTask, TASK_PRIORITIES } from '../../services/projectsService.js';

export function TaskManager({ project, onClose, currentUserId = 'usr-current-student' }) {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [actionError, setActionError] = useState(null);

  const [newTaskData, setNewTaskData] = useState({
    title: '',
    description: '',
    assignedToUserId: project.team?.members?.[0]?.userId || '',
    priority: 'medium',
    dueDate: '',
  });

  const loadTasks = async () => {
    setIsLoading(true);
    setActionError(null);
    try {
      const data = await getProjectTasks(project.id, currentUserId);
      setTasks(data);
    } catch (err) {
      setActionError(err.message || 'Failed to load tasks.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [project.id]);

  const handleToggleStatus = async (task) => {
    const nextStatus =
      task.status === 'todo'
        ? 'in_progress'
        : task.status === 'in_progress'
        ? 'completed'
        : 'todo';

    try {
      await updateProjectTask(project.id, task.id, { status: nextStatus }, currentUserId);
      await loadTasks();
    } catch (err) {
      setActionError(err.message);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setActionError(null);
    try {
      await createProjectTask(project.id, newTaskData, currentUserId);
      setCreateModalOpen(false);
      setNewTaskData({
        title: '',
        description: '',
        assignedToUserId: project.team?.members?.[0]?.userId || '',
        priority: 'medium',
        dueDate: '',
      });
      await loadTasks();
    } catch (err) {
      setActionError(err.message || 'Failed to create task.');
    }
  };

  const filteredTasks = tasks.filter(t => (filterStatus === 'all' ? true : t.status === filterStatus));
  const completedCount = tasks.filter(t => t.status === 'completed').length;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="task-mgr-title">
      <div className="modal-container modal-lg">
        {/* Header */}
        <div className="modal-header">
          <div>
            <div className="modal-badge-row">
              <span className="category-badge">{project.category}</span>
              <span className="capacity-badge">
                Progress: {completedCount} / {tasks.length} Completed
              </span>
            </div>
            <h2 className="modal-title" id="task-mgr-title">Team Task Checklist</h2>
            <p className="modal-subtitle">Project: <strong>{project.title}</strong></p>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            &times;
          </button>
        </div>

        {/* Toolbar & Filters */}
        <div className="task-toolbar">
          <div className="task-filter-pills">
            {['all', 'todo', 'in_progress', 'completed'].map(st => (
              <button
                key={st}
                type="button"
                className={`task-filter-btn ${filterStatus === st ? 'active' : ''}`}
                onClick={() => setFilterStatus(st)}
              >
                {st === 'all' ? 'All Tasks' : st === 'in_progress' ? 'In Progress' : st.charAt(0).toUpperCase() + st.slice(1)}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => setCreateModalOpen(true)}
          >
            + New Task
          </button>
        </div>

        {actionError && <div className="error-banner">{actionError}</div>}

        {/* Task List */}
        <div className="modal-body">
          {isLoading ? (
            <div className="loading-state">Loading team checklist...</div>
          ) : filteredTasks.length === 0 ? (
            <div className="empty-panel">
              <p>No tasks found in this view.</p>
              <span className="empty-sub">Create actionable tasks to coordinate goals and milestones with teammates.</span>
            </div>
          ) : (
            <div className="task-cards-list">
              {filteredTasks.map(task => {
                const isCompleted = task.status === 'completed';

                return (
                  <div key={task.id} className={`task-card ${isCompleted ? 'task-done' : ''}`}>
                    <div className="task-card-left">
                      <button
                        type="button"
                        className={`task-checkbox ${isCompleted ? 'checked' : ''}`}
                        onClick={() => handleToggleStatus(task)}
                        title={`Status: ${task.status}. Click to cycle status.`}
                      >
                        {isCompleted ? '✓' : ''}
                      </button>

                      <div className="task-text-group">
                        <h4 className="task-title">{task.title}</h4>
                        {task.description && <p className="task-desc">{task.description}</p>}
                        <div className="task-meta-row">
                          <span className="task-assignee">Assignee: <strong>{task.assignedToName}</strong></span>
                          {task.dueDate && (
                            <span className="task-due">Due: {task.dueDate}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="task-card-right">
                      <span className={`priority-badge priority-${task.priority}`}>
                        {task.priority}
                      </span>
                      <span className={`status-pill status-${task.status}`}>
                        {task.status === 'in_progress' ? 'In Progress' : task.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Create Task Sub-Modal */}
        {createModalOpen && (
          <div className="sub-modal-backdrop">
            <div className="sub-modal-card">
              <h4>Create Team Task</h4>
              <form onSubmit={handleCreateTask}>
                <div className="form-group">
                  <label className="form-label">Task Title <span className="required-star">*</span></label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Set up WebSocket heartbeats"
                    value={newTaskData.title}
                    onChange={e => setNewTaskData({ ...newTaskData, title: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Description / Instructions</label>
                  <textarea
                    className="form-control"
                    rows="2"
                    placeholder="Provide acceptance criteria..."
                    value={newTaskData.description}
                    onChange={e => setNewTaskData({ ...newTaskData, description: e.target.value })}
                  />
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label className="form-label">Assignee</label>
                    <select
                      className="form-control"
                      value={newTaskData.assignedToUserId}
                      onChange={e => setNewTaskData({ ...newTaskData, assignedToUserId: e.target.value })}
                    >
                      {project.team?.members?.map(m => (
                        <option key={m.userId} value={m.userId}>
                          {m.name} ({m.assignedRoleTitle})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Priority</label>
                    <select
                      className="form-control"
                      value={newTaskData.priority}
                      onChange={e => setNewTaskData({ ...newTaskData, priority: e.target.value })}
                    >
                      {TASK_PRIORITIES.map(p => (
                        <option key={p} value={p}>{p.toUpperCase()}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Due Date (Optional)</label>
                  <input
                    type="date"
                    className="form-control"
                    value={newTaskData.dueDate}
                    onChange={e => setNewTaskData({ ...newTaskData, dueDate: e.target.value })}
                  />
                </div>

                <div className="modal-footer-inline">
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => setCreateModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary btn-sm">
                    Create Task
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default TaskManager;

