import React, { useState } from 'react';
import { Check, Copy, Play, Send, ShieldCheck, Terminal } from 'lucide-react';
import { chatStorage } from '../../services/chatStorage';

interface ApiEndpoint {
  id: string;
  category: 'Auth' | 'Users' | 'Conversations' | 'Messages' | 'STOMP';
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'STOMP';
  path: string;
  description: string;
  requiresAuth: boolean;
  sampleBody?: string;
}

const ENDPOINTS: ApiEndpoint[] = [
  {
    id: 'auth_login',
    category: 'Auth',
    method: 'POST',
    path: '/api/v1/auth/login',
    description: 'Authenticate with email and password, receives HS512 JWT token.',
    requiresAuth: false,
    sampleBody: JSON.stringify(
      {
        email: 'alex.vance@company.dev',
        password: 'password123',
      },
      null,
      2
    ),
  },
  {
    id: 'auth_register',
    category: 'Auth',
    method: 'POST',
    path: '/api/v1/auth/register',
    description: 'Register a new user with BCrypt hashed credentials.',
    requiresAuth: false,
    sampleBody: JSON.stringify(
      {
        name: 'Jordan Lee',
        email: 'jordan.lee@company.dev',
        password: 'securePassword123',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      },
      null,
      2
    ),
  },
  {
    id: 'users_me',
    category: 'Users',
    method: 'GET',
    path: '/api/v1/users/me',
    description: 'Retrieve current authenticated user profile.',
    requiresAuth: true,
  },
  {
    id: 'users_search',
    category: 'Users',
    method: 'GET',
    path: '/api/v1/users/search?keyword=sarah',
    description: 'Search registered users by name or email.',
    requiresAuth: true,
  },
  {
    id: 'conversations_list',
    category: 'Conversations',
    method: 'GET',
    path: '/api/v1/conversations',
    description: 'Fetch all 1-to-1 and group conversations for authenticated user.',
    requiresAuth: true,
  },
  {
    id: 'conversations_direct',
    category: 'Conversations',
    method: 'POST',
    path: '/api/v1/conversations/direct/user_2',
    description: 'Get existing direct conversation or create new one.',
    requiresAuth: true,
  },
  {
    id: 'conversations_group',
    category: 'Conversations',
    method: 'POST',
    path: '/api/v1/conversations/group',
    description: 'Create a new group conversation with title and member list.',
    requiresAuth: true,
    sampleBody: JSON.stringify(
      {
        title: 'Full Stack Sprint 42',
        avatarUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150',
        memberUserIds: ['user_2', 'user_3'],
      },
      null,
      2
    ),
  },
  {
    id: 'messages_history',
    category: 'Messages',
    method: 'GET',
    path: '/api/v1/conversations/conv_direct_1/messages?page=0&size=20',
    description: 'Paginated message history ordered by createdAt DESC.',
    requiresAuth: true,
  },
  {
    id: 'stomp_send',
    category: 'STOMP',
    method: 'STOMP',
    path: '/app/chat.send',
    description: 'Broadcast real-time message via STOMP WebSocket broker.',
    requiresAuth: true,
    sampleBody: JSON.stringify(
      {
        conversationId: 'conv_direct_1',
        content: 'Testing STOMP WebSocket broadcast from API console!',
        type: 'TEXT',
      },
      null,
      2
    ),
  },
];

