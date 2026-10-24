import { ShieldCheck, MessageSquare, X } from 'lucide-react';
import { Contact } from '../types';
import { getContactDisplayName } from '../utils/privacyPseudonyms';

interface AndroidNotificationBannerProps {
  contact: Contact;
  messageText: string;
  onOpen: () => void;
  onDismiss: () => void;
}

export function AndroidNotificationBanner({
  contact,
  messageText,
  onOpen,
  onDismiss,
}: AndroidNotificationBannerProps) {
  const displayName = getContactDisplayName(contact);
  const isUnsaved = !contact.isSaved;

  return (
    <div className="fixed top-10 left-1/2 -translate-x-1/2 w-full max-w-sm px-4 z-50 animate-in slide-in-from-top duration-300">
      <div
        onClick={onOpen}
        className="w-full p-3.5 bg-neutral-900/95 backdrop-blur-lg border border-neutral-700/80 rounded-3xl shadow-2xl cursor-pointer hover:border-sky-500/60 transition-all flex items-start gap-3"
      >
        {/* Contact avatar with shield */}
        <div className="relative shrink-0 mt-0.5">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-neutral-950 font-bold text-xs shadow-sm"
            style={{ backgroundColor: contact.avatarColor }}
          >
            {displayName.slice(0, 2).toUpperCase()}
          </div>
          {isUnsaved && (
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-neutral-900 border border-neutral-700 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-3 h-3" />
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1">
            <div className="flex items-center gap-1.5 truncate">
              {/* CRITICAL: Shows pseudonym, NEVER phone number! */}
              <span className="font-semibold text-xs text-neutral-100 truncate">
                {displayName}
              </span>
              {isUnsaved && (
                <span className="text-[9px] font-medium text-emerald-400 bg-emerald-950/80 px-1 py-0.2 rounded border border-emerald-800/80 shrink-0">
                  Privacy Shield
                </span>
              )}
            </div>
            <span className="text-[10px] text-neutral-400 shrink-0">now</span>
          </div>

          <p className="text-xs text-neutral-300 truncate mt-0.5">{messageText}</p>

          <div className="flex items-center gap-2 mt-1.5 text-[10px] text-neutral-400">
            <span className="text-sky-400 font-medium">Google Messages · RCS</span>
            <span>·</span>
            <span>Tap to reply</span>
          </div>
        </div>

        {/* Dismiss button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDismiss();
          }}
          className="text-neutral-400 hover:text-white p-1 -mr-1"
          aria-label="Dismiss notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
