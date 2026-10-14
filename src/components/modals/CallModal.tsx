import React, { useEffect, useState } from 'react';
import { Mic, MicOff, PhoneOff, Video, VideoOff } from 'lucide-react';
import { Conversation } from '../../types/chat';
import { soundEffects } from '../../utils/audioUtils';

interface CallModalProps {
  isOpen: boolean;
  onClose: () => void;
  conversation: Conversation;
  isVideo: boolean;
}

export const CallModal: React.FC<CallModalProps> = ({
  isOpen,
  onClose,
  conversation,
  isVideo: initialIsVideo,
}) => {
  const [isVideo, setIsVideo] = useState(initialIsVideo);
  const [isMuted, setIsMuted] = useState(false);
  const [status, setStatus] = useState<'RINGING' | 'CONNECTED'>('RINGING');
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!isOpen) return;

    soundEffects.playRing();
    const connectTimer = setTimeout(() => {
      setStatus('CONNECTED');
    }, 2500);

    return () => clearTimeout(connectTimer);
  }, [isOpen]);

  useEffect(() => {
    if (status !== 'CONNECTED') return;
    const interval = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [status]);

  if (!isOpen) return null;

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
      <div className="w-full max-w-sm bg-[#111b21] rounded-3xl shadow-2xl border border-[#2a3942] p-8 flex flex-col items-center text-center relative overflow-hidden">
        {/* Animated background glow */}
        <div className="absolute -top-20 -left-20 w-48 h-48 bg-[#00a884]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Profile Avatar */}
        <div className="relative mb-4">
          <img
            src={conversation.avatar}
            alt={conversation.title}
            className="w-24 h-24 rounded-full object-cover border-4 border-[#00a884] shadow-xl"
          />
          {status === 'CONNECTED' && (
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#00a884] flex items-center justify-center border-2 border-[#111b21]">
              <span className="w-2.5 h-2.5 bg-white rounded-full animate-ping" />
            </div>
          )}
        </div>

        <h3 className="text-xl font-semibold text-[#e9edef] mb-1">
          {conversation.title}
        </h3>

        <p className="text-sm font-medium text-[#00a884] mb-6">
          {status === 'RINGING' ? 'Ringing STOMP peer...' : `Connected • ${formatTime(seconds)}`}
        </p>

        {/* Pulsing Audio Waves */}
        <div className="flex items-center justify-center gap-1.5 h-8 mb-8">
          {[40, 70, 90, 50, 80, 100, 60, 85, 45, 65].map((h, i) => (
            <div
              key={i}
              className="w-1 bg-[#00a884] rounded-full transition-all duration-300"
              style={{
                height: status === 'CONNECTED' ? `${h}%` : '20%',
                opacity: status === 'CONNECTED' ? 0.9 : 0.3,
                animation: status === 'CONNECTED' ? `pulse 1.${i + 2}s infinite alternate` : 'none',
              }}
            />
          ))}
        </div>

        {/* Call Controls */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setIsMuted(!isMuted)}
            className={`p-3.5 rounded-full border transition cursor-pointer ${
              isMuted
                ? 'bg-red-500/20 border-red-500 text-red-400'
                : 'bg-[#202c33] border-[#2a3942] text-[#e9edef] hover:bg-[#2a3942]'
            }`}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="p-4 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-lg transition cursor-pointer transform hover:scale-105"
          >
            <PhoneOff className="w-6 h-6" />
          </button>

          <button
            type="button"
            onClick={() => setIsVideo(!isVideo)}
            className={`p-3.5 rounded-full border transition cursor-pointer ${
              !isVideo
                ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                : 'bg-[#202c33] border-[#2a3942] text-[#e9edef] hover:bg-[#2a3942]'
            }`}
          >
            {isVideo ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
};
