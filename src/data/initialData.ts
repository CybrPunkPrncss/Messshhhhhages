import { Conversation, Contact, Message } from '../types';
import { generatePrivacyPseudonym, getAvatarColor } from '../utils/privacyPseudonyms';
import { generateSafetyNumber, generateIdentityKey, generateFingerprint, encryptPayload, formatMessageTime } from '../utils/crypto';

const now = Date.now();
const minute = 60 * 1000;
const hour = 60 * minute;
const day = 24 * hour;

// Unsaved sender 1
const unsavedPhone1 = '+14158923341';
const alias1 = generatePrivacyPseudonym(unsavedPhone1); // e.g. "Cobalt Falcon"
const contact1: Contact = {
  id: 'contact_unsaved_1',
  rawPhoneNumber: unsavedPhone1, // Strictly hidden in UI!
  isSaved: false,
  name: alias1,
  privacyAlias: alias1,
  privacyTheme: 'Mineral · Fauna',
  avatarColor: getAvatarColor(unsavedPhone1),
  avatarPatternIndex: 0,
  isRcsEnabled: true,
  encryptionStatus: 'e2ee_active',
  safetyNumber: generateSafetyNumber(unsavedPhone1),
  fingerprint: generateFingerprint(unsavedPhone1),
  identityKey: generateIdentityKey(unsavedPhone1),
  lastActive: '5m ago',
  isPinned: true,
};

const msg1_1: Message = {
  id: 'm1_1',
  conversationId: 'conv_1',
  senderId: contact1.id,
  text: 'Hello! I saw your post regarding the vintage road bike. Is it still available for pickup?',
  ciphertext: encryptPayload('Hello! I saw your post regarding the vintage road bike. Is it still available for pickup?').ciphertext,
  iv: '9f8b1c4d2e0a7b5c',
  timestamp: now - 35 * minute,
  timeFormatted: formatMessageTime(now - 35 * minute),
  status: 'read',
  isE2EE: true,
  isRcs: true,
};

const msg1_2: Message = {
  id: 'm1_2',
  conversationId: 'conv_1',
  senderId: 'user',
  text: 'Yes it is! Tomorrow afternoon around 3:00 PM works best for me.',
  ciphertext: encryptPayload('Yes it is! Tomorrow afternoon around 3:00 PM works best for me.').ciphertext,
  iv: '1a2b3c4d5e6f7a8b',
  timestamp: now - 28 * minute,
  timeFormatted: formatMessageTime(now - 28 * minute),
  status: 'read',
  isE2EE: true,
  isRcs: true,
};

const msg1_3: Message = {
  id: 'm1_3',
  conversationId: 'conv_1',
  senderId: contact1.id,
  text: 'Awesome, 3 PM is perfect. I appreciate that our messages and identities stay protected with E2EE.',
  ciphertext: encryptPayload('Awesome, 3 PM is perfect. I appreciate that our messages and identities stay protected with E2EE.').ciphertext,
  iv: '3d4e5f6a7b8c9d0e',
  timestamp: now - 12 * minute,
  timeFormatted: formatMessageTime(now - 12 * minute),
  status: 'read',
  isE2EE: true,
  isRcs: true,
  reactions: [{ emoji: '👍', sender: 'user' }]
};

// Saved Contact 1 (Sarah Chen)
const savedPhone1 = '+12065550183';
const contact2: Contact = {
  id: 'contact_saved_1',
  rawPhoneNumber: savedPhone1,
  isSaved: true,
  name: 'Sarah Chen',
  privacyAlias: generatePrivacyPseudonym(savedPhone1),
  privacyTheme: 'Saved Contact',
  avatarColor: '#76d6d5',
  isRcsEnabled: true,
  encryptionStatus: 'e2ee_verified',
  safetyNumber: generateSafetyNumber(savedPhone1),
  fingerprint: generateFingerprint(savedPhone1),
  identityKey: generateIdentityKey(savedPhone1),
  lastActive: 'Just now',
};

