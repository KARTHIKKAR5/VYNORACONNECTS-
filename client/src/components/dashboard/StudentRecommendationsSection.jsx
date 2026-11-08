import React, { useState } from 'react';
import { UserPlus, Check, Sparkles, ArrowRight } from 'lucide-react';
import { toggleConnectStudent, isStudentConnected } from '../../services/dashboardService.js';

export function StudentRecommendationsSection({ students = [], onViewNetwork }) {
  const [connectedMap, setConnectedMap] = useState({});

  const handleConnectToggle = async (studentId) => {
    const res = await toggleConnectStudent(studentId);
    setConnectedMap((prev) => ({
      ...prev,
      [studentId]: res.connected,
    }));
  };

  return (
    <div className="dashboard-card recommendations-card">
      <div className="card-header-row">
        <div>
          <div className="card-title-flex">
            <h3 className="card-title">People You May Know</h3>
            <span className="badge-pill">
              <Sparkles size={11} />
              AI Match
            </span>
          </div>
          <p className="card-subtitle">Students with complementary skills & interests</p>
        </div>

        <button
          type="button"
          className="link-btn"
          onClick={onViewNetwork}
        >
          <span>Find More</span>
          <ArrowRight size={14} />
        </button>
      </div>

      <div className="students-list">
        {students.map((student) => {
          const isConnected = connectedMap[student.id] ?? isStudentConnected(student.id);

          return (
            <div key={student.id} className="student-recommendation-item" id={`student-rec-${student.id}`}>
              <div className="student-profile-row">
                {student.avatar ? (
                  <img src={student.avatar} alt={student.name} className="student-avatar-img" />
                ) : (
                  <div className="student-avatar-placeholder">
                    {student.name.charAt(0)}
                  </div>
                )}

                <div className="student-info">
                  <div className="student-name-row">
                    <span className="student-name">{student.name}</span>
                    {student.mutualConnections && (
                      <span className="mutual-count">{student.mutualConnections} mutuals</span>
                    )}
                  </div>

                  <span className="student-college-dept">
                    {student.college} • {student.department}
                  </span>

                  <div className="skills-row">
                    {student.skills?.slice(0, 3).map((skill) => (
                      <span key={skill} className="skill-chip">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="student-action-row">
                <button
                  type="button"
                  className={`btn btn-sm ${isConnected ? 'btn-connected' : 'btn-primary'}`}
                  onClick={() => handleConnectToggle(student.id)}
                  id={`connect-btn-${student.id}`}
                >
                  {isConnected ? (
                    <>
                      <Check size={13} />
                      <span>Request Sent</span>
                    </>
                  ) : (
                    <>
                      <UserPlus size={13} />
                      <span>Connect</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
