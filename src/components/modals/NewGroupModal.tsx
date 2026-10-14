import React, { useState } from 'react';
import { Check, Users, X } from 'lucide-react';
import { User } from '../../types/chat';

interface NewGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  currentUserId: string;
  onCreateGroup: (title: string, memberIds: string[], avatar?: string) => void;
}

const PRESET_GROUP_AVATARS = [
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=150&auto=format&fit=crop&q=80',
];

export const NewGroupModal: React.FC<NewGroupModalProps> = ({
  isOpen,
  onClose,
  users,
  currentUserId,
  onCreateGroup,
}) => {
  const [title, setTitle] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(PRESET_GROUP_AVATARS[0]);
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const candidateUsers = users.filter((u) => u.id !== currentUserId);

  const toggleMember = (userId: string) => {
    setSelectedMemberIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Group name is required.');
      return;
    }
    if (selectedMemberIds.length === 0) {
      setError('Please select at least 1 member for the group.');
      return;
    }

    onCreateGroup(title.trim(), selectedMemberIds, selectedAvatar);
    setTitle('');
    setSelectedMemberIds([]);
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="w-full max-w-lg bg-[#202c33] rounded-2xl shadow-2xl border border-[#2a3942] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-[#111b21] flex items-center justify-between border-b border-[#2a3942]">
          <div className="flex items-center gap-2 text-[#e9edef] font-semibold text-base">
            <Users className="w-5 h-5 text-[#00a884]" />
            <span>Create New Group</span>
          </div>
          <button
            onClick={onClose}
            className="text-[#8696a0] hover:text-[#e9edef] p-1.5 rounded-lg hover:bg-[#202c33] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleCreate} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-4 space-y-4 overflow-y-auto flex-1">
            {error && (
              <div className="p-3 bg-red-900/40 border border-red-500/50 rounded-lg text-xs text-red-200">
                {error}
              </div>
            )}

            {/* Group Name & Avatar */}
            <div>
              <label className="block text-xs font-semibold text-[#8696a0] uppercase tracking-wider mb-2">
                Group Details
              </label>
              <div className="flex items-center gap-4">
                <img
                  src={selectedAvatar}
                  alt="Group Avatar"
                  className="w-14 h-14 rounded-full object-cover border-2 border-[#00a884] shrink-0"
                />
                <input
                  type="text"
                  placeholder="Enter group subject (e.g. Spring Boot Architecture)..."
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (error) setError('');
                  }}
                  className="flex-1 bg-[#111b21] text-[#e9edef] text-sm px-4 py-2.5 rounded-xl border border-[#2a3942] focus:border-[#00a884] focus:outline-none placeholder-[#8696a0]"
                />
              </div>

              {/* Avatar Selector */}
              <div className="mt-3">
                <span className="text-[11px] text-[#8696a0]">Choose Group Avatar:</span>
                <div className="flex gap-2 mt-1.5">
                  {PRESET_GROUP_AVATARS.map((url, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedAvatar(url)}
                      className={`w-9 h-9 rounded-full overflow-hidden border-2 transition cursor-pointer ${
                        selectedAvatar === url ? 'border-[#00a884] scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={url} alt="preset" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Member Selection */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-[#8696a0] uppercase tracking-wider">
                  Add Members ({selectedMemberIds.length} selected)
                </label>
              </div>

              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                {candidateUsers.map((user) => {
                  const isChecked = selectedMemberIds.includes(user.id);
                  return (
                    <div
                      key={user.id}
                      onClick={() => toggleMember(user.id)}
                      className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer border transition ${
                        isChecked
                          ? 'bg-[#00a884]/15 border-[#00a884]/40'
                          : 'bg-[#111b21]/60 border-[#2a3942]/60 hover:bg-[#111b21]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <p className="text-sm font-medium text-[#e9edef]">{user.name}</p>
                          <p className="text-xs text-[#8696a0]">{user.email}</p>
                        </div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center border transition ${
                          isChecked
                            ? 'bg-[#00a884] border-[#00a884] text-[#111b21]'
                            : 'border-[#3b4a54]'
                        }`}
                      >
                        {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 bg-[#111b21] border-t border-[#2a3942] flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-[#8696a0] hover:text-[#e9edef] rounded-lg cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#00a884] hover:bg-[#02906f] text-[#111b21] font-semibold text-sm rounded-lg transition cursor-pointer flex items-center gap-2 shadow"
            >
              <Users className="w-4 h-4" />
              Create Group
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
