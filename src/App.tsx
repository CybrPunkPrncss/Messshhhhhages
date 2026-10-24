import { useState, useMemo, useEffect } from 'react';
import { Conversation, Contact, Message, FilterCategory } from './types';
import { INITIAL_CONVERSATIONS } from './data/initialData';
import { generatePrivacyPseudonym, getAvatarColor, getContactDisplayName } from './utils/privacyPseudonyms';
import { generateSafetyNumber, generateIdentityKey, generateFingerprint, encryptPayload, formatMessageTime } from './utils/crypto';

import { AndroidStatusBar } from './components/AndroidStatusBar';
import { TopSearchBar } from './components/TopSearchBar';
import { ConversationList } from './components/ConversationList';
import { ChatView } from './components/ChatView';
import { EncryptionModal } from './components/EncryptionModal';
import { PrivacyShieldModal } from './components/PrivacyShieldModal';
import { NewMessageModal } from './components/NewMessageModal';
import { SettingsModal } from './components/SettingsModal';
import { SimulatorControls } from './components/SimulatorControls';
import { AndroidNotificationBanner } from './components/AndroidNotificationBanner';
import { ShieldCheck, Lock, MessageSquare } from 'lucide-react';

const RANDOM_UNSAVED_TEXTS = [
  "Hi! Just wanted to check if you got my email about the community garden schedule?",
  "Hello, is this item still available? Can we coordinate a meetup?",
  "Hey there, reminder about tomorrow's neighborhood meeting at 6:30 PM.",
  "Thanks for connecting! I'm glad our phone numbers and chats stay private with E2EE.",
  "Quick question: does the conference pass include access to tomorrow's workshop?"
];

