export type EncryptionStatus = 'e2ee_verified' | 'e2ee_active' | 'sms_fallback';

export type ContactType = 'saved' | 'unsaved_shielded';

export interface Contact {
  id: string;
  // Raw phone number is stored in secure memory only and NEVER rendered for unsaved contacts!
  rawPhoneNumber: string;
  isSaved: boolean;
  name: string; // Saved name (if saved) or assigned privacy alias (if unsaved)
  privacyAlias: string; // Randomly generated or deterministic privacy name (e.g. "Cobalt Falcon")
  privacyTheme: string; // e.g. "Mineral · Fauna"
  avatarColor: string; // Material You palette tone
  isRcsEnabled: boolean;
  encryptionStatus: EncryptionStatus;
  safetyNumber: string; // 60-digit verification code
  fingerprint: string; // Hex fingerprint (e.g. 4A9F 8201 DC5E...)
  identityKey: string; // Public identity key string
  isPinned?: boolean;
  isArchived?: boolean;
  isBlocked?: boolean;
  lastActive: string;
}

export interface MessageReaction {
  emoji: string;
  sender: 'user' | 'contact';
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: 'user' | string; // 'user' or contact id
  text: string; // Decrypted text for user display
  ciphertext: string; // Simulated/real AES-GCM ciphertext representation
  iv: string;
  timestamp: number;
  timeFormatted: string;
  status: 'sending' | 'sent' | 'delivered' | 'read';
  isE2EE: boolean;
  isRcs: boolean;
  reactions?: MessageReaction[];
  mediaType?: 'none' | 'image' | 'audio';
  mediaUrl?: string;
  audioDuration?: string;
  isIncomingSimulated?: boolean;
}

export interface Conversation {
  id: string;
  contact: Contact;
  messages: Message[];
  unreadCount: number;
  lastMessageSnippet: string;
  lastMessageTimestamp: number;
  isDraft?: string;
}

export type FilterCategory = 'all' | 'known' | 'shielded' | 'archived';

export interface PrivacyPreferences {
  shieldUnsavedNumbers: boolean; // Must always be true according to user brief
  aliasTheme: 'elemental' | 'celestial' | 'wildlife' | 'botanical';
  autoEncryptRcs: boolean;
  hideLockScreenPreviews: boolean;
  maskClipboardNumberLeaks: boolean;
}
