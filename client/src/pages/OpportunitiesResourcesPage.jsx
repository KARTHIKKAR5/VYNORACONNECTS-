import React, { useState } from 'react';
import { BookOpen, Briefcase, Bookmark, UploadCloud } from 'lucide-react';
import { ResourcesPage } from './ResourcesPage.jsx';
import { OpportunitiesPage } from './OpportunitiesPage.jsx';
import { SavedTrackerView } from '../components/bookmarks/SavedTrackerView.jsx';
import { MySubmissionsView } from '../components/submissions/MySubmissionsView.jsx';

export function OpportunitiesResourcesPage({ onStatusUpdate }) {
  const [section, setSection] = useState('resources'); // 'resources' | 'opportunities' | 'bookmarks' | 'submissions'
  const [selectedOpportunityForTracker, setSelectedOpportunityForTracker] = useState(null);
  const [selectedResourceForTracker, setSelectedResourceForTracker] = useState(null);

  return (
    <div className="opportunities-resources-module">
      {/* Module Navigation Subtabs */}
      <nav className="module-subnav" style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-default)', paddingBottom: '14px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <button
          type="button"
          className={`btn ${section === 'resources' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => {
            setSection('resources');
            setSelectedResourceForTracker(null);
          }}
          id="subnav-tab-resources"
        >
          <BookOpen size={16} />
          1. Learning Resources
        </button>

        <button
          type="button"
          className={`btn ${section === 'opportunities' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => {
            setSection('opportunities');
            setSelectedOpportunityForTracker(null);
          }}
          id="subnav-tab-opportunities"
        >
          <Briefcase size={16} />
          2. Opportunities Hub
        </button>

        <button
          type="button"
          className={`btn ${section === 'bookmarks' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setSection('bookmarks')}
          id="subnav-tab-bookmarks"
        >
          <Bookmark size={16} />
          3. Saved &amp; Bookmarks
        </button>

        <button
          type="button"
          className={`btn ${section === 'submissions' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setSection('submissions')}
          id="subnav-tab-submissions"
        >
          <UploadCloud size={16} />
          4. My Submissions
        </button>
      </nav>

      {/* Render Active Section */}
      {section === 'resources' && (
        <ResourcesPage onStatusUpdate={onStatusUpdate} />
      )}

      {section === 'opportunities' && (
        <OpportunitiesPage onStatusUpdate={onStatusUpdate} />
      )}

      {section === 'bookmarks' && (
        <SavedTrackerView
          onSelectOpportunity={(opp) => {
            setSection('opportunities');
            setSelectedOpportunityForTracker(opp);
          }}
          onSelectResource={(res) => {
            setSection('resources');
            setSelectedResourceForTracker(res);
          }}
        />
      )}

      {section === 'submissions' && (
        <MySubmissionsView />
      )}
    </div>
  );
}

export default OpportunitiesResourcesPage;

