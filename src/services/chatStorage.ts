import { Conversation, Message, MessageType, ReceiptStatus, StompFrame, User } from '../types/chat';
import { soundEffects } from '../utils/audioUtils';
import { INITIAL_CONVERSATIONS, INITIAL_MESSAGES, INITIAL_USERS } from '../data/mockData';

type Listener = () => void;

class ChatStorageService {
  private users: User[] = [];
  private conversations: Conversation[] = [];
  private messages: Record<string, Message[]> = {};
  private currentUserId: string = 'user_1';
  private jwtToken: string = '';
  private stompLogs: StompFrame[] = [];
  private typingMap: Record<string, string[]> = {}; // conversationId -> array of userNames typing
  private listeners: Set<Listener> = new Set();

  constructor() {
    this.init();
  }

  private init() {
    // Load from localStorage or mock
    const savedUsers = localStorage.getItem('wb_chat_users');
    const savedConversations = localStorage.getItem('wb_chat_conversations');
    const savedMessages = localStorage.getItem('wb_chat_messages');
    const savedUserId = localStorage.getItem('wb_chat_current_user_id');

    this.users = savedUsers ? JSON.parse(savedUsers) : [...INITIAL_USERS];
    this.conversations = savedConversations ? JSON.parse(savedConversations) : [...INITIAL_CONVERSATIONS];
    this.messages = savedMessages ? JSON.parse(savedMessages) : { ...INITIAL_MESSAGES };
    this.currentUserId = savedUserId || 'user_1';

    this.generateJwtForCurrent();
    this.logStompConnection();
  }

  private save() {
    try {
      localStorage.setItem('wb_chat_users', JSON.stringify(this.users));
      localStorage.setItem('wb_chat_conversations', JSON.stringify(this.conversations));
      localStorage.setItem('wb_chat_messages', JSON.stringify(this.messages));
      localStorage.setItem('wb_chat_current_user_id', this.currentUserId);
    } catch {
      // quota or private mode
    }
    this.notify();
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((fn) => fn());
  }

