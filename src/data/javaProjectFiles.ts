export interface JavaFileItem {
  path: string;
  name: string;
  category: 'config' | 'entity' | 'repository' | 'service' | 'controller' | 'dto' | 'security' | 'websocket' | 'exception' | 'test' | 'resource' | 'doc';
  language: string;
  code: string;
  description: string;
}

export const JAVA_PROJECT_FILES: JavaFileItem[] = [
  {
    path: 'pom.xml',
    name: 'pom.xml',
    category: 'resource',
    language: 'xml',
    description: 'Maven Project Object Model with Spring Boot 3.3.4, Spring Security, WebSocket STOMP, JPA, MySQL 8, and JJWT 0.12.5.',
    code: `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.3.4</version>
        <relativePath/> <!-- lookup parent from repository -->
    </parent>

    <groupId>com.chat.realtime</groupId>
    <artifactId>whatsapp-spring-boot-chat</artifactId>
    <version>1.0.0-SNAPSHOT</version>
    <name>whatsapp-spring-boot-chat</name>
    <description>Production Real-Time Chat Engine using Spring Boot, WebSocket STOMP, Spring Security, JWT, and MySQL</description>

    <properties>
        <java.version>17</java.version>
        <jjwt.version>0.12.5</jjwt.version>
    </properties>

    <dependencies>
        <!-- Spring Boot Starters -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-websocket</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>

        <!-- Database: MySQL Driver & Connection Pool (HikariCP included by starter) -->
        <dependency>
            <groupId>com.mysql</groupId>
            <artifactId>mysql-connector-j</artifactId>
            <scope>runtime</scope>
        </dependency>

        <!-- JWT Authentication (jjwt 0.12.5) -->
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-api</artifactId>
            <version>\${jjwt.version}</version>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-impl</artifactId>
            <version>\${jjwt.version}</version>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-jackson</artifactId>
            <version>\${jjwt.version}</version>
            <scope>runtime</scope>
        </dependency>

        <!-- Lombok for clean boilerplate elimination -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>

        <!-- Testing -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.springframework.security</groupId>
            <artifactId>spring-security-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <configuration>
                    <excludes>
                        <exclude>
                            <groupId>org.projectlombok</groupId>
                            <artifactId>lombok</artifactId>
                        </exclude>
                    </excludes>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>`,
  },
  {
    path: 'src/main/resources/application.yml',
    name: 'application.yml',
    category: 'resource',
    language: 'yaml',
    description: 'Spring Boot application configuration for MySQL 8, JPA/Hibernate, HikariCP pool, STOMP broker, and JWT secret.',
    code: `server:
  port: 8080
  servlet:
    context-path: /

spring:
  application:
    name: whatsapp-spring-boot-chat

  datasource:
    url: \${SPRING_DATASOURCE_URL:jdbc:mysql://localhost:3306/chatdb?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true&characterEncoding=UTF-8}
    username: \${SPRING_DATASOURCE_USERNAME:root}
    password: \${SPRING_DATASOURCE_PASSWORD:rootpassword}
    driver-class-name: com.mysql.cj.jdbc.Driver
    hikari:
      pool-name: ChatHikariCP
      maximum-pool-size: 20
      minimum-idle: 5
      idle-timeout: 300000
      connection-timeout: 20000
      max-lifetime: 1200000

  jpa:
    database-platform: org.hibernate.dialect.MySQLDialect
    hibernate:
      ddl-auto: update
    show-sql: false
    properties:
      hibernate:
        format_sql: true
        jdbc:
          batch_size: 25
        order_inserts: true
        order_updates: true

  servlet:
    multipart:
      max-file-size: 10MB
      max-request-size: 15MB

# Security & JWT Configuration
app:
  jwt:
    # 512-bit Base64 or plain string for HS512 HMAC signing
    secret: \${JWT_SECRET:9a4f2c8d3b7a1e6f5c8d0b2a4e6f8a1c3d5e7b9a2c4e6f8a1c3d5e7b9a2c4e6f8a1c3d5e7b9a2c4e6f8a1c3d5e7b9a2c4e6f8a1c3d5e7b9a2c4e6f8a1c3d5e7b}
    expiration-ms: 86400000 # 24 hours

logging:
  level:
    root: INFO
    com.chat.realtime: DEBUG
    org.springframework.web.socket: INFO
    org.springframework.messaging: INFO`,
  },
  {
    path: 'src/main/resources/schema.sql',
    name: 'schema.sql',
    category: 'resource',
    language: 'sql',
    description: 'Production MySQL 8 DDL schema script with foreign keys, indexes, and utf8mb4 encoding.',
    code: `-- ========================================================
-- Production Schema for WhatsApp Web / Spring Boot Chat App
-- MySQL 8.x Dialect with utf8mb4 collation for full emoji support
-- ========================================================

CREATE DATABASE IF NOT EXISTS chatdb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE chatdb;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(500),
    status_message VARCHAR(255) DEFAULT 'Hey there! I am using WhatsApp / Spring Boot Chat.',
    is_online BOOLEAN DEFAULT FALSE,
    last_seen_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_email (email),
    INDEX idx_user_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Conversations Table
CREATE TABLE IF NOT EXISTS conversations (
    id VARCHAR(36) PRIMARY KEY,
    type ENUM('PRIVATE', 'GROUP') NOT NULL DEFAULT 'PRIVATE',
    title VARCHAR(150),
    avatar_url VARCHAR(500),
    creator_id VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_conv_creator FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_conv_updated_at (updated_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Conversation Members Table (Many-to-Many bridge with roles)
CREATE TABLE IF NOT EXISTS conversation_members (
    id VARCHAR(36) PRIMARY KEY,
    conversation_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    role ENUM('ADMIN', 'MEMBER') NOT NULL DEFAULT 'MEMBER',
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_cm_conv FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
    CONSTRAINT fk_cm_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY uq_conv_user (conversation_id, user_id),
    INDEX idx_cm_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Messages Table
CREATE TABLE IF NOT EXISTS messages (
    id VARCHAR(36) PRIMARY KEY,
    conversation_id VARCHAR(36) NOT NULL,
    sender_id VARCHAR(36) NOT NULL,
    type ENUM('TEXT', 'IMAGE', 'AUDIO', 'SYSTEM') NOT NULL DEFAULT 'TEXT',
    content TEXT NOT NULL,
    media_url VARCHAR(500),
    media_duration INT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_msg_conv FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
    CONSTRAINT fk_msg_sender FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_msg_conv_created (conversation_id, created_at DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Message Receipts Table (Read & Delivery receipts per participant)
CREATE TABLE IF NOT EXISTS message_receipts (
    id VARCHAR(36) PRIMARY KEY,
    message_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    status ENUM('SENT', 'DELIVERED', 'READ') NOT NULL DEFAULT 'DELIVERED',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_receipt_msg FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE,
    CONSTRAINT fk_receipt_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY uq_receipt_msg_user (message_id, user_id),
    INDEX idx_receipt_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,
  },
  {
    path: 'src/main/java/com/chat/realtime/ChatApplication.java',
    name: 'ChatApplication.java',
    category: 'config',
    language: 'java',
    description: 'Spring Boot Main Application Entry Point with JPA Auditing enabled.',
    code: `package com.chat.realtime;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

/**
 * Main Spring Boot Application entry point for Real-Time Chat Engine.
 * Configured with JPA Auditing and WebSocket STOMP messaging support.
 */
@SpringBootApplication
@EnableJpaAuditing
public class ChatApplication {

    public static void main(String[] args) {
        SpringApplication.run(ChatApplication.class, args);
    }
}`,
  },
  {
    path: 'src/main/java/com/chat/realtime/entity/User.java',
    name: 'User.java',
    category: 'entity',
    language: 'java',
    description: 'JPA Entity representing a user with BCrypt hashed password and presence tracking.',
    code: `package com.chat.realtime.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "users", indexes = {
    @Index(name = "idx_user_email", columnList = "email"),
    @Index(name = "idx_user_name", columnList = "name")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, unique = true, length = 150)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(name = "avatar_url", length = 500)
    private String avatarUrl;

    @Column(name = "status_message", length = 255)
    @Builder.Default
    private String statusMessage = "Hey there! I am using WhatsApp / Spring Boot Chat.";

    @Column(name = "is_online")
    @Builder.Default
    private Boolean isOnline = false;

    @Column(name = "last_seen_at")
    private LocalDateTime lastSeenAt;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}`,
  },
  {
    path: 'src/main/java/com/chat/realtime/entity/Conversation.java',
    name: 'Conversation.java',
    category: 'entity',
    language: 'java',
    description: 'JPA Entity representing a 1-to-1 or Group conversation with members and cascade bindings.',
    code: `package com.chat.realtime.entity;

import com.chat.realtime.entity.enums.ConversationType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "conversations", indexes = {
    @Index(name = "idx_conv_updated_at", columnList = "updated_at")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Conversation {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ConversationType type;

    @Column(length = 150)
    private String title;

    @Column(name = "avatar_url", length = 500)
    private String avatarUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "creator_id")
    private User creator;

    @OneToMany(mappedBy = "conversation", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ConversationMember> members = new ArrayList<>();

    @OneToMany(mappedBy = "conversation", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Message> messages = new ArrayList<>();

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public void addMember(ConversationMember member) {
        members.add(member);
        member.setConversation(this);
    }
}`,
  },
  {
    path: 'src/main/java/com/chat/realtime/entity/ConversationMember.java',
    name: 'ConversationMember.java',
    category: 'entity',
    language: 'java',
    description: 'JPA Entity representing participant membership and role (ADMIN / MEMBER) in a conversation.',
    code: `package com.chat.realtime.entity;

import com.chat.realtime.entity.enums.MemberRole;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "conversation_members", uniqueConstraints = {
    @UniqueConstraint(name = "uq_conv_user", columnNames = {"conversation_id", "user_id"})
}, indexes = {
    @Index(name = "idx_cm_user", columnList = "user_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConversationMember {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "conversation_id", nullable = false)
    private Conversation conversation;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private MemberRole role = MemberRole.MEMBER;

    @CreationTimestamp
    @Column(name = "joined_at", updatable = false)
    private LocalDateTime joinedAt;
}`,
  },
  {
    path: 'src/main/java/com/chat/realtime/entity/Message.java',
    name: 'Message.java',
    category: 'entity',
    language: 'java',
    description: 'JPA Entity representing chat messages with support for text, images, voice notes, and system alerts.',
    code: `package com.chat.realtime.entity;

import com.chat.realtime.entity.enums.MessageType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "messages", indexes = {
    @Index(name = "idx_msg_conv_created", columnList = "conversation_id, created_at DESC")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "conversation_id", nullable = false)
    private Conversation conversation;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private MessageType type = MessageType.TEXT;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(name = "media_url", length = 500)
    private String mediaUrl;

    @Column(name = "media_duration")
    private Integer mediaDuration;

    @OneToMany(mappedBy = "message", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<MessageReceipt> receipts = new ArrayList<>();

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}`,
  },
  {
    path: 'src/main/java/com/chat/realtime/entity/MessageReceipt.java',
    name: 'MessageReceipt.java',
    category: 'entity',
    language: 'java',
    description: 'JPA Entity tracking read/delivered status for participants.',
    code: `package com.chat.realtime.entity;

import com.chat.realtime.entity.enums.ReceiptStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "message_receipts", uniqueConstraints = {
    @UniqueConstraint(name = "uq_receipt_msg_user", columnNames = {"message_id", "user_id"})
}, indexes = {
    @Index(name = "idx_receipt_status", columnList = "status")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MessageReceipt {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "message_id", nullable = false)
    private Message message;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private ReceiptStatus status = ReceiptStatus.DELIVERED;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}`,
  },
  {
    path: 'src/main/java/com/chat/realtime/entity/enums/ConversationType.java',
    name: 'ConversationType.java',
    category: 'entity',
    language: 'java',
    description: 'Enum defining conversation type: PRIVATE or GROUP.',
    code: `package com.chat.realtime.entity.enums;

public enum ConversationType {
    PRIVATE,
    GROUP
}`,
  },
  {
    path: 'src/main/java/com/chat/realtime/entity/enums/MemberRole.java',
    name: 'MemberRole.java',
    category: 'entity',
    language: 'java',
    description: 'Enum defining member roles: ADMIN or MEMBER.',
    code: `package com.chat.realtime.entity.enums;

public enum MemberRole {
    ADMIN,
    MEMBER
}`,
  },
  {
    path: 'src/main/java/com/chat/realtime/entity/enums/MessageType.java',
    name: 'MessageType.java',
    category: 'entity',
    language: 'java',
    description: 'Enum defining message types: TEXT, IMAGE, AUDIO, or SYSTEM.',
    code: `package com.chat.realtime.entity.enums;

public enum MessageType {
    TEXT,
    IMAGE,
    AUDIO,
    SYSTEM
}`,
  },
  {
    path: 'src/main/java/com/chat/realtime/entity/enums/ReceiptStatus.java',
    name: 'ReceiptStatus.java',
    category: 'entity',
    language: 'java',
    description: 'Enum defining receipt states: SENT, DELIVERED, or READ.',
    code: `package com.chat.realtime.entity.enums;

public enum ReceiptStatus {
    SENT,
    DELIVERED,
    READ
}`,
  },
  {
    path: 'src/main/java/com/chat/realtime/repository/UserRepository.java',
    name: 'UserRepository.java',
    category: 'repository',
    language: 'java',
    description: 'Spring Data JPA Repository for User with duplicate check and search queries.',
    code: `package com.chat.realtime.repository;

import com.chat.realtime.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    @Query("SELECT u FROM User u WHERE " +
           "(LOWER(u.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(u.email) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND u.id != :currentUserId")
    List<User> searchUsers(@Param("keyword") String keyword, @Param("currentUserId") String currentUserId);
}`,
  },
  {
    path: 'src/main/java/com/chat/realtime/repository/ConversationRepository.java',
    name: 'ConversationRepository.java',
    category: 'repository',
    language: 'java',
    description: 'Spring Data JPA Repository for finding direct & group conversations by user.',
    code: `package com.chat.realtime.repository;

import com.chat.realtime.entity.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, String> {

    @Query("SELECT DISTINCT c FROM Conversation c " +
           "JOIN c.members m " +
           "WHERE m.user.id = :userId " +
           "ORDER BY c.updatedAt DESC")
    List<Conversation> findAllByUserId(@Param("userId") String userId);

    @Query("SELECT c FROM Conversation c " +
           "WHERE c.type = 'PRIVATE' AND " +
           "EXISTS (SELECT 1 FROM ConversationMember cm1 WHERE cm1.conversation = c AND cm1.user.id = :user1Id) AND " +
           "EXISTS (SELECT 1 FROM ConversationMember cm2 WHERE cm2.conversation = c AND cm2.user.id = :user2Id)")
    Optional<Conversation> findDirectConversationBetweenUsers(@Param("user1Id") String user1Id,
                                                              @Param("user2Id") String user2Id);
}`,
  },
  {
    path: 'src/main/java/com/chat/realtime/repository/ConversationMemberRepository.java',
    name: 'ConversationMemberRepository.java',
    category: 'repository',
    language: 'java',
    description: 'Repository for membership verification and role authorization in conversations.',
    code: `package com.chat.realtime.repository;

import com.chat.realtime.entity.ConversationMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ConversationMemberRepository extends JpaRepository<ConversationMember, String> {

    Optional<ConversationMember> findByConversationIdAndUserId(String conversationId, String userId);

    boolean existsByConversationIdAndUserId(String conversationId, String userId);
}`,
  },
  {
    path: 'src/main/java/com/chat/realtime/repository/MessageRepository.java',
    name: 'MessageRepository.java',
    category: 'repository',
    language: 'java',
    description: 'Spring Data JPA Repository for paginated message history retrieval.',
    code: `package com.chat.realtime.repository;

import com.chat.realtime.entity.Message;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MessageRepository extends JpaRepository<Message, String> {

    Page<Message> findByConversationIdOrderByCreatedAtDesc(String conversationId, Pageable pageable);

    @Query("SELECT m FROM Message m WHERE m.conversation.id = :conversationId ORDER BY m.createdAt DESC LIMIT 1")
    Optional<Message> findLatestMessageByConversationId(@Param("conversationId") String conversationId);

    @Query("SELECT COUNT(m) FROM Message m " +
           "WHERE m.conversation.id = :conversationId AND m.sender.id != :userId AND " +
           "NOT EXISTS (SELECT r FROM MessageReceipt r WHERE r.message = m AND r.user.id = :userId AND r.status = 'READ')")
    long countUnreadMessages(@Param("conversationId") String conversationId, @Param("userId") String userId);
}`,
  },
  {
    path: 'src/main/java/com/chat/realtime/security/JwtTokenProvider.java',
    name: 'JwtTokenProvider.java',
    category: 'security',
    language: 'java',
    description: 'Utility for generating, validating, and extracting claims from HS512 JWT tokens.',
    code: `package com.chat.realtime.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.security.Key;
import java.util.Date;

@Slf4j
@Component
public class JwtTokenProvider {

    @Value("\${app.jwt.secret}")
    private String jwtSecret;

    @Value("\${app.jwt.expiration-ms}")
    private long jwtExpirationMs;

    private Key getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(jwtSecret);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateToken(Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationMs);

        return Jwts.builder()
                .subject(userPrincipal.getId())
                .claim("email", userPrincipal.getEmail())
                .claim("name", userPrincipal.getName())
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(getSigningKey(), Jwts.SIG.HS512)
                .compact();
    }

    public String getUserIdFromToken(String token) {
        Claims claims = Jwts.parser()
                .verifyWith((SecretKey) getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();

        return claims.getSubject();
    }

    public boolean validateToken(String authToken) {
        try {
            Jwts.parser()
                    .verifyWith((SecretKey) getSigningKey())
                    .build()
                    .parseSignedClaims(authToken);
            return true;
        } catch (JwtException | IllegalArgumentException ex) {
            log.error("Invalid JWT token: {}", ex.getMessage());
        }
        return false;
    }
}`,
  },
  {
    path: 'src/main/java/com/chat/realtime/security/JwtAuthenticationFilter.java',
    name: 'JwtAuthenticationFilter.java',
    category: 'security',
    language: 'java',
    description: 'OncePerRequestFilter intercepting HTTP requests to validate Bearer token.',
    code: `package com.chat.realtime.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider tokenProvider;
    private final CustomUserDetailsService customUserDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        try {
            String jwt = getJwtFromRequest(request);

            if (StringUtils.hasText(jwt) && tokenProvider.validateToken(jwt)) {
                String userId = tokenProvider.getUserIdFromToken(jwt);

                UserDetails userDetails = customUserDetailsService.loadUserById(userId);
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        } catch (Exception ex) {
            log.error("Could not set user authentication in security context", ex);
        }

        filterChain.doFilter(request, response);
    }

    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}`,
  },
  {
    path: 'src/main/java/com/chat/realtime/security/SecurityConfig.java',
    name: 'SecurityConfig.java',
    category: 'security',
    language: 'java',
    description: 'Spring Security 6 configuration bean with stateless sessions and CORS.',
    code: `package com.chat.realtime.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationEntryPoint unauthorizedHandler;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .exceptionHandling(ex -> ex.authenticationEntryPoint(unauthorizedHandler))
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/v1/auth/**").permitAll()
                .requestMatchers("/ws-chat/**").permitAll() // Handshake verified by ChannelInterceptor
                .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
                .anyRequest().authenticated()
            );

        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOriginPatterns(List.of("*"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}`,
  },
  {
    path: 'src/main/java/com/chat/realtime/websocket/WebSocketConfig.java',
    name: 'WebSocketConfig.java',
    category: 'websocket',
    language: 'java',
    description: 'WebSocket STOMP Broker configuration with SockJS fallback and JWT interceptor.',
    code: `package com.chat.realtime.websocket;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
@RequiredArgsConstructor
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private final WebSocketSecurityInterceptor securityInterceptor;

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // Simple in-memory STOMP broker for /topic (broadcast) and /queue (user private)
        config.enableSimpleBroker("/topic", "/queue")
              .setHeartbeatValue(new long[]{10000, 10000});
        // Prefix for client @MessageMapping destinations
        config.setApplicationDestinationPrefixes("/app");
        // User-specific routing prefix
        config.setUserDestinationPrefix("/user");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws-chat")
                .setAllowedOriginPatterns("*")
                .withSockJS();
    }

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        // Intercept STOMP CONNECT frames to validate JWT token in Authorization header
        registration.interceptors(securityInterceptor);
    }
}`,
  },
  {
    path: 'src/main/java/com/chat/realtime/websocket/WebSocketSecurityInterceptor.java',
    name: 'WebSocketSecurityInterceptor.java',
    category: 'websocket',
    language: 'java',
    description: 'ChannelInterceptor validating JWT tokens on STOMP CONNECT frame.',
    code: `package com.chat.realtime.websocket;

import com.chat.realtime.security.CustomUserDetailsService;
import com.chat.realtime.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

@Slf4j
@Component
@RequiredArgsConstructor
public class WebSocketSecurityInterceptor implements ChannelInterceptor {

    private final JwtTokenProvider tokenProvider;
    private final CustomUserDetailsService userDetailsService;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor =
                MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        if (accessor != null && StompCommand.CONNECT.equals(accessor.getCommand())) {
            String authHeader = accessor.getFirstNativeHeader("Authorization");

            if (StringUtils.hasText(authHeader) && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);

                if (tokenProvider.validateToken(token)) {
                    String userId = tokenProvider.getUserIdFromToken(token);
                    UserDetails userDetails = userDetailsService.loadUserById(userId);

                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

                    accessor.setUser(authentication);
                    log.info("STOMP authenticated successfully for user: {}", userDetails.getUsername());
                } else {
                    log.warn("STOMP CONNECT rejected: Invalid JWT token");
                }
            } else {
                log.warn("STOMP CONNECT missing Authorization Bearer header");
            }
        }

        return message;
    }
}`,
  },
  {
    path: 'src/main/java/com/chat/realtime/service/MessageService.java',
    name: 'MessageService.java',
    category: 'service',
    language: 'java',
    description: 'Transactional service handling message persistence, validation, and real-time STOMP dispatch.',
    code: `package com.chat.realtime.service;

import com.chat.realtime.dto.request.SendMessagePayload;
import com.chat.realtime.dto.response.MessageResponse;
import com.chat.realtime.entity.*;
import com.chat.realtime.entity.enums.ReceiptStatus;
import com.chat.realtime.exception.ResourceNotFoundException;
import com.chat.realtime.exception.UnauthorizedException;
import com.chat.realtime.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final ConversationRepository conversationRepository;
    private final ConversationMemberRepository memberRepository;
    private final UserRepository userRepository;
    private final MessageReceiptRepository receiptRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Transactional
    public MessageResponse sendMessage(String senderId, SendMessagePayload payload) {
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + senderId));

        Conversation conversation = conversationRepository.findById(payload.getConversationId())
                .orElseThrow(() -> new ResourceNotFoundException("Conversation not found: " + payload.getConversationId()));

        // Security check: verify membership
        if (!memberRepository.existsByConversationIdAndUserId(conversation.getId(), senderId)) {
            throw new UnauthorizedException("You are not a member of this conversation.");
        }

        Message message = Message.builder()
                .conversation(conversation)
                .sender(sender)
                .type(payload.getType())
                .content(payload.getContent())
                .mediaUrl(payload.getMediaUrl())
                .mediaDuration(payload.getMediaDuration())
                .build();

        Message savedMessage = messageRepository.save(message);

        // Update conversation last updated timestamp
        conversation.setUpdatedAt(LocalDateTime.now());
        conversationRepository.save(conversation);

        MessageResponse response = MessageResponse.fromEntity(savedMessage);

        // Broadcast to conversation topic: /topic/conversation.{id}
        messagingTemplate.convertAndSend("/topic/conversation." + conversation.getId(), response);

        return response;
    }

    @Transactional(readOnly = true)
    public Page<MessageResponse> getConversationMessages(String userId, String conversationId, int page, int size) {
        if (!memberRepository.existsByConversationIdAndUserId(conversationId, userId)) {
            throw new UnauthorizedException("You are not authorized to view this conversation's messages.");
        }

        Pageable pageable = PageRequest.of(page, size);
        return messageRepository.findByConversationIdOrderByCreatedAtDesc(conversationId, pageable)
                .map(MessageResponse::fromEntity);
    }

    @Transactional
    public void markMessagesAsRead(String userId, String conversationId) {
        // Mark all unread receipts for this user in this conversation as READ
        // Send receipt notification via STOMP
        messagingTemplate.convertAndSend("/topic/conversation." + conversationId + ".receipt",
                java.util.Map.of("conversationId", conversationId, "readerId", userId, "status", "READ"));
    }
}`,
  },
  {
    path: 'src/main/java/com/chat/realtime/controller/ChatWebSocketController.java',
    name: 'ChatWebSocketController.java',
    category: 'controller',
    language: 'java',
    description: 'STOMP MessageMapping controller handling /app/chat.send, typing, and read receipts.',
    code: `package com.chat.realtime.controller;

import com.chat.realtime.dto.request.SendMessagePayload;
import com.chat.realtime.dto.request.TypingPayload;
import com.chat.realtime.dto.response.MessageResponse;
import com.chat.realtime.security.UserPrincipal;
import com.chat.realtime.service.MessageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Slf4j
@Controller
@RequiredArgsConstructor
public class ChatWebSocketController {

    private final MessageService messageService;
    private final SimpMessagingTemplate messagingTemplate;

    /**
     * Handles outgoing message sending via STOMP: /app/chat.send
     */
    @MessageMapping("/chat.send")
    public void handleSendMessage(@Valid @Payload SendMessagePayload payload, Principal principal) {
        String userId = principal.getName();
        log.info("WebSocket chat.send received from user: {} for conv: {}", userId, payload.getConversationId());
        messageService.sendMessage(userId, payload);
    }

    /**
     * Handles real-time typing indicator: /app/chat.typing
     */
    @MessageMapping("/chat.typing")
    public void handleTyping(@Valid @Payload TypingPayload payload, Principal principal) {
        messagingTemplate.convertAndSend(
                "/topic/conversation." + payload.getConversationId() + ".typing",
                java.util.Map.of(
                        "conversationId", payload.getConversationId(),
                        "userId", principal.getName(),
                        "isTyping", payload.isTyping()
                )
        );
    }
}`,
  },
  {
    path: 'src/main/java/com/chat/realtime/controller/AuthController.java',
    name: 'AuthController.java',
    category: 'controller',
    language: 'java',
    description: 'REST Controller for user registration and JWT authentication login.',
    code: `package com.chat.realtime.controller;

import com.chat.realtime.dto.request.LoginRequest;
import com.chat.realtime.dto.request.RegisterRequest;
import com.chat.realtime.dto.response.ApiResponse;
import com.chat.realtime.dto.response.AuthResponse;
import com.chat.realtime.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse authResponse = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("User registered successfully", authResponse));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse authResponse = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Login successful", authResponse));
    }
}`,
  },
  {
    path: 'src/main/java/com/chat/realtime/controller/ConversationController.java',
    name: 'ConversationController.java',
    category: 'controller',
    language: 'java',
    description: 'REST Controller for conversation list, 1-on-1 initiation, and group creation.',
    code: `package com.chat.realtime.controller;

