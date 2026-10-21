-- EvidenceChain Schema Definition (MySQL 8.x / Compatible with H2)

CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL,
    department VARCHAR(100),
    agency VARCHAR(100),
    badge_number VARCHAR(50),
    account_locked BOOLEAN DEFAULT FALSE,
    failed_attempts INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS evidence (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    case_number VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(100) NOT NULL,
    file_size BIGINT NOT NULL,
    file_hash VARCHAR(64) NOT NULL,
    stored_path VARCHAR(500) NOT NULL,
    authenticity_score INT DEFAULT 100,
    heuristic_flags VARCHAR(500),
    auto_tags VARCHAR(255),
    investigator_id VARCHAR(50) NOT NULL,
    investigator_name VARCHAR(100),
    location VARCHAR(255) NOT NULL,
    collection_timestamp TIMESTAMP NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    current_owner_id BIGINT,
    is_tampered BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS ledger_blocks (
    block_index BIGINT PRIMARY KEY,
    timestamp BIGINT NOT NULL,
    evidence_id BIGINT,
    file_hash VARCHAR(64) NOT NULL,
    authenticity_score INT NOT NULL,
    investigator_id VARCHAR(50) NOT NULL,
    previous_hash VARCHAR(64) NOT NULL,
    block_hash VARCHAR(64) NOT NULL
);

CREATE TABLE IF NOT EXISTS custody_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    evidence_id BIGINT,
    case_number VARCHAR(100),
    user_id BIGINT NOT NULL,
    username VARCHAR(50) NOT NULL,
    user_role VARCHAR(20) NOT NULL,
    action VARCHAR(50) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(50),
    details TEXT
);

CREATE TABLE IF NOT EXISTS security_alerts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    username VARCHAR(50) NOT NULL,
    rule_violated VARCHAR(100) NOT NULL,
    risk_score INT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    details TEXT,
    resolved BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS user_activity_stats (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    hour_bucket VARCHAR(30) NOT NULL,
    action_count INT DEFAULT 0
);
