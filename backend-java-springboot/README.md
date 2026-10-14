# Real-Time Chat Application (WhatsApp Web Clone) - Java Spring Boot & WebSocket STOMP

A complete, production-grade real-time messaging application engineered with **Java 17, Spring Boot 3.3, Spring Security, JWT, WebSocket with STOMP, Spring Data JPA, Hibernate, and MySQL 8**.

---

## Architecture & Message Flow

```
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
```

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
```bash
mysql -u root -p < src/main/resources/schema.sql
```

### 2. Configure Environment (application.yml)
Set your MySQL credentials or pass them via environment variables:
```bash
export SPRING_DATASOURCE_URL="jdbc:mysql://localhost:3306/chatdb?useSSL=false&serverTimezone=UTC"
export SPRING_DATASOURCE_USERNAME="root"
export SPRING_DATASOURCE_PASSWORD="yourpassword"
export JWT_SECRET="your-base64-encoded-512bit-secret"
```

### 3. Run Backend
```bash
mvn clean spring-boot:run
```
The backend starts on **http://localhost:8080**.

---

## Java Full Stack Developer Interview Highlights

1. **How does WebSocket authentication work in Spring Boot?**
   - Standard HTTP filters do not inspect WebSocket frames after the HTTP upgrade handshake.
   - We implement a custom `ChannelInterceptor` registered on `configureClientInboundChannel`.
   - On `StompCommand.CONNECT`, we inspect the native header `Authorization: Bearer <token>`, validate with JJWT, and inject the authenticated `UsernamePasswordAuthenticationToken` into the STOMP session accessor.

2. **How is the JPA N+1 problem avoided?**
   - Using `JOIN FETCH` in custom JPQL queries in `ConversationRepository` and proper indexing on `(conversation_id, created_at DESC)` for pagination.

3. **How does WhatsApp-style message delivery status work?**
   - **SENT (Single tick)**: Message received by backend and saved to MySQL.
   - **DELIVERED (Double gray tick)**: Recipient client establishes STOMP connection and acks packet.
   - **READ (Double blue tick)**: Recipient opens conversation viewport, firing `/app/chat.read` event.