  private generateJwtForCurrent() {
    const user = this.getCurrentUser();
    // Simulate authentic Spring Security JWT HS512 Bearer format
    const header = btoa(JSON.stringify({ alg: 'HS512', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({
      sub: user.id,
      email: user.email,
      name: user.name,
      roles: ['ROLE_USER'],
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 86400,
    }));
    const signature = 'dGVzdFNpZ25hdHVyZVNwcmluZ0Jvb3RTZWN1cml0eUpXVA';
    this.jwtToken = `${header}.${payload}.${signature}`;
  }

  private logStompConnection() {
    const user = this.getCurrentUser();
    this.addStompLog({
      command: 'CONNECT',
      direction: 'OUTGOING',
      headers: {
        'accept-version': '1.2,1.1,1.0',
        'heart-beat': '10000,10000',
        'Authorization': `Bearer ${this.jwtToken.substring(0, 20)}...`,
        'X-User-Id': user.id,
      },
    });

    this.addStompLog({
      command: 'CONNECTED',
      direction: 'INCOMING',
      headers: {
        'version': '1.2',
        'heart-beat': '10000,10000',
        'user-name': user.email,
        'session-id': `stomp-session-${Math.random().toString(36).substring(2, 9)}`,
      },
    });

    // Subscriptions
    this.conversations.forEach((conv) => {
      this.addStompLog({
        command: 'SUBSCRIBE',
        direction: 'OUTGOING',
        destination: `/topic/conversation.${conv.id}`,
        headers: {
          id: `sub-${conv.id}`,
          destination: `/topic/conversation.${conv.id}`,
        },
      });
    });

    this.addStompLog({
      command: 'SUBSCRIBE',
      direction: 'OUTGOING',
      destination: `/user/queue/notifications`,
      headers: {
        id: `sub-user-notif`,
        destination: `/user/queue/notifications`,
      },
    });
  }

  public addStompLog(frame: Omit<StompFrame, 'id' | 'timestamp'>) {
    const log: StompFrame = {
      id: `frame_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toLocaleTimeString(),
      ...frame,
    };
    this.stompLogs = [log, ...this.stompLogs].slice(0, 100);
    this.notify();
  }

  public getStompLogs(): StompFrame[] {
    return this.stompLogs;
  }

  public clearStompLogs() {
    this.stompLogs = [];
    this.notify();
  }

  public getCurrentUser(): User {
    const user = this.users.find((u) => u.id === this.currentUserId);
    if (!user) {
      return this.users[0] || INITIAL_USERS[0];
    }
    return user;
  }

  public getJwtToken(): string {
    return this.jwtToken;
  }

  public getAllUsers(): User[] {
    return this.users;
  }

  public switchUser(userId: string) {
    const target = this.users.find((u) => u.id === userId);
    if (!target) return;
    this.currentUserId = userId;
    this.generateJwtForCurrent();
    this.logStompConnection();
    this.save();
  }

  public registerUser(name: string, email: string, passwordHash: string, avatar?: string): User {
    const existing = this.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      throw new Error(`Email ${email} is already registered. Duplicate email rejected by Spring Data JPA.`);
    }

    const newUser: User = {
      id: `user_${Date.now()}`,
      name,
      email,
      avatar: avatar || `https://images.unsplash.com/photo-${1535713875002 + this.users.length}?w=150&auto=format&fit=crop&q=80`,
      statusMessage: 'Hey there! I am using WhatsApp / Spring Boot Chat.',
      status: 'ONLINE',
      createdAt: new Date().toISOString(),
    };

    this.users.push(newUser);
    this.currentUserId = newUser.id;
    this.generateJwtForCurrent();
    this.logStompConnection();
    this.save();
    return newUser;
  }

  public loginUser(email: string): User {
    const user = this.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      throw new Error('Invalid credentials: user not found in MySQL database.');
    }
    this.currentUserId = user.id;
    this.generateJwtForCurrent();
    this.logStompConnection();
    this.save();
    return user;
  }

  public updateUserProfile(name: string, statusMessage: string, avatar?: string) {
    const user = this.getCurrentUser();
    user.name = name;
    user.statusMessage = statusMessage;
    if (avatar) user.avatar = avatar;

    // Update in all conversations
    this.conversations.forEach((conv) => {
      const member = conv.members.find((m) => m.userId === user.id);
      if (member) {
        member.userName = name;
        if (avatar) member.userAvatar = avatar;
      }
    });

    this.save();
  }

  public getConversations(): Conversation[] {
    // Return conversations where current user is a member
    return this.conversations
      .filter((c) => c.members.some((m) => m.userId === this.currentUserId))
      .map((c) => {
        // If private chat, title and avatar should match the OTHER participant
        if (c.type === 'PRIVATE') {
          const otherMember = c.members.find((m) => m.userId !== this.currentUserId);
          if (otherMember) {
            const userObj = this.users.find((u) => u.id === otherMember.userId);
            return {
              ...c,
              title: otherMember.userName,
              avatar: otherMember.userAvatar,
              otherUser: userObj,
            };
          }
        }
        return c;
      })
      .sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        const timeA = new Date(a.updatedAt).getTime();
        const timeB = new Date(b.updatedAt).getTime();
        return timeB - timeA;
      });
  }

  public getMessages(conversationId: string): Message[] {
    return this.messages[conversationId] || [];
  }

  public sendMessage(
    conversationId: string,
    content: string,
    type: MessageType = 'TEXT',
    mediaUrl?: string,
    mediaDuration?: number
  ): Message {
    const currentUser = this.getCurrentUser();
    const conv = this.conversations.find((c) => c.id === conversationId);
    if (!conv) throw new Error('Conversation not found');

    const newMsg: Message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      conversationId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      type,
      content,
      mediaUrl,
      mediaDuration,
      createdAt: new Date().toISOString(),
      receiptStatus: 'SENT',
    };

    if (!this.messages[conversationId]) {
      this.messages[conversationId] = [];
    }
    this.messages[conversationId].push(newMsg);

    // Update conversation last message
    conv.lastMessage = newMsg;
    conv.updatedAt = newMsg.createdAt;

    soundEffects.playSent();

    // Log STOMP SEND frame
    this.addStompLog({
      command: 'SEND',
      direction: 'OUTGOING',
      destination: '/app/chat.send',
      headers: {
        destination: '/app/chat.send',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        conversationId,
        content,
        type,
        mediaUrl,
      }),
    });

    this.save();

    // Simulate STOMP broker distributing message to subscribers
    setTimeout(() => {
      newMsg.receiptStatus = 'DELIVERED';
      this.addStompLog({
        command: 'MESSAGE',
        direction: 'INCOMING',
        destination: `/topic/conversation.${conversationId}`,
        headers: {
          'message-id': newMsg.id,
          destination: `/topic/conversation.${conversationId}`,
          'subscription': `sub-${conversationId}`,
        },
        body: JSON.stringify(newMsg),
      });
      this.save();
    }, 400);

    // If private chat with another user, simulate their read receipt & response
    this.simulateParticipantInteraction(conv, newMsg);

    return newMsg;
  }

  private simulateParticipantInteraction(conv: Conversation, sentMsg: Message) {
    const otherMembers = conv.members.filter((m) => m.userId !== this.currentUserId);
    if (otherMembers.length === 0) return;

    const responder = otherMembers[0];

    // Mark as READ after 1.5 seconds
    setTimeout(() => {
      sentMsg.receiptStatus = 'READ';
      this.addStompLog({
        command: 'MESSAGE',
        direction: 'INCOMING',
        destination: `/topic/conversation.${conv.id}.receipt`,
        headers: {
          'receipt-for': sentMsg.id,
          'status': 'READ',
          'reader-id': responder.userId,
        },
      });
      this.save();
    }, 1200);

    // Trigger typing indicator after 2.2 seconds
    setTimeout(() => {
      this.setTyping(conv.id, responder.userName, true);
      this.addStompLog({
        command: 'MESSAGE',
        direction: 'INCOMING',
        destination: `/topic/conversation.${conv.id}.typing`,
        headers: {
          'user-id': responder.userId,
          'typing': 'true',
        },
      });
    }, 2200);

    // Send automated reply after 4.5 seconds
    setTimeout(() => {
      this.setTyping(conv.id, responder.userName, false);

      const replies: Record<string, string[]> = {
        conv_direct_1: [
          'Brilliant! The Spring Data JPA pagination ensures message queries stay under 5ms even with 100k records.',
          'Tested the STOMP message channel interceptor—unauthenticated tokens are cleanly intercepted with 401 UNAUTHORIZED.',
          'Love how responsive this WhatsApp UI is! Perfectly replicates the web layout.',
        ],
        conv_direct_2: [
          'MySQL 8 InnoDB buffer pool is configured for 1GB. Flyway schema migration completed without errors.',
          'Connection pool stats: 10 active, 5 idle. HikariCP handling load gracefully.',
        ],
        conv_group_1: [
          'Great point! For group messaging, the STOMP simple broker broadcasts to /topic/conversation.{id} seamlessly.',
          'Team, remember to check the JPA @Entity relationships—ConversationMember uses Composite PK or surrogate ID cleanly.',
        ],
      };

      const pool = replies[conv.id] || [
        'Got your message! Processing via Spring Boot STOMP WebSocket.',
        'Looks solid! Ready for the Java Full Stack interview demo.',
      ];
      const replyText = pool[Math.floor(Math.random() * pool.length)];

      const replyMsg: Message = {
        id: `msg_reply_${Date.now()}`,
        conversationId: conv.id,
        senderId: responder.userId,
        senderName: responder.userName,
        senderAvatar: responder.userAvatar,
        type: 'TEXT',
        content: replyText,
        createdAt: new Date().toISOString(),
        receiptStatus: 'READ',
      };

      if (!this.messages[conv.id]) this.messages[conv.id] = [];
      this.messages[conv.id].push(replyMsg);
      conv.lastMessage = replyMsg;
      conv.updatedAt = replyMsg.createdAt;

      soundEffects.playReceived();

      this.addStompLog({
        command: 'MESSAGE',
        direction: 'INCOMING',
        destination: `/topic/conversation.${conv.id}`,
        headers: {
          'message-id': replyMsg.id,
          'sender': responder.userEmail,
        },
        body: JSON.stringify(replyMsg),
      });

      this.save();
    }, 4500);
  }

  public setTyping(conversationId: string, userName: string, isTyping: boolean) {
    if (!this.typingMap[conversationId]) {
      this.typingMap[conversationId] = [];
    }
    if (isTyping) {
      if (!this.typingMap[conversationId].includes(userName)) {
        this.typingMap[conversationId].push(userName);
      }
    } else {
      this.typingMap[conversationId] = this.typingMap[conversationId].filter((u) => u !== userName);
    }
    this.notify();
  }

  public getTypingUsers(conversationId: string): string[] {
    return this.typingMap[conversationId] || [];
  }

  public markAsRead(conversationId: string) {
    const conv = this.conversations.find((c) => c.id === conversationId);
    if (!conv) return;

    conv.unreadCount = 0;
    const msgs = this.messages[conversationId] || [];
    msgs.forEach((m) => {
      if (m.senderId !== this.currentUserId && m.receiptStatus !== 'READ') {
        m.receiptStatus = 'READ';
      }
    });

    this.save();
  }

  public createDirectConversation(targetUserId: string): Conversation {
    const currentUser = this.getCurrentUser();
    const targetUser = this.users.find((u) => u.id === targetUserId);
    if (!targetUser) throw new Error('Target user not found');

    // Check if conversation already exists
    const existing = this.conversations.find(
      (c) =>
        c.type === 'PRIVATE' &&
        c.members.some((m) => m.userId === currentUser.id) &&
        c.members.some((m) => m.userId === targetUserId)
    );

    if (existing) {
      return existing;
    }

    const newConv: Conversation = {
      id: `conv_direct_${Date.now()}`,
      type: 'PRIVATE',
      title: targetUser.name,
      avatar: targetUser.avatar,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      unreadCount: 0,
      members: [
        {
          userId: currentUser.id,
          userName: currentUser.name,
          userAvatar: currentUser.avatar,
          userEmail: currentUser.email,
          role: 'MEMBER',
          joinedAt: new Date().toISOString(),
        },
        {
          userId: targetUser.id,
          userName: targetUser.name,
          userAvatar: targetUser.avatar,
          userEmail: targetUser.email,
          role: 'MEMBER',
          joinedAt: new Date().toISOString(),
        },
      ],
    };

    this.conversations.unshift(newConv);
    this.messages[newConv.id] = [];
    this.save();
    return newConv;
  }

  public createGroupConversation(title: string, memberUserIds: string[], avatar?: string): Conversation {
    const currentUser = this.getCurrentUser();
    const members: import('../types/chat').ConversationMember[] = [
      {
        userId: currentUser.id,
        userName: currentUser.name,
        userAvatar: currentUser.avatar,
        userEmail: currentUser.email,
        role: 'ADMIN',
        joinedAt: new Date().toISOString(),
      },
    ];

    memberUserIds.forEach((id) => {
      if (id !== currentUser.id) {
        const u = this.users.find((user) => user.id === id);
        if (u) {
          members.push({
            userId: u.id,
            userName: u.name,
            userAvatar: u.avatar,
            userEmail: u.email,
            role: 'MEMBER' as const,
            joinedAt: new Date().toISOString(),
          });
        }
      }
    });

    const newGroup: Conversation = {
      id: `conv_group_${Date.now()}`,
      type: 'GROUP',
      title,
      avatar: avatar || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&auto=format&fit=crop&q=80',
      creatorId: currentUser.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      unreadCount: 0,
      members,
    };

    const welcomeMsg: Message = {
      id: `msg_sys_${Date.now()}`,
      conversationId: newGroup.id,
      senderId: 'SYSTEM',
      senderName: 'System',
      senderAvatar: '',
      type: 'SYSTEM',
      content: `${currentUser.name} created group "${title}" with ${members.length} members.`,
      createdAt: new Date().toISOString(),
      receiptStatus: 'READ',
    };

    this.conversations.unshift(newGroup);
    this.messages[newGroup.id] = [welcomeMsg];
    newGroup.lastMessage = welcomeMsg;

    this.save();
    return newGroup;
  }

  public resetToDefault() {
    localStorage.removeItem('wb_chat_users');
    localStorage.removeItem('wb_chat_conversations');
    localStorage.removeItem('wb_chat_messages');
    localStorage.removeItem('wb_chat_current_user_id');
    this.users = [...INITIAL_USERS];
    this.conversations = [...INITIAL_CONVERSATIONS];
    this.messages = { ...INITIAL_MESSAGES };
    this.currentUserId = 'user_1';
    this.generateJwtForCurrent();
    this.logStompConnection();
    this.notify();
  }
}

export const chatStorage = new ChatStorageService();
