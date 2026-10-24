import { useState } from 'react';
import { Search, Mic, ShieldCheck, Settings, CheckCircle2, Lock, X } from 'lucide-react';
import { FilterCategory } from '../types';

interface TopSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeFilter: FilterCategory;
  onFilterChange: (filter: FilterCategory) => void;
  onOpenPrivacyModal: () => void;
  onOpenSettingsModal: () => void;
  totalConversationsCount: number;
  shieldedCount: number;
}

export function TopSearchBar({
  searchQuery,
  onSearchChange,
  activeFilter,
  onFilterChange,
  onOpenPrivacyModal,
  onOpenSettingsModal,
  totalConversationsCount,
  shieldedCount,
}: TopSearchBarProps) {
  const [showAccountMenu, setShowAccountMenu] = useState(false);

  return (
    <div className="pt-2 pb-3 px-3.5 space-y-2.5 bg-neutral-900 border-b border-neutral-800/80">
      {/* Material You Pill Search Bar */}
      <div className="relative">
        <div className="flex items-center h-12 w-full px-4 rounded-full bg-neutral-800/90 text-neutral-200 border border-neutral-700/60 shadow-sm focus-within:border-sky-500/80 focus-within:ring-2 focus-within:ring-sky-500/20 transition-all">
          <Search className="w-5 h-5 text-neutral-400 shrink-0 mr-3" />
          
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search conversations"
            className="w-full bg-transparent text-sm text-neutral-100 placeholder-neutral-400 focus:outline-none"
          />

          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="p-1 rounded-full text-neutral-400 hover:text-neutral-200 mr-1"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => {
              // Voice search simulation
              onSearchChange('pickup');
            }}
            title="Voice search"
            className="p-1.5 text-neutral-400 hover:text-neutral-200 rounded-full transition-colors mr-1"
          >
            <Mic className="w-4 h-4" />
          </button>

          {/* Google Profile Avatar */}
          <button
            onClick={() => setShowAccountMenu(!showAccountMenu)}
            className="relative w-8 h-8 rounded-full bg-sky-600 text-white font-semibold text-xs flex items-center justify-center border-2 border-neutral-700 hover:border-sky-400 transition-all ml-1 shrink-0"
            title="Google Account & Messages Profile"
          >
            <span>D</span>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border border-neutral-900 rounded-full" />
          </button>
        </div>

        {/* Account popup dialog */}
        {showAccountMenu && (
          <div className="absolute right-0 top-14 w-72 p-3 bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-sky-600 text-white font-semibold text-sm flex items-center justify-center">
                  D
                </div>
                <div>
                  <div className="text-xs font-semibold text-neutral-100">Dalton Lind</div>
                  <div className="text-[10px] text-neutral-400">daltonjlind@gmail.com</div>
                </div>
              </div>
              <button
                onClick={() => setShowAccountMenu(false)}
                className="text-neutral-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-2.5 space-y-2 text-xs">
              <div className="flex items-center justify-between text-neutral-300 px-1">
                <span className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-sky-400" />
                  RCS Chats
                </span>
                <span className="text-[11px] text-sky-400 font-medium">Connected</span>
              </div>
              <div className="flex items-center justify-between text-neutral-300 px-1">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Privacy Number Shield
                </span>
                <span className="text-[11px] text-emerald-400 font-medium">Active (Zero-Leak)</span>
              </div>
              <div className="flex items-center justify-between text-neutral-300 px-1">
                <span className="text-neutral-400">E2EE Security</span>
                <span className="text-[11px] text-emerald-400">Signal / UP 2.4</span>
              </div>
            </div>

            <div className="pt-2 border-t border-neutral-800 flex items-center justify-between">
              <button
                onClick={() => {
                  setShowAccountMenu(false);
                  onOpenPrivacyModal();
                }}
                className="text-xs text-sky-400 hover:text-sky-300 font-medium py-1 px-2 rounded-lg hover:bg-neutral-800 transition-colors"
              >
                Privacy Audit
              </button>
              <button
                onClick={() => {
                  setShowAccountMenu(false);
                  onOpenSettingsModal();
                }}
                className="flex items-center gap-1 text-xs text-neutral-300 hover:text-white py-1 px-2 rounded-lg hover:bg-neutral-800 transition-colors"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Settings</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Zero-Leak Phone Privacy Banner Trigger */}
      <div 
        onClick={onOpenPrivacyModal}
        className="w-full flex items-center justify-between px-3 py-1.5 rounded-xl bg-neutral-800/60 hover:bg-neutral-800 text-neutral-300 text-xs cursor-pointer border border-neutral-700/40 transition-colors"
      >
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-[11px] text-neutral-200">
            <span className="font-medium text-emerald-400">Privacy Shield:</span> Unsaved phone numbers are masked on screen as random aliases
          </span>
        </div>
        <span className="text-[10px] text-sky-400 font-medium shrink-0 ml-1">
          {shieldedCount} Shielded
        </span>
      </div>

      {/* Filter Tabs (Interactive segmented buttons) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
        <button
          onClick={() => onFilterChange('all')}
          className={`px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap transition-colors ${
            activeFilter === 'all'
              ? 'bg-sky-400 text-neutral-950 font-semibold shadow-sm'
              : 'bg-neutral-800/80 text-neutral-300 hover:bg-neutral-700/80'
          }`}
        >
          All ({totalConversationsCount})
        </button>

        <button
          onClick={() => onFilterChange('shielded')}
          className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap transition-colors ${
            activeFilter === 'shielded'
              ? 'bg-emerald-400 text-neutral-950 font-semibold shadow-sm'
              : 'bg-neutral-800/80 text-neutral-300 hover:bg-neutral-700/80'
          }`}
        >
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          <span>Shielded Unknowns ({shieldedCount})</span>
        </button>

        <button
          onClick={() => onFilterChange('known')}
          className={`px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap transition-colors ${
            activeFilter === 'known'
              ? 'bg-sky-400 text-neutral-950 font-semibold shadow-sm'
              : 'bg-neutral-800/80 text-neutral-300 hover:bg-neutral-700/80'
          }`}
        >
          Known Contacts
        </button>

        <button
          onClick={() => onFilterChange('archived')}
          className={`px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap transition-colors ${
            activeFilter === 'archived'
              ? 'bg-sky-400 text-neutral-950 font-semibold shadow-sm'
              : 'bg-neutral-800/80 text-neutral-300 hover:bg-neutral-700/80'
          }`}
        >
          Archived
        </button>
      </div>
    </div>
  );
}