export const ApiPlayground: React.FC = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint>(ENDPOINTS[0]);
  const [requestBody, setRequestBody] = useState(selectedEndpoint.sampleBody || '');
  const [responseOutput, setResponseOutput] = useState<string>('');
  const [responseStatus, setResponseStatus] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const currentUser = chatStorage.getCurrentUser();
  const jwt = chatStorage.getJwtToken();

  const handleSelectEndpoint = (ep: ApiEndpoint) => {
    setSelectedEndpoint(ep);
    setRequestBody(ep.sampleBody || '');
    setResponseOutput('');
    setResponseStatus('');
  };

  const handleExecute = () => {
    setLoading(true);
    setResponseOutput('Executing request against Spring Boot controller...');

    setTimeout(() => {
      setLoading(false);
      try {
        if (selectedEndpoint.id === 'auth_login') {
          setResponseStatus('200 OK (HTTP/1.1)');
          setResponseOutput(
            JSON.stringify(
              {
                success: true,
                message: 'Login successful',
                data: {
                  token: jwt,
                  type: 'Bearer',
                  user: {
                    id: currentUser.id,
                    name: currentUser.name,
                    email: currentUser.email,
                    status: currentUser.status,
                  },
                },
              },
              null,
              2
            )
          );
        } else if (selectedEndpoint.id === 'auth_register') {
          setResponseStatus('201 CREATED (HTTP/1.1)');
          setResponseOutput(
            JSON.stringify(
              {
                success: true,
                message: 'User registered successfully with BCrypt hash',
                data: {
                  token: 'eyJhbGciOiJIUzUxMiJ9.newlyRegisteredToken...',
                  type: 'Bearer',
                  user: {
                    id: 'user_gen_' + Date.now(),
                    name: 'Jordan Lee',
                    email: 'jordan.lee@company.dev',
                  },
                },
              },
              null,
              2
            )
          );
        } else if (selectedEndpoint.id === 'users_me') {
          setResponseStatus('200 OK (HTTP/1.1)');
          setResponseOutput(
            JSON.stringify(
              {
                success: true,
                data: currentUser,
              },
              null,
              2
            )
          );
        } else if (selectedEndpoint.id === 'users_search') {
          setResponseStatus('200 OK (HTTP/1.1)');
          const results = chatStorage.getAllUsers().filter((u) => u.id !== currentUser.id);
          setResponseOutput(
            JSON.stringify(
              {
                success: true,
                count: results.length,
                data: results,
              },
              null,
              2
            )
          );
        } else if (selectedEndpoint.id === 'conversations_list') {
          setResponseStatus('200 OK (HTTP/1.1)');
          setResponseOutput(
            JSON.stringify(
              {
                success: true,
                data: chatStorage.getConversations(),
              },
              null,
              2
            )
          );
        } else if (selectedEndpoint.id === 'conversations_direct') {
          setResponseStatus('200 OK (HTTP/1.1)');
          const conv = chatStorage.createDirectConversation('user_2');
          setResponseOutput(
            JSON.stringify(
              {
                success: true,
                data: conv,
              },
              null,
              2
            )
          );
        } else if (selectedEndpoint.id === 'conversations_group') {
          setResponseStatus('201 CREATED (HTTP/1.1)');
          const conv = chatStorage.createGroupConversation('Full Stack Sprint 42', ['user_2', 'user_3']);
          setResponseOutput(
            JSON.stringify(
              {
                success: true,
                message: 'Group created successfully',
                data: conv,
              },
              null,
              2
            )
          );
        } else if (selectedEndpoint.id === 'messages_history') {
          setResponseStatus('200 OK (HTTP/1.1)');
          const msgs = chatStorage.getMessages('conv_direct_1');
          setResponseOutput(
            JSON.stringify(
              {
                content: msgs,
                pageable: { pageNumber: 0, pageSize: 20 },
                totalElements: msgs.length,
                totalPages: 1,
              },
              null,
              2
            )
          );
        } else if (selectedEndpoint.id === 'stomp_send') {
          setResponseStatus('STOMP ACK (Destination: /topic/conversation.conv_direct_1)');
          const newMsg = chatStorage.sendMessage(
            'conv_direct_1',
            'Testing STOMP WebSocket broadcast from API console!'
          );
          setResponseOutput(
            JSON.stringify(
              {
                event: 'MESSAGE_BROADCAST',
                destination: '/topic/conversation.conv_direct_1',
                payload: newMsg,
              },
              null,
              2
            )
          );
        }
      } catch (err: unknown) {
        setResponseStatus('500 INTERNAL SERVER ERROR');
        setResponseOutput(err instanceof Error ? err.message : 'Error executing endpoint');
      }
    }, 350);
  };

  const copyResponse = () => {
    navigator.clipboard.writeText(responseOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#111b21] text-[#e9edef] overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-[#202c33] border-b border-[#2a3942] flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-[#e9edef] flex items-center gap-2">
            <Terminal className="w-5 h-5 text-[#00a884]" />
            <span>Interactive REST &amp; WebSocket STOMP Console</span>
          </h2>
          <p className="text-xs text-[#8696a0] mt-0.5">
            Test backend Spring Boot endpoints directly with active user credentials and Bearer JWT authorization.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono bg-[#111b21] px-3 py-1.5 rounded-lg border border-[#2a3942]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#00a884]" />
          <span>Bearer Auth:</span>
          <span className="text-[#00a884]">{currentUser.name}</span>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
        {/* Left Endpoint Selector */}
        <div className="md:col-span-4 bg-[#111b21] border-r border-[#2a3942] overflow-y-auto divide-y divide-[#2a3942]/40">
          <div className="p-3 bg-[#182229] text-[11px] font-semibold text-[#8696a0] uppercase tracking-wider">
            Available Endpoints
          </div>
          {ENDPOINTS.map((ep) => {
            const isSelected = selectedEndpoint.id === ep.id;
            return (
              <button
                key={ep.id}
                onClick={() => handleSelectEndpoint(ep)}
                className={`w-full p-3 text-left transition cursor-pointer flex flex-col gap-1 ${
                  isSelected ? 'bg-[#202c33] border-l-4 border-[#00a884]' : 'hover:bg-[#182229]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                      ep.method === 'GET'
                        ? 'bg-blue-500/20 text-blue-400'
                        : ep.method === 'POST'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : ep.method === 'STOMP'
                        ? 'bg-purple-500/20 text-purple-400'
                        : 'bg-amber-500/20 text-amber-400'
                    }`}
                  >
                    {ep.method}
                  </span>
                  <span className="text-xs font-mono text-[#e9edef] truncate">{ep.path}</span>
                </div>
                <p className="text-[11px] text-[#8696a0] line-clamp-1">{ep.description}</p>
              </button>
            );
          })}
        </div>

        {/* Right Request/Response Pane */}
        <div className="md:col-span-8 bg-[#111b21] flex flex-col overflow-hidden p-4 space-y-4">
          {/* Endpoint Bar */}
          <div className="bg-[#202c33] rounded-xl p-3 border border-[#2a3942] flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 overflow-hidden">
              <span
                className={`px-2 py-1 rounded text-xs font-mono font-bold ${
                  selectedEndpoint.method === 'GET'
                    ? 'bg-blue-500/20 text-blue-400'
                    : selectedEndpoint.method === 'POST'
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : selectedEndpoint.method === 'STOMP'
                    ? 'bg-purple-500/20 text-purple-400'
                    : 'bg-amber-500/20 text-amber-400'
                }`}
              >
                {selectedEndpoint.method}
              </span>
              <span className="text-xs font-mono text-[#e9edef] truncate">
                {selectedEndpoint.path}
              </span>
            </div>

            <button
              onClick={handleExecute}
              disabled={loading}
              className="px-4 py-1.5 bg-[#00a884] hover:bg-[#02906f] text-[#111b21] text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-1.5 shadow"
            >
              {loading ? (
                <div className="w-3.5 h-3.5 border-2 border-[#111b21] border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Execute</span>
                </>
              )}
            </button>
          </div>

          {/* Request Headers & Body */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 overflow-hidden">
            {/* Request Pane */}
            <div className="bg-[#202c33] rounded-xl border border-[#2a3942] p-3 flex flex-col overflow-hidden">
              <div className="text-xs font-semibold text-[#8696a0] mb-2 flex justify-between items-center">
                <span>Request Configuration</span>
                {selectedEndpoint.requiresAuth && (
                  <span className="text-[10px] text-[#00a884] font-mono">Authorization: Bearer</span>
                )}
              </div>

              {selectedEndpoint.sampleBody ? (
                <div className="flex-1 flex flex-col overflow-hidden">
                  <span className="text-[11px] text-[#8696a0] mb-1 font-mono">JSON Body:</span>
                  <textarea
                    value={requestBody}
                    onChange={(e) => setRequestBody(e.target.value)}
                    className="flex-1 w-full bg-[#111b21] text-[#e9edef] font-mono text-xs p-3 rounded-lg border border-[#2a3942] focus:border-[#00a884] focus:outline-none resize-none"
                  />
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center text-xs text-[#8696a0] text-center p-4">
                  No request body required for this HTTP {selectedEndpoint.method} request.
                </div>
              )}
            </div>

            {/* Response Pane */}
            <div className="bg-[#202c33] rounded-xl border border-[#2a3942] p-3 flex flex-col overflow-hidden">
              <div className="text-xs font-semibold text-[#8696a0] mb-2 flex justify-between items-center">
                <span>Response Output</span>
                {responseStatus && (
                  <span className="text-[11px] font-mono text-[#00a884] font-bold">
                    {responseStatus}
                  </span>
                )}
              </div>

              {responseOutput ? (
                <div className="flex-1 flex flex-col overflow-hidden relative">
                  <button
                    onClick={copyResponse}
                    className="absolute top-2 right-2 p-1.5 bg-[#202c33] hover:bg-[#2a3942] rounded border border-[#2a3942] text-xs text-[#8696a0] hover:text-[#e9edef] cursor-pointer"
                    title="Copy response JSON"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-[#00a884]" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <pre className="flex-1 bg-[#111b21] rounded-lg p-3 font-mono text-xs text-[#53bdeb] overflow-y-auto border border-[#2a3942] whitespace-pre-wrap">
                    {responseOutput}
                  </pre>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center text-xs text-[#8696a0] text-center p-4">
                  Click "Execute" above to trigger this endpoint against Spring Boot controller.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
