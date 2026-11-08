import React from 'react';
import { ChatWindow } from '../components/chat/ChatWindow';

/**
 * ChatPage Component
 * Dedicated full-view chat conversation page for direct linking and focused messaging.
 */
export const ChatPage = ({
  conversation,
  currentUserId,
  onSendMessage,
  onBack,
}) => {
  return (
    <div className="flex-1 flex h-[calc(100vh-4rem)] overflow-hidden bg-slate-50">
      <ChatWindow
        conversation={conversation}
        currentUserId={currentUserId}
        onSendMessage={onSendMessage}
        onBack={onBack}
      />
    </div>
  );
};
