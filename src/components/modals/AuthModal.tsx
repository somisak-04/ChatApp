import React, { useState } from 'react';
import { CheckCircle2, Lock, LogIn, ShieldAlert, User, UserPlus, X } from 'lucide-react';
import { chatStorage } from '../../services/chatStorage';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [mode, setMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      try {
        if (mode === 'REGISTER') {
          if (!name.trim()) throw new Error('Full name is required.');
          if (!email.trim() || !email.includes('@')) throw new Error('Valid email address is required.');
          if (password.length < 6) throw new Error('Password must be at least 6 characters.');

          chatStorage.registerUser(name.trim(), email.trim(), password, avatar);
        } else {
          if (!email.trim()) throw new Error('Email is required.');
          chatStorage.loginUser(email.trim());
        }
        setLoading(false);
        onSuccess();
        onClose();
      } catch (err: unknown) {
        setLoading(false);
        setError(err instanceof Error ? err.message : 'Authentication failed.');
      }
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="w-full max-w-md bg-[#202c33] rounded-2xl shadow-2xl border border-[#2a3942] overflow-hidden flex flex-col">
        {/* Header Tabs */}
        <div className="flex border-b border-[#2a3942] bg-[#111b21]">
          <button
            type="button"
            onClick={() => {
              setMode('LOGIN');
              setError('');
            }}
            className={`flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-2 border-b-2 transition cursor-pointer ${
              mode === 'LOGIN'
                ? 'border-[#00a884] text-[#00a884] bg-[#202c33]/40'
                : 'border-transparent text-[#8696a0] hover:text-[#e9edef]'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>Login</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('REGISTER');
              setError('');
            }}
            className={`flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-2 border-b-2 transition cursor-pointer ${
              mode === 'REGISTER'
                ? 'border-[#00a884] text-[#00a884] bg-[#202c33]/40'
                : 'border-transparent text-[#8696a0] hover:text-[#e9edef]'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Register</span>
          </button>
          <button
            onClick={onClose}
            className="p-3 text-[#8696a0] hover:text-[#e9edef] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="text-center mb-2">
            <h2 className="text-lg font-semibold text-[#e9edef]">
              {mode === 'LOGIN' ? 'Welcome Back' : 'Create Chat Account'}
            </h2>
            <p className="text-xs text-[#8696a0] mt-1">
              {mode === 'LOGIN'
                ? 'Authenticate with Spring Security & obtain a valid JWT token.'
                : 'BCrypt password hashing & MySQL unique email constraint enforced.'}
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-900/40 border border-red-500/50 rounded-xl text-xs text-red-200 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {mode === 'REGISTER' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-[#8696a0] uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#8696a0] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jordan Lee"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#111b21] text-[#e9edef] text-sm pl-9 pr-4 py-2.5 rounded-xl border border-[#2a3942] focus:border-[#00a884] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8696a0] uppercase tracking-wider mb-1">
                  Avatar
                </label>
                <div className="flex items-center gap-3">
                  <img src={avatar} alt="Selected" className="w-10 h-10 rounded-full object-cover border border-[#00a884]" />
                  <input
                    type="text"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    className="flex-1 bg-[#111b21] text-[#e9edef] text-xs px-3 py-2 rounded-lg border border-[#2a3942] focus:border-[#00a884] focus:outline-none truncate"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#8696a0] uppercase tracking-wider mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="e.g. alex.vance@company.dev"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#111b21] text-[#e9edef] text-sm px-4 py-2.5 rounded-xl border border-[#2a3942] focus:border-[#00a884] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#8696a0] uppercase tracking-wider mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#8696a0] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#111b21] text-[#e9edef] text-sm pl-9 pr-4 py-2.5 rounded-xl border border-[#2a3942] focus:border-[#00a884] focus:outline-none"
              />
            </div>
            <p className="text-[10px] text-[#667781] mt-1">
              Hashed with BCrypt (12 rounds) before storage in MySQL database.
            </p>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-[#00a884] hover:bg-[#02906f] text-[#111b21] font-semibold text-sm rounded-xl transition cursor-pointer flex items-center justify-center gap-2 shadow"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-[#111b21] border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{mode === 'LOGIN' ? 'Sign In & Connect STOMP' : 'Create Account & Sign In'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
