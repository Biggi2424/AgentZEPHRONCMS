-- Neyraq Cloud - PostgreSQL Schema
-- Multi-tenant, vorbereitet für Tickets, Agents, Deployments und Service Store.

-- Vorbereitung
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "citext";

-- 1) Tenants & Users
CREATE TABLE tenants (
    id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name       TEXT NOT NULL,
    slug       TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    email           CITEXT NOT NULL,
    display_name    TEXT NOT NULL,
    role            TEXT NOT NULL CHECK (role IN ('owner','admin','operator','viewer')),
    auth_provider   TEXT NOT NULL DEFAULT 'local',
    auth_subject_id TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    last_login_at   TIMESTAMPTZ
);

CREATE UNIQUE INDEX users_tenant_email_uq ON users(tenant_id, email);

-- 2) Agents & Agent-Events
CREATE TABLE agents (
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id     UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    device_name   TEXT NOT NULL,
    user_id       UUID REFERENCES users(id),
    os_version    TEXT NOT NULL,
    neyraq_version TEXT NOT NULL,
    online_status TEXT NOT NULL CHECK (online_status IN ('online','offline')),
    last_seen_at  TIMESTAMPTZ,
    tags          TEXT[] NOT NULL DEFAULT '{}',
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX agents_tenant_idx ON agents(tenant_id);
CREATE INDEX agents_tenant_hostname ON agents(tenant_id, device_name);

CREATE TABLE agent_events (
    id           BIGSERIAL PRIMARY KEY,
    tenant_id    UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    agent_id     UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
    event_type   TEXT NOT NULL,
    severity     TEXT NOT NULL DEFAULT 'info',
    message      TEXT NOT NULL,
    payload_json JSONB,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX agent_events_agent_idx ON agent_events(agent_id, created_at DESC);
CREATE INDEX agent_events_tenant_idx ON agent_events(tenant_id, created_at DESC);

-- 3) Ticketsystem
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ticket_status') THEN
        CREATE TYPE ticket_status AS ENUM ('new', 'in_progress', 'waiting', 'resolved', 'closed');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ticket_priority') THEN
        CREATE TYPE ticket_priority AS ENUM ('low', 'normal', 'high', 'critical');
    END IF;
END$$;

CREATE TABLE tickets (
    id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id         UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    human_id          TEXT NOT NULL,
    title             TEXT NOT NULL,
    description       TEXT NOT NULL DEFAULT '',
    status            ticket_status NOT NULL DEFAULT 'new',
    priority          ticket_priority NOT NULL DEFAULT 'normal',
    requester_user_id UUID REFERENCES users(id),
    assignee_user_id  UUID REFERENCES users(id),
    source            TEXT NOT NULL CHECK (source IN ('portal','email','agent')),
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    closed_at         TIMESTAMPTZ
);

CREATE UNIQUE INDEX tickets_tenant_human_id_uq ON tickets(tenant_id, human_id);
CREATE INDEX tickets_tenant_status_idx ON tickets(tenant_id, status, created_at DESC);
CREATE INDEX tickets_requester_idx ON tickets(requester_user_id, created_at DESC);

CREATE TABLE ticket_comments (
    id             BIGSERIAL PRIMARY KEY,
    tenant_id      UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    ticket_id      UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    author_user_id UUID REFERENCES users(id),
    agent_id       UUID REFERENCES agents(id),
    body           TEXT NOT NULL,
    is_internal    BOOLEAN NOT NULL DEFAULT false,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX ticket_comments_ticket_idx ON ticket_comments(ticket_id, created_at);

CREATE TABLE ticket_attachments (
    id              BIGSERIAL PRIMARY KEY,
    tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    ticket_id       UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    file_name       TEXT NOT NULL,
    content_type    TEXT NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    storage_url     TEXT NOT NULL,
    uploaded_by     UUID REFERENCES users(id),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX ticket_attachments_ticket_idx ON ticket_attachments(ticket_id);

-- 4) Softwareverteilung
CREATE TABLE packages (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id           UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name                TEXT NOT NULL,
    version             TEXT NOT NULL,
    type                TEXT NOT NULL CHECK (type IN ('msi','exe','script')),
    install_command     TEXT NOT NULL,
    uninstall_command   TEXT,
    reboot_behavior     TEXT NOT NULL CHECK (reboot_behavior IN ('never','if_needed','always')),
    file_url            TEXT NOT NULL,
    detection_rule_json JSONB,
    created_by          UUID REFERENCES users(id),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX packages_tenant_name_idx ON packages(tenant_id, name);

CREATE TABLE device_groups (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id   UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name        TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    is_dynamic  BOOLEAN NOT NULL DEFAULT false,
    query_json  JSONB,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX device_groups_tenant_idx ON device_groups(tenant_id, name);

CREATE TABLE device_group_members (
    device_group_id UUID NOT NULL REFERENCES device_groups(id) ON DELETE CASCADE,
    agent_id        UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
    PRIMARY KEY (device_group_id, agent_id)
);

CREATE TABLE deployments (
    id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id        UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    package_id       UUID NOT NULL REFERENCES packages(id) ON DELETE CASCADE,
    device_group_id  UUID NOT NULL REFERENCES device_groups(id) ON DELETE RESTRICT,
    name             TEXT NOT NULL,
    rollout_strategy TEXT NOT NULL CHECK (rollout_strategy IN ('all_at_once','ring','scheduled')),
    ring_config_json JSONB,
    start_time       TIMESTAMPTZ,
    status           TEXT NOT NULL CHECK (status IN ('pending','running','completed','cancelled','failed')) DEFAULT 'pending',
    created_by       UUID REFERENCES users(id),
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX deployments_tenant_idx ON deployments(tenant_id, created_at DESC);

CREATE TABLE deployment_results (
    id             BIGSERIAL PRIMARY KEY,
    deployment_id  UUID NOT NULL REFERENCES deployments(id) ON DELETE CASCADE,
    tenant_id      UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    agent_id       UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
    status         TEXT NOT NULL CHECK (status IN ('pending','running','success','failed','skipped')),
    last_update_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    log_url        TEXT,
    last_message   TEXT
);

CREATE INDEX deployment_results_deployment_idx ON deployment_results(deployment_id, status);
CREATE INDEX deployment_results_agent_idx ON deployment_results(agent_id, last_update_at DESC);

-- 5) Service Store
CREATE TABLE catalog_items (
    id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id         UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    type              TEXT NOT NULL CHECK (type IN ('software','service')),
    title             TEXT NOT NULL,
    description       TEXT NOT NULL DEFAULT '',
    icon_url          TEXT,
    category          TEXT NOT NULL,
    requires_approval BOOLEAN NOT NULL DEFAULT false,
    linked_package_id UUID REFERENCES packages(id),
    linked_workflow   TEXT,
    is_active         BOOLEAN NOT NULL DEFAULT true,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by        UUID REFERENCES users(id)
);

CREATE INDEX catalog_items_tenant_idx ON catalog_items(tenant_id, category, is_active);

CREATE TABLE catalog_requests (
    id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id         UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    catalog_item_id   UUID NOT NULL REFERENCES catalog_items(id) ON DELETE CASCADE,
    requester_user_id UUID REFERENCES users(id),
    agent_id          UUID REFERENCES agents(id),
    status            TEXT NOT NULL CHECK (status IN ('requested','in_review','approved','rejected','fulfilled','cancelled')) DEFAULT 'requested',
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    ticket_id         UUID REFERENCES tickets(id),
    deployment_id     UUID REFERENCES deployments(id)
);

CREATE INDEX catalog_requests_tenant_status_idx ON catalog_requests(tenant_id, status, created_at DESC);

-- 6) API Keys / Integrationen
CREATE TABLE api_keys (
    id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id  UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    label      TEXT NOT NULL,
    secret_hash TEXT NOT NULL,
    scopes     TEXT[] NOT NULL DEFAULT '{}',
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    last_used_at TIMESTAMPTZ,
    is_revoked  BOOLEAN NOT NULL DEFAULT false
);

CREATE INDEX api_keys_tenant_idx ON api_keys(tenant_id, is_revoked);
