import React, { useState, useEffect } from 'react';
import MarketplaceHero from '../components/marketplace/MarketplaceHero';
import MarketplaceFilters from '../components/marketplace/MarketplaceFilters';
import ListingCard from '../components/marketplace/ListingCard';
import ListingDetailsModal from '../components/marketplace/ListingDetailsModal';
import CreateListingModal from '../components/marketplace/CreateListingModal';
import MyListingsView from '../components/marketplace/MyListingsView';
import SendInquiryModal from '../components/marketplace/SendInquiryModal';
import MyInquiriesView from '../components/marketplace/MyInquiriesView';
import InquiryDetailsModal from '../components/marketplace/InquiryDetailsModal';
import MarketplacePermissionsPanel from '../components/marketplace/MarketplacePermissionsPanel';
import { marketplaceService } from '../services/marketplaceService';
import { MOCK_USERS } from '../data/marketplaceData';

export function MarketplacePage() {
  // Current active user (Surya Prakash)
  const currentUser = MOCK_USERS.SURYA;

  // Active subview: 'EXPLORE' | 'MY_LISTINGS' | 'MY_INQUIRIES' | 'PERMISSIONS'
  const [activeView, setActiveView] = useState('EXPLORE');

  // Search & filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedPriceModel, setSelectedPriceModel] = useState('ALL');
  const [selectedSort, setSelectedSort] = useState('newest');

  // Data states
  const [listings, setListings] = useState([]);
  const [myListings, setMyListings] = useState([]);
  const [receivedInquiries, setReceivedInquiries] = useState([]);
  const [sentInquiries, setSentInquiries] = useState([]);

  // Modal states
  const [selectedListingForDetails, setSelectedListingForDetails] = useState(null);
  const [selectedListingForInquiry, setSelectedListingForInquiry] = useState(null);
  const [selectedListingForEdit, setSelectedListingForEdit] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedInquiryForDetails, setSelectedInquiryForDetails] = useState(null);

  // Feedback toast
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Load / reload data
  const refreshData = () => {
    const listRes = marketplaceService.getListings({
      category: selectedCategory,
      search: searchQuery,
      priceModel: selectedPriceModel,
      sort: selectedSort
    });
    if (listRes.success) setListings(listRes.data);

    const myListRes = marketplaceService.getUserListings(currentUser.id);
    if (myListRes.success) setMyListings(myListRes.data);

    const inqRecRes = marketplaceService.getReceivedInquiries(currentUser.id);
    if (inqRecRes.success) setReceivedInquiries(inqRecRes.data);

    const inqSentRes = marketplaceService.getSentInquiries(currentUser.id);
    if (inqSentRes.success) setSentInquiries(inqSentRes.data);
  };

  useEffect(() => {
    refreshData();
  }, [selectedCategory, searchQuery, selectedPriceModel, selectedSort]);

  // Handlers
  const handleSaveListing = (payload, listingId = null) => {
    if (listingId) {
      const res = marketplaceService.updateListing(listingId, payload, currentUser);
      if (res.success) {
        showToast('✓ Service listing updated successfully!');
      } else {
        showToast(res.error?.message || 'Update failed.', 'error');
      }
    } else {
      const res = marketplaceService.createListing(payload, currentUser);
      if (res.success) {
        showToast(
          payload.publishNow
            ? '✓ Service listing published to catalog!'
            : '✓ Service listing saved as draft.'
        );
      } else {
        showToast(res.error?.message || 'Creation failed.', 'error');
      }
    }
    setShowCreateModal(false);
    setSelectedListingForEdit(null);
    refreshData();
  };

  const handlePublishListing = (listingId) => {
    const res = marketplaceService.publishListing(listingId, currentUser);
    if (res.success) {
      showToast('✓ Listing published to live campus catalog!');
      refreshData();
    } else {
      showToast(res.error?.message || 'Publishing failed.', 'error');
    }
  };

  const handleArchiveListing = (listingId) => {
    const res = marketplaceService.archiveListing(listingId, currentUser);
    if (res.success) {
      showToast('Listing archived from public browsing.', 'info');
      refreshData();
    } else {
      showToast(res.error?.message || 'Archive failed.', 'error');
    }
  };

  const handleSendInquiry = (listingId, formData) => {
    const res = marketplaceService.createInquiry(listingId, formData, currentUser);
    if (res.success) {
      showToast('✓ Inquiry submitted! The provider will review your requirements.');
      setSelectedListingForInquiry(null);
      refreshData();
      setActiveView('MY_INQUIRIES');
    } else {
      showToast(res.error?.message || 'Failed to submit inquiry.', 'error');
    }
  };

  const handleAcceptInquiry = (inquiryId) => {
    const res = marketplaceService.respondToInquiry(inquiryId, 'ACCEPT', currentUser);
    if (res.success) {
      showToast('✓ Inquiry accepted. Project consultation started.');
      refreshData();
    } else {
      showToast(res.error?.message || 'Action failed.', 'error');
    }
  };

  const handleDeclineInquiry = (inquiryId) => {
    const res = marketplaceService.respondToInquiry(inquiryId, 'DECLINE', currentUser);
    if (res.success) {
      showToast('Inquiry declined.', 'info');
      refreshData();
    } else {
      showToast(res.error?.message || 'Action failed.', 'error');
    }
  };

  const handleCancelInquiry = (inquiryId) => {
    const res = marketplaceService.cancelInquiry(inquiryId, currentUser);
    if (res.success) {
      showToast('Inquiry cancelled.', 'info');
      refreshData();
    } else {
      showToast(res.error?.message || 'Action failed.', 'error');
    }
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset all marketplace listings and inquiries back to default demo state?')) {
      marketplaceService.resetToDefaults();
      refreshData();
      showToast('Marketplace demo data reset.');
    }
  };

  return (
    <div className="mono-marketplace-container">
      {/* Toast Notification */}
      {toast && (
        <div className={`mono-toast ${toast.type}`}>
          <span className="mono-toast-icon">
            {toast.type === 'error' ? '✕' : toast.type === 'info' ? 'ℹ' : '✓'}
          </span>
          <span className="mono-toast-msg">{toast.message}</span>
          <button className="mono-toast-close" onClick={() => setToast(null)}>✕</button>
        </div>
      )}

      {/* Top Marketplace Navigation Strip */}
      <div className="mono-market-navbar">
        <div className="mono-market-nav-links">
          <button
            className={`mono-nav-btn ${activeView === 'EXPLORE' ? 'active' : ''}`}
            onClick={() => setActiveView('EXPLORE')}
          >
            <span>✦ Explore Services</span>
          </button>
          <button
            className={`mono-nav-btn ${activeView === 'MY_LISTINGS' ? 'active' : ''}`}
            onClick={() => setActiveView('MY_LISTINGS')}
          >
            <span>📁 My Listings ({myListings.length})</span>
          </button>
          <button
            className={`mono-nav-btn ${activeView === 'MY_INQUIRIES' ? 'active' : ''}`}
            onClick={() => setActiveView('MY_INQUIRIES')}
          >
            <span>✉️ Inquiries ({receivedInquiries.length + sentInquiries.length})</span>
          </button>
          <button
            className={`mono-nav-btn ${activeView === 'PERMISSIONS' ? 'active' : ''}`}
            onClick={() => setActiveView('PERMISSIONS')}
          >
            <span>🛡️ Owner Permissions</span>
          </button>
        </div>

        <div className="mono-market-nav-actions">
          <button
            className="mono-btn mono-btn-sm mono-btn-outline"
            onClick={handleResetDefaults}
            title="Reset demo data"
          >
            Reset Demo Data
          </button>
          <button
            className="mono-btn mono-btn-sm mono-btn-primary"
            onClick={() => {
              setSelectedListingForEdit(null);
              setShowCreateModal(true);
            }}
          >
            + Offer a Service
          </button>
        </div>
      </div>

      {/* VIEW ROUTING */}
      {activeView === 'EXPLORE' && (
        <div className="mono-explore-view">
          <MarketplaceHero
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onExploreClick={() => {
              const el = document.getElementById('catalog-grid');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            onCreateClick={() => {
              setSelectedListingForEdit(null);
              setShowCreateModal(true);
            }}
            listingsCount={listings.length}
          />

          <MarketplaceFilters
            activeCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            activePriceModel={selectedPriceModel}
            onSelectPriceModel={setSelectedPriceModel}
            activeSort={selectedSort}
            onSelectSort={setSelectedSort}
            totalResults={listings.length}
          />

          <div id="catalog-grid" className="mono-catalog-section">
            {listings.length === 0 ? (
              <div className="mono-empty-state">
                <span className="mono-empty-icon">🔍</span>
                <h4>No matching services found</h4>
                <p>Try clearing your search query or switching to another category.</p>
                <button
                  className="mono-btn mono-btn-secondary"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('ALL');
                    setSelectedPriceModel('ALL');
                  }}
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="mono-grid-3">
                {listings.map(listing => (
                  <ListingCard
                    key={listing.id}
                    listing={listing}
                    onViewDetails={(item) => setSelectedListingForDetails(item)}
                    onInquire={(item) => setSelectedListingForInquiry(item)}
                    isOwner={listing.ownerId === currentUser.id}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeView === 'MY_LISTINGS' && (
        <MyListingsView
          listings={myListings}
          onEdit={(item) => {
            setSelectedListingForEdit(item);
            setShowCreateModal(true);
          }}
          onPublish={handlePublishListing}
          onArchive={handleArchiveListing}
          onCreateNew={() => {
            setSelectedListingForEdit(null);
            setShowCreateModal(true);
          }}
          currentUserName={currentUser.name}
        />
      )}

      {activeView === 'MY_INQUIRIES' && (
        <MyInquiriesView
          receivedInquiries={receivedInquiries}
          sentInquiries={sentInquiries}
          onAccept={handleAcceptInquiry}
          onDecline={handleDeclineInquiry}
          onCancel={handleCancelInquiry}
          onViewDetails={(inq) => setSelectedInquiryForDetails(inq)}
        />
      )}

      {activeView === 'PERMISSIONS' && (
        <MarketplacePermissionsPanel />
      )}

      {/* MODALS */}
      {selectedListingForDetails && (
        <ListingDetailsModal
          listing={selectedListingForDetails}
          onClose={() => setSelectedListingForDetails(null)}
          onInquire={(item) => {
            setSelectedListingForDetails(null);
            setSelectedListingForInquiry(item);
          }}
          onEdit={(item) => {
            setSelectedListingForDetails(null);
            setSelectedListingForEdit(item);
            setShowCreateModal(true);
          }}
          isOwner={selectedListingForDetails.ownerId === currentUser.id}
        />
      )}

      {selectedListingForInquiry && (
        <SendInquiryModal
          listing={selectedListingForInquiry}
          onClose={() => setSelectedListingForInquiry(null)}
          onSubmit={handleSendInquiry}
          currentUserId={currentUser.id}
        />
      )}

      {showCreateModal && (
        <CreateListingModal
          initialData={selectedListingForEdit}
          isEditMode={Boolean(selectedListingForEdit)}
          onClose={() => {
            setShowCreateModal(false);
            setSelectedListingForEdit(null);
          }}
          onSave={handleSaveListing}
        />
      )}

      {selectedInquiryForDetails && (
        <InquiryDetailsModal
          inquiry={selectedInquiryForDetails}
          onClose={() => setSelectedInquiryForDetails(null)}
          onAccept={handleAcceptInquiry}
          onDecline={handleDeclineInquiry}
          onCancel={handleCancelInquiry}
          currentUserId={currentUser.id}
        />
      )}
    </div>
  );
}

export default MarketplacePage;
