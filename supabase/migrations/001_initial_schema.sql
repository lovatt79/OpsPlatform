-- Operations Platform Database Schema
-- For Supabase (PostgreSQL)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- CORE TABLES
-- ============================================

-- Organizations (tenants for white-label)
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    logo_url TEXT,
    primary_color TEXT DEFAULT '#3B82F6',
    timezone TEXT DEFAULT 'America/New_York',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Roles within an organization
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    requires_license BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Locations
CREATE TABLE locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Manager roles and permissions
CREATE TABLE manager_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    permissions JSONB NOT NULL DEFAULT '{}',
    scope_type TEXT NOT NULL DEFAULT 'all' CHECK (scope_type IN ('all', 'role', 'location')),
    scope_ids UUID[],
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Staff
CREATE TABLE staff (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    auth_user_id UUID, -- Links to Supabase Auth
    email TEXT NOT NULL,
    phone TEXT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    role_id UUID REFERENCES roles(id) ON DELETE SET NULL,
    is_manager BOOLEAN DEFAULT FALSE,
    manager_role_id UUID REFERENCES manager_roles(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'onboarding', 'offboarded')),
    preferences JSONB DEFAULT '{}',
    compliance_override JSONB,
    is_minor BOOLEAN DEFAULT FALSE,
    contract_type TEXT DEFAULT 'full_time' CHECK (contract_type IN ('full_time', 'part_time', 'seasonal', 'contractor')),
    max_weekly_hours INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(organization_id, email)
);

-- Staff extended details (HR)
CREATE TABLE staff_details (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    staff_id UUID NOT NULL UNIQUE REFERENCES staff(id) ON DELETE CASCADE,
    date_of_birth DATE,
    address TEXT,
    city TEXT,
    state TEXT,
    postal_code TEXT,
    country TEXT,
    emergency_contact_name TEXT,
    emergency_contact_phone TEXT,
    emergency_contact_relationship TEXT,
    start_date DATE,
    end_date DATE,
    employment_type TEXT DEFAULT 'full_time',
    pay_type TEXT CHECK (pay_type IN ('hourly', 'salary')),
    pay_rate NUMERIC(10,2),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SCHEDULING TABLES
-- ============================================

-- Schedules (weekly)
CREATE TABLE schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    week_start DATE NOT NULL,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'revised')),
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Shifts
CREATE TABLE shifts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    schedule_id UUID NOT NULL REFERENCES schedules(id) ON DELETE CASCADE,
    staff_id UUID REFERENCES staff(id) ON DELETE SET NULL,
    role_id UUID REFERENCES roles(id) ON DELETE SET NULL,
    location_id UUID REFERENCES locations(id) ON DELETE SET NULL,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'callout', 'completed')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Open shifts
CREATE TABLE open_shifts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    role_id UUID REFERENCES roles(id) ON DELETE SET NULL,
    location_id UUID REFERENCES locations(id) ON DELETE SET NULL,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    assignment_type TEXT DEFAULT 'first_come' CHECK (assignment_type IN ('first_come', 'approval')),
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'filled', 'cancelled')),
    filled_by UUID REFERENCES staff(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Open shift applications
CREATE TABLE open_shift_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    open_shift_id UUID NOT NULL REFERENCES open_shifts(id) ON DELETE CASCADE,
    staff_id UUID NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'denied')),
    applied_at TIMESTAMPTZ DEFAULT NOW(),
    decided_at TIMESTAMPTZ
);

-- Staff availability
CREATE TABLE availability (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    staff_id UUID NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
    available BOOLEAN DEFAULT TRUE,
    preference TEXT DEFAULT 'available' CHECK (preference IN ('preferred', 'available', 'unavailable')),
    notes TEXT,
    UNIQUE(staff_id, day_of_week)
);

-- ============================================
-- REQUESTS & CALLOUTS
-- ============================================

-- Vacation/time-off requests
CREATE TABLE vacation_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    staff_id UUID NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    hours_requested NUMERIC(5,2),
    pto_type TEXT DEFAULT 'vacation' CHECK (pto_type IN ('vacation', 'sick', 'personal')),
    reason TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'denied')),
    manager_note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    decided_at TIMESTAMPTZ
);

