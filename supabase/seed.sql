-- Seed data for development and testing
-- Run this after the initial schema migration

-- ============================================
-- SAMPLE ORGANIZATION
-- ============================================

INSERT INTO organizations (id, name, slug, timezone) VALUES
    ('11111111-1111-1111-1111-111111111111', 'City Tours Co', 'city-tours', 'America/New_York');

-- ============================================
-- ROLES
-- ============================================

INSERT INTO roles (id, organization_id, name, requires_license) VALUES
    ('22222222-2222-2222-2222-222222222201', '11111111-1111-1111-1111-111111111111', 'Driver', TRUE),
    ('22222222-2222-2222-2222-222222222202', '11111111-1111-1111-1111-111111111111', 'Guide', FALSE),
    ('22222222-2222-2222-2222-222222222203', '11111111-1111-1111-1111-111111111111', 'Front Desk', FALSE);

-- ============================================
-- LOCATIONS
-- ============================================

INSERT INTO locations (id, organization_id, name, address) VALUES
    ('33333333-3333-3333-3333-333333333301', '11111111-1111-1111-1111-111111111111', 'Main Office', '123 Main St'),
    ('33333333-3333-3333-3333-333333333302', '11111111-1111-1111-1111-111111111111', 'Route 1 - Downtown', 'Downtown Loop'),
    ('33333333-3333-3333-3333-333333333303', '11111111-1111-1111-1111-111111111111', 'Route 2 - Harbor', 'Harbor District'),
    ('33333333-3333-3333-3333-333333333304', '11111111-1111-1111-1111-111111111111', 'Marina Dock', '500 Marina Way');

-- ============================================
-- MANAGER ROLES
-- ============================================

INSERT INTO manager_roles (id, organization_id, name, permissions, scope_type, scope_ids) VALUES
    ('44444444-4444-4444-4444-444444444401', '11111111-1111-1111-1111-111111111111', 'Admin', 
     '{"dashboard": true, "schedule": {"view": true, "edit": true}, "staff": {"view": true, "edit": true}, "open_shifts": {"view": true, "create": true, "approve": true}, "requests": {"view": true, "approve": true}, "assets": {"view": true, "edit": true}, "settings": true, "hr": true}',
     'all', NULL),
    ('44444444-4444-4444-4444-444444444402', '11111111-1111-1111-1111-111111111111', 'Drivers Manager',
     '{"dashboard": true, "schedule": {"view": true, "edit": true}, "staff": {"view": true, "edit": false}, "open_shifts": {"view": true, "create": true, "approve": true}, "requests": {"view": true, "approve": true}, "assets": {"view": true, "edit": false}, "settings": false}',
     'role', ARRAY['22222222-2222-2222-2222-222222222201']::UUID[]),
    ('44444444-4444-4444-4444-444444444403', '11111111-1111-1111-1111-111111111111', 'Guides Manager',
     '{"dashboard": true, "schedule": {"view": true, "edit": true}, "staff": {"view": true, "edit": false}, "open_shifts": {"view": true, "create": true, "approve": true}, "requests": {"view": true, "approve": true}, "assets": {"view": true, "edit": false}, "settings": false}',
     'role', ARRAY['22222222-2222-2222-2222-222222222202']::UUID[]);

-- ============================================
-- STAFF
-- ============================================

-- Admin
INSERT INTO staff (id, organization_id, email, phone, first_name, last_name, role_id, is_manager, manager_role_id, status) VALUES
    ('55555555-5555-5555-5555-555555555501', '11111111-1111-1111-1111-111111111111', 'admin@citytours.com', '+15551000001', 'Lisa', 'Martinez', NULL, TRUE, '44444444-4444-4444-4444-444444444401', 'active');

-- Drivers Manager
INSERT INTO staff (id, organization_id, email, phone, first_name, last_name, role_id, is_manager, manager_role_id, status) VALUES
    ('55555555-5555-5555-5555-555555555502', '11111111-1111-1111-1111-111111111111', 'dave@citytours.com', '+15551000002', 'Dave', 'Peters', '22222222-2222-2222-2222-222222222201', TRUE, '44444444-4444-4444-4444-444444444402', 'active');

