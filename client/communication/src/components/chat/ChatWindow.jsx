import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  Phone,
  Video,
  Info,
  ShieldCheck,
  MessageSquare,
  Sparkles,
  Users,
  GraduationCap,
  Calendar,
  UserPlus,
} from 'lucide-react';
import { Avatar } from '../common/Avatar';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { MessageBubble } from './MessageBubble';
import { MessageInput } from './MessageInput';

/**
 * ChatWindow Component
 * Right panel displaying active conversation, message stream, and message composer.
 * Designed like a real platform: clean empty states and authentic student profile cards.
 */
export const ChatWindow = ({
  conversation,
  currentUserId,
  onSendMessage,
  onBack,
  onStartNewChat,
}) => {
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom when messages update
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation?.messages]);

  // If no conversation is selected
  if (!conversation) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-50/50 text-center h-full">
        <div className="w-16 h-16 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mb-4 shadow-sm border border-brand-100">
          <MessageSquare className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-1">
          Welcome to Vynora Messages
        </h3>
        <p className="text-xs text-slate-500 max-w-sm mb-5 leading-relaxed">
          Students select who they want to chat with. Connect with classmates, mentors, or start a course study channel.
        </p>
        {onStartNewChat && (
          <Button
            size="md"
            icon={UserPlus}
            onClick={onStartNewChat}
            className="shadow-sm"
          >
            Select Person to Chat
          </Button>
        )}
      </div>
    );
  }

  const { name, avatar, title, type, status, department, messages = [] } = conversation;

  const handleQuickGreeting = (text) => {
    onSendMessage(conversation.id, text);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50/60 overflow-hidden">
      {/* 1. Chat Header */}
      <div className="h-16 px-4 md:px-6 bg-white border-b border-slate-200 flex items-center justify-between z-10 flex-shrink-0 shadow-xs">
        <div className="flex items-center gap-3 min-w-0">
          {/* Back button visible on mobile */}
          <button
            onClick={onBack}
            className="md:hidden p-1.5 -ml-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg"
            title="Back to conversations"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <Avatar
            src={avatar}
            alt={name}
            size="md"
            status={type === 'direct' ? status : null}
          />

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 truncate">
                {name}
              </h3>
              {type === 'direct' && status === 'online' && (
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Active Now
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 truncate flex items-center gap-1">
              <span>{title}</span>
            </p>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1 text-slate-400">
          <button
            type="button"
            className="p-2 hover:bg-slate-100 rounded-lg hover:text-slate-700 transition-colors"
            title="Start Audio Sync"
            onClick={() => alert(`Starting audio sync with ${name}...`)}
          >
            <Phone className="w-4 h-4" />
          </button>
          <button
            type="button"
            className="p-2 hover:bg-slate-100 rounded-lg hover:text-slate-700 transition-colors"
            title="Start Video Meeting"
            onClick={() => alert(`Starting video meeting with ${name}...`)}
          >
            <Video className="w-4 h-4" />
          </button>
          <button
            type="button"
            className="p-2 hover:bg-slate-100 rounded-lg hover:text-slate-700 transition-colors"
            title="Student Profile & Info"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
        {/* Safe Campus Networking Notice */}
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-1.5 py-1 px-3 bg-white border border-slate-200 rounded-full text-[11px] text-slate-500 shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-500" />
            <span>Vynora Student Network Verified • Direct Message</span>
          </div>
        </div>

        {/* Real Profile Header (Appears at top of chat or when messages are empty) */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 text-center shadow-xs max-w-lg mx-auto">
          <Avatar
            src={avatar}
            alt={name}
            size="xl"
            status={type === 'direct' ? status : null}
            className="mx-auto mb-3 ring-4 ring-slate-50"
          />
          <h2 className="text-base font-bold text-slate-900">{name}</h2>
          <p className="text-xs text-brand-600 font-medium mt-0.5">{title}</p>
          {department && (
            <p className="text-[11px] text-slate-500 mt-1">{department}</p>
          )}

          <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-600">
            {type === 'group' ? (
              <p>This is the start of the <span className="font-semibold text-slate-800">{name}</span> study channel. Share project files, code, and coordinate meetings.</p>
            ) : (
              <p>This is the start of your direct conversation with <span className="font-semibold text-slate-800">{name}</span>. Say hello, collaborate on courses, or plan study sessions.</p>
            )}
          </div>

          {/* Quick starter greeting suggestions */}
          {messages.length === 0 && (
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => handleQuickGreeting(`Hi ${name.split(' ')[0]}! Are you available to connect regarding course projects?`)}
                className="px-3 py-1.5 rounded-full bg-slate-50 hover:bg-brand-50 text-slate-700 hover:text-brand-700 border border-slate-200 text-xs font-medium transition-colors"
              >
                👋 Say Hello
              </button>
              <button
                type="button"
                onClick={() => handleQuickGreeting(`Hey! Wanted to check if you have time for a quick study sync today.`)}
                className="px-3 py-1.5 rounded-full bg-slate-50 hover:bg-brand-50 text-slate-700 hover:text-brand-700 border border-slate-200 text-xs font-medium transition-colors"
              >
                📚 Study Sync
              </button>
            </div>
          )}
        </div>

        {/* Date Divider if messages exist */}
        {messages.length > 0 && (
          <div className="relative flex items-center justify-center my-4">
            <div className="border-t border-slate-200 w-full absolute"></div>
            <span className="bg-slate-50/60 px-3 py-0.5 text-[11px] font-semibold text-slate-400 relative rounded-full">
              Today
            </span>
          </div>
        )}

        {/* Render real message bubbles */}
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            isOwn={msg.senderId === currentUserId}
            showSenderName={type === 'group'}
          />
        ))}

        <div ref={messagesEndRef} />
      </div>

      {/* 3. Composer Input */}
      <MessageInput
        onSendMessage={(text) => onSendMessage(conversation.id, text)}
      />
    </div>
  );
};
