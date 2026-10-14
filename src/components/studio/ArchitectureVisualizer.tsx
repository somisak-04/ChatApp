import React, { useState } from 'react';
import {
  Activity,
  ArrowRight,
  Database,
  Layers,
  Lock,
  RefreshCw,
  Server,
  Shield,
  Terminal,
  Trash2,
  Zap,
} from 'lucide-react';
import { chatStorage } from '../../services/chatStorage';
import { StompFrame } from '../../types/chat';

interface ArchitectureVisualizerProps {
  stompLogs: StompFrame[];
}

export const ArchitectureVisualizer: React.FC<ArchitectureVisualizerProps> = ({ stompLogs }) => {
  const [activeTab, setActiveTab] = useState<'FLOW' | 'STOMP_LOGS' | 'SECURITY' | 'DATABASE'>('FLOW');
  const [selectedFrame, setSelectedFrame] = useState<StompFrame | null>(stompLogs[0] || null);

  const clearLogs = () => {
    chatStorage.clearStompLogs();
    setSelectedFrame(null);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#111b21] text-[#e9edef] overflow-hidden">
      {/* Sub-navigation */}
      <div className="bg-[#202c33] px-4 py-2 flex items-center justify-between border-b border-[#2a3942]">
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setActiveTab('FLOW')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              activeTab === 'FLOW'
                ? 'bg-[#00a884] text-[#111b21]'
                : 'text-[#8696a0] hover:text-[#e9edef] hover:bg-[#2a3942]'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>STOMP Architecture</span>
          </button>

          <button
            onClick={() => setActiveTab('STOMP_LOGS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              activeTab === 'STOMP_LOGS'
                ? 'bg-[#00a884] text-[#111b21]'
                : 'text-[#8696a0] hover:text-[#e9edef] hover:bg-[#2a3942]'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Live STOMP Frames ({stompLogs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('SECURITY')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              activeTab === 'SECURITY'
                ? 'bg-[#00a884] text-[#111b21]'
                : 'text-[#8696a0] hover:text-[#e9edef] hover:bg-[#2a3942]'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Spring Security Filter Chain</span>
          </button>

          <button
            onClick={() => setActiveTab('DATABASE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              activeTab === 'DATABASE'
                ? 'bg-[#00a884] text-[#111b21]'
                : 'text-[#8696a0] hover:text-[#e9edef] hover:bg-[#2a3942]'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>MySQL Schema &amp; ERD</span>
          </button>
        </div>

        {activeTab === 'STOMP_LOGS' && (
          <button
            onClick={clearLogs}
            className="text-xs text-[#8696a0] hover:text-red-400 flex items-center gap-1 px-2 py-1 rounded bg-[#111b21] border border-[#2a3942] cursor-pointer"
          >
            <Trash2 className="w-3 h-3" />
            <span>Clear Logs</span>
          </button>
        )}
      </div>

      {/* Main Container */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Tab 1: Architecture Flow */}
        {activeTab === 'FLOW' && (
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="bg-[#202c33] rounded-2xl p-6 border border-[#2a3942] shadow-xl">
              <h3 className="text-base font-bold text-[#e9edef] mb-2 flex items-center gap-2">
                <Server className="w-5 h-5 text-[#00a884]" />
                <span>Spring Boot 3.3 STOMP Real-Time Engine Lifecycle</span>
              </h3>
              <p className="text-xs text-[#8696a0] leading-relaxed mb-6">
                How every WhatsApp Web message flows end-to-end: from client input to Spring Security JWT verification, message persistence in MySQL, and broadcasting to WebSocket subscribers.
              </p>

              {/* Step Diagram */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Step 1 */}
                <div className="bg-[#111b21] p-4 rounded-xl border border-[#2a3942] relative flex flex-col justify-between">
                  <span className="text-[10px] font-mono font-bold text-[#00a884] uppercase">Step 01</span>
                  <div className="my-3">
                    <h4 className="text-sm font-semibold text-[#e9edef]">WebSocket Handshake</h4>
                    <p className="text-xs text-[#8696a0] mt-1">
                      Client connects to <code className="text-[#00a884]">/ws-chat</code>. ChannelInterceptor inspects <code className="text-amber-400">CONNECT</code> frame with Bearer JWT token.
                    </p>
                  </div>
                  <div className="text-[11px] font-mono text-[#53bdeb] bg-[#202c33] p-1.5 rounded">
                    StompCommand.CONNECT
                  </div>
                </div>

                {/* Step 2 */}
                <div className="bg-[#111b21] p-4 rounded-xl border border-[#2a3942] relative flex flex-col justify-between">
                  <span className="text-[10px] font-mono font-bold text-[#00a884] uppercase">Step 02</span>
                  <div className="my-3">
                    <h4 className="text-sm font-semibold text-[#e9edef]">@MessageMapping</h4>
                    <p className="text-xs text-[#8696a0] mt-1">
                      Payload routed to <code className="text-[#00a884]">/app/chat.send</code>. Validated via JSR-380 Bean Validation (@Valid).
                    </p>
                  </div>
                  <div className="text-[11px] font-mono text-[#53bdeb] bg-[#202c33] p-1.5 rounded">
                    ChatWebSocketController
                  </div>
                </div>

                {/* Step 3 */}
                <div className="bg-[#111b21] p-4 rounded-xl border border-[#2a3942] relative flex flex-col justify-between">
                  <span className="text-[10px] font-mono font-bold text-[#00a884] uppercase">Step 03</span>
                  <div className="my-3">
                    <h4 className="text-sm font-semibold text-[#e9edef]">MySQL Persistence</h4>
                    <p className="text-xs text-[#8696a0] mt-1">
                      <code className="text-[#00a884]">MessageService</code> verifies membership, persists to MySQL via Spring Data JPA, sets status = SENT.
                    </p>
                  </div>
                  <div className="text-[11px] font-mono text-[#53bdeb] bg-[#202c33] p-1.5 rounded">
                    @Transactional JPA Save
                  </div>
                </div>

                {/* Step 4 */}
                <div className="bg-[#111b21] p-4 rounded-xl border border-[#2a3942] relative flex flex-col justify-between">
                  <span className="text-[10px] font-mono font-bold text-[#00a884] uppercase">Step 04</span>
                  <div className="my-3">
                    <h4 className="text-sm font-semibold text-[#e9edef]">Broker Broadcast</h4>
                    <p className="text-xs text-[#8696a0] mt-1">
                      <code className="text-[#00a884]">SimpMessagingTemplate</code> dispatches to <code className="text-[#00a884]">/topic/conversation.&#123;id&#125;</code> for instant client delivery.
                    </p>
                  </div>
                  <div className="text-[11px] font-mono text-[#53bdeb] bg-[#202c33] p-1.5 rounded">
                    SimpMessagingTemplate
                  </div>
                </div>
              </div>
            </div>

            {/* Core Interview Architectural Decisions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#202c33] p-5 rounded-2xl border border-[#2a3942]">
                <h4 className="text-sm font-semibold text-[#00a884] mb-2 flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  <span>STOMP vs Raw WebSocket</span>
                </h4>
                <p className="text-xs text-[#8696a0] leading-relaxed">
                  Raw WebSockets only handle binary/text streams without routing logic. STOMP (Streaming Text Oriented Messaging Protocol) introduces standardized frame headers, pub/sub destinations (<code className="text-[#e9edef]">/topic</code>, <code className="text-[#e9edef]">/queue</code>), and heartbeats, enabling enterprise-scale decoupled architectures.
                </p>
              </div>

              <div className="bg-[#202c33] p-5 rounded-2xl border border-[#2a3942]">
                <h4 className="text-sm font-semibold text-[#00a884] mb-2 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span>ChannelInterceptor Security</span>
                </h4>
                <p className="text-xs text-[#8696a0] leading-relaxed">
                  Standard Spring Security HTTP filters execute only during the initial HTTP 101 upgrade handshake. Ongoing STOMP frames (CONNECT, SUBSCRIBE, SEND) require an inbound <code className="text-[#e9edef]">ChannelInterceptor</code> to parse the native Authorization header and authenticate the STOMP session.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Live STOMP Frames */}
        {activeTab === 'STOMP_LOGS' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-6xl mx-auto h-[75vh]">
            {/* Frame List */}
            <div className="lg:col-span-1 bg-[#202c33] rounded-2xl border border-[#2a3942] flex flex-col overflow-hidden">
              <div className="p-3 bg-[#111b21] border-b border-[#2a3942] text-xs font-semibold text-[#8696a0] flex justify-between items-center">
                <span>Intercepted Frames ({stompLogs.length})</span>
                <span className="text-[10px] text-[#00a884] font-mono">LIVE LISTENER</span>
              </div>
              <div className="flex-1 overflow-y-auto divide-y divide-[#2a3942]/50">
                {stompLogs.length === 0 ? (
                  <div className="p-8 text-center text-xs text-[#8696a0]">
                    No frames captured yet. Send a message or switch chats in WhatsApp Web!
                  </div>
                ) : (
                  stompLogs.map((frame) => {
                    const isSelected = selectedFrame?.id === frame.id;
                    const isOutgoing = frame.direction === 'OUTGOING';

                    return (
                      <button
                        key={frame.id}
                        onClick={() => setSelectedFrame(frame)}
                        className={`w-full p-2.5 text-left text-xs transition cursor-pointer flex items-center justify-between ${
                          isSelected ? 'bg-[#00a884]/20 border-l-4 border-[#00a884]' : 'hover:bg-[#111b21]'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                                frame.command === 'SEND'
                                  ? 'bg-blue-500/20 text-blue-400'
                                  : frame.command === 'MESSAGE'
                                  ? 'bg-emerald-500/20 text-emerald-400'
                                  : frame.command === 'CONNECT' || frame.command === 'CONNECTED'
                                  ? 'bg-purple-500/20 text-purple-400'
                                  : 'bg-amber-500/20 text-amber-400'
                              }`}
                            >
                              {frame.command}
                            </span>
                            <span className="text-[10px] text-[#8696a0] font-mono">
                              {frame.timestamp}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#8696a0] truncate mt-1 font-mono">
                            {frame.destination || frame.headers?.destination || 'Handshake'}
                          </p>
                        </div>
                        <span className="text-[10px] text-[#667781] font-mono">
                          {isOutgoing ? 'TX ➔' : 'RX ➔'}
                        </span>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Frame Details */}
            <div className="lg:col-span-2 bg-[#202c33] rounded-2xl border border-[#2a3942] p-5 flex flex-col overflow-hidden">
              {selectedFrame ? (
                <div className="flex-1 flex flex-col overflow-hidden space-y-4">
                  <div className="flex items-center justify-between border-b border-[#2a3942] pb-3">
                    <div>
                      <h4 className="text-sm font-bold text-[#e9edef] font-mono flex items-center gap-2">
                        <span>STOMP Frame:</span>
                        <span className="text-[#00a884]">{selectedFrame.command}</span>
                      </h4>
                      <p className="text-xs text-[#8696a0] font-mono mt-0.5">
                        Direction: {selectedFrame.direction} • Captured at {selectedFrame.timestamp}
                      </p>
                    </div>
                  </div>

                  {/* Headers */}
                  <div>
                    <h5 className="text-xs font-semibold text-[#8696a0] uppercase tracking-wider mb-1.5">
                      Frame Headers
                    </h5>
                    <div className="bg-[#111b21] rounded-xl p-3 font-mono text-xs space-y-1 max-h-40 overflow-y-auto border border-[#2a3942]">
                      {Object.entries(selectedFrame.headers || {}).map(([key, val]) => (
                        <div key={key} className="flex gap-2">
                          <span className="text-purple-400 shrink-0">{key}:</span>
                          <span className="text-[#e9edef] break-all">{val}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Body */}
                  {selectedFrame.body && (
                    <div className="flex-1 flex flex-col overflow-hidden">
                      <h5 className="text-xs font-semibold text-[#8696a0] uppercase tracking-wider mb-1.5">
                        Payload Body (JSON)
                      </h5>
                      <pre className="flex-1 bg-[#111b21] rounded-xl p-3 font-mono text-xs text-[#53bdeb] overflow-y-auto border border-[#2a3942] whitespace-pre-wrap">
                        {(() => {
                          try {
                            return JSON.stringify(JSON.parse(selectedFrame.body), null, 2);
                          } catch {
                            return selectedFrame.body;
                          }
                        })()}
                      </pre>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center text-xs text-[#8696a0]">
                  Select a frame from the list to inspect headers and JSON payload
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Security */}
        {activeTab === 'SECURITY' && (
          <div className="max-w-4xl mx-auto bg-[#202c33] rounded-2xl p-6 border border-[#2a3942] shadow-xl space-y-6">
            <div>
              <h3 className="text-base font-bold text-[#e9edef] flex items-center gap-2">
                <Lock className="w-5 h-5 text-[#00a884]" />
                <span>Spring Security 6 Stateless JWT Filter Architecture</span>
              </h3>
              <p className="text-xs text-[#8696a0] mt-1">
                Zero session state stored in JVM heap. Every HTTP request and STOMP message carries cryptographic credentials.
              </p>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 bg-[#111b21] rounded-xl border border-[#2a3942] flex items-start gap-3">
                <span className="px-2 py-0.5 bg-[#00a884] text-[#111b21] rounded font-bold shrink-0">01</span>
                <div>
                  <p className="text-sm font-semibold text-[#e9edef]">CorsFilter &amp; CsrfFilter Disabled</p>
                  <p className="text-xs text-[#8696a0] mt-0.5">
                    Cross-Origin Resource Sharing configured for client domains. CSRF disabled because REST APIs are stateless with Bearer JWT tokens.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-[#111b21] rounded-xl border border-[#2a3942] flex items-start gap-3">
                <span className="px-2 py-0.5 bg-[#00a884] text-[#111b21] rounded font-bold shrink-0">02</span>
                <div>
                  <p className="text-sm font-semibold text-[#e9edef]">JwtAuthenticationFilter (OncePerRequestFilter)</p>
                  <p className="text-xs text-[#8696a0] mt-0.5">
                    Extracts <code className="text-[#00a884]">Authorization: Bearer &lt;token&gt;</code> header. Validates cryptographic signature with JJWT 0.12.5 and sets <code className="text-[#53bdeb]">SecurityContextHolder.getContext().setAuthentication(...)</code>.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-[#111b21] rounded-xl border border-[#2a3942] flex items-start gap-3">
                <span className="px-2 py-0.5 bg-[#00a884] text-[#111b21] rounded font-bold shrink-0">03</span>
                <div>
                  <p className="text-sm font-semibold text-[#e9edef]">SessionCreationPolicy.STATELESS</p>
                  <p className="text-xs text-[#8696a0] mt-0.5">
                    Spring Security never creates or checks an HTTP HttpSession, maximizing horizontal scalability across load balancers.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-[#111b21] rounded-xl border border-[#2a3942] flex items-start gap-3">
                <span className="px-2 py-0.5 bg-[#00a884] text-[#111b21] rounded font-bold shrink-0">04</span>
                <div>
                  <p className="text-sm font-semibold text-[#e9edef]">BCryptPasswordEncoder (12 Rounds)</p>
                  <p className="text-xs text-[#8696a0] mt-0.5">
                    Passwords hashed with random 16-byte salt and configurable work factor. Plaintext passwords never touch memory or database.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Database ERD */}
        {activeTab === 'DATABASE' && (
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="bg-[#202c33] rounded-2xl p-6 border border-[#2a3942] shadow-xl">
              <h3 className="text-base font-bold text-[#e9edef] mb-2 flex items-center gap-2">
                <Database className="w-5 h-5 text-[#00a884]" />
                <span>MySQL 8 Entity-Relationship Schema</span>
              </h3>
              <p className="text-xs text-[#8696a0] mb-6">
                Normalized schema designed with Hibernate 6 JPA annotations. Optimized with composite indexes on <code className="text-[#00a884]">(conversation_id, created_at DESC)</code> for sub-millisecond pagination.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Table users */}
                <div className="bg-[#111b21] rounded-xl border border-[#2a3942] p-4 text-xs">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#2a3942]">
                    <span className="font-bold text-[#00a884] font-mono">TABLE: users</span>
                    <span className="text-[10px] text-[#8696a0]">ENGINE=InnoDB</span>
                  </div>
                  <div className="font-mono space-y-1 text-[#8696a0]">
                    <p className="text-[#e9edef] font-semibold">🔑 id: VARCHAR(36) PK</p>
                    <p>name: VARCHAR(100)</p>
                    <p className="text-amber-400">email: VARCHAR(150) UNIQUE</p>
                    <p>password_hash: VARCHAR(255)</p>
                    <p>avatar_url: VARCHAR(500)</p>
                    <p>is_online: BOOLEAN</p>
                    <p>last_seen_at: TIMESTAMP</p>
                  </div>
                </div>

                {/* Table conversations */}
                <div className="bg-[#111b21] rounded-xl border border-[#2a3942] p-4 text-xs">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#2a3942]">
                    <span className="font-bold text-[#00a884] font-mono">TABLE: conversations</span>
                    <span className="text-[10px] text-[#8696a0]">ENGINE=InnoDB</span>
                  </div>
                  <div className="font-mono space-y-1 text-[#8696a0]">
                    <p className="text-[#e9edef] font-semibold">🔑 id: VARCHAR(36) PK</p>
                    <p className="text-[#53bdeb]">type: ENUM('PRIVATE', 'GROUP')</p>
                    <p>title: VARCHAR(150)</p>
                    <p>avatar_url: VARCHAR(500)</p>
                    <p>creator_id: FK ➔ users.id</p>
                    <p>created_at: TIMESTAMP</p>
                    <p>updated_at: TIMESTAMP (INDEX)</p>
                  </div>
                </div>

                {/* Table conversation_members */}
                <div className="bg-[#111b21] rounded-xl border border-[#2a3942] p-4 text-xs">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#2a3942]">
                    <span className="font-bold text-[#00a884] font-mono">TABLE: conversation_members</span>
                    <span className="text-[10px] text-[#8696a0]">BRIDGE</span>
                  </div>
                  <div className="font-mono space-y-1 text-[#8696a0]">
                    <p className="text-[#e9edef] font-semibold">🔑 id: VARCHAR(36) PK</p>
                    <p className="text-purple-400">conversation_id: FK ➔ conv.id</p>
                    <p className="text-purple-400">user_id: FK ➔ users.id</p>
                    <p>role: ENUM('ADMIN', 'MEMBER')</p>
                    <p className="text-amber-400">UNIQUE (conversation_id, user_id)</p>
                    <p>joined_at: TIMESTAMP</p>
                  </div>
                </div>

                {/* Table messages */}
                <div className="bg-[#111b21] rounded-xl border border-[#2a3942] p-4 text-xs">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#2a3942]">
                    <span className="font-bold text-[#00a884] font-mono">TABLE: messages</span>
                    <span className="text-[10px] text-[#8696a0]">PARTITION READY</span>
                  </div>
                  <div className="font-mono space-y-1 text-[#8696a0]">
                    <p className="text-[#e9edef] font-semibold">🔑 id: VARCHAR(36) PK</p>
                    <p className="text-purple-400">conversation_id: FK</p>
                    <p className="text-purple-400">sender_id: FK ➔ users.id</p>
                    <p>type: ENUM('TEXT', 'IMAGE', ...)</p>
                    <p>content: TEXT (utf8mb4)</p>
                    <p>media_url: VARCHAR(500)</p>
                    <p className="text-amber-400">INDEX (conversation_id, created_at DESC)</p>
                  </div>
                </div>

                {/* Table message_receipts */}
                <div className="bg-[#111b21] rounded-xl border border-[#2a3942] p-4 text-xs">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#2a3942]">
                    <span className="font-bold text-[#00a884] font-mono">TABLE: message_receipts</span>
                    <span className="text-[10px] text-[#8696a0]">RECEIPTS</span>
                  </div>
                  <div className="font-mono space-y-1 text-[#8696a0]">
                    <p className="text-[#e9edef] font-semibold">🔑 id: VARCHAR(36) PK</p>
                    <p className="text-purple-400">message_id: FK ➔ messages.id</p>
                    <p className="text-purple-400">user_id: FK ➔ users.id</p>
                    <p className="text-[#53bdeb]">status: ENUM('DELIVERED', 'READ')</p>
                    <p className="text-amber-400">UNIQUE (message_id, user_id)</p>
                    <p>updated_at: TIMESTAMP</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