-- Callouts
CREATE TABLE callouts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shift_id UUID NOT NULL REFERENCES shifts(id) ON DELETE CASCADE,
    staff_id UUID NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
    reason TEXT,
    reported_at TIMESTAMPTZ DEFAULT NOW(),
    covered_by UUID REFERENCES staff(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'reported' CHECK (status IN ('reported', 'covered', 'unresolved'))
);

-- ============================================
-- ASSETS
-- ============================================

-- Asset types
CREATE TABLE asset_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    requires_assignment BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Assets
CREATE TABLE assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    asset_type_id UUID NOT NULL REFERENCES asset_types(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    identifier TEXT,
    status TEXT DEFAULT 'available' CHECK (status IN ('available', 'in_use', 'maintenance', 'retired')),
    capacity INTEGER,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Shift-asset assignments
CREATE TABLE shift_assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shift_id UUID NOT NULL REFERENCES shifts(id) ON DELETE CASCADE,
    asset_id UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
    assigned_at TIMESTAMPTZ DEFAULT NOW()
);

-- Asset issues
CREATE TABLE asset_issues (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_id UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
    reported_by UUID NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    urgency TEXT DEFAULT 'medium' CHECK (urgency IN ('low', 'medium', 'high', 'critical')),
    status TEXT DEFAULT 'reported' CHECK (status IN ('reported', 'in_progress', 'resolved')),
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- COMPLIANCE
-- ============================================

-- Compliance rules
CREATE TABLE compliance_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    applies_to TEXT DEFAULT 'all' CHECK (applies_to IN ('all', 'role', 'location')),
    applies_to_ids UUID[],
    rules JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Compliance overrides (acknowledged violations)
CREATE TABLE compliance_overrides (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    schedule_id UUID REFERENCES schedules(id) ON DELETE CASCADE,
    staff_id UUID NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
    rule_violated TEXT NOT NULL,
    scheduled_value NUMERIC,
    limit_value NUMERIC,
    override_reason TEXT NOT NULL,
    overridden_by UUID NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- HR & DOCUMENTS
-- ============================================

-- Certification types
CREATE TABLE certification_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    required_for_role_ids UUID[],
    renewal_period_months INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Staff documents
CREATE TABLE staff_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    staff_id UUID NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
    document_type TEXT NOT NULL CHECK (document_type IN ('license', 'certification', 'contract', 'id', 'waiver', 'other')),
    name TEXT NOT NULL,
    file_url TEXT,
    issue_date DATE,
    expiry_date DATE,
    status TEXT DEFAULT 'valid' CHECK (status IN ('valid', 'expiring_soon', 'expired')),
    verified_by UUID REFERENCES staff(id) ON DELETE SET NULL,
    verified_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Staff certifications
CREATE TABLE staff_certifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    staff_id UUID NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
    certification_type_id UUID NOT NULL REFERENCES certification_types(id) ON DELETE CASCADE,
    certification_number TEXT,
    issue_date DATE,
    expiry_date DATE,
    status TEXT DEFAULT 'valid' CHECK (status IN ('valid', 'expiring_soon', 'expired', 'revoked')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Onboarding templates
CREATE TABLE onboarding_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    role_id UUID REFERENCES roles(id) ON DELETE SET NULL,
    tasks JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Staff onboarding
CREATE TABLE staff_onboarding (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    staff_id UUID NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
    template_id UUID NOT NULL REFERENCES onboarding_templates(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'overdue')),
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Staff onboarding tasks
CREATE TABLE staff_onboarding_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    onboarding_id UUID NOT NULL REFERENCES staff_onboarding(id) ON DELETE CASCADE,
    task_name TEXT NOT NULL,
    category TEXT CHECK (category IN ('paperwork', 'documents', 'training', 'equipment', 'other')),
    required BOOLEAN DEFAULT TRUE,
    due_date DATE,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'overdue')),
    completed_at TIMESTAMPTZ,
    completed_by UUID REFERENCES staff(id) ON DELETE SET NULL,
    notes TEXT
);