-- Guides Manager
INSERT INTO staff (id, organization_id, email, phone, first_name, last_name, role_id, is_manager, manager_role_id, status) VALUES
    ('55555555-5555-5555-5555-555555555503', '11111111-1111-1111-1111-111111111111', 'lisa.g@citytours.com', '+15551000003', 'Lisa', 'Garcia', '22222222-2222-2222-2222-222222222202', TRUE, '44444444-4444-4444-4444-444444444403', 'active');

-- Drivers
INSERT INTO staff (id, organization_id, email, phone, first_name, last_name, role_id, is_manager, status, contract_type) VALUES
    ('55555555-5555-5555-5555-555555555504', '11111111-1111-1111-1111-111111111111', 'john@citytours.com', '+15551000004', 'John', 'Smith', '22222222-2222-2222-2222-222222222201', FALSE, 'active', 'full_time'),
    ('55555555-5555-5555-5555-555555555505', '11111111-1111-1111-1111-111111111111', 'mike@citytours.com', '+15551000005', 'Mike', 'Rodriguez', '22222222-2222-2222-2222-222222222201', FALSE, 'active', 'full_time'),
    ('55555555-5555-5555-5555-555555555506', '11111111-1111-1111-1111-111111111111', 'dave.p@citytours.com', '+15551000006', 'Dave', 'Palmer', '22222222-2222-2222-2222-222222222201', FALSE, 'active', 'part_time');

-- Guides
INSERT INTO staff (id, organization_id, email, phone, first_name, last_name, role_id, is_manager, status, contract_type) VALUES
    ('55555555-5555-5555-5555-555555555507', '11111111-1111-1111-1111-111111111111', 'sarah@citytours.com', '+15551000007', 'Sarah', 'Kim', '22222222-2222-2222-2222-222222222202', FALSE, 'active', 'full_time'),
    ('55555555-5555-5555-5555-555555555508', '11111111-1111-1111-1111-111111111111', 'maria@citytours.com', '+15551000008', 'Maria', 'Lopez', '22222222-2222-2222-2222-222222222202', FALSE, 'active', 'full_time'),
    ('55555555-5555-5555-5555-555555555509', '11111111-1111-1111-1111-111111111111', 'tom@citytours.com', '+15551000009', 'Tom', 'Harris', '22222222-2222-2222-2222-222222222202', FALSE, 'active', 'full_time');

-- Front Desk
INSERT INTO staff (id, organization_id, email, phone, first_name, last_name, role_id, is_manager, status, contract_type) VALUES
    ('55555555-5555-5555-5555-555555555510', '11111111-1111-1111-1111-111111111111', 'alex@citytours.com', '+15551000010', 'Alex', 'Turner', '22222222-2222-2222-2222-222222222203', FALSE, 'active', 'full_time'),
    ('55555555-5555-5555-5555-555555555511', '11111111-1111-1111-1111-111111111111', 'chris@citytours.com', '+15551000011', 'Chris', 'Morgan', '22222222-2222-2222-2222-222222222203', FALSE, 'active', 'part_time');

-- ============================================
-- STAFF DETAILS
-- ============================================

INSERT INTO staff_details (staff_id, date_of_birth, address, city, state, postal_code, country, emergency_contact_name, emergency_contact_phone, emergency_contact_relationship, start_date, pay_type, pay_rate) VALUES
    ('55555555-5555-5555-5555-555555555504', '1990-01-15', '123 Oak St', 'San Francisco', 'CA', '94102', 'USA', 'Sarah Smith', '+15559990001', 'Spouse', '2024-03-15', 'hourly', 22.00),
    ('55555555-5555-5555-5555-555555555505', '1988-06-22', '456 Pine Ave', 'San Francisco', 'CA', '94103', 'USA', 'Linda Rodriguez', '+15559990002', 'Mother', '2023-11-01', 'hourly', 24.00),
    ('55555555-5555-5555-5555-555555555507', '1995-03-10', '789 Elm St', 'San Francisco', 'CA', '94104', 'USA', 'James Kim', '+15559990003', 'Father', '2024-01-10', 'hourly', 20.00),
    ('55555555-5555-5555-5555-555555555508', '1992-09-05', '321 Cedar Ln', 'San Francisco', 'CA', '94105', 'USA', 'Carlos Lopez', '+15559990004', 'Spouse', '2023-06-15', 'hourly', 21.00);

