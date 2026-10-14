import React, { useEffect, useState } from 'react';
import {
  Code2,
  Cpu,
  Layers,
  MessageSquare,
  RefreshCcw,
  Server,
  ShieldCheck,
  Terminal,
  UserCheck,
  Zap,
} from 'lucide-react';
import { Sidebar } from './components/chat/Sidebar';
import { ChatArea } from './components/chat/ChatArea';
import { EmptyChat } from './components/chat/EmptyChat';
import { NewChatModal } from './components/modals/NewChatModal';
import { NewGroupModal } from './components/modals/NewGroupModal';
import { ProfileModal } from './components/modals/ProfileModal';
import { AuthModal } from './components/modals/AuthModal';
import { CallModal } from './components/modals/CallModal';
import { ArchitectureVisualizer } from './components/studio/ArchitectureVisualizer';
import { ApiPlayground } from './components/studio/ApiPlayground';
import { CodeViewer } from './components/studio/CodeViewer';
import { chatStorage } from './services/chatStorage';
import { Conversation, Message, StompFrame, User } from './types/chat';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User>(chatStorage.getCurrentUser());
  const [conversations, setConversations] = useState<Conversation[]>(chatStorage.getConversations());
  const [allUsers, setAllUsers] = useState<User[]>(chatStorage.getAllUsers());
  const [activeConversationId, setActiveConversationId] = useState<string | null>(
    conversations[0]?.id || null
  );
  const [stompLogs, setStompLogs] = useState<StompFrame[]>(chatStorage.getStompLogs());
  const [activeTab, setActiveTab] = useState<'CHAT' | 'ARCHITECTURE' | 'API' | 'CODE'>('CHAT');

  // Modals state
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);
  const [isNewGroupOpen, setIsNewGroupOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [callState, setCallState] = useState<{ isOpen: boolean; isVideo: boolean }>({
    isOpen: false,
    isVideo: false,
  });

  // Reactive state binding with chatStorage
  useEffect(() => {
    const unsubscribe = chatStorage.subscribe(() => {
      setCurrentUser(chatStorage.getCurrentUser());
      setConversations(chatStorage.getConversations());
      setAllUsers(chatStorage.getAllUsers());
      setStompLogs(chatStorage.getStompLogs());
    });
    return () => unsubscribe();
  }, []);

  const activeConversation = conversations.find((c) => c.id === activeConversationId);
  const currentMessages = activeConversationId ? chatStorage.getMessages(activeConversationId) : [];
  const currentTypingUsers = activeConversationId ? chatStorage.getTypingUsers(activeConversationId) : [];

  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id);
    chatStorage.markAsRead(id);
  };

  const handleSendMessage = (
    content: string,
    type: 'TEXT' | 'IMAGE' | 'AUDIO' = 'TEXT',
    mediaUrl?: string
  ) => {
    if (!activeConversationId) return;
    chatStorage.sendMessage(activeConversationId, content, type, mediaUrl);
  };

  const handleTyping = (isTyping: boolean) => {
    if (!activeConversationId) return;
    chatStorage.setTyping(activeConversationId, currentUser.name, isTyping);
  };

  const handleStartDirectChat = (targetUserId: string) => {
    const conv = chatStorage.createDirectConversation(targetUserId);
    setActiveConversationId(conv.id);
  };

  const handleCreateGroup = (title: string, memberIds: string[], avatar?: string) => {
    const group = chatStorage.createGroupConversation(title, memberIds, avatar);
    setActiveConversationId(group.id);
  };

  const handleResetData = () => {
    if (window.confirm('Reset all messages, mock conversations and STOMP logs to default state?')) {
      chatStorage.resetToDefault();
      setActiveConversationId(INITIAL_CONVERSATIONS_ID);
    }
  };

  const INITIAL_CONVERSATIONS_ID = 'conv_group_1';

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#0c1317] font-sans antialiased text-[#e9edef]">
      {/* Top Application Bar */}
      <header className="h-14 bg-[#111b21] border-b border-[#222e35] px-4 flex items-center justify-between shrink-0 select-none z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#00a884] flex items-center justify-center text-[#111b21] shadow-md font-bold">
            <MessageSquare className="w-5 h-5 fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-tight text-[#e9edef]">WhatsApp Web</span>
              <span className="text-[10px] bg-[#00a884]/20 text-[#00a884] px-2 py-0.5 rounded-full font-mono font-medium border border-[#00a884]/30">
                Spring Boot 3.3 STOMP
              </span>
            </div>
            <p className="text-[10px] text-[#8696a0] hidden sm:block">
              Java 17 • Spring Security JWT • Hibernate JPA • MySQL 8
            </p>
          </div>
        </div>

        {/* View Mode Tabs */}
        <div className="flex items-center gap-1 bg-[#202c33] p-1 rounded-xl border border-[#2a3942]">
          <button
            type="button"
            onClick={() => setActiveTab('CHAT')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              activeTab === 'CHAT'
                ? 'bg-[#00a884] text-[#111b21] shadow-xs'
                : 'text-[#8696a0] hover:text-[#e9edef]'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">WhatsApp Web</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ARCHITECTURE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              activeTab === 'ARCHITECTURE'
                ? 'bg-[#00a884] text-[#111b21] shadow-xs'
                : 'text-[#8696a0] hover:text-[#e9edef]'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Architecture &amp; STOMP</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('API')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              activeTab === 'API'
                ? 'bg-[#00a884] text-[#111b21] shadow-xs'
                : 'text-[#8696a0] hover:text-[#e9edef]'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">REST Console</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('CODE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              activeTab === 'CODE'
                ? 'bg-[#00a884] text-[#111b21] shadow-xs'
                : 'text-[#8696a0] hover:text-[#e9edef]'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Java Source</span>
          </button>
        </div>

        {/* Right Tools */}
        <div className="flex items-center gap-3">
          {/* Quick Active User Pill */}
          <button
            type="button"
            onClick={() => setIsProfileOpen(true)}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-[#202c33] transition cursor-pointer"
            title="Logged in as"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-7 h-7 rounded-full object-cover border border-[#00a884]"
            />
            <span className="text-xs font-medium text-[#e9edef] hidden md:inline truncate max-w-[100px]">
              {currentUser.name.split(' ')[0]}
            </span>
          </button>

          {/* Reset button */}
          <button
            type="button"
            onClick={handleResetData}
            title="Reset Mock Data"
            className="p-2 text-[#8696a0] hover:text-[#e9edef] hover:bg-[#202c33] rounded-lg transition cursor-pointer"
          >
            <RefreshCcw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Body View */}
      <main className="flex-1 flex overflow-hidden relative">
        {activeTab === 'CHAT' && (
          <div className="flex-1 flex w-full h-full overflow-hidden">
            {/* Sidebar (Responsive: hidden on mobile if chat active) */}
            <div
              className={`w-full md:w-auto h-full ${
                activeConversationId ? 'hidden md:flex' : 'flex'
              }`}
            >
              <Sidebar
                currentUser={currentUser}
                allUsers={allUsers}
                conversations={conversations}
                activeConversationId={activeConversationId}
                onSelectConversation={handleSelectConversation}
                onOpenNewChat={() => setIsNewChatOpen(true)}
                onOpenNewGroup={() => setIsNewGroupOpen(true)}
                onOpenProfile={() => setIsProfileOpen(true)}
                onOpenAuth={() => setIsAuthOpen(true)}
                onSwitchUser={(userId) => chatStorage.switchUser(userId)}
                onOpenStudio={() => setActiveTab('ARCHITECTURE')}
              />
            </div>

            {/* Chat Area or Empty state */}
            <div
              className={`flex-1 h-full flex flex-col ${
                !activeConversationId ? 'hidden md:flex' : 'flex'
              }`}
            >
              {activeConversation ? (
                <ChatArea
                  conversation={activeConversation}
                  currentUser={currentUser}
                  messages={currentMessages}
                  typingUsers={currentTypingUsers}
                  onSendMessage={handleSendMessage}
                  onTyping={handleTyping}
                  onBack={() => setActiveConversationId(null)}
                  onStartCall={(isVideo) => setCallState({ isOpen: true, isVideo })}
                />
              ) : (
                <EmptyChat
                  onStartChat={() => setIsNewChatOpen(true)}
                  onOpenStudio={() => setActiveTab('ARCHITECTURE')}
                />
              )}
            </div>
          </div>
        )}

        {activeTab === 'ARCHITECTURE' && (
          <ArchitectureVisualizer stompLogs={stompLogs} />
        )}

        {activeTab === 'API' && <ApiPlayground />}

        {activeTab === 'CODE' && <CodeViewer />}
      </main>

      {/* Global Modals */}
      <NewChatModal
        isOpen={isNewChatOpen}
        onClose={() => setIsNewChatOpen(false)}
        users={allUsers}
        currentUserId={currentUser.id}
        onSelectUser={handleStartDirectChat}
      />

      <NewGroupModal
        isOpen={isNewGroupOpen}
        onClose={() => setIsNewGroupOpen(false)}
        users={allUsers}
        currentUserId={currentUser.id}
        onCreateGroup={handleCreateGroup}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        currentUser={currentUser}
        jwtToken={chatStorage.getJwtToken()}
        onUpdateProfile={(name, status) => chatStorage.updateUserProfile(name, status)}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={() => {
          setActiveConversationId(conversations[0]?.id || null);
        }}
      />

      {activeConversation && (
        <CallModal
          isOpen={callState.isOpen}
          onClose={() => setCallState({ isOpen: false, isVideo: false })}
          conversation={activeConversation}
          isVideo={callState.isVideo}
        />
      )}
    </div>
  );
}