const msg2_1: Message = {
  id: 'm2_1',
  conversationId: 'conv_2',
  senderId: contact2.id,
  text: 'Hey! Did you get a chance to inspect the new design tokens? The dark mode palette looks fantastic.',
  ciphertext: encryptPayload('Hey! Did you get a chance to inspect the new design tokens? The dark mode palette looks fantastic.').ciphertext,
  iv: '7b8c9d0e1f2a3b4c',
  timestamp: now - 3 * hour,
  timeFormatted: formatMessageTime(now - 3 * hour),
  status: 'read',
  isE2EE: true,
  isRcs: true,
};

const msg2_2: Message = {
  id: 'm2_2',
  conversationId: 'conv_2',
  senderId: 'user',
  text: 'Yes! The Material You dynamic tones and zero-leak privacy controls are dialed in. Safety numbers are verified too.',
  ciphertext: encryptPayload('Yes! The Material You dynamic tones and zero-leak privacy controls are dialed in. Safety numbers are verified too.').ciphertext,
  iv: '5a6b7c8d9e0f1a2b',
  timestamp: now - 2 * hour,
  timeFormatted: formatMessageTime(now - 2 * hour),
  status: 'read',
  isE2EE: true,
  isRcs: true,
  reactions: [{ emoji: '❤️', sender: contact2.id as any }]
};

const msg2_3: Message = {
  id: 'm2_3',
  conversationId: 'conv_2',
  senderId: contact2.id,
  text: 'See you at the team sync at 4:30 PM!',
  ciphertext: encryptPayload('See you at the team sync at 4:30 PM!').ciphertext,
  iv: '4f3e2d1c0b9a8f7e',
  timestamp: now - 45 * minute,
  timeFormatted: formatMessageTime(now - 45 * minute),
  status: 'read',
  isE2EE: true,
  isRcs: true,
};

// Unsaved sender 2
const unsavedPhone2 = '+16505550199';
const alias2 = generatePrivacyPseudonym(unsavedPhone2); // e.g. "Amber Horizon"
const contact3: Contact = {
  id: 'contact_unsaved_2',
  rawPhoneNumber: unsavedPhone2, // Strictly hidden in UI!
  isSaved: false,
  name: alias2,
  privacyAlias: alias2,
  privacyTheme: 'Solar · Terrain',
  avatarColor: getAvatarColor(unsavedPhone2),
  avatarPatternIndex: 2,
  isRcsEnabled: true,
  encryptionStatus: 'e2ee_active',
  safetyNumber: generateSafetyNumber(unsavedPhone2),
  fingerprint: generateFingerprint(unsavedPhone2),
  identityKey: generateIdentityKey(unsavedPhone2),
  lastActive: '2h ago',
};

const msg3_1: Message = {
  id: 'm3_1',
  conversationId: 'conv_3',
  senderId: contact3.id,
  text: 'Hi there! We are organizing the community park cleanup this weekend. Let us know if you can bring garden gloves.',
  ciphertext: encryptPayload('Hi there! We are organizing the community park cleanup this weekend. Let us know if you can bring garden gloves.').ciphertext,
  iv: '2c3d4e5f6a7b8c9d',
  timestamp: now - 5 * hour,
  timeFormatted: formatMessageTime(now - 5 * hour),
  status: 'read',
  isE2EE: true,
  isRcs: true,
};

const msg3_2: Message = {
  id: 'm3_2',
  conversationId: 'conv_3',
  senderId: 'user',
  text: 'I have two extra pairs! Count me in for 9:00 AM.',
  ciphertext: encryptPayload('I have two extra pairs! Count me in for 9:00 AM.').ciphertext,
  iv: '1d2e3f4a5b6c7d8e',
  timestamp: now - 4 * hour,
  timeFormatted: formatMessageTime(now - 4 * hour),
  status: 'delivered',
  isE2EE: true,
  isRcs: true,
};

