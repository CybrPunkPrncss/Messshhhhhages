import { useState } from 'react';
import { Smartphone, Monitor, ShieldAlert, Sparkles, MessageSquare, Zap, Lock } from 'lucide-react';

interface SimulatorControlsProps {
  onSimulateUnknownIncoming: () => void;
  onSimulateKnownIncoming: () => void;
  isDeviceFrame: boolean;
  onToggleDeviceFrame: () => void;
  onOpenPrivacyModal: () => void;
}

export function SimulatorControls({
  onSimulateUnknownIncoming,
  onSimulateKnownIncoming,
  isDeviceFrame,
  onToggleDeviceFrame,
  onOpenPrivacyModal,
}: SimulatorControlsProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="fixed top-3 right-3 z-40 max-w-sm">
      <div className="bg-neutral-900/95 backdrop-blur-md border border-neutral-700/80 rounded-2xl shadow-2xl p-2.5 text-xs text-neutral-200 transition-all">
        <div className="flex items-center justify-between gap-3 pb-1.5 border-b border-neutral-800">
          <div className="flex items-center gap-1.5 font-semibold text-neutral-100 text-[11px]">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>Privacy & RCS Simulator</span>
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-[10px] text-neutral-400 hover:text-neutral-200 px-1.5 py-0.5 rounded bg-neutral-800"
          >
            {collapsed ? 'Expand' : 'Hide'}
          </button>
        </div>

        {!collapsed && (
          <div className="mt-2 space-y-2">
            <p className="text-[10px] text-neutral-400 leading-tight">
              Test receiving messages from unsaved numbers to verify that phone numbers are concealed and assigned random aliases.
            </p>

            <div className="flex flex-col gap-1.5">
              {/* Primary action to test brief's main privacy requirement */}
              <button
                onClick={onSimulateUnknownIncoming}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-semibold text-[11px] shadow-sm transition-all"
                title="Send an incoming SMS/RCS from an unsaved phone number"
              >
                <div className="flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Incoming SMS from Unknown Number</span>
                </div>
                <span className="text-[9px] uppercase tracking-wider bg-neutral-950/20 px-1 py-0.5 rounded">
                  Test Privacy
                </span>
              </button>

              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={onSimulateKnownIncoming}
                  className="flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-[10px] font-medium transition-colors"
                >
                  <MessageSquare className="w-3 h-3 text-sky-400" />
                  <span>Incoming (Saved)</span>
                </button>

                <button
                  onClick={onToggleDeviceFrame}
                  className="flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-[10px] font-medium transition-colors"
                  title="Switch between Android phone frame and wide responsive view"
                >
                  {isDeviceFrame ? (
                    <>
                      <Monitor className="w-3 h-3 text-sky-400" />
                      <span>Tablet View</span>
                    </>
                  ) : (
                    <>
                      <Smartphone className="w-3 h-3 text-sky-400" />
                      <span>Phone Frame</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
