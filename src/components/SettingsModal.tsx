import { useState } from 'react';
import { X, ShieldCheck, Lock, CheckCircle2, Sliders, Smartphone, Radio, Info } from 'lucide-react';

interface SettingsModalProps {
  onClose: () => void;
  readReceiptsEnabled: boolean;
  onToggleReadReceipts: (enabled: boolean) => void;
}

export function SettingsModal({ onClose, readReceiptsEnabled, onToggleReadReceipts }: SettingsModalProps) {
  const [typingIndicators, setTypingIndicators] = useState(true);
  const [keyAlerts, setKeyAlerts] = useState(true);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-md bg-neutral-900 border border-neutral-700/80 rounded-3xl p-5 shadow-2xl text-neutral-100 space-y-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-sky-400">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-neutral-100">Messages Settings</h3>
              <p className="text-[11px] text-neutral-400">RCS & Privacy Configuration</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* RCS Status Card */}
        <div className="p-3.5 bg-neutral-950 rounded-2xl border border-neutral-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-100 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-sky-400" />
              <span>RCS Chats (Google Jibe)</span>
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/80 text-[10px] font-medium">
              Connected
            </span>
          </div>

          <p className="text-[11px] text-neutral-400 leading-relaxed">
            Send messages over Wi-Fi and mobile data with high-res media, typing indicators, read receipts, and automatic End-to-End Encryption.
          </p>

          <div className="pt-2 border-t border-neutral-800/80 space-y-3 text-xs">
            {/* Read Receipts Toggle */}
            <div className="p-2.5 rounded-xl bg-neutral-900/90 border border-neutral-800 flex items-start justify-between gap-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-neutral-200 font-medium">Send read receipts</span>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                      readReceiptsEnabled
                        ? 'bg-sky-950 text-sky-400 border border-sky-800'
                        : 'bg-neutral-800 text-neutral-400'
                    }`}
                  >
                    {readReceiptsEnabled ? 'Active' : 'Disabled'}
                  </span>
                </div>
                <p className="text-[10px] text-neutral-400 leading-normal">
                  {readReceiptsEnabled
                    ? 'Others can see when you have read their messages (blue checkmark), and you can see when they read yours.'
                    : 'Messages stop at "Delivered" status. Neither you nor contacts will see "Read" indicators.'}
                </p>
              </div>

              {/* Material You Style Toggle Switch */}
              <button
                type="button"
                role="switch"
                aria-checked={readReceiptsEnabled}
                onClick={() => onToggleReadReceipts(!readReceiptsEnabled)}
                className={`w-11 h-6 rounded-full transition-colors relative shrink-0 p-0.5 cursor-pointer ${
                  readReceiptsEnabled ? 'bg-sky-400' : 'bg-neutral-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-neutral-950 transition-transform ${
                    readReceiptsEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Typing Indicators Toggle */}
            <div className="flex items-center justify-between px-1">
              <span className="text-neutral-300">Show typing indicators</span>
              <input
                type="checkbox"
                checked={typingIndicators}
                onChange={(e) => setTypingIndicators(e.target.checked)}
                className="w-4 h-4 accent-sky-400 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Privacy Shield & Zero-Leak Phone Settings */}
        <div className="p-3.5 bg-neutral-950 rounded-2xl border border-emerald-900/60 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>Zero-Leak Screen Privacy Shield</span>
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold">
              Always Enforced
            </span>
          </div>

          <p className="text-[11px] text-neutral-300 leading-relaxed">
            Protects your screen against shoulder surfers and screenshot leaks. The phone numbers of incoming text messages from unsaved senders are isolated in Android hardware keystore and never rendered to your screen.
          </p>

          <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-neutral-300">Mask unknown phone numbers</span>
              <span className="text-emerald-400 font-semibold text-[11px]">Enforced ✓</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-neutral-300">End-to-End Encryption (E2EE)</span>
              <span className="text-sky-400 font-semibold text-[11px]">Active (AES-256)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-neutral-300">Key change verification alerts</span>
              <input
                type="checkbox"
                checked={keyAlerts}
                onChange={(e) => setKeyAlerts(e.target.checked)}
                className="w-4 h-4 accent-emerald-400 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* App Version Info */}
        <div className="text-center text-[11px] text-neutral-400 space-y-0.5">
          <div>Google Messages · Android Dark Material Design</div>
          <div className="text-neutral-400">RCS Universal Profile 2.4 · Signal Double Ratchet E2EE</div>
        </div>

        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