// Saved Contact 2 (Marcus Brody)
const savedPhone2 = '+13125550147';
const contact4: Contact = {
  id: 'contact_saved_2',
  rawPhoneNumber: savedPhone2,
  isSaved: true,
  name: 'Marcus Brody',
  privacyAlias: generatePrivacyPseudonym(savedPhone2),
  privacyTheme: 'Saved Contact',
  avatarColor: '#d0bcff',
  isRcsEnabled: true,
  encryptionStatus: 'e2ee_verified',
  safetyNumber: generateSafetyNumber(savedPhone2),
  fingerprint: generateFingerprint(savedPhone2),
  identityKey: generateIdentityKey(savedPhone2),
  lastActive: 'Yesterday',
};

const msg4_1: Message = {
  id: 'm4_1',
  conversationId: 'conv_4',
  senderId: contact4.id,
  text: 'Can you send over the encrypted RCS telemetry logs when you get a chance?',
  ciphertext: encryptPayload('Can you send over the encrypted RCS telemetry logs when you get a chance?').ciphertext,
  iv: '8a9b0c1d2e3f4a5b',
  timestamp: now - 1 * day,
  timeFormatted: formatMessageTime(now - 1 * day),
  status: 'read',
  isE2EE: true,
  isRcs: true,
};

// Unsaved sender 3
const unsavedPhone3 = '+19175550172';
const alias3 = generatePrivacyPseudonym(unsavedPhone3); // e.g. "Silver Pine"
const contact5: Contact = {
  id: 'contact_unsaved_3',
  rawPhoneNumber: unsavedPhone3, // Strictly hidden!
  isSaved: false,
  name: alias3,
  privacyAlias: alias3,
  privacyTheme: 'Alpine · Flora',
  avatarColor: getAvatarColor(unsavedPhone3),
  avatarPatternIndex: 6,
  isRcsEnabled: true,
  encryptionStatus: 'e2ee_active',
  safetyNumber: generateSafetyNumber(unsavedPhone3),
  fingerprint: generateFingerprint(unsavedPhone3),
  identityKey: generateIdentityKey(unsavedPhone3),
  lastActive: '2d ago',
};

const msg5_1: Message = {
  id: 'm5_1',
  conversationId: 'conv_5',
  senderId: contact5.id,
  text: 'Your neighborhood artisan bakery order #4092 is ready for contactless locker pickup.',
  ciphertext: encryptPayload('Your neighborhood artisan bakery order #4092 is ready for contactless locker pickup.').ciphertext,
  iv: '6e7f8a9b0c1d2e3f',
  timestamp: now - 2 * day,
  timeFormatted: formatMessageTime(now - 2 * day),
  status: 'read',
  isE2EE: true,
  isRcs: true,
};

export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv_1',
    contact: contact1,
    messages: [msg1_1, msg1_2, msg1_3],
    unreadCount: 0,
    lastMessageSnippet: msg1_3.text,
    lastMessageTimestamp: msg1_3.timestamp,
  },
  {
    id: 'conv_2',
    contact: contact2,
    messages: [msg2_1, msg2_2, msg2_3],
    unreadCount: 0,
    lastMessageSnippet: msg2_3.text,
    lastMessageTimestamp: msg2_3.timestamp,
  },
  {
    id: 'conv_3',
    contact: contact3,
    messages: [msg3_1, msg3_2],
    unreadCount: 0,
    lastMessageSnippet: 'I have two extra pairs! Count me in for 9:00 AM.',
    lastMessageTimestamp: msg3_2.timestamp,
  },
  {
    id: 'conv_4',
    contact: contact4,
    messages: [msg4_1],
    unreadCount: 0,
    lastMessageSnippet: msg4_1.text,
    lastMessageTimestamp: msg4_1.timestamp,
  },
  {
    id: 'conv_5',
    contact: contact5,
    messages: [msg5_1],
    unreadCount: 0,
    lastMessageSnippet: msg5_1.text,
    lastMessageTimestamp: msg5_1.timestamp,
  },
];
