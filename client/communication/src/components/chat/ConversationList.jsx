import React, { useState } from 'react';
import { Search, Plus, UserPlus, Users } from 'lucide-react';
import { ConversationItem } from './ConversationItem';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';

/**
 * ConversationList Component
 * Left panel showing student chats with filters, search, and a "New Conversation" modal.
 * No fake/example students are shown — the student types a name to start a chat.
 */
export const ConversationList = ({
  conversations = [],
  selectedId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'direct' | 'group' | 'unread'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState('direct'); // 'direct' | 'group'
  const [directChatName, setDirectChatName] = useState('');
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupCourse, setNewGroupCourse] = useState('');

  // Filter conversations list by search text and active tab
  const filteredConversations = conversations.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.title && c.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (c.lastMessage?.text && c.lastMessage.text.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;
    if (activeFilter === 'direct') return c.type === 'direct';
    if (activeFilter === 'group') return c.type === 'group';
    if (activeFilter === 'unread') return c.unreadCount > 0;
    return true;
  });

  // Start a direct chat by typing a name manually — no pre-loaded student list
  const handleStartDirectChat = (e) => {
    e.preventDefault();
    const name = directChatName.trim();
    if (!name) return;

    // If a conversation with this name already exists, just open it
    const existing = conversations.find(
      (c) => c.name.toLowerCase() === name.toLowerCase()
    );

    if (existing) {
      onSelectConversation(existing.id || existing._id);
    } else if (onNewConversation) {
      onNewConversation({
        name,
        type: 'direct',
        title: 'Student',
        department: '',
      });
    }

    setDirectChatName('');
    setIsModalOpen(false);
  };

  // Create a named study group channel
  const handleCreateGroup = (e) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;

    if (onNewConversation) {
      onNewConversation({
        name: newGroupName.trim(),
        type: 'group',
        title: newGroupCourse.trim()
          ? `${newGroupCourse.trim()} • Study Group`
          : 'Study Group Channel',
        department: 'Student Study Group',
        avatar:
          'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&auto=format&fit=crop&q=80',
      });
    }

    setNewGroupName('');
    setNewGroupCourse('');
    setIsModalOpen(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setDirectChatName('');
    setNewGroupName('');
    setNewGroupCourse('');
  };

  return (
    <div className="flex flex-col h-full bg-white border-r border-slate-200">
      {/* Top action header */}
      <div className="p-4 border-b border-slate-100 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-800">Messages</h2>
            <p className="text-xs text-slate-500">Student &amp; Study Channels</p>
          </div>
          <Button
            size="sm"
            icon={Plus}
            onClick={() => setIsModalOpen(true)}
            className="rounded-lg shadow-sm"
          >
            New Chat
          </Button>
        </div>

        {/* Search Input */}
        <Input
          placeholder="Search chats, groups..."
          icon={Search}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onClear={() => setSearchQuery('')}
        />

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {[
            { id: 'all', label: 'All' },
            { id: 'direct', label: 'Direct' },
            { id: 'group', label: 'Study Groups' },
            { id: 'unread', label: 'Unread' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                activeFilter === tab.id
                  ? 'bg-brand-500 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Conversations List — scrollable */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {filteredConversations.length > 0 ? (
          filteredConversations.map((c) => (
            <ConversationItem
              key={c.id || c._id}
              conversation={c}
              isSelected={(c.id || c._id) === selectedId}
              onSelect={onSelectConversation}
              onDelete={onDeleteConversation}
            />
          ))
        ) : (
          /* Empty state — shown when no conversations exist */
          <div className="py-12 px-4 text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-brand-50 flex items-center justify-center text-brand-600 mb-3 border border-brand-100">
              <UserPlus className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-slate-800">No active conversations</p>
            <p className="text-xs text-slate-500 mt-1 max-w-[220px] mx-auto leading-relaxed">
              Type a student's name to start a new chat.
            </p>
            <Button
              size="sm"
              icon={UserPlus}
              onClick={() => setIsModalOpen(true)}
              className="mt-4 text-xs shadow-sm"
            >
              Start a Chat
            </Button>
          </div>
        )}
      </div>

      {/* New Conversation Modal — no fake directory; student types a name */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="New Conversation"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          {/* Tab switcher */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => setModalTab('direct')}
              className={`py-2 px-3 rounded-lg transition-all ${
                modalTab === 'direct'
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Direct Message
            </button>
            <button
              type="button"
              onClick={() => setModalTab('group')}
              className={`py-2 px-3 rounded-lg transition-all ${
                modalTab === 'group'
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Study Group
            </button>
          </div>

          {/* Direct Message — simple name input, no fake suggestions */}
          {modalTab === 'direct' ? (
            <form onSubmit={handleStartDirectChat} className="space-y-4">
              <div className="bg-brand-50 border border-brand-100 rounded-xl p-3 flex items-start gap-2">
                <UserPlus className="w-4 h-4 text-brand-500 mt-0.5 shrink-0" />
                <p className="text-xs text-brand-700 leading-relaxed">
                  Enter the name of the student or mentor you want to chat with.
                  When the shared backend is connected, you'll search from real registered students.
                </p>
              </div>

              <Input
                label="Student / Mentor Name"
                placeholder="e.g. Ravi Kumar, Priya, Dr. Mehta..."
                value={directChatName}
                onChange={(e) => setDirectChatName(e.target.value)}
                autoFocus
                required
              />

              <div className="flex justify-end gap-2 pt-1">
                <Button variant="outline" size="sm" type="button" onClick={closeModal}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  icon={Users}
                  disabled={!directChatName.trim()}
                >
                  Start Chat
                </Button>
              </div>
            </form>
          ) : (
            /* Study Group — name + optional course tag */
            <form onSubmit={handleCreateGroup} className="space-y-3.5">
              <Input
                label="Study Group / Project Channel Name"
                placeholder="e.g. CS 330 Algorithms Final Prep"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                required
              />

              <Input
                label="Associated Course / Tag (Optional)"
                placeholder="e.g. CS 330 or Machine Learning Lab"
                value={newGroupCourse}
                onChange={(e) => setNewGroupCourse(e.target.value)}
              />

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" size="sm" type="button" onClick={closeModal}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={!newGroupName.trim()}
                >
                  Create Channel
                </Button>
              </div>
            </form>
          )}
        </div>
      </Modal>
    </div>
  );
};
