import { useState } from 'react';
import { Contact } from '../types';
import { generatePrivacyPseudonym, getAvatarColor, getContactDisplayName } from '../utils/privacyPseudonyms';
import { X, Search, ShieldCheck, Lock, UserPlus, Send, MessageSquarePlus } from 'lucide-react';

interface NewMessageModalProps {
  existingContacts: Contact[];
  onClose: () => void;
  onCreateConversation: (contactData: { rawPhoneNumber: string; isSaved: boolean; name?: string }, initialText: string) => void;
}

export function NewMessageModal({ existingContacts, onClose, onCreateConversation }: NewMessageModalProps) {
  const [phoneInput, setPhoneInput] = useState('');
  const [initialMessage, setInitialMessage] = useState('');
  const [searchContact, setSearchContact] = useState('');

  // Clean the number
  const cleanedDigits = phoneInput.replace(/\D/g, '');
  const isInputValidNumber = cleanedDigits.length >= 7;

  // Real-time generated privacy alias for this phone number
  const previewAlias = generatePrivacyPseudonym(cleanedDigits || 'new_seed');
  const previewColor = getAvatarColor(cleanedDigits || 'new_seed');

  // Filter existing contacts
  const filteredContacts = existingContacts.filter((c) => {
    const name = getContactDisplayName(c).toLowerCase();
    return name.includes(searchContact.toLowerCase());
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isInputValidNumber) return;

    onCreateConversation(
      {
        rawPhoneNumber: phoneInput,
        isSaved: false, // Unsaved sender! Will be shielded with previewAlias
      },
      initialMessage.trim() || 'Hi! Starting an end-to-end encrypted RCS chat.'
    );
    onClose();
  };

  const handleSelectExisting = (contact: Contact) => {
    onCreateConversation(
      {
        rawPhoneNumber: contact.rawPhoneNumber,
        isSaved: contact.isSaved,
        name: contact.isSaved ? contact.name : undefined,
      },
      initialMessage.trim() || 'Hi! Connecting via RCS.'
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-md bg-neutral-900 border border-neutral-700/80 rounded-3xl p-5 shadow-2xl text-neutral-100 space-y-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-sky-950/80 border border-sky-800/80 flex items-center justify-center text-sky-400">
              <MessageSquarePlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-neutral-100">Start new RCS chat</h3>
              <p className="text-[11px] text-neutral-400">End-to-end encrypted & privacy shielded</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs font-medium text-neutral-300 block mb-1">
              Recipient Phone Number
            </label>
            <div className="relative">
              <input
                type="text"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                placeholder="e.g. (555) 782-9014"
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-xs font-mono text-neutral-100 focus:outline-none focus:border-sky-500"
                autoFocus
              />
            </div>
          </div>

          {/* Privacy Preview Card if entering an unsaved number */}
          {phoneInput.trim().length > 3 && (
            <div className="p-3 rounded-2xl bg-neutral-950 border border-emerald-900/60 space-y-2 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-medium">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Zero-Leak Privacy Assignment</span>
              </div>

              <div className="flex items-center gap-3 p-2 bg-neutral-900 rounded-xl">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-950 font-bold text-xs"
                  style={{ backgroundColor: previewColor }}
                >
                  {previewAlias.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="text-xs font-semibold text-neutral-100">
                    {previewAlias}
                  </div>
                  <div className="text-[10px] text-neutral-400">
                    Phone number will be hidden on screen permanently
                  </div>
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-medium text-neutral-300 block mb-1">
              Initial Message (Encrypted payload)
            </label>
            <input
              type="text"
              value={initialMessage}
              onChange={(e) => setInitialMessage(e.target.value)}
              placeholder="Type your message..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-xs text-neutral-100 focus:outline-none focus:border-sky-500"
            />
          </div>

          <button
            type="submit"
            disabled={!isInputValidNumber}
            className="w-full py-2.5 rounded-xl bg-sky-400 hover:bg-sky-300 disabled:opacity-40 text-neutral-950 font-semibold text-xs transition-colors flex items-center justify-center gap-2"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Start Encrypted Chat</span>
          </button>
        </form>

        {/* Existing Contacts Section */}
        <div className="pt-2 border-t border-neutral-800 space-y-2">
          <div className="text-xs font-medium text-neutral-400">Or pick an existing conversation:</div>
          <div className="space-y-1 max-h-40 overflow-y-auto">
            {filteredContacts.map((c) => {
              const name = getContactDisplayName(c);
              return (
                <div
                  key={c.id}
                  onClick={() => handleSelectExisting(c)}
                  className="flex items-center justify-between p-2 rounded-xl hover:bg-neutral-800 cursor-pointer transition-colors text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-neutral-950 font-bold text-[10px]"
                      style={{ backgroundColor: c.avatarColor }}
                    >
                      {name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold text-neutral-200">{name}</div>
                      <div className="text-[10px] text-neutral-400">
                        {c.isSaved ? 'Saved Contact' : 'Privacy Shielded'}
                      </div>
                    </div>
                  </div>
                  <Lock className="w-3.5 h-3.5 text-sky-400" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
