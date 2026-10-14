import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  Check,
  CheckCheck,
  FileText,
  Image as ImageIcon,
  Mic,
  MoreVertical,
  Paperclip,
  Phone,
  Play,
  Pause,
  Search,
  Send,
  Smile,
  Video,
  X,
} from 'lucide-react';
import { Conversation, Message, User } from '../../types/chat';

interface ChatAreaProps {
  conversation: Conversation;
  currentUser: User;
  messages: Message[];
  typingUsers: string[];
  onSendMessage: (content: string, type?: 'TEXT' | 'IMAGE' | 'AUDIO', mediaUrl?: string) => void;
  onTyping: (isTyping: boolean) => void;
  onBack: () => void;
  onStartCall: (isVideo: boolean) => void;
}

const EMOJI_PALETTE = ['😀', '😂', '😍', '🔥', '👍', '🙏', '🚀', '☕', '❤️', '🎉', '👏', '✨', '💻', '💯', '🙌', '😎'];

export const ChatArea: React.FC<ChatAreaProps> = ({
  conversation,
  currentUser,
  messages,
  typingUsers,
  onSendMessage,
  onTyping,
  onBack,
  onStartCall,
}) => {
  const [inputText, setInputText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [searchInChat, setSearchInChat] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingUsers]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
    onTyping(true);

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      onTyping(false);
    }, 1500);
  };

  const handleSend = () => {
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim(), 'TEXT');
    setInputText('');
    onTyping(false);
    setShowEmojiPicker(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSendAudioSim = () => {
    onSendMessage('Voice message (0:14)', 'AUDIO', undefined);
    setShowAttachMenu(false);
  };

  const handleSendImageSim = () => {
    onSendMessage('Architecture Diagram Preview', 'IMAGE', 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80');
    setShowAttachMenu(false);
  };

  const formatMessageTime = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  const filteredMessages = searchQuery.trim()
    ? messages.filter((m) => m.content.toLowerCase().includes(searchQuery.toLowerCase()))
    : messages;

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0b141a] relative overflow-hidden select-text">
      {/* Header */}
      <div className="h-16 bg-[#202c33] px-4 flex items-center justify-between border-b border-[#222e35] shrink-0 z-10">
        <div className="flex items-center gap-3">
          {/* Mobile Back Button */}
          <button
            onClick={onBack}
            className="md:hidden text-[#8696a0] hover:text-[#e9edef] p-1 rounded-full cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Avatar with Status */}
          <div className="relative">
            <img
              src={conversation.avatar}
              alt={conversation.title}
              className="w-10 h-10 rounded-full object-cover border border-[#2a3942]"
            />
            {conversation.type !== 'GROUP' && (
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#00a884] border-2 border-[#202c33] rounded-full" />
            )}
          </div>

          {/* Title & Subtitle */}
          <div>
            <h3 className="text-sm font-semibold text-[#e9edef] leading-tight">
              {conversation.title}
            </h3>
            <p className="text-[11px] text-[#8696a0] leading-tight truncate max-w-[200px] sm:max-w-[360px]">
              {typingUsers.length > 0 ? (
                <span className="text-[#00a884] font-medium animate-pulse">
                  {typingUsers.join(', ')} typing...
                </span>
              ) : conversation.type === 'GROUP' ? (
                `${conversation.members.map((m) => m.userName.split(' ')[0]).join(', ')}`
              ) : (
                'Online • Java Spring Boot STOMP Active'
              )}
            </p>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1 sm:gap-2 text-[#aebac1]">
          <button
            type="button"
            onClick={() => onStartCall(false)}
            title="Start Voice Call"
            className="p-2 hover:bg-[#2a3942] rounded-full transition cursor-pointer"
          >
            <Phone className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => onStartCall(true)}
            title="Start Video Call"
            className="p-2 hover:bg-[#2a3942] rounded-full transition cursor-pointer"
          >
            <Video className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => setSearchInChat(!searchInChat)}
            title="Search in chat"
            className="p-2 hover:bg-[#2a3942] rounded-full transition cursor-pointer"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* In-Chat Search Bar */}
      {searchInChat && (
        <div className="bg-[#111b21] p-2.5 border-b border-[#222e35] flex items-center gap-2 animate-fadeIn shrink-0">
          <Search className="w-4 h-4 text-[#8696a0]" />
          <input
            type="text"
            placeholder="Search messages in this conversation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
            className="flex-1 bg-transparent text-xs text-[#e9edef] focus:outline-none placeholder-[#8696a0]"
          />
          {searchQuery && (
            <span className="text-[11px] text-[#8696a0]">
              {filteredMessages.length} matches
            </span>
          )}
          <button
            onClick={() => {
              setSearchInChat(false);
              setSearchQuery('');
            }}
            className="text-[#8696a0] hover:text-[#e9edef] p-1 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Messages Scroll Area with WhatsApp Wallpaper Pattern */}
      <div className="flex-1 overflow-y-auto px-4 py-3 whatsapp-chat-bg space-y-3">
        {/* End-to-End Encryption Banner */}
        <div className="flex justify-center my-2">
          <div className="bg-[#182229] text-[#ffd279] text-[11px] px-3.5 py-1.5 rounded-lg border border-[#2a3942]/60 shadow-sm max-w-sm text-center leading-relaxed">
            🔒 Messages are securely persisted in MySQL 8 and transported via Spring Boot STOMP WebSocket.
          </div>
        </div>

        {/* Date Divider */}
        <div className="flex justify-center my-3">
          <span className="bg-[#182229] text-[#8696a0] text-[10px] font-semibold px-3 py-1 rounded-md shadow-xs uppercase tracking-wider">
            Today
          </span>
        </div>

        {/* Render Messages */}
        {filteredMessages.map((msg) => {
          const isMe = msg.senderId === currentUser.id;
          const isSystem = msg.type === 'SYSTEM';

          if (isSystem) {
            return (
              <div key={msg.id} className="flex justify-center my-2">
                <span className="bg-[#182229]/90 text-[#8696a0] text-[11px] px-3 py-1 rounded-md border border-[#2a3942]">
                  {msg.content}
                </span>
              </div>
            );
          }

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} my-1 group`}
            >
              <div
                className={`relative max-w-[85%] sm:max-w-[70%] md:max-w-[60%] rounded-2xl px-3.5 py-2 shadow-sm text-sm break-words ${
                  isMe
                    ? 'bg-[#005c4b] text-[#e9edef] rounded-tr-xs'
                    : 'bg-[#202c33] text-[#e9edef] rounded-tl-xs'
                }`}
              >
                {/* Group Sender Name */}
                {conversation.type === 'GROUP' && !isMe && (
                  <p className="text-[11px] font-bold text-[#53bdeb] mb-1">
                    {msg.senderName}
                  </p>
                )}

                {/* Media rendering */}
                {msg.type === 'IMAGE' && msg.mediaUrl && (
                  <div className="mb-2 rounded-xl overflow-hidden border border-black/20">
                    <img src={msg.mediaUrl} alt="media" className="w-full max-h-60 object-cover" />
                  </div>
                )}

                {/* Audio voice note player */}
                {msg.type === 'AUDIO' ? (
                  <div className="flex items-center gap-3 py-1 min-w-[200px]">
                    <button
                      type="button"
                      onClick={() =>
                        setPlayingAudioId(playingAudioId === msg.id ? null : msg.id)
                      }
                      className="w-8 h-8 rounded-full bg-[#00a884] text-[#111b21] flex items-center justify-center shrink-0 cursor-pointer shadow"
                    >
                      {playingAudioId === msg.id ? (
                        <Pause className="w-4 h-4 fill-current" />
                      ) : (
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      )}
                    </button>
                    <div className="flex-1">
                      <div className="h-1.5 bg-[#2a3942] rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-[#00a884] rounded-full ${
                            playingAudioId === msg.id ? 'animate-pulse w-3/4' : 'w-1/3'
                          }`}
                        />
                      </div>
                      <span className="text-[10px] text-[#8696a0] mt-1 block">
                        {playingAudioId === msg.id ? 'Playing STOMP audio stream...' : '0:14'}
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="leading-relaxed">{msg.content}</p>
                )}

                {/* Footer with Timestamp & Status Ticks */}
                <div className="flex items-center justify-end gap-1 text-[10px] text-[#8696a0] mt-1 select-none">
                  <span>{formatMessageTime(msg.createdAt)}</span>
                  {isMe && (
                    <span>
                      {msg.receiptStatus === 'READ' ? (
                        <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb]" />
                      ) : msg.receiptStatus === 'DELIVERED' ? (
                        <CheckCheck className="w-3.5 h-3.5 text-[#8696a0]" />
                      ) : (
                        <Check className="w-3.5 h-3.5 text-[#8696a0]" />
                      )}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Typing indicator bubble */}
        {typingUsers.length > 0 && (
          <div className="flex items-start my-1 animate-fadeIn">
            <div className="bg-[#202c33] rounded-2xl rounded-tl-xs px-4 py-2.5 shadow-sm flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#00a884] animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-[#00a884] animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-[#00a884] animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Emoji Drawer */}
      {showEmojiPicker && (
        <div className="bg-[#202c33] border-t border-[#2a3942] p-2 flex flex-wrap gap-2 animate-fadeIn shrink-0">
          {EMOJI_PALETTE.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => {
                setInputText((prev) => prev + emoji);
              }}
              className="text-xl p-1.5 hover:bg-[#2a3942] rounded-lg transition transform hover:scale-125 cursor-pointer"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {/* Attachment Menu Popup */}
      {showAttachMenu && (
        <div className="absolute bottom-16 left-12 bg-[#202c33] rounded-2xl p-3 shadow-2xl border border-[#2a3942] flex flex-col gap-2 z-30 animate-fadeIn">
          <button
            onClick={handleSendImageSim}
            className="flex items-center gap-3 px-4 py-2 hover:bg-[#111b21] rounded-xl text-left text-xs font-medium text-[#e9edef] transition cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <ImageIcon className="w-4 h-4" />
            </div>
            <span>Share Image Attachment</span>
          </button>
          <button
            onClick={handleSendAudioSim}
            className="flex items-center gap-3 px-4 py-2 hover:bg-[#111b21] rounded-xl text-left text-xs font-medium text-[#e9edef] transition cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Mic className="w-4 h-4" />
            </div>
            <span>Send Audio Note (Simulated)</span>
          </button>
        </div>
      )}

      {/* Bottom Message Input Bar */}
      <div className="bg-[#202c33] px-3 py-2.5 flex items-center gap-2 border-t border-[#222e35] shrink-0">
        {/* Emoji Button */}
        <button
          type="button"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className={`p-2 rounded-full transition cursor-pointer ${
            showEmojiPicker ? 'text-[#00a884] bg-[#2a3942]' : 'text-[#8696a0] hover:text-[#e9edef]'
          }`}
          title="Insert emoji"
        >
          <Smile className="w-5 h-5" />
        </button>

        {/* Attachment Button */}
        <button
          type="button"
          onClick={() => setShowAttachMenu(!showAttachMenu)}
          className={`p-2 rounded-full transition cursor-pointer ${
            showAttachMenu ? 'text-[#00a884] bg-[#2a3942]' : 'text-[#8696a0] hover:text-[#e9edef]'
          }`}
          title="Attach document or media"
        >
          <Paperclip className="w-5 h-5" />
        </button>

        {/* Input Field */}
        <input
          type="text"
          placeholder="Type a message (Enter to send, Shift+Enter for new line)"
          value={inputText}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-[#2a3942] text-[#e9edef] text-sm px-4 py-2.5 rounded-xl border border-transparent focus:border-[#00a884] focus:outline-none placeholder-[#8696a0]"
        />

        {/* Send or Voice Note Button */}
        {inputText.trim() ? (
          <button
            type="button"
            onClick={handleSend}
            className="p-2.5 bg-[#00a884] hover:bg-[#02906f] text-[#111b21] rounded-full transition cursor-pointer shadow transform active:scale-95"
            title="Send Message"
          >
            <Send className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSendAudioSim}
            className="p-2 text-[#8696a0] hover:text-[#e9edef] hover:bg-[#2a3942] rounded-full transition cursor-pointer"
            title="Simulate Voice Note"
          >
            <Mic className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};
