import React, { useState } from 'react';
import { Check, Copy, Key, Shield, User as UserIcon, X } from 'lucide-react';
import { User } from '../../types/chat';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  jwtToken: string;
  onUpdateProfile: (name: string, statusMessage: string, avatar?: string) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  jwtToken,
  onUpdateProfile,
}) => {
  const [name, setName] = useState(currentUser.name);
  const [statusMessage, setStatusMessage] = useState(currentUser.statusMessage);
  const [copiedToken, setCopiedToken] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(name.trim(), statusMessage.trim());
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const copyToken = () => {
    navigator.clipboard.writeText(jwtToken);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="w-full max-w-md bg-[#202c33] rounded-2xl shadow-2xl border border-[#2a3942] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-[#111b21] flex items-center justify-between border-b border-[#2a3942]">
          <div className="flex items-center gap-2 text-[#e9edef] font-semibold text-base">
            <UserIcon className="w-5 h-5 text-[#00a884]" />
            <span>Profile &amp; Credentials</span>
          </div>
          <button
            onClick={onClose}
            className="text-[#8696a0] hover:text-[#e9edef] p-1.5 rounded-lg hover:bg-[#202c33] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-5 space-y-5">
          {savedSuccess && (
            <div className="p-3 bg-emerald-950/60 border border-emerald-500/50 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>Profile updated in MySQL and synchronized with Spring Data JPA.</span>
            </div>
          )}

          {/* Avatar display */}
          <div className="flex flex-col items-center">
            <div className="relative group">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-[#00a884] shadow-md"
              />
              <span className="absolute bottom-1 right-1 w-5 h-5 bg-[#00a884] border-2 border-[#202c33] rounded-full" />
            </div>
            <p className="mt-2 text-xs text-[#8696a0]">{currentUser.email}</p>
          </div>

          {/* Name Field */}
          <div>
            <label className="block text-xs font-semibold text-[#8696a0] uppercase tracking-wider mb-1.5">
              Your Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-[#111b21] text-[#e9edef] text-sm px-4 py-2.5 rounded-xl border border-[#2a3942] focus:border-[#00a884] focus:outline-none"
            />
            <p className="text-[11px] text-[#8696a0] mt-1">
              This name will be visible to all conversation participants.
            </p>
          </div>

          {/* Status Message Field */}
          <div>
            <label className="block text-xs font-semibold text-[#8696a0] uppercase tracking-wider mb-1.5">
              About / Status
            </label>
            <input
              type="text"
              value={statusMessage}
              onChange={(e) => setStatusMessage(e.target.value)}
              className="w-full bg-[#111b21] text-[#e9edef] text-sm px-4 py-2.5 rounded-xl border border-[#2a3942] focus:border-[#00a884] focus:outline-none"
            />
          </div>

          {/* JWT Security Card */}
          <div className="p-4 bg-[#111b21] rounded-xl border border-[#2a3942] space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-medium text-[#00a884]">
                <Shield className="w-3.5 h-3.5" />
                <span>Active Spring Security JWT Token</span>
              </div>
              <button
                type="button"
                onClick={copyToken}
                className="text-xs text-[#8696a0] hover:text-[#e9edef] flex items-center gap-1 bg-[#202c33] px-2 py-1 rounded cursor-pointer border border-[#2a3942]"
              >
                {copiedToken ? <Check className="w-3 h-3 text-[#00a884]" /> : <Copy className="w-3 h-3" />}
                <span>{copiedToken ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="p-2 bg-[#0b141a] rounded text-[10px] font-mono text-[#8696a0] break-all max-h-16 overflow-y-auto border border-[#202c33]">
              {jwtToken}
            </div>
            <p className="text-[10px] text-[#667781]">
              Injected into STOMP CONNECT frame via <code className="text-[#00a884]">Authorization: Bearer</code> header.
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-[#8696a0] hover:text-[#e9edef] rounded-lg cursor-pointer"
            >
              Close
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#00a884] hover:bg-[#02906f] text-[#111b21] font-semibold text-sm rounded-lg transition cursor-pointer shadow"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
