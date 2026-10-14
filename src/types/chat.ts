export type UserStatus = 'ONLINE' | 'OFFLINE' | 'AWAY';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  statusMessage: string;
  status: UserStatus;
  lastSeen?: string;
  createdAt: string;
}

export type ConversationType = 'PRIVATE' | 'GROUP';

export type MemberRole = 'ADMIN' | 'MEMBER';

export interface ConversationMember {
  userId: string;
  userName: string;
  userAvatar: string;
  userEmail: string;
  role: MemberRole;
  joinedAt: string;
}

export type MessageType = 'TEXT' | 'IMAGE' | 'AUDIO' | 'SYSTEM';

export type ReceiptStatus = 'SENT' | 'DELIVERED' | 'READ';

export interface MessageReceipt {
  userId: string;
  status: ReceiptStatus;
  timestamp: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  type: MessageType;
  content: string;
  mediaUrl?: string;
  mediaDuration?: number; // For audio in seconds
  createdAt: string;
  receiptStatus: ReceiptStatus; // overall for 1-1 or current recipient
  receipts?: MessageReceipt[]; // for group breakdowns
}

export interface Conversation {
  id: string;
  type: ConversationType;
  title: string; // Contact name or group name
  avatar?: string;
  creatorId?: string;
  createdAt: string;
  updatedAt: string;
  members: ConversationMember[];
  lastMessage?: Message;
  unreadCount?: number;
  isPinned?: boolean;
}

export interface StompFrame {
  id: string;
  command: 'CONNECT' | 'CONNECTED' | 'SUBSCRIBE' | 'SEND' | 'MESSAGE' | 'RECEIPT' | 'DISCONNECT';
  destination?: string;
  headers: Record<string, string>;
  body?: string;
  timestamp: string;
  direction: 'INCOMING' | 'OUTGOING';
}

export interface TypingEvent {
  conversationId: string;
  userId: string;
  userName: string;
  isTyping: boolean;
}
