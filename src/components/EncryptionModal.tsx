import { useState } from 'react';
import { Contact } from '../types';
import { getContactDisplayName } from '../utils/privacyPseudonyms';
import { X, ShieldCheck, Lock, QrCode, CheckCircle2, Copy, RefreshCw, Key } from 'lucide-react';

interface EncryptionModalProps {
  contact: Contact;
  onClose: () => void;
  onVerifyContact: (contactId: string) => void;
}

export function EncryptionModal({ contact, onClose, onVerifyContact }: EncryptionModalProps) {
  const [copied, setCopied] = useState(false);
  const [scanSimulated, setScanSimulated] = useState(false);
  const displayName = getContactDisplayName(contact);
  const isVerified = contact.encryptionStatus === 'e2ee_verified';

  const handleCopySafetyNumber = () => {
    navigator.clipboard?.writeText(contact.safetyNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulateScan = () => {
    setScanSimulated(true);
    setTimeout(() => {
      onVerifyContact(contact.id);
      setScanSimulated(false);
    }, 900);
  };

  // Generate visual QR code cells from the safety number hash
  const safetyDigits = contact.safetyNumber.replace(/\s+/g, '');
  const qrCells = Array.from({ length: 64 }).map((_, i) => {
    const charCode = safetyDigits.charCodeAt(i % safetyDigits.length) || 0;
    return (charCode + i) % 2 === 0;
  });

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-md bg-neutral-900 border border-neutral-700/80 rounded-3xl p-5 shadow-2xl text-neutral-100 space-y-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-sky-950/80 border border-sky-800/80 flex items-center justify-center text-sky-400">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-neutral-100">Verify Safety Numbers</h3>
              <p className="text-[11px] text-neutral-400">{displayName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Verification Status Banner */}
        <div
          className={`p-3 rounded-2xl border flex items-center justify-between ${
            isVerified
              ? 'bg-emerald-950/60 border-emerald-800/60 text-emerald-200'
              : 'bg-neutral-800/60 border-neutral-700/60 text-neutral-300'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {isVerified ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <ShieldCheck className="w-5 h-5 text-sky-400 shrink-0" />
            )}
            <div>
              <div className="text-xs font-semibold">
                {isVerified ? 'Verified Encryption Identity' : 'Encryption Active (Unverified)'}
              </div>
              <div className="text-[10px] text-neutral-400">
                {isVerified
                  ? 'Cryptographic safety numbers match this device.'
                  : 'Compare the 60-digit safety number with your contact.'}
              </div>
            </div>
          </div>

          <button
            onClick={() => onVerifyContact(contact.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              isVerified
                ? 'bg-emerald-400 text-neutral-950 hover:bg-emerald-300'
                : 'bg-sky-400 text-neutral-950 hover:bg-sky-300'
            }`}
          >
            {isVerified ? 'Verified ✓' : 'Mark Verified'}
          </button>
        </div>

        {/* Visual QR Code & Safety Numbers */}
        <div className="flex flex-col items-center p-4 bg-neutral-950 rounded-2xl border border-neutral-800 space-y-3">
          {/* Simulated QR Code Canvas */}
          <div className="relative p-3 bg-white rounded-xl shadow-inner">
            <div className="grid grid-cols-8 gap-0.5 w-28 h-28">
              {qrCells.map((filled, idx) => (
                <div
                  key={idx}
                  className={`${filled ? 'bg-neutral-950' : 'bg-white'} rounded-[1px]`}
                />
              ))}
            </div>
            {/* Center Lock Badge */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-7 h-7 rounded-full bg-sky-600 text-white flex items-center justify-center shadow">
                <Lock className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          <div className="text-center space-y-1">
            <span className="text-[11px] text-neutral-400 uppercase tracking-wider font-semibold">
              60-Digit Safety Number
            </span>
            <div className="font-mono text-xs text-sky-300 tracking-wider leading-relaxed px-2 bg-neutral-900/80 py-2 rounded-xl border border-neutral-800 select-all">
              {contact.safetyNumber}
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={handleCopySafetyNumber}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium transition-colors"
            >
              <Copy className="w-3.5 h-3.5 text-neutral-400" />
              <span>{copied ? 'Copied!' : 'Copy Numbers'}</span>
            </button>

            <button
              onClick={handleSimulateScan}
              disabled={scanSimulated}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium transition-colors"
            >
              <QrCode className="w-3.5 h-3.5 text-sky-400" />
              <span>{scanSimulated ? 'Scanning...' : 'Scan QR Code'}</span>
            </button>
          </div>
        </div>

        {/* Cryptographic Architecture Details */}
        <div className="space-y-2 text-xs">
          <div className="text-neutral-400 font-semibold text-[11px] uppercase tracking-wider">
            Cryptographic Parameters
          </div>

          <div className="p-3 bg-neutral-950 rounded-2xl border border-neutral-800 space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-neutral-400">Ratchet Algorithm</span>
              <span className="text-neutral-200 font-medium">Double Ratchet (Signal / UP 2.4)</span>
            </div>

            <div className="flex items-center justify-between text-[11px]">
              <span className="text-neutral-400">Symmetric Cipher</span>
              <span className="text-neutral-200 font-medium">AES-256-GCM Authenticated</span>
            </div>

            <div className="flex items-center justify-between text-[11px]">
              <span className="text-neutral-400">Forward Secrecy</span>
              <span className="text-emerald-400 font-medium">Per-Message Ephemeral Keys</span>
            </div>

            <div className="flex flex-col gap-0.5 text-[10px] pt-1 border-t border-neutral-800/80">
              <span className="text-neutral-400">Public Identity Key:</span>
              <span className="font-mono text-neutral-300 break-all">{contact.identityKey}</span>
            </div>
          </div>
        </div>

        {/* Close Button */}
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
