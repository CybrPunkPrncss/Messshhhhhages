import { useState, useEffect } from 'react';
import { Wifi, BatteryMedium, ShieldCheck, Lock } from 'lucide-react';

interface AndroidStatusBarProps {
  rcsConnected?: boolean;
}

export function AndroidStatusBar({ rcsConnected = true }: AndroidStatusBarProps) {
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      hours = hours % 12 || 12;
      setCurrentTime(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-8 px-4 flex items-center justify-between text-xs font-medium text-slate-300 select-none bg-neutral-950/80 backdrop-blur-sm z-30 shrink-0">
      {/* Left side: Time & Notification status */}
      <div className="flex items-center gap-2">
        <span className="font-semibold tracking-tight text-white">{currentTime || '10:42'}</span>
        <div className="flex items-center gap-1.5 ml-1 text-slate-400">
          {rcsConnected && (
            <span className="flex items-center gap-1 text-[10px] text-sky-400 font-normal" title="RCS Chat Connected (End-to-End Encrypted)">
              <Lock className="w-2.5 h-2.5" />
              <span>RCS</span>
            </span>
          )}
          <span className="flex items-center text-[10px] text-emerald-400 font-normal" title="Privacy Shield Active: Zero-Leak Phone Masking">
            <ShieldCheck className="w-2.5 h-2.5" />
          </span>
        </div>
      </div>

      {/* Right side: 5G, Wi-Fi, Battery */}
      <div className="flex items-center gap-2.5 text-slate-300">
        <span className="text-[10px] font-bold text-slate-400 tracking-wider">5G</span>
        <Wifi className="w-3.5 h-3.5 text-slate-300" />
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-slate-400">92%</span>
          <BatteryMedium className="w-4 h-4 text-slate-200" />
        </div>
      </div>
    </div>
  );
}
