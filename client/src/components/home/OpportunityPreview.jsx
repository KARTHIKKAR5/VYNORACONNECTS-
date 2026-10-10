import React from 'react';

// Reusable OpportunityCard sub-component accepting props
function OpportunityCard({ title, organization, type, deadline }) {
  return (
    <div className="preview-card opportunity-card">
      <div className="preview-card-top">
        <span className="badge badge-opp">{type}</span>
        <span className="preview-meta-deadline">⏳ Deadline: {deadline}</span>
      </div>

      <h4 className="preview-card-title">{title}</h4>
      <p className="preview-meta-org">🏢 {organization}</p>
    </div>
  );
}

function OpportunityPreview({ opportunities }) {
  // Realistic campus opportunities
  const defaultOpportunities = [
    {
      id: 'opp-1',
      title: 'Summer Frontend Engineering Intern',
      organization: 'Vynora Labs Inc.',
      type: 'Internship',
      deadline: 'Nov 15, 2026'
    },
    {
      id: 'opp-2',
      title: 'Google Developer Student Club Core Team Lead',
      organization: 'GDSC Campus Chapter',
      type: 'Leadership',
      deadline: 'Oct 30, 2026'
    }
  ];

  const opportunityList = opportunities !== undefined ? opportunities : defaultOpportunities;

  return (
    <section className="preview-section">
      <div className="section-header">
        <h3 className="section-main-heading">Opportunities</h3>
        <span className="section-badge">{opportunityList.length} open</span>
      </div>

      {opportunityList.length === 0 ? (
        <div className="empty-state-card">
          <span className="empty-state-icon">💼</span>
          <p className="empty-state-text">No active opportunities found right now.</p>
          <span className="empty-state-sub">New internships, scholarships, and fellowships will be posted soon.</span>
        </div>
      ) : (
        <div className="preview-grid">
          {opportunityList.map((opp) => (
            <OpportunityCard
              key={opp.id}
              title={opp.title}
              organization={opp.organization}
              type={opp.type}
              deadline={opp.deadline}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default OpportunityPreview;
