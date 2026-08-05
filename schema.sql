-- =========================================================
-- Car Selling Platform — Schema
-- PostgreSQL (Neon)
-- Single-seller today, seller_id groundwork for future marketplace
-- =========================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pg_trgm; -- for fuzzy text search on make/model

-- =========================================================
-- SELLERS
-- Only one row today (you), but modeled for future dealers.
-- =========================================================
CREATE TABLE sellers (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name            VARCHAR(150) NOT NULL,
    slug            VARCHAR(160) UNIQUE NOT NULL,
    type            VARCHAR(20) NOT NULL DEFAULT 'dealer'
                        CHECK (type IN ('dealer', 'private')),
    phone           VARCHAR(20),
    whatsapp        VARCHAR(20),
    email           VARCHAR(150),
    location_text   VARCHAR(255),       -- e.g. "Westlands, Nairobi"
    latitude        NUMERIC(9,6),
    longitude       NUMERIC(9,6),
    verified        BOOLEAN NOT NULL DEFAULT TRUE, -- default true since it's you
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =========================================================
-- USERS (buyers + admin/internal staff)
-- =========================================================
CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email           VARCHAR(150) UNIQUE NOT NULL,
    phone           VARCHAR(20) UNIQUE,
    password_hash   VARCHAR(255),           -- null if OAuth-only
    full_name       VARCHAR(150),
    role            VARCHAR(20) NOT NULL DEFAULT 'buyer'
                        CHECK (role IN ('buyer', 'admin', 'staff')),
    seller_id       UUID REFERENCES sellers(id) ON DELETE SET NULL, -- for admin/staff tied to a dealer
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_users_role ON users(role);

-- =========================================================
-- CARS (core inventory)
-- =========================================================
CREATE TABLE cars (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    seller_id           UUID NOT NULL REFERENCES sellers(id) ON DELETE CASCADE,

    -- Core spec
    make                VARCHAR(60) NOT NULL,
    model               VARCHAR(60) NOT NULL,
    trim                VARCHAR(60),
    year                SMALLINT NOT NULL CHECK (year BETWEEN 1980 AND 2100),
    vin                 VARCHAR(32),
    body_type           VARCHAR(30),        -- sedan, suv, hatchback, pickup, van...
    transmission        VARCHAR(20) CHECK (transmission IN ('automatic', 'manual', 'cvt')),
    fuel_type           VARCHAR(20) CHECK (fuel_type IN ('petrol', 'diesel', 'hybrid', 'electric')),
    drivetrain          VARCHAR(10) CHECK (drivetrain IN ('fwd', 'rwd', 'awd', '4wd')),
    engine_capacity_cc  INTEGER,
    mileage_km          INTEGER NOT NULL DEFAULT 0,
    color               VARCHAR(30),
    seats               SMALLINT,
    condition           VARCHAR(20) NOT NULL DEFAULT 'used'
                            CHECK (condition IN ('new', 'used', 'certified_preowned')),

    -- Origin (relevant for KE market)
    import_type         VARCHAR(20) CHECK (import_type IN ('locally_used', 'foreign_used', 'brand_new')),

    -- Pricing
    price               NUMERIC(12,2) NOT NULL,
    negotiable           BOOLEAN NOT NULL DEFAULT TRUE,
    previous_price       NUMERIC(12,2),          -- for "just reduced" badge

    -- Status / lifecycle
    status              VARCHAR(20) NOT NULL DEFAULT 'draft'
                            CHECK (status IN ('draft', 'published', 'reserved', 'sold', 'archived')),
    featured            BOOLEAN NOT NULL DEFAULT FALSE,
    listed_at           TIMESTAMPTZ,
    sold_at             TIMESTAMPTZ,

    -- Content
    description         TEXT,
    slug                VARCHAR(200) UNIQUE NOT NULL,

    -- Search helper (generated tsvector for full-text search)
    search_vector       TSVECTOR GENERATED ALWAYS AS (
                            to_tsvector('english',
                                coalesce(make,'') || ' ' ||
                                coalesce(model,'') || ' ' ||
                                coalesce(trim,'') || ' ' ||
                                coalesce(description,'')
                            )
                        ) STORED,

    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes tuned for the filter/sort patterns you'll actually query
CREATE INDEX idx_cars_seller       ON cars(seller_id);
CREATE INDEX idx_cars_status       ON cars(status);
CREATE INDEX idx_cars_make_model   ON cars(make, model);
CREATE INDEX idx_cars_year         ON cars(year);
CREATE INDEX idx_cars_price        ON cars(price);
CREATE INDEX idx_cars_mileage      ON cars(mileage_km);
CREATE INDEX idx_cars_body_type    ON cars(body_type);
CREATE INDEX idx_cars_fuel_type    ON cars(fuel_type);
CREATE INDEX idx_cars_search       ON cars USING GIN(search_vector);
CREATE INDEX idx_cars_make_trgm    ON cars USING GIN(make gin_trgm_ops);
CREATE INDEX idx_cars_model_trgm   ON cars USING GIN(model gin_trgm_ops);
-- Composite index for the most common combined filter (status + price sort)
CREATE INDEX idx_cars_status_price ON cars(status, price);

-- =========================================================
-- CAR IMAGES
-- Stored via ImageKit — this table holds references, not files.
-- =========================================================
CREATE TABLE car_images (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    car_id          UUID NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
    imagekit_file_id VARCHAR(100) NOT NULL,   -- ImageKit's fileId, for deletion/mgmt via API
    url             TEXT NOT NULL,             -- base ImageKit URL (transforms applied at render time)
    alt_text        VARCHAR(150),
    position        SMALLINT NOT NULL DEFAULT 0, -- ordering, position 0 = cover photo
    is_cover        BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_car_images_car ON car_images(car_id, position);
-- Ensure only one cover image per car
CREATE UNIQUE INDEX idx_car_images_one_cover
    ON car_images(car_id) WHERE is_cover = TRUE;

-- =========================================================
-- INSPECTION SCORECARD (your trust differentiator)
-- =========================================================
CREATE TABLE inspections (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    car_id          UUID NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
    inspector_name  VARCHAR(100),
    inspected_at    DATE NOT NULL DEFAULT CURRENT_DATE,
    overall_score   SMALLINT CHECK (overall_score BETWEEN 0 AND 100),
    video_url       TEXT,             -- walkaround video, ImageKit or Youtube
    notes           TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE inspection_items (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    inspection_id   UUID NOT NULL REFERENCES inspections(id) ON DELETE CASCADE,
    category        VARCHAR(40) NOT NULL,   -- engine, body, tires, electronics, interior...
    item            VARCHAR(100) NOT NULL,  -- e.g. "Brake pads"
    rating          VARCHAR(20) NOT NULL CHECK (rating IN ('good', 'fair', 'needs_attention')),
    remarks         TEXT
);

CREATE INDEX idx_inspection_items_inspection ON inspection_items(inspection_id);

-- =========================================================
-- LEADS / ENQUIRIES (your internal CRM-lite)
-- =========================================================
CREATE TABLE leads (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    car_id          UUID NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
    user_id         UUID REFERENCES users(id) ON DELETE SET NULL, -- null if guest enquiry
    name            VARCHAR(150) NOT NULL,
    phone           VARCHAR(20) NOT NULL,
    email           VARCHAR(150),
    channel         VARCHAR(20) NOT NULL DEFAULT 'form'
                        CHECK (channel IN ('form', 'whatsapp', 'call', 'test_drive')),
    message         TEXT,
    status          VARCHAR(20) NOT NULL DEFAULT 'new'
                        CHECK (status IN ('new', 'contacted', 'test_drive_booked', 'negotiating', 'won', 'lost')),
    assigned_to     UUID REFERENCES users(id) ON DELETE SET NULL, -- staff member handling it
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_leads_car    ON leads(car_id);
CREATE INDEX idx_leads_status ON leads(status);

-- =========================================================
-- TEST DRIVE BOOKINGS
-- =========================================================
CREATE TABLE test_drive_bookings (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id         UUID REFERENCES leads(id) ON DELETE SET NULL,
    car_id          UUID NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
    scheduled_at    TIMESTAMPTZ NOT NULL,
    status          VARCHAR(20) NOT NULL DEFAULT 'pending'
                        CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled', 'no_show')),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_test_drive_car ON test_drive_bookings(car_id, scheduled_at);

-- =========================================================
-- RESERVATIONS (M-Pesa deposit to hold a car)
-- =========================================================
CREATE TABLE reservations (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    car_id              UUID NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
    lead_id             UUID REFERENCES leads(id) ON DELETE SET NULL,
    user_id             UUID REFERENCES users(id) ON DELETE SET NULL,
    amount              NUMERIC(10,2) NOT NULL,
    mpesa_receipt       VARCHAR(50),
    mpesa_phone         VARCHAR(20),
    status              VARCHAR(20) NOT NULL DEFAULT 'pending'
                            CHECK (status IN ('pending', 'paid', 'expired', 'refunded', 'converted')),
    expires_at          TIMESTAMPTZ NOT NULL, -- e.g. now() + 48 hours
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_reservations_car    ON reservations(car_id);
CREATE INDEX idx_reservations_status ON reservations(status);
-- Prevent more than one active reservation per car at a time
CREATE UNIQUE INDEX idx_reservations_one_active_per_car
    ON reservations(car_id) WHERE status = 'pending';

-- =========================================================
-- TRADE-IN VALUATIONS
-- =========================================================
CREATE TABLE trade_in_requests (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id         UUID REFERENCES leads(id) ON DELETE SET NULL,
    make            VARCHAR(60) NOT NULL,
    model           VARCHAR(60) NOT NULL,
    year            SMALLINT NOT NULL,
    mileage_km      INTEGER NOT NULL,
    condition_notes TEXT,
    estimated_value NUMERIC(12,2),
    status          VARCHAR(20) NOT NULL DEFAULT 'pending'
                        CHECK (status IN ('pending', 'estimated', 'inspected', 'accepted', 'rejected')),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =========================================================
-- FAVORITES / SAVED SEARCHES (buyer dashboard)
-- =========================================================
CREATE TABLE favorites (
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    car_id          UUID NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, car_id)
);

CREATE TABLE saved_searches (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name            VARCHAR(100),
    filters         JSONB NOT NULL,      -- { make, model, price_max, year_min, ... }
    notify          BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_saved_searches_user ON saved_searches(user_id);

-- =========================================================
-- WAITLIST (notify me when similar car arrives — for sold cars)
-- =========================================================
CREATE TABLE waitlist_entries (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    car_id          UUID REFERENCES cars(id) ON DELETE SET NULL, -- the sold car that triggered interest
    user_id         UUID REFERENCES users(id) ON DELETE SET NULL,
    name            VARCHAR(150),
    phone           VARCHAR(20),
    email           VARCHAR(150),
    make            VARCHAR(60),
    model           VARCHAR(60),
    max_price        NUMERIC(12,2),
    notified        BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =========================================================
-- updated_at auto-touch trigger (applied to key tables)
-- =========================================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_cars_updated_at
    BEFORE UPDATE ON cars
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_sellers_updated_at
    BEFORE UPDATE ON sellers
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_leads_updated_at
    BEFORE UPDATE ON leads
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- =========================================================
-- Seed: your own seller record (single-seller today)
-- =========================================================
INSERT INTO sellers (name, slug, type, verified)
VALUES ('Your Dealership Name', 'your-dealership-name', 'dealer', TRUE);