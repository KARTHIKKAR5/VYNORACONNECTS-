import React from 'react';
import { Check, CheckCheck } from 'lucide-react';

/**
 * MessageBubble Component
 * Renders sent and received chat messages with timestamps and delivery status.
 */
export const MessageBubble = ({
  message,
  isOwn = false,
  showSenderName = false,
}) => {
  const { text, timestamp, status, senderName } = message;

  return (
    <div className={`flex flex-col mb-3 ${isOwn ? 'items-end' : 'items-start'}`}>
      {/* Sender name for group chats */}
      {showSenderName && senderName && !isOwn && (
        <span className="text-[11px] font-semibold text-slate-500 mb-1 ml-1">
          {senderName}
        </span>
      )}

      <div
        className={`relative max-w-[85%] sm:max-w-md px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-xs ${
          isOwn
            ? 'bg-brand-500 text-white rounded-br-xs'
            : 'bg-white border border-slate-200/80 text-slate-800 rounded-bl-xs'
        }`}
      >
        <p className="whitespace-pre-wrap break-words">{text}</p>

        {/* Timestamp and delivery receipts */}
        <div
          className={`flex items-center justify-end gap-1 mt-1 text-[10px] select-none ${
            isOwn ? 'text-brand-100' : 'text-slate-400'
          }`}
        >
          <span>{timestamp}</span>
          {isOwn && (
            <span>
              {status === 'read' ? (
                <CheckCheck className="w-3.5 h-3.5 text-blue-200" />
              ) : status === 'delivered' ? (
                <CheckCheck className="w-3.5 h-3.5 text-brand-200" />
              ) : (
                <Check className="w-3.5 h-3.5 text-brand-200" />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
