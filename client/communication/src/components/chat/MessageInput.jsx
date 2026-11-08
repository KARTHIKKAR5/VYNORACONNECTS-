import React, { useState, useRef } from 'react';
import { Send, Paperclip, Smile } from 'lucide-react';
import { Button } from '../common/Button';

/**
 * MessageInput Component
 * Professional chat composer with keyboard handlers and attachment support.
 */
export const MessageInput = ({ onSendMessage, disabled = false }) => {
  const [text, setText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef(null);
  const inputRef = useRef(null);

  const emojis = ['👍', '🎉', '👋', '🚀', '🔥', '📚', '🤝', '💯', '✨', '☕'];

  const handleSend = () => {
    if (!text.trim() || disabled) return;
    onSendMessage(text.trim());
    setText('');
    setShowEmojiPicker(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleAddEmoji = (emoji) => {
    setText((prev) => prev + emoji);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setText((prev) => (prev ? `${prev} [Attachment: ${file.name}]` : `[Attachment: ${file.name}]`));
    }
  };

  return (
    <div className="border-t border-slate-200 bg-white p-3 space-y-2">
      {/* Emoji Picker Row */}
      {showEmojiPicker && (
        <div className="flex items-center gap-1.5 overflow-x-auto p-1.5 bg-slate-50 border border-slate-200 rounded-xl">
          <span className="text-[11px] font-semibold text-slate-400 pl-1">Reactions:</span>
          {emojis.map((emoji, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleAddEmoji(emoji)}
              className="text-base p-1 hover:bg-white rounded-lg transition-transform hover:scale-125"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      <div className="flex items-end gap-2">
        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Attachment & Emoji buttons */}
        <div className="flex items-center gap-1 pb-1">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            title="Attach Course Document or Code"
          >
            <Paperclip className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className={`p-2 rounded-lg transition-colors ${
              showEmojiPicker
                ? 'bg-brand-50 text-brand-600'
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
            }`}
            title="Add Reaction"
          >
            <Smile className="w-4 h-4" />
          </button>
        </div>

        {/* Message Input Box */}
        <div className="flex-1 relative">
          <textarea
            ref={inputRef}
            rows={1}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message... (Enter to send)"
            disabled={disabled}
            className="w-full resize-none py-2.5 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all max-h-32"
          />
        </div>

        {/* Send Button */}
        <Button
          onClick={handleSend}
          disabled={!text.trim() || disabled}
          size="md"
          icon={Send}
          className="rounded-xl px-4 py-2.5 shadow-sm"
        >
          Send
        </Button>
      </div>
    </div>
  );
};
