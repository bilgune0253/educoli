
-- 1. Хоёр оюутны чат
CREATE TABLE IF NOT EXISTS conversations (
    id BIGSERIAL PRIMARY KEY,

    learning_request_id BIGINT NOT NULL UNIQUE
        REFERENCES learning_requests(id)
        ON DELETE RESTRICT,

    student_id INTEGER NOT NULL
        REFERENCES users(id),

    tutor_id INTEGER NOT NULL
        REFERENCES users(id),

    status VARCHAR(20) NOT NULL DEFAULT 'active'
        CHECK (status IN ('active', 'archived')),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    archived_at TIMESTAMPTZ,

    CHECK (student_id <> tutor_id)
);

-- 2. Чат доторх мессежүүд
CREATE TABLE IF NOT EXISTS messages (
    id BIGSERIAL PRIMARY KEY,

    conversation_id BIGINT NOT NULL
        REFERENCES conversations(id)
        ON DELETE CASCADE,

    sender_id INTEGER NOT NULL
        REFERENCES users(id),

    content TEXT NOT NULL
        CHECK (
            char_length(btrim(content)) BETWEEN 1 AND 2000
        ),

    is_read BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Мессежүүдийг хурдан хайх индекс
CREATE INDEX IF NOT EXISTS idx_messages_conversation
ON messages(conversation_id, created_at DESC, id DESC);

-- 4. Оюутны чатуудыг хурдан хайх индекс
CREATE INDEX IF NOT EXISTS idx_conversations_student
ON conversations(student_id);

CREATE INDEX IF NOT EXISTS idx_conversations_tutor
ON conversations(tutor_id);