-- PTO balances
CREATE TABLE pto_balances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    staff_id UUID NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
    year INTEGER NOT NULL,
    pto_type TEXT NOT NULL CHECK (pto_type IN ('vacation', 'sick', 'personal')),
    accrued NUMERIC(6,2) DEFAULT 0,
    used NUMERIC(6,2) DEFAULT 0,
    pending NUMERIC(6,2) DEFAULT 0,
    balance NUMERIC(6,2) GENERATED ALWAYS AS (accrued - used - pending) STORED,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(staff_id, year, pto_type)
);

-- Performance notes
CREATE TABLE performance_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    staff_id UUID NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
    note_type TEXT NOT NULL CHECK (note_type IN ('positive', 'coaching', 'warning', 'incident', 'review')),
    content TEXT NOT NULL,
    is_private BOOLEAN DEFAULT FALSE,
    follow_up_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Incidents
CREATE TABLE incidents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    reported_by UUID NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
    involved_staff UUID[],
    incident_date DATE NOT NULL,
    incident_time TIME,
    location_id UUID REFERENCES locations(id) ON DELETE SET NULL,
    asset_id UUID REFERENCES assets(id) ON DELETE SET NULL,
    description TEXT NOT NULL,
    severity TEXT DEFAULT 'minor' CHECK (severity IN ('minor', 'moderate', 'serious', 'critical')),
    injury_reported BOOLEAN DEFAULT FALSE,
    customer_involved BOOLEAN DEFAULT FALSE,
    status TEXT DEFAULT 'reported' CHECK (status IN ('reported', 'investigating', 'resolved', 'closed')),
    resolution TEXT,
    resolved_by UUID REFERENCES staff(id) ON DELETE SET NULL,
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TIME TRACKING & TIMESHEETS
-- ============================================

-- Pay period settings
CREATE TABLE pay_period_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL UNIQUE REFERENCES organizations(id) ON DELETE CASCADE,
    period_type TEXT NOT NULL CHECK (period_type IN ('weekly', 'biweekly', 'semimonthly', 'monthly')),
    start_day INTEGER NOT NULL,
    cutoff_day_offset INTEGER DEFAULT 0,
    staff_signature_deadline_days INTEGER DEFAULT 3,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Time entries
CREATE TABLE time_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    staff_id UUID NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
    shift_id UUID REFERENCES shifts(id) ON DELETE SET NULL,
    date DATE NOT NULL,
    clock_in TIMESTAMPTZ,
    clock_out TIMESTAMPTZ,
    break_minutes INTEGER DEFAULT 0,
    total_hours NUMERIC(5,2),
    overtime_hours NUMERIC(5,2) DEFAULT 0,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'disputed', 'submitted', 'approved')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Timesheets
CREATE TABLE timesheets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    staff_id UUID NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
    pay_period_start DATE NOT NULL,
    pay_period_end DATE NOT NULL,
    total_regular_hours NUMERIC(6,2) DEFAULT 0,
    total_overtime_hours NUMERIC(6,2) DEFAULT 0,
    total_pto_hours NUMERIC(6,2) DEFAULT 0,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'approved', 'locked')),
    staff_signature TEXT,
    staff_signed_at TIMESTAMPTZ,
    staff_ip_address TEXT,
    manager_signature TEXT,
    manager_signed_at TIMESTAMPTZ,
    manager_id UUID REFERENCES staff(id) ON DELETE SET NULL,
    manager_ip_address TEXT,
    locked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(staff_id, pay_period_start)
);

-- Timesheet entries
CREATE TABLE timesheet_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    timesheet_id UUID NOT NULL REFERENCES timesheets(id) ON DELETE CASCADE,
    time_entry_id UUID NOT NULL REFERENCES time_entries(id) ON DELETE CASCADE,
    adjusted_hours NUMERIC(5,2),
    adjustment_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Timesheet disputes