-- ============================================
-- ASSET TYPES
-- ============================================

INSERT INTO asset_types (id, organization_id, name, requires_assignment) VALUES
    ('66666666-6666-6666-6666-666666666601', '11111111-1111-1111-1111-111111111111', 'Bus', TRUE),
    ('66666666-6666-6666-6666-666666666602', '11111111-1111-1111-1111-111111111111', 'Van', TRUE),
    ('66666666-6666-6666-6666-666666666603', '11111111-1111-1111-1111-111111111111', 'Radio', FALSE);

-- ============================================
-- ASSETS
-- ============================================

INSERT INTO assets (id, organization_id, asset_type_id, name, identifier, status, capacity) VALUES
    ('77777777-7777-7777-7777-777777777701', '11111111-1111-1111-1111-111111111111', '66666666-6666-6666-6666-666666666601', 'Bus 3', 'BUS-003', 'available', 45),
    ('77777777-7777-7777-7777-777777777702', '11111111-1111-1111-1111-111111111111', '66666666-6666-6666-6666-666666666601', 'Bus 7', 'BUS-007', 'available', 45),
    ('77777777-7777-7777-7777-777777777703', '11111111-1111-1111-1111-111111111111', '66666666-6666-6666-6666-666666666601', 'Bus 12', 'BUS-012', 'available', 45),
    ('77777777-7777-7777-7777-777777777704', '11111111-1111-1111-1111-111111111111', '66666666-6666-6666-6666-666666666602', 'Van 1', 'VAN-001', 'available', 12),
    ('77777777-7777-7777-7777-777777777705', '11111111-1111-1111-1111-111111111111', '66666666-6666-6666-6666-666666666602', 'Van 2', 'VAN-002', 'available', 12),
    ('77777777-7777-7777-7777-777777777706', '11111111-1111-1111-1111-111111111111', '66666666-6666-6666-6666-666666666602', 'Van 3', 'VAN-003', 'maintenance', 12);

-- ============================================
-- COMPLIANCE RULES
-- ============================================

INSERT INTO compliance_rules (id, organization_id, name, is_active, applies_to, rules) VALUES
    ('88888888-8888-8888-8888-888888888801', '11111111-1111-1111-1111-111111111111', 'California Labor Law', TRUE, 'all',
    '{
        "max_daily_hours": 10,
        "max_weekly_hours": 40,
        "overtime_threshold_daily": 8,
        "overtime_threshold_weekly": 40,
        "min_break_duration_minutes": 30,
        "break_required_after_hours": 6,
        "second_break_after_hours": 10,
        "min_hours_between_shifts": 11,
        "max_consecutive_days": 6,
        "min_rest_day_per_period": {
            "days_off": 1,
            "per_days": 7
        },
        "minor_rules": {
            "max_daily_hours": 8,
            "max_weekly_hours": 30,
            "no_shifts_before": "06:00",
            "no_shifts_after": "22:00"
        },
        "overtime_rules": {
            "daily_multiplier": 1.5,
            "weekly_multiplier": 1.5,
            "double_time_after_hours": 12
        }
    }');

-- ============================================
-- CERTIFICATION TYPES
-- ============================================

INSERT INTO certification_types (id, organization_id, name, required_for_role_ids, renewal_period_months) VALUES
    ('99999999-9999-9999-9999-999999999901', '11111111-1111-1111-1111-111111111111', 'CDL Class B', ARRAY['22222222-2222-2222-2222-222222222201']::UUID[], 60),
    ('99999999-9999-9999-9999-999999999902', '11111111-1111-1111-1111-111111111111', 'First Aid', NULL, 24),
    ('99999999-9999-9999-9999-999999999903', '11111111-1111-1111-1111-111111111111', 'Defensive Driving', ARRAY['22222222-2222-2222-2222-222222222201']::UUID[], 12);

-- ============================================
-- PAY PERIOD SETTINGS
-- ============================================

INSERT INTO pay_period_settings (organization_id, period_type, start_day, cutoff_day_offset, staff_signature_deadline_days) VALUES
    ('11111111-1111-1111-1111-111111111111', 'biweekly', 1, 0, 3);

-- ============================================
-- AVAILABILITY
-- ============================================

