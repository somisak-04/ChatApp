import React, { useState } from 'react';
import { Search, UserPlus, X } from 'lucide-react';
import { User } from '../../types/chat';

interface NewChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  currentUserId: string;
  onSelectUser: (userId: string) => void;
}

export const NewChatModal: React.FC<NewChatModalProps> = ({
  isOpen,
  onClose,
  users,
  currentUserId,
  onSelectUser,
}) => {
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filteredUsers = users.filter(
    (u) =>
      u.id !== currentUserId &&
      (u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="w-full max-w-md bg-[#202c33] rounded-2xl shadow-2xl border border-[#2a3942] overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 bg-[#111b21] flex items-center justify-between border-b border-[#2a3942]">
          <div className="flex items-center gap-2 text-[#e9edef] font-semibold text-base">
            <UserPlus className="w-5 h-5 text-[#00a884]" />
            <span>New Chat</span>
          </div>
          <button
            onClick={onClose}
            className="text-[#8696a0] hover:text-[#e9edef] p-1.5 rounded-lg hover:bg-[#202c33] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-3 bg-[#111b21]/60 border-b border-[#2a3942]">
          <div className="relative">
            <Search className="w-4 h-4 text-[#8696a0] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
              className="w-full bg-[#202c33] text-[#e9edef] text-sm pl-9 pr-4 py-2 rounded-lg border border-[#2a3942] focus:border-[#00a884] focus:outline-none placeholder-[#8696a0]"
            />
          </div>
        </div>

        {/* User list */}
        <div className="flex-1 overflow-y-auto p-2 divide-y divide-[#2a3942]/40">
          {filteredUsers.length === 0 ? (
            <div className="py-12 text-center text-sm text-[#8696a0]">
              No contacts found matching "{search}"
            </div>
          ) : (
            filteredUsers.map((user) => (
              <button
                key={user.id}
                onClick={() => {
                  onSelectUser(user.id);
                  onClose();
                }}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-[#111b21] transition text-left cursor-pointer group"
              >
                <div className="relative shrink-0">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-12 h-12 rounded-full object-cover border border-[#2a3942]"
                  />
                  {user.status === 'ONLINE' && (
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#00a884] border-2 border-[#202c33] rounded-full" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-[#e9edef] group-hover:text-[#00a884] transition truncate">
                      {user.name}
                    </p>
                    <span className="text-[11px] text-[#8696a0] uppercase tracking-wider font-mono">
                      {user.status}
                    </span>
                  </div>
                  <p className="text-xs text-[#8696a0] truncate mt-0.5">
                    {user.statusMessage || user.email}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