export default function App() {
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [activeConversationId, setActiveConversationId] = useState<string | null>('conv_1');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('all');
  const [isDeviceFrame, setIsDeviceFrame] = useState(true);

  // Modals state
  const [showEncryptionModal, setShowEncryptionModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Notification state
  const [incomingNotification, setIncomingNotification] = useState<{
    contact: Contact;
    messageText: string;
    conversationId: string;
  } | null>(null);

  // Responsive check for small mobile viewports
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Filter conversations
  const filteredConversations = useMemo(() => {
    return conversations.filter((conv) => {
      const { contact, messages } = conv;
      const displayName = getContactDisplayName(contact);

      // Search matching
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = displayName.toLowerCase().includes(query);
        const matchesSnippet = messages.some((m) => m.text.toLowerCase().includes(query));
        if (!matchesName && !matchesSnippet) return false;
      }

      // Filter category
      if (activeFilter === 'shielded') {
        return !contact.isSaved; // Unknown contacts whose phone numbers are masked
      }
      if (activeFilter === 'known') {
        return contact.isSaved;
      }
      if (activeFilter === 'archived') {
        return !!conv.contact.isArchived;
      }
      return true;
    });
  }, [conversations, searchQuery, activeFilter]);

  const activeConversation = useMemo(() => {
    return conversations.find((c) => c.id === activeConversationId) || null;
  }, [conversations, activeConversationId]);

  const shieldedContacts = useMemo(() => {
    return conversations.map((c) => c.contact).filter((c) => !c.isSaved);
  }, [conversations]);

  // Handle sending a new message
  const handleSendMessage = (text: string) => {
    if (!activeConversationId) return;

    const { ciphertext, iv } = encryptPayload(text);
    const now = Date.now();
    const newMsg: Message = {
      id: `msg_${now}_${Math.random().toString(36).substring(2, 6)}`,
      conversationId: activeConversationId,
      senderId: 'user',
      text,
      ciphertext,
      iv,
      timestamp: now,
      timeFormatted: formatMessageTime(now),
      status: 'sent',
      isE2EE: true,
      isRcs: true,
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeConversationId) {
          return {
            ...c,
            messages: [...c.messages, newMsg],
            lastMessageSnippet: text,
            lastMessageTimestamp: now,
          };
        }
        return c;
      })
    );

    // Transition message status: sent -> delivered -> read
    setTimeout(() => {
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === activeConversationId) {
            return {
              ...c,
              messages: c.messages.map((m) =>
                m.id === newMsg.id ? { ...m, status: 'delivered' as const } : m
              ),
            };
          }
          return c;
        })
      );
    }, 600);

    // Simulate contact reply after a short delay
    setTimeout(() => {
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === activeConversationId) {
            const replyNow = Date.now();
            const contactName = getContactDisplayName(c.contact);
            const replyText = c.contact.isSaved
              ? `Got your message! Thanks for confirming.`
              : `Received securely! Privacy Shield and E2EE are working great.`;

            const replyCipher = encryptPayload(replyText);
            const replyMsg: Message = {
              id: `msg_reply_${replyNow}`,
              conversationId: c.id,
              senderId: c.contact.id,
              text: replyText,
              ciphertext: replyCipher.ciphertext,
              iv: replyCipher.iv,
              timestamp: replyNow,
              timeFormatted: formatMessageTime(replyNow),
              status: 'read' as const,
              isE2EE: true,
              isRcs: true,
            };

            return {
              ...c,
              messages: c.messages.map((m) =>
                m.id === newMsg.id ? { ...m, status: 'read' as const } : m
              ).concat(replyMsg),
              lastMessageSnippet: replyText,
              lastMessageTimestamp: replyNow,
            };
          }
          return c;
        })
      );
    }, 1800);
  };

  // Add emoji reaction
  const handleAddReaction = (messageId: string, emoji: string) => {
    if (!activeConversationId) return;
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeConversationId) {
          return {
            ...c,
            messages: c.messages.map((m) => {
              if (m.id === messageId) {
                const current = m.reactions || [];
                const exists = current.some((r) => r.emoji === emoji && r.sender === 'user');
                const updated = exists
                  ? current.filter((r) => !(r.emoji === emoji && r.sender === 'user'))
                  : [...current, { emoji, sender: 'user' as const }];
                return { ...m, reactions: updated };
              }
              return m;
            }),
          };
        }
        return c;
      })
    );
  };

  // Simulate incoming SMS from an unknown unsaved phone number
  const handleSimulateUnknownIncoming = () => {
    // Generate a fresh unsaved phone number (which will NEVER be displayed on screen)
    const randomArea = Math.floor(200 + Math.random() * 700);
    const randomExch = Math.floor(200 + Math.random() * 700);
    const randomLine = Math.floor(1000 + Math.random() * 9000);
    const rawPhoneNumber = `+1${randomArea}${randomExch}${randomLine}`;

    // Generate random privacy pseudonym (e.g. "Emerald Lynx")
    const privacyAlias = generatePrivacyPseudonym(rawPhoneNumber);
    const avatarColor = getAvatarColor(rawPhoneNumber);
    const safetyNumber = generateSafetyNumber(rawPhoneNumber);
    const identityKey = generateIdentityKey(rawPhoneNumber);
    const fingerprint = generateFingerprint(rawPhoneNumber);

    const now = Date.now();
    const messageText = RANDOM_UNSAVED_TEXTS[Math.floor(Math.random() * RANDOM_UNSAVED_TEXTS.length)];
    const { ciphertext, iv } = encryptPayload(messageText);

    const newContact: Contact = {
      id: `contact_unsaved_${now}`,
      rawPhoneNumber, // Stored safely in memory, NEVER shown on screen!
      isSaved: false,
      name: privacyAlias,
      privacyAlias,
      privacyTheme: 'Mineral · Wildlife',
      avatarColor,
      isRcsEnabled: true,
      encryptionStatus: 'e2ee_active',
      safetyNumber,
      fingerprint,
      identityKey,
      lastActive: 'Just now',
    };

    const newConversationId = `conv_${now}`;
    const newMsg: Message = {
      id: `msg_${now}`,
      conversationId: newConversationId,
      senderId: newContact.id,
      text: messageText,
      ciphertext,
      iv,
      timestamp: now,
      timeFormatted: formatMessageTime(now),
      status: 'delivered',
      isE2EE: true,
      isRcs: true,
    };

    const newConversation: Conversation = {
      id: newConversationId,
      contact: newContact,
      messages: [newMsg],
      unreadCount: 1,
      lastMessageSnippet: messageText,
      lastMessageTimestamp: now,
    };

    setConversations((prev) => [newConversation, ...prev]);

    // Show Android heads-up notification with strictly the alias!
    setIncomingNotification({
      contact: newContact,
      messageText,
      conversationId: newConversationId,
    });

    // Auto dismiss after 5 seconds
    setTimeout(() => {
      setIncomingNotification((curr) =>
        curr?.conversationId === newConversationId ? null : curr
      );
    }, 5000);
  };

  // Simulate incoming from saved contact
  const handleSimulateKnownIncoming = () => {
    const saved = conversations.find((c) => c.contact.isSaved);
    if (!saved) return;

    const now = Date.now();
    const text = 'Hey! Confirming our RCS end-to-end encrypted session is active.';
    const { ciphertext, iv } = encryptPayload(text);

    const newMsg: Message = {
      id: `msg_${now}`,
      conversationId: saved.id,
      senderId: saved.contact.id,
      text,
      ciphertext,
      iv,
      timestamp: now,
      timeFormatted: formatMessageTime(now),
      status: 'delivered',
      isE2EE: true,
      isRcs: true,
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === saved.id) {
          return {
            ...c,
            messages: [...c.messages, newMsg],
            unreadCount: c.unreadCount + 1,
            lastMessageSnippet: text,
            lastMessageTimestamp: now,
          };
        }
        return c;
      })
    );

    setIncomingNotification({
      contact: saved.contact,
      messageText: text,
      conversationId: saved.id,
    });

    setTimeout(() => {
      setIncomingNotification((curr) =>
        curr?.conversationId === saved.id ? null : curr
      );
    }, 5000);
  };

  // Start chat with a phone number (creates shielded contact)
  const handleCreateConversation = (
    contactData: { rawPhoneNumber: string; isSaved: boolean; name?: string },
    initialText: string
  ) => {
    const now = Date.now();
    const rawNumber = contactData.rawPhoneNumber;
    const privacyAlias = generatePrivacyPseudonym(rawNumber);
    const avatarColor = getAvatarColor(rawNumber);

    const contact: Contact = {
      id: `contact_${now}`,
      rawPhoneNumber: rawNumber,
      isSaved: contactData.isSaved,
      name: contactData.isSaved && contactData.name ? contactData.name : privacyAlias,
      privacyAlias,
      privacyTheme: 'Mineral · Cosmic',
      avatarColor,
      isRcsEnabled: true,
      encryptionStatus: 'e2ee_active',
      safetyNumber: generateSafetyNumber(rawNumber),
      fingerprint: generateFingerprint(rawNumber),
      identityKey: generateIdentityKey(rawNumber),
      lastActive: 'Just now',
    };

    const newConvId = `conv_${now}`;
    const { ciphertext, iv } = encryptPayload(initialText);
    const newMsg: Message = {
      id: `msg_${now}`,
      conversationId: newConvId,
      senderId: 'user',
      text: initialText,
      ciphertext,
      iv,
      timestamp: now,
      timeFormatted: formatMessageTime(now),
      status: 'sent',
      isE2EE: true,
      isRcs: true,
    };

    const newConv: Conversation = {
      id: newConvId,
      contact,
      messages: [newMsg],
      unreadCount: 0,
      lastMessageSnippet: initialText,
      lastMessageTimestamp: now,
    };

    setConversations((prev) => [newConv, ...prev]);
    setActiveConversationId(newConvId);
  };

  // Save an unsaved contact with a custom name
  const handleSaveAsContact = (contactId: string, customName: string) => {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.contact.id === contactId) {
          return {
            ...c,
            contact: {
              ...c.contact,
              isSaved: true,
              name: customName,
            },
          };
        }
        return c;
      })
    );
  };

  // Regenerate privacy alias
  const handleRerollPseudonym = (contactId: string) => {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.contact.id === contactId) {
          const newAlias = generatePrivacyPseudonym();
          return {
            ...c,
            contact: {
              ...c.contact,
              privacyAlias: newAlias,
              name: newAlias,
            },
          };
        }
        return c;
      })
    );
  };

  // Mark contact E2EE as verified
  const handleVerifyContact = (contactId: string) => {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.contact.id === contactId) {
          const isCurrentVerified = c.contact.encryptionStatus === 'e2ee_verified';
          return {
            ...c,
            contact: {
              ...c.contact,
              encryptionStatus: isCurrentVerified ? 'e2ee_active' : 'e2ee_verified',
            },
          };
        }
        return c;
      })
    );
  };

  return (
    <div className="min-h-screen bg-[#0d0e11] text-[#e3e2e6] flex flex-col items-center justify-center relative font-sans antialiased overflow-x-hidden p-0 sm:p-4">
      {/* Simulation test bar in top right */}
      <SimulatorControls
        onSimulateUnknownIncoming={handleSimulateUnknownIncoming}
        onSimulateKnownIncoming={handleSimulateKnownIncoming}
        isDeviceFrame={isDeviceFrame}
        onToggleDeviceFrame={() => setIsDeviceFrame(!isDeviceFrame)}
        onOpenPrivacyModal={() => setShowPrivacyModal(true)}
      />

      {/* Android Heads-up Notification Banner */}
      {incomingNotification && (
        <AndroidNotificationBanner
          contact={incomingNotification.contact}
          messageText={incomingNotification.messageText}
          onOpen={() => {
            setActiveConversationId(incomingNotification.conversationId);
            setIncomingNotification(null);
          }}
          onDismiss={() => setIncomingNotification(null)}
        />
      )}

      {/* Main Container: Android Phone Frame OR Responsive Wide Layout */}
      <div
        className={`w-full transition-all duration-300 ${
          isDeviceFrame && !isSmallScreen
            ? 'max-w-[420px] h-[870px] rounded-[50px] border-[10px] border-[#222428] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col bg-[#131314] relative ring-1 ring-neutral-700/50'
            : 'w-full max-w-7xl h-screen sm:h-[92vh] sm:rounded-3xl border border-neutral-800 bg-[#131314] overflow-hidden flex flex-col shadow-2xl'
        }`}
      >
        {/* Android Camera Punch Hole (visible in phone frame mode) */}
        {isDeviceFrame && !isSmallScreen && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-black z-40 flex items-center justify-center border border-neutral-800">
            <div className="w-1.5 h-1.5 rounded-full bg-neutral-900 border border-neutral-800" />
          </div>
        )}

        {/* Android Status Bar */}
        <AndroidStatusBar rcsConnected={true} />

        {/* Application Body */}
        <div className="flex-1 flex overflow-hidden relative">
          {/* Layout Mode A: Phone Frame or Mobile View */}
          {isDeviceFrame || isSmallScreen ? (
            <div className="w-full h-full flex flex-col relative overflow-hidden">
              {activeConversation ? (
                <ChatView
                  conversation={activeConversation}
                  onBack={() => setActiveConversationId(null)}
                  onSendMessage={handleSendMessage}
                  onAddReaction={handleAddReaction}
                  onOpenEncryptionModal={() => setShowEncryptionModal(true)}
                  onOpenPrivacyModal={() => setShowPrivacyModal(true)}
                  onSaveAsContact={handleSaveAsContact}
                  onRerollPseudonym={handleRerollPseudonym}
                />
              ) : (
                <div className="flex-1 flex flex-col h-full bg-[#131314]">
                  <TopSearchBar
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    activeFilter={activeFilter}
                    onFilterChange={setActiveFilter}
                    onOpenPrivacyModal={() => setShowPrivacyModal(true)}
                    onOpenSettingsModal={() => setShowSettingsModal(true)}
                    totalConversationsCount={conversations.length}
                    shieldedCount={shieldedContacts.length}
                  />

                  <ConversationList
                    conversations={filteredConversations}
                    selectedId={activeConversationId}
                    onSelectConversation={(id) => {
                      setActiveConversationId(id);
                      setConversations((prev) =>
                        prev.map((c) => (c.id === id ? { ...c, unreadCount: 0 } : c))
                      );
                    }}
                    onStartNewChat={() => setShowNewMessageModal(true)}
                    onOpenPrivacyModal={() => setShowPrivacyModal(true)}
                  />
                </div>
              )}
            </div>
          ) : (
            /* Layout Mode B: Wide Tablet / Split Desktop View (Google Messages Web Style) */
            <div className="w-full h-full grid grid-cols-12 overflow-hidden">
              {/* Left Pane: Conversation List */}
              <div className="col-span-4 border-r border-neutral-800/80 flex flex-col h-full bg-[#131314] relative">
                <TopSearchBar
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  activeFilter={activeFilter}
                  onFilterChange={setActiveFilter}
                  onOpenPrivacyModal={() => setShowPrivacyModal(true)}
                  onOpenSettingsModal={() => setShowSettingsModal(true)}
                  totalConversationsCount={conversations.length}
                  shieldedCount={shieldedContacts.length}
                />

                <ConversationList
                  conversations={filteredConversations}
                  selectedId={activeConversationId}
                  onSelectConversation={(id) => {
                    setActiveConversationId(id);
                    setConversations((prev) =>
                      prev.map((c) => (c.id === id ? { ...c, unreadCount: 0 } : c))
                    );
                  }}
                  onStartNewChat={() => setShowNewMessageModal(true)}
                  onOpenPrivacyModal={() => setShowPrivacyModal(true)}
                />
              </div>

              {/* Right Pane: Active Chat View */}
              <div className="col-span-8 flex flex-col h-full bg-[#131314]">
                {activeConversation ? (
                  <ChatView
                    conversation={activeConversation}
                    onBack={() => setActiveConversationId(null)}
                    onSendMessage={handleSendMessage}
                    onAddReaction={handleAddReaction}
                    onOpenEncryptionModal={() => setShowEncryptionModal(true)}
                    onOpenPrivacyModal={() => setShowPrivacyModal(true)}
                    onSaveAsContact={handleSaveAsContact}
                    onRerollPseudonym={handleRerollPseudonym}
                  />
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-neutral-400">
                    <div className="w-20 h-20 rounded-full bg-neutral-800/80 flex items-center justify-center mb-4 text-sky-400 shadow-lg">
                      <Lock className="w-10 h-10" />
                    </div>
                    <h3 className="text-lg font-semibold text-neutral-200 mb-1">
                      Google Messages with End-to-End Encryption
                    </h3>
                    <p className="text-xs text-neutral-400 max-w-sm mb-4">
                      Select a conversation on the left to start texting. Phone numbers from unsaved contacts are shielded and assigned privacy code-names automatically.
                    </p>
                    <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/60 px-3 py-1.5 rounded-full border border-emerald-800/60">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Zero-Leak Phone Privacy Engine Active</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Android Bottom Gesture Bar */}
        {isDeviceFrame && !isSmallScreen && (
          <div className="w-full h-5 bg-[#131314] flex items-center justify-center z-30 shrink-0">
            <div className="w-32 h-1 bg-neutral-600 rounded-full" />
          </div>
        )}
      </div>

      {/* E2EE Safety Number Verification Modal */}
      {showEncryptionModal && activeConversation && (
        <EncryptionModal
          contact={activeConversation.contact}
          onClose={() => setShowEncryptionModal(false)}
          onVerifyContact={handleVerifyContact}
        />
      )}

      {/* Zero-Leak Phone Privacy Audit Modal */}
      {showPrivacyModal && (
        <PrivacyShieldModal
          shieldedContacts={shieldedContacts}
          onClose={() => setShowPrivacyModal(false)}
        />
      )}

      {/* Start New Chat Modal */}
      {showNewMessageModal && (
        <NewMessageModal
          existingContacts={conversations.map((c) => c.contact)}
          onClose={() => setShowNewMessageModal(false)}
          onCreateConversation={handleCreateConversation}
        />
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <SettingsModal onClose={() => setShowSettingsModal(false)} />
      )}
    </div>
  );
}
