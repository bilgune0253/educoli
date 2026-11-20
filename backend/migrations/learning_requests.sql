
CREATE TABLE IF NOT EXISTS learning_requests (
    id BIGSERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL
        REFERENCES users(id) ON DELETE CASCADE,
    subject VARCHAR(120) NOT NULL,
    topic VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    preferred_format VARCHAR(20) NOT NULL DEFAULT 'either'
        CHECK (preferred_format IN ('online', 'offline', 'either')),
    budget NUMERIC(12,2)
        CHECK (budget IS NULL OR budget >= 0),
    status VARCHAR(20) NOT NULL DEFAULT 'open'
        CHECK (status IN ('open', 'matched', 'closed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS learning_offers (
    id BIGSERIAL PRIMARY KEY,
    learning_request_id BIGINT NOT NULL
        REFERENCES learning_requests(id) ON DELETE CASCADE,
    tutor_id INTEGER NOT NULL
        REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    proposed_price NUMERIC(12,2) NOT NULL
        CHECK (proposed_price >= 0),
    status VARCHAR(20) NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'accepted', 'rejected')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (learning_request_id, tutor_id)
);

CREATE INDEX IF NOT EXISTS idx_learning_requests_status
ON learning_requests(status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_learning_offers_request
ON learning_offers(learning_request_id);
