import { useState } from 'react';
import { Contact } from '../types';
import { generatePrivacyPseudonym, getAvatarColor, getContactDisplayName, getSecureAuditMask } from '../utils/privacyPseudonyms';
import { ShieldCheck, Lock, EyeOff, X, Sparkles, Check, ShieldAlert } from 'lucide-react';

interface PrivacyShieldModalProps {
  onClose: () => void;
  shieldedContacts: Contact[];
}

export function PrivacyShieldModal({ onClose, shieldedContacts }: PrivacyShieldModalProps) {
  const [testNumber, setTestNumber] = useState('+1 (555) 982-4102');
  const [testGeneratedAlias, setTestGeneratedAlias] = useState(() => generatePrivacyPseudonym('+15559824102'));

  const handleTestNumberChange = (val: string) => {
    setTestNumber(val);
    const cleaned = val.replace(/\D/g, '');
    setTestGeneratedAlias(generatePrivacyPseudonym(cleaned || 'seed'));
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-lg bg-neutral-900 border border-neutral-700/80 rounded-3xl p-5 shadow-2xl text-neutral-100 space-y-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-emerald-950 border border-emerald-700 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-neutral-100">Zero-Leak Privacy Shield</h3>
              <p className="text-[11px] text-emerald-400">Active · Unsaved Numbers Permanently Masked</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Core Guarantee explanation */}
        <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
          <div className="flex items-start gap-2.5">
            <EyeOff className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-xs font-semibold text-neutral-100">Zero-Screen Exposure Policy</h4>
              <p className="text-xs text-neutral-300 leading-relaxed">
                When you receive SMS or RCS text messages from unsaved phone numbers, this app never renders their raw phone numbers on your screen. Instead, the Privacy Engine dynamically assigns a noble, memorable pseudonym.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-800/80 text-[11px]">
            <div className="p-2 rounded-xl bg-neutral-900/80 border border-neutral-800">
              <div className="text-neutral-400">Screen Render Target:</div>
              <div className="text-emerald-400 font-medium">Privacy Alias Only</div>
            </div>
            <div className="p-2 rounded-xl bg-neutral-900/80 border border-neutral-800">
              <div className="text-neutral-400">Carrier Number Store:</div>
              <div className="text-sky-400 font-medium">Android Keystore Sandboxed</div>
            </div>
          </div>
        </div>

        {/* Interactive Live Tester */}
        <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Interactive Privacy Masking Sandbox</span>
            </span>
            <span className="text-[10px] text-neutral-400">Try any phone number</span>
          </div>

          <div>
            <label className="text-[11px] text-neutral-400 block mb-1">
              Simulate Incoming Unknown Sender Phone Number:
            </label>
            <input
              type="text"
              value={testNumber}
              onChange={(e) => handleTestNumberChange(e.target.value)}
              placeholder="+1 (555) 000-0000"
              className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-xs font-mono text-neutral-100 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="p-3 rounded-xl bg-neutral-900 border border-emerald-900/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-neutral-950 font-bold text-xs"
                style={{ backgroundColor: getAvatarColor(testNumber) }}
              >
                {testGeneratedAlias.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="text-xs font-semibold text-neutral-100 flex items-center gap-1.5">
                  <span>{testGeneratedAlias}</span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-950/80 px-1.5 py-0.2 rounded border border-emerald-800/80">
                    Shielded
                  </span>
                </div>
                <div className="text-[10px] text-neutral-400 font-mono">
                  DOM Output: &quot;{testGeneratedAlias}&quot; · Number on Screen: 0 digits
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setTestGeneratedAlias(generatePrivacyPseudonym());
              }}
              className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-[11px]"
              title="Re-roll random alias"
            >
              Re-roll
            </button>
          </div>
        </div>

        {/* Shielded Senders in your app */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-neutral-300">Currently Shielded Unknown Contacts</span>
            <span className="text-neutral-400 text-[11px]">{shieldedContacts.length} active</span>
          </div>

          <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
            {shieldedContacts.map((contact) => (
              <div
                key={contact.id}
                className="flex items-center justify-between px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800/80 text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-neutral-950 font-bold text-[10px]"
                    style={{ backgroundColor: contact.avatarColor }}
                  >
                    {contact.privacyAlias.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-medium text-neutral-200">{contact.privacyAlias}</div>
                    <div className="text-[10px] text-neutral-400 font-mono">
                      {getSecureAuditMask(contact.rawPhoneNumber)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Hidden</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Close Button */}
        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 text-xs font-semibold transition-colors"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
}