-- John Smith - available Mon-Fri
INSERT INTO availability (staff_id, day_of_week, available, preference) VALUES
    ('55555555-5555-5555-5555-555555555504', 0, FALSE, 'unavailable'),
    ('55555555-5555-5555-5555-555555555504', 1, TRUE, 'preferred'),
    ('55555555-5555-5555-5555-555555555504', 2, TRUE, 'preferred'),
    ('55555555-5555-5555-5555-555555555504', 3, TRUE, 'preferred'),
    ('55555555-5555-5555-5555-555555555504', 4, TRUE, 'preferred'),
    ('55555555-5555-5555-5555-555555555504', 5, TRUE, 'preferred'),
    ('55555555-5555-5555-5555-555555555504', 6, FALSE, 'unavailable');

-- Sarah Kim - available except Sundays
INSERT INTO availability (staff_id, day_of_week, available, preference) VALUES
    ('55555555-5555-5555-5555-555555555507', 0, FALSE, 'unavailable'),
    ('55555555-5555-5555-5555-555555555507', 1, TRUE, 'available'),
    ('55555555-5555-5555-5555-555555555507', 2, TRUE, 'available'),
    ('55555555-5555-5555-5555-555555555507', 3, TRUE, 'preferred'),
    ('55555555-5555-5555-5555-555555555507', 4, TRUE, 'preferred'),
    ('55555555-5555-5555-5555-555555555507', 5, TRUE, 'preferred'),
    ('55555555-5555-5555-5555-555555555507', 6, TRUE, 'available');

-- ============================================
-- PTO BALANCES
-- ============================================

INSERT INTO pto_balances (staff_id, year, pto_type, accrued, used, pending) VALUES
    ('55555555-5555-5555-5555-555555555504', 2026, 'vacation', 80, 16, 24),
    ('55555555-5555-5555-5555-555555555504', 2026, 'sick', 40, 8, 0),
    ('55555555-5555-5555-5555-555555555507', 2026, 'vacation', 80, 0, 0),
    ('55555555-5555-5555-5555-555555555507', 2026, 'sick', 40, 0, 0),
    ('55555555-5555-5555-5555-555555555508', 2026, 'vacation', 80, 8, 0),
    ('55555555-5555-5555-5555-555555555508', 2026, 'sick', 40, 0, 0);

-- ============================================
-- ONBOARDING TEMPLATE
-- ============================================

INSERT INTO onboarding_templates (id, organization_id, name, role_id, tasks) VALUES
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'Driver Onboarding', '22222222-2222-2222-2222-222222222201',
    '[
        {"name": "Complete W-4 form", "category": "paperwork", "required": true, "due_days": 3},
        {"name": "Complete I-9 verification", "category": "paperwork", "required": true, "due_days": 3},
        {"name": "Upload CDL", "category": "documents", "required": true, "due_days": 1},
        {"name": "Upload proof of insurance", "category": "documents", "required": true, "due_days": 3},
        {"name": "Complete safety training video", "category": "training", "required": true, "due_days": 7},
        {"name": "Vehicle familiarization ride-along", "category": "training", "required": true, "due_days": 7},
        {"name": "Route familiarization (Route 1)", "category": "training", "required": true, "due_days": 14},
        {"name": "Route familiarization (Route 2)", "category": "training", "required": true, "due_days": 14},
        {"name": "Issue uniform", "category": "equipment", "required": true, "due_days": 1},
        {"name": "Issue radio", "category": "equipment", "required": true, "due_days": 1}
    ]'),
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaabbb', '11111111-1111-1111-1111-111111111111', 'Guide Onboarding', '22222222-2222-2222-2222-222222222202',
    '[
        {"name": "Complete W-4 form", "category": "paperwork", "required": true, "due_days": 3},
        {"name": "Complete I-9 verification", "category": "paperwork", "required": true, "due_days": 3},
        {"name": "Upload government ID", "category": "documents", "required": true, "due_days": 1},
        {"name": "Complete customer service training", "category": "training", "required": true, "due_days": 7},
        {"name": "Shadow experienced guide (3 tours)", "category": "training", "required": true, "due_days": 14},
        {"name": "Practice tour evaluation", "category": "training", "required": true, "due_days": 21},
        {"name": "Issue uniform", "category": "equipment", "required": true, "due_days": 1}
    ]');