CREATE TABLE timesheet_disputes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    timesheet_id UUID NOT NULL REFERENCES timesheets(id) ON DELETE CASCADE,
    time_entry_id UUID NOT NULL REFERENCES time_entries(id) ON DELETE CASCADE,
    raised_by UUID NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    proposed_clock_in TIMESTAMPTZ,
    proposed_clock_out TIMESTAMPTZ,
    proposed_break_minutes INTEGER,
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'resolved', 'denied')),
    resolution_note TEXT,
    resolved_by UUID REFERENCES staff(id) ON DELETE SET NULL,
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ACTIVITY LOG
-- ============================================

CREATE TABLE activity_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    actor_id UUID NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID,
    changes JSONB,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

-- Organizations
CREATE INDEX idx_organizations_slug ON organizations(slug);

-- Staff
CREATE INDEX idx_staff_organization ON staff(organization_id);
CREATE INDEX idx_staff_role ON staff(role_id);
CREATE INDEX idx_staff_email ON staff(email);
CREATE INDEX idx_staff_status ON staff(status);

-- Schedules & Shifts
CREATE INDEX idx_schedules_organization ON schedules(organization_id);
CREATE INDEX idx_schedules_week ON schedules(week_start);
CREATE INDEX idx_shifts_schedule ON shifts(schedule_id);
CREATE INDEX idx_shifts_staff ON shifts(staff_id);
CREATE INDEX idx_shifts_date ON shifts(date);

-- Open shifts
CREATE INDEX idx_open_shifts_organization ON open_shifts(organization_id);
CREATE INDEX idx_open_shifts_date ON open_shifts(date);
CREATE INDEX idx_open_shifts_status ON open_shifts(status);

-- Vacation requests
CREATE INDEX idx_vacation_requests_staff ON vacation_requests(staff_id);
CREATE INDEX idx_vacation_requests_status ON vacation_requests(status);
CREATE INDEX idx_vacation_requests_dates ON vacation_requests(start_date, end_date);

-- Assets
CREATE INDEX idx_assets_organization ON assets(organization_id);
CREATE INDEX idx_assets_status ON assets(status);

-- Time entries & Timesheets
CREATE INDEX idx_time_entries_staff ON time_entries(staff_id);
CREATE INDEX idx_time_entries_date ON time_entries(date);
CREATE INDEX idx_timesheets_staff ON timesheets(staff_id);
CREATE INDEX idx_timesheets_period ON timesheets(pay_period_start, pay_period_end);
CREATE INDEX idx_timesheets_status ON timesheets(status);

-- Activity log
CREATE INDEX idx_activity_log_organization ON activity_log(organization_id);
CREATE INDEX idx_activity_log_actor ON activity_log(actor_id);
CREATE INDEX idx_activity_log_entity ON activity_log(entity_type, entity_id);
CREATE INDEX idx_activity_log_created ON activity_log(created_at DESC);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE manager_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE open_shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE open_shift_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE vacation_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE callouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE asset_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE shift_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE asset_issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_overrides ENABLE ROW LEVEL SECURITY;
ALTER TABLE certification_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_onboarding ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_onboarding_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE pto_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE pay_period_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE timesheets ENABLE ROW LEVEL SECURITY;
ALTER TABLE timesheet_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE timesheet_disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- Note: RLS policies should be created based on your auth setup
-- Example policy for staff table:
-- CREATE POLICY "Users can view staff in their organization" ON staff
--     FOR SELECT USING (
--         organization_id IN (
--             SELECT organization_id FROM staff WHERE auth_user_id = auth.uid()
--         )
--     );

-- ============================================
-- FUNCTIONS
-- ============================================

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_organizations_updated_at
    BEFORE UPDATE ON organizations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_staff_updated_at
    BEFORE UPDATE ON staff
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_staff_details_updated_at
    BEFORE UPDATE ON staff_details
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_time_entries_updated_at
    BEFORE UPDATE ON time_entries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_timesheets_updated_at
    BEFORE UPDATE ON timesheets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_pto_balances_updated_at
    BEFORE UPDATE ON pto_balances
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
