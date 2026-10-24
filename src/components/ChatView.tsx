import { useState, useRef, useEffect } from 'react';
import { Conversation, Message } from '../types';
import { getContactDisplayName } from '../utils/privacyPseudonyms';
import { formatMessageTime } from '../utils/crypto';
import { ContactAvatar } from './ContactAvatar';
import {
  ArrowLeft,
  Phone,
  Video,
  ShieldCheck,
  Lock,
  MoreVertical,
  Paperclip,
  Smile,
  Mic,
  Send,
  UserPlus,
  Key,
  CheckCheck,
  Check,
  Eye,
  EyeOff,
  Sparkles,
  Info
} from 'lucide-react';

interface ChatViewProps {
  conversation: Conversation;
  readReceiptsEnabled?: boolean;
  onBack: () => void;
  onSendMessage: (text: string) => void;
  onAddReaction: (messageId: string, emoji: string) => void;
  onOpenEncryptionModal: () => void;
  onOpenPrivacyModal: () => void;
  onSaveAsContact?: (contactId: string, customName: string) => void;
  onRerollPseudonym?: (contactId: string) => void;
}

const COMMON_EMOJIS = ['❤️', '👍', '😂', '😮', '😢', '🙏', '🔥', '🎉'];

export function ChatView({
  conversation,
  readReceiptsEnabled = true,
  onBack,
  onSendMessage,
  onAddReaction,
  onOpenEncryptionModal,
  onOpenPrivacyModal,
  onSaveAsContact,
  onRerollPseudonym,
}: ChatViewProps) {
  const { contact, messages } = conversation;
  const displayName = getContactDisplayName(contact);
  const isUnsaved = !contact.isSaved;

  const [inputText, setInputText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showOptionsDropdown, setShowOptionsDropdown] = useState(false);
  const [selectedMessageForInspection, setSelectedMessageForInspection] = useState<Message | null>(null);
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [showSaveContactModal, setShowSaveContactModal] = useState(false);
  const [newContactName, setNewContactName] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText('');
    setShowEmojiPicker(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  const handleAudioSimulate = () => {
    setIsRecordingAudio(true);
    setTimeout(() => {
      setIsRecordingAudio(false);
      onSendMessage('🎙️ [Voice message · 0:14 · E2EE audio]');
    }, 1200);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#131314] text-neutral-100 relative overflow-hidden">
      {/* Google Messages Top Bar */}
      <div className="h-16 px-3 flex items-center justify-between border-b border-neutral-800/80 bg-neutral-900/90 backdrop-blur-md z-20 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          {/* Back button */}
          <button
            onClick={onBack}
            className="p-2 -ml-1 text-neutral-300 hover:text-white rounded-full hover:bg-neutral-800 active:bg-neutral-700 transition-colors"
            aria-label="Back to conversations"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Contact Avatar (Displays random tie-dye pattern for unsaved contacts) */}
          <div
            onClick={onOpenPrivacyModal}
            className="cursor-pointer"
            title={isUnsaved ? 'Unsaved Contact · Protected by Privacy Shield' : 'Saved Contact'}
          >
            <ContactAvatar contact={contact} size="md" showBadge={false} />
          </div>

          {/* Name & Security Subtitle */}
          <div className="min-w-0 flex flex-col justify-center">
            <div className="flex items-center gap-1.5 truncate">
              {/* CRITICAL: Never shows phone number for unsaved contact */}
              <span className="font-semibold text-sm text-neutral-100 truncate">
                {displayName}
              </span>

              {isUnsaved ? (
                <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-medium px-1.5 py-0.2 rounded bg-emerald-950/80 border border-emerald-800/60 shrink-0">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Hidden Number</span>
                </span>
              ) : (
                <span className="text-[10px] text-sky-400 flex items-center gap-0.5 shrink-0">
                  <Lock className="w-2.5 h-2.5" />
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-neutral-400">
              <span className="flex items-center gap-1 text-sky-400 font-medium">
                <Lock className="w-2.5 h-2.5" />
                RCS · E2EE
              </span>
              <span>·</span>
              {isUnsaved ? (
                <span className="text-emerald-400/90 truncate">Privacy Alias Active</span>
              ) : (
                <span className="text-neutral-400 truncate">Active now</span>
              )}
            </div>
          </div>
        </div>

        {/* Top Action Icons */}
        <div className="flex items-center gap-0.5 shrink-0">
          {/* E2EE Safety Number Verification button */}
          <button
            onClick={onOpenEncryptionModal}
            className="p-2 text-sky-400 hover:text-sky-300 rounded-full hover:bg-neutral-800 transition-colors"
            title="Verify End-to-End Encryption Keys"
          >
            <Key className="w-4 h-4" />
          </button>

          {/* Phone Call Button */}
          <button
            onClick={() => {
              alert(`Connecting encrypted RCS voice call to ${displayName}... [Phone number kept confidential]`);
            }}
            className="p-2 text-neutral-300 hover:text-white rounded-full hover:bg-neutral-800 transition-colors"
            title="Encrypted voice call"
          >
            <Phone className="w-4 h-4" />
          </button>

          {/* Video Call Button */}
          <button
            onClick={() => {
              alert(`Initiating Google Meet end-to-end encrypted video session with ${displayName}`);
            }}
            className="p-2 text-neutral-300 hover:text-white rounded-full hover:bg-neutral-800 transition-colors"
            title="Google Meet video call"
          >
            <Video className="w-4 h-4" />
          </button>

          {/* 3-dots Menu */}
          <div className="relative">
            <button
              onClick={() => setShowOptionsDropdown(!showOptionsDropdown)}
              className="p-2 text-neutral-300 hover:text-white rounded-full hover:bg-neutral-800 transition-colors"
              title="Conversation options"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showOptionsDropdown && (
              <div className="absolute right-0 top-10 w-56 p-1.5 bg-neutral-900 border border-neutral-700 rounded-xl shadow-2xl z-50 text-xs">
                <button
                  onClick={() => {
                    setShowOptionsDropdown(false);
                    onOpenEncryptionModal();
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-neutral-800 flex items-center gap-2 text-neutral-200"
                >
                  <Lock className="w-3.5 h-3.5 text-sky-400" />
                  <span>View Encryption Details</span>
                </button>

                <button
                  onClick={() => {
                    setShowOptionsDropdown(false);
                    onOpenPrivacyModal();
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-neutral-800 flex items-center gap-2 text-neutral-200"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Privacy Shield Audit</span>
                </button>

                {isUnsaved && onRerollPseudonym && (
                  <button
                    onClick={() => {
                      setShowOptionsDropdown(false);
                      onRerollPseudonym(contact.id);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-neutral-800 flex items-center gap-2 text-neutral-200"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Regenerate Privacy Alias</span>
                  </button>
                )}

                {isUnsaved && onSaveAsContact && (
                  <button
                    onClick={() => {
                      setShowOptionsDropdown(false);
                      setShowSaveContactModal(true);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-neutral-800 flex items-center gap-2 text-neutral-200"
                  >
                    <UserPlus className="w-3.5 h-3.5 text-sky-400" />
                    <span>Add to Contacts</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Message Thread Scroll View */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {/* Security Banner Card */}
        <div className="mx-auto max-w-md p-3.5 rounded-2xl bg-neutral-900/90 border border-neutral-800 text-center text-xs space-y-2 mb-4 shadow-sm">
          <div className="flex items-center justify-center gap-1.5 text-sky-400 font-semibold">
            <Lock className="w-4 h-4" />
            <span>RCS chat with {displayName}</span>
          </div>

          <p className="text-neutral-400 text-[11px] leading-relaxed">
            End-to-end encrypted with Google Jibe RCS & Signal Protocol. No one outside of this chat, not even Google or your carrier, can read or listen to them.
          </p>

          {isUnsaved && (
            <div className="p-2.5 rounded-xl bg-neutral-950/90 border border-emerald-900/50 flex flex-col items-center gap-1 text-[11px]">
              <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Zero-Leak Phone Privacy Enforced</span>
              </div>
              <p className="text-neutral-400 text-[10px]">
                The sender's raw phone number is permanently concealed from this screen and assigned the alias <span className="text-neutral-200 font-semibold">{contact.privacyAlias}</span>.
              </p>
              {onSaveAsContact && (
                <button
                  onClick={() => setShowSaveContactModal(true)}
                  className="mt-1 px-3 py-1 rounded-full bg-neutral-800 hover:bg-neutral-700 text-sky-400 text-[10px] font-medium transition-colors"
                >
                  Save as custom contact
                </button>
              )}
            </div>
          )}
        </div>

        {/* Message Bubbles */}
        {messages.map((message) => {
          const isUser = message.senderId === 'user';

          return (
            <div
              key={message.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} group`}
            >
              {/* Message Container */}
              <div className="relative max-w-[82%] sm:max-w-[70%]">
                <div
                  onClick={() => setSelectedMessageForInspection(message)}
                  className={`px-4 py-2.5 cursor-pointer transition-all ${
                    isUser
                      ? 'bg-sky-600 text-white rounded-3xl rounded-br-sm shadow-md'
                      : 'bg-[#282a2d] text-neutral-100 rounded-3xl rounded-bl-sm border border-neutral-700/50 shadow-sm'
                  }`}
                  title="Click to inspect End-to-End Encryption ciphertext payload"
                >
                  {/* Message body text */}
                  <p className="text-[13px] leading-relaxed break-words">
                    {message.text}
                  </p>

                  {/* Metadata: Lock + Time + Status */}
                  <div
                    className={`flex items-center justify-end gap-1.5 mt-1 text-[10px] ${
                      isUser ? 'text-sky-100' : 'text-neutral-400'
                    }`}
                  >
                    {/* E2EE Lock icon */}
                    <Lock className="w-2.5 h-2.5 shrink-0 opacity-80" />
                    <span>{message.timeFormatted}</span>
                    {isUser && (
                      <span className="shrink-0">
                        {readReceiptsEnabled && message.status === 'read' ? (
                          <span title="Read" className="flex items-center">
                            <CheckCheck className="w-3 h-3 text-sky-200" />
                          </span>
                        ) : message.status === 'read' || message.status === 'delivered' ? (
                          <span
                            title={readReceiptsEnabled ? 'Delivered' : 'Delivered (Read receipts disabled)'}
                            className="flex items-center"
                          >
                            <CheckCheck className={`w-3 h-3 ${readReceiptsEnabled ? 'text-sky-300/70' : 'text-slate-300/70'}`} />
                          </span>
                        ) : (
                          <span title="Sent" className="flex items-center">
                            <Check className="w-3 h-3 text-sky-300/60" />
                          </span>
                        )}
                      </span>
                    )}
                  </div>
                </div>

                {/* Reactions badge */}
                {message.reactions && message.reactions.length > 0 && (
                  <div className="absolute -bottom-2.5 right-2 flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-neutral-900 border border-neutral-700 text-xs shadow-sm">
                    {message.reactions.map((r, i) => (
                      <span key={i}>{r.emoji}</span>
                    ))}
                  </div>
                )}
              </div>

              {/* Hover quick reaction pill */}
              <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 mt-1 px-1 transition-opacity">
                {COMMON_EMOJIS.slice(0, 4).map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => onAddReaction(message.id, emoji)}
                    className="hover:scale-125 transition-transform text-xs p-0.5"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Ciphertext Packet Inspection Drawer/Modal */}
      {selectedMessageForInspection && (
        <div className="p-3 bg-neutral-950 border-t border-neutral-800 text-xs space-y-1.5 animate-in slide-in-from-bottom duration-200">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-sky-400 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              <span>Decrypted E2EE Packet Inspector</span>
            </span>
            <button
              onClick={() => setSelectedMessageForInspection(null)}
              className="text-neutral-400 hover:text-white text-[11px]"
            >
              Close
            </button>
          </div>
          <div className="font-mono text-[11px] p-2 bg-neutral-900 rounded-lg text-emerald-400 break-all select-all">
            <div className="text-neutral-400 text-[10px] mb-1">AES-GCM-256 Ciphertext over RCS Signal Ratchet:</div>
            {selectedMessageForInspection.ciphertext}
          </div>
          <div className="flex items-center justify-between text-[10px] text-neutral-400">
            <span>IV: {selectedMessageForInspection.iv}</span>
            <span>Cipher: AES-256-GCM / Universal Profile 2.4</span>
            <span className="text-sky-400 font-medium">Decryption: Authenticated</span>
          </div>
        </div>
      )}

      {/* Bottom Composer Bar */}
      <div className="p-3 bg-neutral-900 border-t border-neutral-800/80 shrink-0">
        {/* Emoji picker tray */}
        {showEmojiPicker && (
          <div className="mb-2 p-2 bg-neutral-800 rounded-2xl border border-neutral-700 flex items-center gap-2 overflow-x-auto">
            {COMMON_EMOJIS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => {
                  setInputText((prev) => prev + emoji);
                  setShowEmojiPicker(false);
                }}
                className="text-lg hover:scale-125 transition-transform p-1"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2">
          {/* Media attachment button */}
          <button
            onClick={() => {
              onSendMessage('📷 [Encrypted image sent · 2.4 MB]');
            }}
            className="w-10 h-10 rounded-full flex items-center justify-center text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors shrink-0"
            title="Attach media or photo"
          >
            <Paperclip className="w-5 h-5" />
          </button>

          {/* Input pill */}
          <div className="flex-1 flex items-center h-12 px-4 rounded-full bg-neutral-800/90 border border-neutral-700/60 focus-within:border-sky-500/80 focus-within:ring-2 focus-within:ring-sky-500/20 transition-all">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="RCS chat"
              className="flex-1 bg-transparent text-sm text-neutral-100 placeholder-neutral-400 focus:outline-none"
            />

            {/* Lock indicator inside composer (standard Google Messages RCS design) */}
            <span title="End-to-end encrypted RCS chat" className="flex items-center">
              <Lock className="w-3.5 h-3.5 text-sky-400 shrink-0 mx-2" />
            </span>

            {/* Emoji toggle */}
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="text-neutral-400 hover:text-neutral-200 p-1"
              title="Add emoji"
            >
              <Smile className="w-5 h-5" />
            </button>
          </div>

          {/* Send or Voice Note button */}
          {inputText.trim() ? (
            <button
              onClick={handleSend}
              className="w-12 h-12 rounded-full bg-sky-400 hover:bg-sky-300 text-neutral-950 flex items-center justify-center shadow-md active:scale-95 transition-all shrink-0"
              title="Send RCS message"
            >
              <Send className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleAudioSimulate}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shrink-0 ${
                isRecordingAudio
                  ? 'bg-rose-500 text-white animate-pulse'
                  : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300'
              }`}
              title="Record encrypted voice message"
            >
              <Mic className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Save Contact Modal (Optional for user when they wish to save an unsaved sender) */}
      {showSaveContactModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-sm bg-neutral-900 border border-neutral-700 rounded-3xl p-5 space-y-4 shadow-2xl">
            <div className="flex items-center gap-2.5">
              <ContactAvatar contact={contact} size="md" />
              <div>
                <h3 className="font-semibold text-neutral-100 text-sm">Save Contact</h3>
                <p className="text-[11px] text-neutral-400">Current Alias: {contact.privacyAlias}</p>
              </div>
            </div>

            <p className="text-xs text-neutral-400">
              Saving this contact assigns a custom friendly name to your address book. Note that the phone number remains protected in the secure Android keystore.
            </p>

            <div>
              <label className="text-[11px] font-medium text-neutral-300 block mb-1">
                Contact Name
              </label>
              <input
                type="text"
                value={newContactName}
                onChange={(e) => setNewContactName(e.target.value)}
                placeholder="e.g. Alex Johnson"
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-neutral-100 text-xs focus:outline-none focus:border-sky-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowSaveContactModal(false)}
                className="px-4 py-2 rounded-xl text-neutral-300 hover:bg-neutral-800 text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (newContactName.trim() && onSaveAsContact) {
                    onSaveAsContact(contact.id, newContactName.trim());
                    setShowSaveContactModal(false);
                  }
                }}
                disabled={!newContactName.trim()}
                className="px-4 py-2 rounded-xl bg-sky-400 hover:bg-sky-300 disabled:opacity-50 text-neutral-950 font-semibold text-xs"
              >
                Save Contact
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
