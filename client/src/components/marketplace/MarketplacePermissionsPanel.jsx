import React, { useState } from 'react';
import {
  ACTIONS,
  canPerformMarketplaceAction,
  isListingOwner,
  isInquiryRecipient,
  isInquiryRequester,
  getActionDescription
} from '../../utils/permissions';
import { MOCK_USERS, INITIAL_SERVICE_LISTINGS, INITIAL_INQUIRIES } from '../../data/marketplaceData';

export function MarketplacePermissionsPanel() {
  // Selected simulated identity
  const [activeUserKey, setActiveUserKey] = useState('SURYA');
  const currentUser = MOCK_USERS[activeUserKey];

  // Test target resources
  const testListing = INITIAL_SERVICE_LISTINGS[0]; // Owned by Surya
  const testInquiry = INITIAL_INQUIRIES[0]; // Requester: Aarav, Recipient: Surya

  const marketplaceActions = [
    ACTIONS.MARKETPLACE_LISTING_CREATE,
    ACTIONS.MARKETPLACE_LISTING_READ,
    ACTIONS.MARKETPLACE_LISTING_UPDATE,
    ACTIONS.MARKETPLACE_LISTING_ARCHIVE,
    ACTIONS.MARKETPLACE_LISTING_MODERATE,
    ACTIONS.MARKETPLACE_INQUIRY_CREATE,
    ACTIONS.MARKETPLACE_INQUIRY_READ,
    ACTIONS.MARKETPLACE_INQUIRY_RESPOND,
    ACTIONS.MARKETPLACE_INQUIRY_CANCEL
  ];

  return (
    <div className="mono-permissions-panel">
      {/* Header */}
      <div className="mono-view-header">
        <div>
          <span className="mono-badge mono-badge-subtle font-mono">AUTHORIZATION SPECIFICATION</span>
          <h2 className="mono-view-title">Marketplace RBAC & ABAC Matrix</h2>
          <p className="mono-view-desc">
            Granular evaluation of resource ownership, role boundaries, and attribute-based security rules.
          </p>
        </div>
      </div>

      {/* Security Architecture Callout */}
      <div className="mono-notice-box warning">
        <span className="mono-notice-icon">🛡️</span>
        <div>
          <strong>Backend Enforcement Requirement:</strong>
          <p>
            Client-side checks are for user interface gating only. All actions (such as updates, archive requests, and inquiry acceptances) must be validated server-side by Express middleware (<code>authorizeMarketplace</code>) and MongoDB collection authorization rules.
          </p>
        </div>
      </div>

      {/* Identity Selector */}
      <div className="mono-card mono-identity-card">
        <div className="mono-identity-header">
          <span className="mono-badge mono-badge-category">SIMULATE ACTIVE USER</span>
          <div className="mono-user-profile-summary">
            <strong>{currentUser.name}</strong> ({currentUser.department}) • Role:{' '}
            <span className="font-mono">{currentUser.role}</span>
            {currentUser.isModerator && <span className="mono-badge mono-badge-delivery">MODERATOR</span>}
          </div>
        </div>

        <div className="mono-role-pills-row">
          {Object.keys(MOCK_USERS).map((key) => {
            const u = MOCK_USERS[key];
            return (
              <button
                key={key}
                className={`mono-role-btn ${activeUserKey === key ? 'active' : ''}`}
                onClick={() => setActiveUserKey(key)}
              >
                <span>{u.name}</span>
                <span className="mono-role-tag font-mono">[{u.role}]</span>
              </button>
            );
          })}
        </div>

        {/* Resource Relationship Inspector */}
        <div className="mono-relations-grid font-mono">
          <div className="mono-relation-box">
            <span className="mono-relation-label">Target Service Listing:</span>
            <span className="mono-relation-val">"{testListing.title.slice(0, 32)}..."</span>
            <span className="mono-relation-result">
              isListingOwner: {isListingOwner(currentUser.id, testListing.ownerId) ? 'TRUE (Owner)' : 'FALSE'}
            </span>
          </div>

          <div className="mono-relation-box">
            <span className="mono-relation-label">Target Inquiry:</span>
            <span className="mono-relation-val">"{testInquiry.subject.slice(0, 32)}..."</span>
            <span className="mono-relation-result">
              isRecipient: {isInquiryRecipient(currentUser.id, testInquiry) ? 'TRUE' : 'FALSE'} |{' '}
              isRequester: {isInquiryRequester(currentUser.id, testInquiry) ? 'TRUE' : 'FALSE'}
            </span>
          </div>
        </div>
      </div>

      {/* Permissions Matrix */}
      <div className="mono-card">
        <h4 className="mono-section-heading">Evaluated Permissions for {currentUser.name}</h4>

        <div className="mono-matrix-table-wrap">
          <table className="mono-table font-mono">
            <thead>
              <tr>
                <th>Action Identifier</th>
                <th>Target Resource</th>
                <th>Access Result</th>
                <th>Rule Description</th>
              </tr>
            </thead>
            <tbody>
              {marketplaceActions.map((action) => {
                const targetResource = action.includes('INQUIRY_RESPOND') || action.includes('INQUIRY_CANCEL') || action === ACTIONS.MARKETPLACE_INQUIRY_READ
                  ? testInquiry
                  : testListing;

                const allowed = canPerformMarketplaceAction(currentUser, action, targetResource);

                return (
                  <tr key={action}>
                    <td>
                      <span className="mono-action-name">{action}</span>
                    </td>
                    <td>
                      <span className="mono-target-badge">
                        {targetResource === testInquiry ? 'Inquiry' : 'Listing'}
                      </span>
                    </td>
                    <td>
                      <span className={`mono-access-pill ${allowed ? 'granted' : 'denied'}`}>
                        {allowed ? '✓ GRANTED' : '✕ DENIED'}
                      </span>
                    </td>
                    <td className="mono-desc-cell">
                      {action === ACTIONS.MARKETPLACE_INQUIRY_CREATE && isListingOwner(currentUser.id, testListing.ownerId)
                        ? 'Blocked: Self-inquiry on own listing is strictly prohibited.'
                        : getActionDescription(action)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default MarketplacePermissionsPanel;