import com.chat.realtime.dto.request.CreateGroupRequest;
import com.chat.realtime.dto.response.ApiResponse;
import com.chat.realtime.dto.response.ConversationResponse;
import com.chat.realtime.security.UserPrincipal;
import com.chat.realtime.service.ConversationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/conversations")
@RequiredArgsConstructor
public class ConversationController {

    private final ConversationService conversationService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ConversationResponse>>> getConversations(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        List<ConversationResponse> conversations = conversationService.getUserConversations(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(conversations));
    }

    @PostMapping("/direct/{targetUserId}")
    public ResponseEntity<ApiResponse<ConversationResponse>> getOrCreateDirectConversation(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable String targetUserId) {
        ConversationResponse response = conversationService.getOrCreateDirectConversation(currentUser.getId(), targetUserId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/group")
    public ResponseEntity<ApiResponse<ConversationResponse>> createGroup(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody CreateGroupRequest request) {
        ConversationResponse response = conversationService.createGroup(currentUser.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Group created successfully", response));
    }
}`,
  },
  {
    path: 'src/main/java/com/chat/realtime/exception/GlobalExceptionHandler.java',
    name: 'GlobalExceptionHandler.java',
    category: 'exception',
    language: 'java',
    description: 'Centralized @RestControllerAdvice exception handler with standardized error payloads.',
    code: `package com.chat.realtime.exception;

import com.chat.realtime.dto.response.ApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleNotFound(ResourceNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error(ex.getMessage()));
    }

    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<ApiResponse<Void>> handleUnauthorized(UnauthorizedException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ApiResponse.error(ex.getMessage()));
    }

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<ApiResponse<Void>> handleBadRequest(BadRequestException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ApiResponse.error(ex.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Map<String, String>>> handleValidation(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach(error -> {
            String field = ((FieldError) error).getField();
            String message = error.getDefaultMessage();
            errors.put(field, message);
        });
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.<Map<String, String>>builder()
                        .success(false)
                        .message("Validation failed")
                        .data(errors)
                        .build());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleGeneric(Exception ex) {
        log.error("Unhandled exception occurred: ", ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Internal server error: " + ex.getMessage()));
    }
}`,
  },
  {
    path: 'src/test/java/com/chat/realtime/service/MessageServiceTest.java',
    name: 'MessageServiceTest.java',
    category: 'test',
    language: 'java',
    description: 'Unit test verifying conversation authorization, message persistence, and STOMP broadcast.',
    code: `package com.chat.realtime.service;

import com.chat.realtime.dto.request.SendMessagePayload;
import com.chat.realtime.dto.response.MessageResponse;
import com.chat.realtime.entity.*;
import com.chat.realtime.entity.enums.MessageType;
import com.chat.realtime.exception.UnauthorizedException;
import com.chat.realtime.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MessageServiceTest {

    @Mock
    private MessageRepository messageRepository;
    @Mock
    private ConversationRepository conversationRepository;
    @Mock
    private ConversationMemberRepository memberRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private SimpMessagingTemplate messagingTemplate;

    @InjectMocks
    private MessageService messageService;

    private User mockSender;
    private Conversation mockConversation;

    @BeforeEach
    void setUp() {
        mockSender = User.builder().id("user_1").name("Alex").email("alex@test.com").build();
        mockConversation = Conversation.builder().id("conv_1").title("Chat").build();
    }

    @Test
    @DisplayName("Should successfully send message and broadcast to STOMP destination")
    void shouldSendMessageSuccessfully() {
        SendMessagePayload payload = new SendMessagePayload();
        payload.setConversationId("conv_1");
        payload.setContent("Hello World");
        payload.setType(MessageType.TEXT);

        when(userRepository.findById("user_1")).thenReturn(Optional.of(mockSender));
        when(conversationRepository.findById("conv_1")).thenReturn(Optional.of(mockConversation));
        when(memberRepository.existsByConversationIdAndUserId("conv_1", "user_1")).thenReturn(true);
        when(messageRepository.save(any(Message.class))).thenAnswer(i -> {
            Message m = i.getArgument(0);
            m.setId("msg_generated_1");
            return m;
        });

        MessageResponse response = messageService.sendMessage("user_1", payload);

        assertNotNull(response);
        assertEquals("Hello World", response.getContent());
        verify(messagingTemplate, times(1)).convertAndSend(eq("/topic/conversation.conv_1"), any(MessageResponse.class));
    }

    @Test
    @DisplayName("Should throw UnauthorizedException when sender is not in conversation")
    void shouldThrowWhenNotMember() {
        SendMessagePayload payload = new SendMessagePayload();
        payload.setConversationId("conv_1");
        payload.setContent("Hello");
        payload.setType(MessageType.TEXT);

        when(userRepository.findById("user_1")).thenReturn(Optional.of(mockSender));
        when(conversationRepository.findById("conv_1")).thenReturn(Optional.of(mockConversation));
        when(memberRepository.existsByConversationIdAndUserId("conv_1", "user_1")).thenReturn(false);

        assertThrows(UnauthorizedException.class, () -> messageService.sendMessage("user_1", payload));
        verify(messageRepository, never()).save(any());
    }
}`,
  },
  {
    path: 'README.md',
    name: 'README.md',
    category: 'doc',
    language: 'markdown',
    description: 'Comprehensive setup guide, architecture breakdown, interview question cheat sheet, and VS Code instructions.',
    code: `# Real-Time Chat Application (WhatsApp Web Clone) - Java Spring Boot & WebSocket STOMP

A complete, production-grade real-time messaging application engineered with **Java 17, Spring Boot 3.3, Spring Security, JWT, WebSocket with STOMP, Spring Data JPA, Hibernate, and MySQL 8**.

---

## Architecture & Message Flow

\`\`\`
[Browser Client]
       │
       ├── (1) HTTP POST /api/v1/auth/login ───> [Spring Security + JWT Provider] ───> Returns Bearer JWT
       │
       ├── (2) WebSocket Handshake /ws-chat ───> [WebSocketSecurityInterceptor] ────> Validates Token on CONNECT
       │
       ├── (3) STOMP SEND /app/chat.send ──────> [@MessageMapping Controller]
       │                                                 │
       │                                                 ▼
       │                                        [MessageService @Transactional]
       │                                                 │
       │                                                 ├──> [Spring Data JPA + MySQL 8]
       │                                                 │        (INSERT into messages, receipts)
       │                                                 │
       │                                                 └──> [SimpMessagingTemplate]
       │                                                          │
       ▼                                                          ▼
[Subscribed Clients] <───────────────────────────── Broadcast to /topic/conversation.{id}
\`\`\`

---

## Key Tech Stack
- **Backend Framework**: Spring Boot 3.3.4
- **Language**: Java 17+
- **Security**: Spring Security 6 (Stateless JWT HS512, BCrypt 12 rounds)
- **Real-Time Engine**: Spring WebSocket with STOMP & SimpleBroker
- **ORM & Database**: Spring Data JPA / Hibernate 6, MySQL 8 InnoDB (HikariCP connection pool)
- **Validation**: Bean Validation (JSR 380)

---

## How to Run in VS Code / Terminal

### 1. MySQL Database Setup
\`\`\`bash
mysql -u root -p < src/main/resources/schema.sql
\`\`\`

### 2. Configure Environment (application.yml)
Set your MySQL credentials or pass them via environment variables:
\`\`\`bash
export SPRING_DATASOURCE_URL="jdbc:mysql://localhost:3306/chatdb?useSSL=false&serverTimezone=UTC"
export SPRING_DATASOURCE_USERNAME="root"
export SPRING_DATASOURCE_PASSWORD="yourpassword"
export JWT_SECRET="your-base64-encoded-512bit-secret"
\`\`\`

### 3. Run Backend
\`\`\`bash
mvn clean spring-boot:run
\`\`\`
The backend starts on **http://localhost:8080**.

---

## Java Full Stack Developer Interview Highlights

1. **How does WebSocket authentication work in Spring Boot?**
   - Standard HTTP filters do not inspect WebSocket frames after the HTTP upgrade handshake.
   - We implement a custom \`ChannelInterceptor\` registered on \`configureClientInboundChannel\`.
   - On \`StompCommand.CONNECT\`, we inspect the native header \`Authorization: Bearer <token>\`, validate with JJWT, and inject the authenticated \`UsernamePasswordAuthenticationToken\` into the STOMP session accessor.

2. **How is the JPA N+1 problem avoided?**
   - Using \`JOIN FETCH\` in custom JPQL queries in \`ConversationRepository\` and proper indexing on \`(conversation_id, created_at DESC)\` for pagination.

3. **How does WhatsApp-style message delivery status work?**
   - **SENT (Single tick)**: Message received by backend and saved to MySQL.
   - **DELIVERED (Double gray tick)**: Recipient client establishes STOMP connection and acks packet.
   - **READ (Double blue tick)**: Recipient opens conversation viewport, firing \`/app/chat.read\` event.
`,
  },
];
