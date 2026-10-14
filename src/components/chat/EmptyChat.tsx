import React from 'react';
import { Lock, MessageSquare, ShieldCheck, Zap } from 'lucide-react';

interface EmptyChatProps {
  onStartChat: () => void;
  onOpenStudio: () => void;
}

export const EmptyChat: React.FC<EmptyChatProps> = ({ onStartChat, onOpenStudio }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[#222e35] text-[#8696a0] border-b-[6px] border-[#00a884]">
      <div className="max-w-md flex flex-col items-center">
        <div className="w-20 h-20 rounded-full bg-[#111b21] flex items-center justify-center mb-6 text-[#00a884] shadow-lg border border-[#2a3942]">
          <MessageSquare className="w-10 h-10" />
        </div>

        <h1 className="text-3xl font-light text-[#e9edef] mb-3">
          WhatsApp Web &amp; Spring Boot
        </h1>

        <p className="text-sm text-[#8696a0] leading-relaxed mb-6">
          Real-time messaging powered by Java 17, Spring Boot 3.3, WebSocket STOMP, and MySQL 8. Select a conversation on the left or start a new direct or group chat.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          <button
            onClick={onStartChat}
            className="px-5 py-2.5 bg-[#00a884] hover:bg-[#02906f] text-[#111b21] font-semibold text-sm rounded-full transition shadow flex items-center gap-2 cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            New Conversation
          </button>
          <button
            onClick={onOpenStudio}
            className="px-5 py-2.5 bg-[#2a3942] hover:bg-[#32434f] text-[#e9edef] font-medium text-sm rounded-full transition border border-[#3b4a54] flex items-center gap-2 cursor-pointer"
          >
            <Zap className="w-4 h-4 text-[#00a884]" />
            Architecture &amp; Code
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs text-[#667781] bg-[#111b21]/70 px-4 py-2 rounded-full border border-[#202c33]">
          <Lock className="w-3.5 h-3.5 text-[#00a884]" />
          <span>Spring Security JWT authenticated • WebSocket STOMP broker active</span>
        </div>
      </div>
    </div>
  );
};
