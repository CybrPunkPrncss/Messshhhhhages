import { Conversation } from '../types';
import { getContactDisplayName } from '../utils/privacyPseudonyms';
import { formatShortDate } from '../utils/crypto';
import { ContactAvatar } from './ContactAvatar';
import { Lock, ShieldCheck, Pin, CheckCheck, MessageSquarePlus, Check } from 'lucide-react';

interface ConversationListProps {
  conversations: Conversation[];
  selectedId: string | null;
  readReceiptsEnabled?: boolean;
  onSelectConversation: (id: string) => void;
  onStartNewChat: () => void;
  onTogglePin?: (id: string) => void;
  onToggleArchive?: (id: string) => void;
  onOpenPrivacyModal?: () => void;
}

export function ConversationList({
  conversations,
  selectedId,
  readReceiptsEnabled = true,
  onSelectConversation,
  onStartNewChat,
  onTogglePin,
  onToggleArchive,
  onOpenPrivacyModal,
}: ConversationListProps) {
  if (conversations.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-neutral-400">
        <div className="w-16 h-16 rounded-full bg-neutral-800 flex items-center justify-center mb-4 text-neutral-300">
          <ShieldCheck className="w-8 h-8 text-sky-400" />
        </div>
        <h3 className="text-base font-semibold text-neutral-200 mb-1">No conversations found</h3>
        <p className="text-xs text-neutral-400 max-w-xs mb-6">
          Start a new encrypted RCS chat or simulate an incoming SMS message from an unsaved number.
        </p>
        <button
          onClick={onStartNewChat}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-sky-400 text-neutral-950 font-semibold text-xs hover:bg-sky-300 transition-colors shadow-lg"
        >
          <MessageSquarePlus className="w-4 h-4" />
          <span>Start chat</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto relative pb-24">
      <div className="divide-y divide-neutral-800/40">
        {conversations.map((conv) => {
          const { contact, lastMessageSnippet, lastMessageTimestamp, unreadCount } = conv;
          const isPinned = contact.isPinned;
          const isSelected = selectedId === conv.id;
          const displayName = getContactDisplayName(contact);
          const isUnsaved = !contact.isSaved;

          return (
            <div
              key={conv.id}
              onClick={() => onSelectConversation(conv.id)}
              className={`group flex items-center gap-3.5 px-4 py-3.5 cursor-pointer transition-colors select-none ${
                isSelected
                  ? 'bg-neutral-800/90 border-l-4 border-sky-400'
                  : 'hover:bg-neutral-800/50 active:bg-neutral-800'
              }`}
            >
              {/* Avatar circle (Custom mandala image for unsaved, initials for saved) */}
              <ContactAvatar contact={contact} size="lg" showBadge={true} />

              {/* Conversation info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <div className="flex items-center gap-1.5 truncate">
                    {/* Contact display name - CRITICAL: Never renders raw phone number for unsaved */}
                    <span className="font-semibold text-sm text-neutral-100 truncate">
                      {displayName}
                    </span>

                    {isUnsaved && (
                      <span className="px-1.5 py-0.2 text-[10px] font-medium rounded bg-emerald-950/70 text-emerald-400 border border-emerald-800/60 shrink-0">
                        Shielded
                      </span>
                    )}

                    {isPinned && (
                      <Pin className="w-3 h-3 text-sky-400 fill-sky-400 shrink-0 ml-1" />
                    )}
                  </div>

                  {/* Timestamp */}
                  <span className="text-[11px] text-neutral-400 font-medium shrink-0">
                    {formatShortDate(lastMessageTimestamp)}
                  </span>
                </div>

                {/* Snippet & Lock icon */}
                <div className="flex items-center justify-between gap-2">
                  <p className="flex items-center gap-1.5 text-xs text-neutral-300 truncate">
                    {/* E2EE Lock icon */}
                    <Lock className="w-3 h-3 text-sky-400/90 shrink-0" />
                    <span className="truncate">{lastMessageSnippet}</span>
                  </p>

                  <div className="flex items-center gap-1 shrink-0">
                    {unreadCount > 0 ? (
                      <span className="w-5 h-5 rounded-full bg-sky-400 text-neutral-950 font-bold text-[10px] flex items-center justify-center">
                        {unreadCount}
                      </span>
                    ) : readReceiptsEnabled ? (
                      <span title="Read" className="flex items-center">
                        <CheckCheck className="w-3.5 h-3.5 text-sky-400" />
                      </span>
                    ) : (
                      <span title="Delivered (Read receipts disabled)" className="flex items-center">
                        <CheckCheck className="w-3.5 h-3.5 text-neutral-400" />
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Action Button (FAB) in authentic Google Messages Material 3 shape */}
      <button
        onClick={onStartNewChat}
        className="fixed bottom-6 right-6 lg:absolute z-20 flex items-center gap-2.5 px-5 py-3.5 rounded-2xl bg-sky-400 hover:bg-sky-300 active:scale-95 text-neutral-950 font-semibold text-sm shadow-xl shadow-sky-950/40 transition-all cursor-pointer"
        aria-label="Start new chat"
      >
        <MessageSquarePlus className="w-5 h-5 text-neutral-950" />
        <span className="font-medium tracking-tight">Start chat</span>
      </button>
    </div>
  );
}
