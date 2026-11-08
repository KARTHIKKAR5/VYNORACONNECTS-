import React, { useState } from 'react';
import { ConversationList } from '../components/chat/ConversationList';
import { ChatWindow } from '../components/chat/ChatWindow';

/**
 * InboxPage Component
 * Split-view responsive student collaboration inbox:
 * - Conversation list on the left (starts clean — students choose who to chat with)
 * - Selected active chat on the right
 * - Responsive: On mobile screens, switches smoothly between list view and chat view.
 */
export const InboxPage = ({
  conversations = [],
  selectedId,
  onSelectConversation,
  onSendMessage,
  onNewConversation,
  onDeleteConversation,
  currentUserId,
}) => {
  const [mobileChatOpen, setMobileChatOpen] = useState(Boolean(selectedId));

  const activeConversation = conversations.find((c) => c.id === selectedId) || null;

  const handleSelect = (id) => {
    onSelectConversation(id);
    setMobileChatOpen(true);
  };

  const handleBackToConversations = () => {
    setMobileChatOpen(false);
  };

  return (
    <div className="flex-1 flex h-[calc(100vh-4rem)] overflow-hidden bg-slate-50">
      {/* Left Column: Conversation List */}
      <div
        className={`w-full md:w-80 lg:w-96 flex-shrink-0 h-full ${
          mobileChatOpen ? 'hidden md:flex' : 'flex'
        }`}
      >
        <ConversationList
          conversations={conversations}
          selectedId={selectedId}
          onSelectConversation={handleSelect}
          onNewConversation={onNewConversation}
          onDeleteConversation={onDeleteConversation}
        />
      </div>

      {/* Right Column: Chat Window */}
      <div
        className={`flex-1 h-full ${
          mobileChatOpen ? 'flex' : 'hidden md:flex'
        }`}
      >
        <ChatWindow
          conversation={activeConversation}
          currentUserId={currentUserId}
          onSendMessage={onSendMessage}
          onBack={handleBackToConversations}
        />
      </div>
    </div>
  );
};
