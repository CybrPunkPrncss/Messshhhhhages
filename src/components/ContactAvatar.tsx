import { Contact } from '../types';
import { getContactDisplayName, getAvatarInitials } from '../utils/privacyPseudonyms';
import { ShieldCheck, Lock } from 'lucide-react';

interface ContactAvatarProps {
  contact: Contact;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showBadge?: boolean;
}

const SIZE_CONFIG = {
  xs: {
    container: 'w-6 h-6 text-[9px]',
    badge: 'w-3.5 h-3.5',
    badgeIcon: 'w-2 h-2',
    badgeOffset: '-bottom-0.5 -right-0.5',
  },
  sm: {
    container: 'w-8 h-8 text-xs',
    badge: 'w-4 h-4',
    badgeIcon: 'w-2.5 h-2.5',
    badgeOffset: '-bottom-1 -right-1',
  },
  md: {
    container: 'w-10 h-10 text-xs',
    badge: 'w-4 h-4',
    badgeIcon: 'w-2.5 h-2.5',
    badgeOffset: '-bottom-1 -right-1',
  },
  lg: {
    container: 'w-12 h-12 text-sm',
    badge: 'w-5 h-5',
    badgeIcon: 'w-3 h-3',
    badgeOffset: '-bottom-1 -right-1',
  },
  xl: {
    container: 'w-16 h-16 text-base',
    badge: 'w-6 h-6',
    badgeIcon: 'w-3.5 h-3.5',
    badgeOffset: '-bottom-1 -right-1',
  },
};

// 8 sprite positions for the 2x4 grid in /assets/aistudio/Screenshot_2026-10-24_6.32.28_AM_40bc0880.png
// 4 columns (0%, 33.333%, 66.666%, 100%) and 2 rows (0%, 100%)
const PATTERN_POSITIONS: Record<number, string> = {
  0: '0% 0%',       // Top-left: Starburst tie-dye
  1: '33.333% 0%',  // Top-center-left: Swirling vortex
  2: '66.666% 0%',  // Top-center-right: Radiating pink heart
  3: '100% 0%',     // Top-right: Intricate mandala sunburst
  4: '0% 100%',     // Bottom-left: Spiky flower ripple
  5: '33.333% 100%',// Bottom-center-left: Rainbow layered heart
  6: '66.666% 100%',// Bottom-center-right: Tight circular vortex
  7: '100% 100%',   // Bottom-right: Sharp star mandala
};

export const REFERENCE_IMAGE_PATH = '/assets/aistudio/contact_images_black_bg.png';

/**
 * Returns a deterministic or random pattern index (0 to 7) for unsaved phone numbers
 */
export function getRandomPatternIndex(seed: string = ''): number {
  if (seed) {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = (hash << 5) - hash + seed.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash) % 8;
  }
  return Math.floor(Math.random() * 8);
}

export function ContactAvatar({
  contact,
  size = 'md',
  className = '',
  showBadge = false,
}: ContactAvatarProps) {
  const isUnsaved = !contact.isSaved;
  const displayName = getContactDisplayName(contact);
  const initials = getAvatarInitials(displayName);
  const config = SIZE_CONFIG[size];

  // If unsaved, select one of the 8 patterns from the reference image
  const patternIndex = typeof contact.avatarPatternIndex === 'number'
    ? (contact.avatarPatternIndex % 8)
    : getRandomPatternIndex(contact.rawPhoneNumber || contact.privacyAlias);

  const backgroundPosition = PATTERN_POSITIONS[patternIndex] || '0% 0%';

  return (
    <div className={`relative shrink-0 select-none ${className}`}>
      {isUnsaved ? (
        /* Unsaved Contact Avatar: Distinctive contact image with black background matching the app */
        <div
          className={`${config.container} rounded-full overflow-hidden bg-black shadow-sm ring-1 ring-neutral-800 transition-transform`}
          title={`Unsaved Contact · Pattern #${patternIndex + 1}`}
        >
          <div
            className="w-full h-full rounded-full transition-all"
            style={{
              backgroundImage: `url('${REFERENCE_IMAGE_PATH}')`,
              backgroundSize: '400% 200%',
              backgroundPosition: backgroundPosition,
              backgroundRepeat: 'no-repeat',
            }}
          />
        </div>
      ) : (
        /* Saved Contact Avatar: Standard Material You initial badge */
        <div
          className={`${config.container} rounded-full flex items-center justify-center text-neutral-950 font-bold shadow-sm ring-1 ring-neutral-700/50`}
          style={{ backgroundColor: contact.avatarColor || '#a8c7fa' }}
          title={displayName}
        >
          {initials}
        </div>
      )}

      {/* Optional Badge Overlay (Shield for unsaved, Lock for saved E2EE) */}
      {showBadge && (
        <span
          className={`absolute ${config.badgeOffset} ${config.badge} rounded-full bg-neutral-900 border border-neutral-700 flex items-center justify-center shadow-md z-10 ${
            isUnsaved ? 'text-emerald-400' : 'text-sky-400'
          }`}
          title={isUnsaved ? 'Privacy Shielded: Number masked' : 'End-to-End Encrypted'}
        >
          {isUnsaved ? (
            <ShieldCheck className={config.badgeIcon} />
          ) : (
            <Lock className={config.badgeIcon} />
          )}
        </span>
      )}
    </div>
  );
}
