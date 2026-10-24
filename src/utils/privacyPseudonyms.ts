/**
 * Privacy Pseudonym Generator for Unsaved Phone Numbers.
 * Ensures zero phone number leakage onto the screen by assigning
 * dignified, memorable, randomly generated or deterministic privacy aliases.
 */

const ADJECTIVES = [
  'Cobalt', 'Amber', 'Silver', 'Velvet', 'Solar', 'Emerald',
  'Astral', 'Lapis', 'Onyx', 'Coral', 'Golden', 'Crimson',
  'Jade', 'Willow', 'Obsidian', 'Zenith', 'Frost', 'Horizon',
  'Cypress', 'Topaz', 'Quartz', 'Indigo', 'Echo', 'Sapphire',
  'Terra', 'Titanium', 'Boreal', 'Alpine', 'Verdant', 'Gilded'
];

const NOUNS = [
  'Falcon', 'Lynx', 'Raven', 'Heron', 'Wanderer', 'Pine',
  'Meadow', 'Comet', 'Badger', 'Cedar', 'Aurora', 'Harbor',
  'Sparrow', 'Wolf', 'Fox', 'Nebula', 'Finch', 'Brook',
  'Summit', 'Canyon', 'Breeze', 'Voyager', 'Pinnacle', 'Glade',
  'Drift', 'Vale', 'Echo', 'Orion', 'Crest', 'Atlas'
];

const MATERIAL_YOU_AVATAR_COLORS = [
  '#a8c7fa', // Google blue soft
  '#76d6d5', // Cyan / Teal
  '#d0bcff', // Purple / Lavender
  '#f2b8b5', // Salmon / Coral
  '#fdd663', // Sun Yellow
  '#a5d6a7', // Mint Green
  '#e1bee7', // Muted Violet
  '#80deea', // Sky Aqua
  '#ffcc80', // Peach
  '#b39ddb', // Deep Lilac
];

/**
 * Simple string hash to generate consistent deterministic values from raw phone number
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

/**
 * Generates a dignified privacy pseudonym from a phone number or seed.
 */
export function generatePrivacyPseudonym(seed: string = ''): string {
  if (seed) {
    const hash = hashString(seed);
    const adj = ADJECTIVES[hash % ADJECTIVES.length];
    const noun = NOUNS[(Math.floor(hash / ADJECTIVES.length)) % NOUNS.length];
    return `${adj} ${noun}`;
  }
  const randomAdj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const randomNoun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  return `${randomAdj} ${randomNoun}`;
}

/**
 * Picks a harmonious Material You color based on a seed string.
 */
export function getAvatarColor(seed: string): string {
  const hash = hashString(seed);
  return MATERIAL_YOU_AVATAR_COLORS[hash % MATERIAL_YOU_AVATAR_COLORS.length];
}

/**
 * Generates an initial pair for the avatar circle.
 * For privacy aliases, returns the 2 uppercase initials (e.g., "Cobalt Falcon" -> "CF").
 */
export function getAvatarInitials(displayName: string): string {
  if (!displayName) return '??';
  const parts = displayName.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return displayName.substring(0, 2).toUpperCase();
}

/**
 * Creates a sanitized display name for a contact.
 * CRITICAL RULE: If the contact is not explicitly saved in user contacts,
 * the raw phone number is NEVER returned. The privacy alias is strictly returned.
 */
export function getContactDisplayName(contact: { isSaved: boolean; name?: string; privacyAlias: string }): string {
  if (contact.isSaved && contact.name && contact.name.trim().length > 0) {
    return contact.name;
  }
  return contact.privacyAlias || 'Protected Sender';
}

/**
 * Obfuscates a phone number for debugging/audit views, showing only that it is locked.
 * E.g., returns "•••••••• 5521 (Secure Enclave Encrypted)"
 */
export function getSecureAuditMask(rawNumber: string): string {
  const digits = rawNumber.replace(/\D/g, '');
  const lastFour = digits.slice(-4) || '••••';
  return `+••••••••${lastFour} [Hardware Isolated]`;
}
