import React, { useState } from 'react';
import {
  Bell,
  BellOff,
  Check,
  CheckCheck,
  Code2,
  Filter,
  LogOut,
  MessageSquare,
  MessageSquarePlus,
  Pin,
  Search,
  Settings,
  ShieldCheck,
  UserCheck,
  Users,
} from 'lucide-react';
import { Conversation, User } from '../../types/chat';
import { soundEffects } from '../../utils/audioUtils';

interface SidebarProps {
  currentUser: User;
  allUsers: User[];
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onOpenNewChat: () => void;
  onOpenNewGroup: () => void;
  onOpenProfile: () => void;
  onOpenAuth: () => void;
  onSwitchUser: (userId: string) => void;
  onOpenStudio: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentUser,
  allUsers,
  conversations,
  activeConversationId,
  onSelectConversation,
  onOpenNewChat,
  onOpenNewGroup,
  onOpenProfile,
  onOpenAuth,
  onSwitchUser,
  onOpenStudio,
}) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'ALL' | 'UNREAD' | 'GROUPS'>('ALL');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundEffects.enabled = next;
  };

  const filteredConversations = conversations.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      (c.lastMessage?.content && c.lastMessage.content.toLowerCase().includes(search.toLowerCase()));

    if (!matchesSearch) return false;

    if (filter === 'UNREAD') return (c.unreadCount || 0) > 0;
    if (filter === 'GROUPS') return c.type === 'GROUP';
    return true;
  });

  const formatTimestamp = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const isToday = date.toDateString() === now.toDateString();
      if (isToday) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } catch {
      return '';
    }
  };

  return (
    <div className="w-full md:w-[380px] lg:w-[420px] h-full bg-[#111b21] border-r border-[#222e35] flex flex-col shrink-0 select-none">
      {/* Top Bar with Profile & Action Icons */}
      <div className="p-3 bg-[#202c33] flex items-center justify-between border-b border-[#222e35]">
        {/* User Profile & Switcher Button */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-[#2a3942] transition cursor-pointer text-left"
            title="Switch authenticated profile"
          >
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-10 h-10 rounded-full object-cover border border-[#2a3942]"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#00a884] border-2 border-[#202c33] rounded-full" />
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-semibold text-[#e9edef] leading-tight truncate max-w-[120px]">
                {currentUser.name}
              </p>
              <p className="text-[10px] text-[#00a884] font-medium flex items-center gap-1">
                <span>Active Account</span>
                <span className="text-[9px]">▾</span>
              </p>
            </div>
          </button>

          {/* User Switcher Dropdown */}
          {showUserDropdown && (
            <div className="absolute left-0 top-12 z-50 w-64 bg-[#202c33] rounded-xl shadow-2xl border border-[#2a3942] py-2 animate-fadeIn divide-y divide-[#2a3942]/60">
              <div className="px-3 py-1.5 text-[11px] font-semibold text-[#8696a0] uppercase tracking-wider flex items-center justify-between">
                <span>Switch Simulated Peer</span>
                <ShieldCheck className="w-3.5 h-3.5 text-[#00a884]" />
              </div>

              <div className="py-1">
                {allUsers.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => {
                      onSwitchUser(u.id);
                      setShowUserDropdown(false);
                    }}
                    className={`w-full px-3 py-2 text-left flex items-center gap-2.5 hover:bg-[#111b21] transition cursor-pointer ${
                      u.id === currentUser.id ? 'bg-[#111b21]/70' : ''
                    }`}
                  >
                    <img src={u.avatar} alt={u.name} className="w-7 h-7 rounded-full object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-[#e9edef] truncate">{u.name}</p>
                      <p className="text-[10px] text-[#8696a0] truncate">{u.email}</p>
                    </div>
                    {u.id === currentUser.id && <UserCheck className="w-4 h-4 text-[#00a884]" />}
                  </button>
                ))}
              </div>

              <div className="pt-1 px-1">
                <button
                  onClick={() => {
                    setShowUserDropdown(false);
                    onOpenAuth();
                  }}
                  className="w-full px-3 py-2 text-xs text-[#00a884] hover:bg-[#111b21] rounded-lg transition text-left flex items-center gap-2 cursor-pointer font-medium"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Register or Login New User</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1 text-[#aebac1]">
          {/* Audio Chime Toggle */}
          <button
            type="button"
            onClick={toggleSound}
            title={soundEnabled ? 'Mute notification chimes' : 'Unmute notification chimes'}
            className="p-2 hover:bg-[#2a3942] rounded-full transition cursor-pointer"
          >
            {soundEnabled ? (
              <Bell className="w-5 h-5 text-[#00a884]" />
            ) : (
              <BellOff className="w-5 h-5 text-[#8696a0]" />
            )}
          </button>

          {/* New Group */}
          <button
            type="button"
            onClick={onOpenNewGroup}
            title="Create New Group"
            className="p-2 hover:bg-[#2a3942] rounded-full transition cursor-pointer"
          >
            <Users className="w-5 h-5" />
          </button>

          {/* New 1-to-1 Chat */}
          <button
            type="button"
            onClick={onOpenNewChat}
            title="New Conversation"
            className="p-2 hover:bg-[#2a3942] rounded-full transition cursor-pointer"
          >
            <MessageSquarePlus className="w-5 h-5" />
          </button>

          {/* Profile & Credentials */}
          <button
            type="button"
            onClick={onOpenProfile}
            title="Profile & JWT Credentials"
            className="p-2 hover:bg-[#2a3942] rounded-full transition cursor-pointer"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Spring Boot STOMP Status Banner */}
      <div className="bg-[#182229] px-3 py-2 flex items-center justify-between border-b border-[#222e35] text-[11px]">
        <div className="flex items-center gap-2 text-[#00a884]">
          <span className="w-2 h-2 rounded-full bg-[#00a884] animate-pulse" />
          <span className="font-mono font-medium">STOMP BROKER: CONNECTED</span>
        </div>
        <button
          onClick={onOpenStudio}
          className="text-[#8696a0] hover:text-[#00a884] flex items-center gap-1 font-mono hover:underline cursor-pointer"
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>Java Studio</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-2 bg-[#111b21] border-b border-[#222e35]">
        <div className="relative">
          <Search className="w-4 h-4 text-[#8696a0] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search or start new chat"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#202c33] text-[#e9edef] text-xs pl-9 pr-4 py-2 rounded-lg focus:outline-none placeholder-[#8696a0]"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 mt-2 px-1">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition cursor-pointer ${
              filter === 'ALL'
                ? 'bg-[#00a884]/20 text-[#00a884] border border-[#00a884]/40'
                : 'bg-[#202c33] text-[#8696a0] hover:text-[#e9edef]'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('UNREAD')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition cursor-pointer ${
              filter === 'UNREAD'
                ? 'bg-[#00a884]/20 text-[#00a884] border border-[#00a884]/40'
                : 'bg-[#202c33] text-[#8696a0] hover:text-[#e9edef]'
            }`}
          >
            Unread
          </button>
          <button
            onClick={() => setFilter('GROUPS')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition cursor-pointer ${
              filter === 'GROUPS'
                ? 'bg-[#00a884]/20 text-[#00a884] border border-[#00a884]/40'
                : 'bg-[#202c33] text-[#8696a0] hover:text-[#e9edef]'
            }`}
          >
            Groups
          </button>
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto divide-y divide-[#202c33]/50">
        {filteredConversations.length === 0 ? (
          <div className="py-16 text-center text-xs text-[#8696a0] px-4">
            <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p>No conversations found</p>
            <button
              onClick={onOpenNewChat}
              className="mt-3 text-[#00a884] font-medium hover:underline cursor-pointer"
            >
              Start a new conversation
            </button>
          </div>
        ) : (
          filteredConversations.map((conv) => {
            const isActive = conv.id === activeConversationId;
            const lastMsg = conv.lastMessage;
            const isUnread = (conv.unreadCount || 0) > 0;

            return (
              <div
                key={conv.id}
                onClick={() => onSelectConversation(conv.id)}
                className={`flex items-center gap-3 px-3 py-3 cursor-pointer transition select-none ${
                  isActive ? 'bg-[#2a3942]' : 'hover:bg-[#202c33]'
                }`}
              >
                {/* Avatar with type badge */}
                <div className="relative shrink-0">
                  <img
                    src={conv.avatar}
                    alt={conv.title}
                    className="w-12 h-12 rounded-full object-cover border border-[#2a3942]"
                  />
                  {conv.type === 'GROUP' ? (
                    <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-[#00a884] text-[#111b21] rounded-full flex items-center justify-center text-[9px] font-bold">
                      G
                    </span>
                  ) : (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#00a884] border-2 border-[#111b21] rounded-full" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {/* Title & Timestamp */}
                  <div className="flex items-center justify-between mb-1">
                    <h4
                      className={`text-sm truncate font-medium ${
                        isUnread ? 'text-[#e9edef] font-semibold' : 'text-[#e9edef]'
                      }`}
                    >
                      {conv.title}
                    </h4>
                    <span
                      className={`text-[11px] shrink-0 font-mono ${
                        isUnread ? 'text-[#00a884] font-semibold' : 'text-[#8696a0]'
                      }`}
                    >
                      {formatTimestamp(lastMsg?.createdAt || conv.updatedAt)}
                    </span>
                  </div>

                  {/* Last Message Preview & Unread Badge */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-[#8696a0] truncate max-w-[240px]">
                      {lastMsg && lastMsg.senderId === currentUser.id && (
                        <span className="shrink-0">
                          {lastMsg.receiptStatus === 'READ' ? (
                            <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb]" />
                          ) : lastMsg.receiptStatus === 'DELIVERED' ? (
                            <CheckCheck className="w-3.5 h-3.5 text-[#8696a0]" />
                          ) : (
                            <Check className="w-3.5 h-3.5 text-[#8696a0]" />
                          )}
                        </span>
                      )}

                      <span className="truncate">
                        {lastMsg
                          ? conv.type === 'GROUP' && lastMsg.senderId !== currentUser.id
                            ? `${lastMsg.senderName.split(' ')[0]}: ${lastMsg.content}`
                            : lastMsg.content
                          : 'No messages yet'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 ml-2">
                      {conv.isPinned && <Pin className="w-3 h-3 text-[#8696a0]" />}
                      {isUnread && (
                        <span className="bg-[#00a884] text-[#111b21] text-[11px] font-bold rounded-full min-w-5 h-5 flex items-center justify-center px-1">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
