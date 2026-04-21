-- RLS policies for the Ops Platform
-- All multi-tenant tables are scoped by organization_id.
-- Managers within an org get read/write access; non-managers (staff) get read access
-- to org data and read/write access to rows that belong to them.
-- Self-referencing access uses a SECURITY DEFINER helper to avoid recursion on `staff`.

-- ============================================
-- Helper functions (SECURITY DEFINER to sidestep RLS recursion)
-- ============================================

CREATE OR REPLACE FUNCTION auth_staff_id()
RETURNS UUID
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
    SELECT id FROM staff WHERE auth_user_id = auth.uid() LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION auth_org_id()
RETURNS UUID
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
    SELECT organization_id FROM staff WHERE auth_user_id = auth.uid() LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION auth_is_manager()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
    SELECT COALESCE(is_manager, FALSE) FROM staff WHERE auth_user_id = auth.uid() LIMIT 1;
$$;

-- ============================================
-- Organizations — read-only for members, no writes from client
-- ============================================
CREATE POLICY "org: read own" ON organizations
    FOR SELECT USING (id = auth_org_id());

-- ============================================
-- Staff — everyone in org can read, only managers write, users can update own prefs
-- ============================================
CREATE POLICY "staff: read org" ON staff
    FOR SELECT USING (organization_id = auth_org_id());

CREATE POLICY "staff: managers insert" ON staff
    FOR INSERT WITH CHECK (organization_id = auth_org_id() AND auth_is_manager());

CREATE POLICY "staff: managers update" ON staff
    FOR UPDATE USING (organization_id = auth_org_id() AND auth_is_manager())
    WITH CHECK (organization_id = auth_org_id());

CREATE POLICY "staff: self update prefs" ON staff
    FOR UPDATE USING (auth_user_id = auth.uid())
    WITH CHECK (auth_user_id = auth.uid());

CREATE POLICY "staff: managers delete" ON staff
    FOR DELETE USING (organization_id = auth_org_id() AND auth_is_manager());

CREATE POLICY "staff_details: read org" ON staff_details
    FOR SELECT USING (
        staff_id IN (SELECT id FROM staff WHERE organization_id = auth_org_id())
    );

CREATE POLICY "staff_details: managers write" ON staff_details
    FOR ALL USING (
        auth_is_manager() AND
        staff_id IN (SELECT id FROM staff WHERE organization_id = auth_org_id())
    )
    WITH CHECK (
        staff_id IN (SELECT id FROM staff WHERE organization_id = auth_org_id())
    );

-- ============================================
-- Reference data — read org, managers write
-- ============================================
CREATE POLICY "roles: read org" ON roles FOR SELECT USING (organization_id = auth_org_id());
CREATE POLICY "roles: managers write" ON roles FOR ALL
    USING (organization_id = auth_org_id() AND auth_is_manager())
    WITH CHECK (organization_id = auth_org_id());

CREATE POLICY "locations: read org" ON locations FOR SELECT USING (organization_id = auth_org_id());
CREATE POLICY "locations: managers write" ON locations FOR ALL
    USING (organization_id = auth_org_id() AND auth_is_manager())
    WITH CHECK (organization_id = auth_org_id());

CREATE POLICY "manager_roles: read org" ON manager_roles FOR SELECT USING (organization_id = auth_org_id());
CREATE POLICY "manager_roles: managers write" ON manager_roles FOR ALL
    USING (organization_id = auth_org_id() AND auth_is_manager())
    WITH CHECK (organization_id = auth_org_id());

-- ============================================
-- Scheduling
-- ============================================
CREATE POLICY "schedules: read org" ON schedules FOR SELECT USING (organization_id = auth_org_id());
CREATE POLICY "schedules: managers write" ON schedules FOR ALL
    USING (organization_id = auth_org_id() AND auth_is_manager())
    WITH CHECK (organization_id = auth_org_id());

CREATE POLICY "shifts: read org" ON shifts FOR SELECT
    USING (schedule_id IN (SELECT id FROM schedules WHERE organization_id = auth_org_id()));
CREATE POLICY "shifts: managers write" ON shifts FOR ALL
    USING (
        auth_is_manager() AND
        schedule_id IN (SELECT id FROM schedules WHERE organization_id = auth_org_id())
    )
    WITH CHECK (
        schedule_id IN (SELECT id FROM schedules WHERE organization_id = auth_org_id())
    );

CREATE POLICY "open_shifts: read org" ON open_shifts FOR SELECT USING (organization_id = auth_org_id());
CREATE POLICY "open_shifts: managers write" ON open_shifts FOR INSERT
    WITH CHECK (organization_id = auth_org_id() AND auth_is_manager());
CREATE POLICY "open_shifts: managers update" ON open_shifts FOR UPDATE
    USING (organization_id = auth_org_id() AND auth_is_manager())
    WITH CHECK (organization_id = auth_org_id());
CREATE POLICY "open_shifts: self claim" ON open_shifts FOR UPDATE
    USING (
        organization_id = auth_org_id() AND status = 'open' AND assignment_type = 'first_come'
    )
    WITH CHECK (organization_id = auth_org_id() AND filled_by = auth_staff_id());
CREATE POLICY "open_shifts: managers delete" ON open_shifts FOR DELETE
    USING (organization_id = auth_org_id() AND auth_is_manager());

CREATE POLICY "open_shift_applications: read own or manager" ON open_shift_applications FOR SELECT
    USING (
        staff_id = auth_staff_id() OR
        (auth_is_manager() AND
         open_shift_id IN (SELECT id FROM open_shifts WHERE organization_id = auth_org_id()))
    );
CREATE POLICY "open_shift_applications: self insert" ON open_shift_applications FOR INSERT
    WITH CHECK (
        staff_id = auth_staff_id() AND
        open_shift_id IN (SELECT id FROM open_shifts WHERE organization_id = auth_org_id())
    );
CREATE POLICY "open_shift_applications: managers decide" ON open_shift_applications FOR UPDATE
    USING (
        auth_is_manager() AND
        open_shift_id IN (SELECT id FROM open_shifts WHERE organization_id = auth_org_id())
    );

CREATE POLICY "availability: read org" ON availability FOR SELECT
    USING (staff_id IN (SELECT id FROM staff WHERE organization_id = auth_org_id()));
CREATE POLICY "availability: self write" ON availability FOR ALL
    USING (staff_id = auth_staff_id())
    WITH CHECK (staff_id = auth_staff_id());

-- ============================================
-- Requests & callouts
-- ============================================
CREATE POLICY "vacation_requests: read own or manager" ON vacation_requests FOR SELECT
    USING (
        staff_id = auth_staff_id() OR
        (auth_is_manager() AND
         staff_id IN (SELECT id FROM staff WHERE organization_id = auth_org_id()))
    );
CREATE POLICY "vacation_requests: self insert" ON vacation_requests FOR INSERT
    WITH CHECK (staff_id = auth_staff_id());
CREATE POLICY "vacation_requests: self update pending" ON vacation_requests FOR UPDATE
    USING (staff_id = auth_staff_id() AND status = 'pending');
CREATE POLICY "vacation_requests: managers decide" ON vacation_requests FOR UPDATE
    USING (
        auth_is_manager() AND
        staff_id IN (SELECT id FROM staff WHERE organization_id = auth_org_id())
    );
CREATE POLICY "vacation_requests: managers delete" ON vacation_requests FOR DELETE
    USING (
        auth_is_manager() AND
        staff_id IN (SELECT id FROM staff WHERE organization_id = auth_org_id())
    );

CREATE POLICY "callouts: read org" ON callouts FOR SELECT
    USING (staff_id IN (SELECT id FROM staff WHERE organization_id = auth_org_id()));
CREATE POLICY "callouts: self insert" ON callouts FOR INSERT
    WITH CHECK (staff_id = auth_staff_id());
CREATE POLICY "callouts: managers update" ON callouts FOR UPDATE
    USING (
        auth_is_manager() AND
        staff_id IN (SELECT id FROM staff WHERE organization_id = auth_org_id())
    );

-- ============================================
-- Assets
-- ============================================
CREATE POLICY "asset_types: read org" ON asset_types FOR SELECT USING (organization_id = auth_org_id());
CREATE POLICY "asset_types: managers write" ON asset_types FOR ALL
    USING (organization_id = auth_org_id() AND auth_is_manager())
    WITH CHECK (organization_id = auth_org_id());

CREATE POLICY "assets: read org" ON assets FOR SELECT USING (organization_id = auth_org_id());
CREATE POLICY "assets: managers write" ON assets FOR ALL
    USING (organization_id = auth_org_id() AND auth_is_manager())
    WITH CHECK (organization_id = auth_org_id());

CREATE POLICY "shift_assets: read org" ON shift_assets FOR SELECT
    USING (asset_id IN (SELECT id FROM assets WHERE organization_id = auth_org_id()));
CREATE POLICY "shift_assets: managers write" ON shift_assets FOR ALL
    USING (
        auth_is_manager() AND
        asset_id IN (SELECT id FROM assets WHERE organization_id = auth_org_id())
    )
    WITH CHECK (asset_id IN (SELECT id FROM assets WHERE organization_id = auth_org_id()));

CREATE POLICY "asset_issues: read org" ON asset_issues FOR SELECT
    USING (asset_id IN (SELECT id FROM assets WHERE organization_id = auth_org_id()));
CREATE POLICY "asset_issues: self insert" ON asset_issues FOR INSERT
    WITH CHECK (
        reported_by = auth_staff_id() AND
        asset_id IN (SELECT id FROM assets WHERE organization_id = auth_org_id())
    );
CREATE POLICY "asset_issues: managers update" ON asset_issues FOR UPDATE
    USING (
        auth_is_manager() AND
        asset_id IN (SELECT id FROM assets WHERE organization_id = auth_org_id())
    );

-- ============================================
-- Compliance
-- ============================================
CREATE POLICY "compliance_rules: read org" ON compliance_rules FOR SELECT USING (organization_id = auth_org_id());
CREATE POLICY "compliance_rules: managers write" ON compliance_rules FOR ALL
    USING (organization_id = auth_org_id() AND auth_is_manager())
    WITH CHECK (organization_id = auth_org_id());

CREATE POLICY "compliance_overrides: read org" ON compliance_overrides FOR SELECT USING (organization_id = auth_org_id());
CREATE POLICY "compliance_overrides: managers write" ON compliance_overrides FOR ALL
    USING (organization_id = auth_org_id() AND auth_is_manager())
    WITH CHECK (organization_id = auth_org_id() AND overridden_by = auth_staff_id());

-- ============================================
-- HR & documents
-- ============================================
CREATE POLICY "certification_types: read org" ON certification_types FOR SELECT USING (organization_id = auth_org_id());
CREATE POLICY "certification_types: managers write" ON certification_types FOR ALL
    USING (organization_id = auth_org_id() AND auth_is_manager())
    WITH CHECK (organization_id = auth_org_id());

CREATE POLICY "staff_documents: read own or manager" ON staff_documents FOR SELECT
    USING (
        staff_id = auth_staff_id() OR
        (auth_is_manager() AND
         staff_id IN (SELECT id FROM staff WHERE organization_id = auth_org_id()))
    );
CREATE POLICY "staff_documents: self or manager write" ON staff_documents FOR ALL
    USING (
        staff_id = auth_staff_id() OR
        (auth_is_manager() AND
         staff_id IN (SELECT id FROM staff WHERE organization_id = auth_org_id()))
    )
    WITH CHECK (
        staff_id IN (SELECT id FROM staff WHERE organization_id = auth_org_id())
    );

CREATE POLICY "staff_certifications: read org" ON staff_certifications FOR SELECT
    USING (staff_id IN (SELECT id FROM staff WHERE organization_id = auth_org_id()));
CREATE POLICY "staff_certifications: managers write" ON staff_certifications FOR ALL
    USING (
        auth_is_manager() AND
        staff_id IN (SELECT id FROM staff WHERE organization_id = auth_org_id())
    )
    WITH CHECK (staff_id IN (SELECT id FROM staff WHERE organization_id = auth_org_id()));

CREATE POLICY "onboarding_templates: read org" ON onboarding_templates FOR SELECT USING (organization_id = auth_org_id());
CREATE POLICY "onboarding_templates: managers write" ON onboarding_templates FOR ALL
    USING (organization_id = auth_org_id() AND auth_is_manager())
    WITH CHECK (organization_id = auth_org_id());

CREATE POLICY "staff_onboarding: read own or manager" ON staff_onboarding FOR SELECT
    USING (
        staff_id = auth_staff_id() OR
        (auth_is_manager() AND
         staff_id IN (SELECT id FROM staff WHERE organization_id = auth_org_id()))
    );
CREATE POLICY "staff_onboarding: managers write" ON staff_onboarding FOR ALL
    USING (
        auth_is_manager() AND
        staff_id IN (SELECT id FROM staff WHERE organization_id = auth_org_id())
    )
    WITH CHECK (staff_id IN (SELECT id FROM staff WHERE organization_id = auth_org_id()));

CREATE POLICY "staff_onboarding_tasks: read own or manager" ON staff_onboarding_tasks FOR SELECT
    USING (
        onboarding_id IN (
            SELECT id FROM staff_onboarding
            WHERE staff_id = auth_staff_id()
               OR staff_id IN (SELECT id FROM staff WHERE organization_id = auth_org_id() AND auth_is_manager())
        )
    );
CREATE POLICY "staff_onboarding_tasks: self or manager update" ON staff_onboarding_tasks FOR UPDATE
    USING (
        onboarding_id IN (
            SELECT id FROM staff_onboarding
            WHERE staff_id = auth_staff_id()
               OR (auth_is_manager() AND staff_id IN (SELECT id FROM staff WHERE organization_id = auth_org_id()))
        )
    );

CREATE POLICY "pto_balances: read own or manager" ON pto_balances FOR SELECT
    USING (
        staff_id = auth_staff_id() OR
        (auth_is_manager() AND
         staff_id IN (SELECT id FROM staff WHERE organization_id = auth_org_id()))
    );
CREATE POLICY "pto_balances: managers write" ON pto_balances FOR ALL
    USING (
        auth_is_manager() AND
        staff_id IN (SELECT id FROM staff WHERE organization_id = auth_org_id())
    )
    WITH CHECK (staff_id IN (SELECT id FROM staff WHERE organization_id = auth_org_id()));

CREATE POLICY "performance_notes: read own or manager" ON performance_notes FOR SELECT
    USING (
        (staff_id = auth_staff_id() AND is_private = FALSE) OR
        (auth_is_manager() AND
         staff_id IN (SELECT id FROM staff WHERE organization_id = auth_org_id()))
    );
CREATE POLICY "performance_notes: managers write" ON performance_notes FOR ALL
    USING (
        auth_is_manager() AND
        staff_id IN (SELECT id FROM staff WHERE organization_id = auth_org_id())
    )
    WITH CHECK (
        staff_id IN (SELECT id FROM staff WHERE organization_id = auth_org_id()) AND
        author_id = auth_staff_id()
    );

CREATE POLICY "incidents: read org" ON incidents FOR SELECT USING (organization_id = auth_org_id());
CREATE POLICY "incidents: org insert" ON incidents FOR INSERT
    WITH CHECK (organization_id = auth_org_id() AND reported_by = auth_staff_id());
CREATE POLICY "incidents: managers update" ON incidents FOR UPDATE
    USING (organization_id = auth_org_id() AND auth_is_manager());

-- ============================================
-- Time tracking
-- ============================================
CREATE POLICY "pay_period_settings: read org" ON pay_period_settings FOR SELECT USING (organization_id = auth_org_id());
CREATE POLICY "pay_period_settings: managers write" ON pay_period_settings FOR ALL
    USING (organization_id = auth_org_id() AND auth_is_manager())
    WITH CHECK (organization_id = auth_org_id());

CREATE POLICY "time_entries: read own or manager" ON time_entries FOR SELECT
    USING (
        staff_id = auth_staff_id() OR
        (auth_is_manager() AND
         staff_id IN (SELECT id FROM staff WHERE organization_id = auth_org_id()))
    );
CREATE POLICY "time_entries: self insert" ON time_entries FOR INSERT
    WITH CHECK (staff_id = auth_staff_id());
CREATE POLICY "time_entries: self update pending" ON time_entries FOR UPDATE
    USING (staff_id = auth_staff_id() AND status IN ('pending', 'disputed'));
CREATE POLICY "time_entries: managers write" ON time_entries FOR ALL
    USING (
        auth_is_manager() AND
        staff_id IN (SELECT id FROM staff WHERE organization_id = auth_org_id())
    )
    WITH CHECK (staff_id IN (SELECT id FROM staff WHERE organization_id = auth_org_id()));

CREATE POLICY "timesheets: read own or manager" ON timesheets FOR SELECT
    USING (
        staff_id = auth_staff_id() OR
        (organization_id = auth_org_id() AND auth_is_manager())
    );
CREATE POLICY "timesheets: self sign" ON timesheets FOR UPDATE
    USING (staff_id = auth_staff_id())
    WITH CHECK (staff_id = auth_staff_id());
CREATE POLICY "timesheets: managers write" ON timesheets FOR ALL
    USING (organization_id = auth_org_id() AND auth_is_manager())
    WITH CHECK (organization_id = auth_org_id());

CREATE POLICY "timesheet_entries: read via timesheet" ON timesheet_entries FOR SELECT
    USING (
        timesheet_id IN (
            SELECT id FROM timesheets
            WHERE staff_id = auth_staff_id() OR (organization_id = auth_org_id() AND auth_is_manager())
        )
    );
CREATE POLICY "timesheet_entries: managers write" ON timesheet_entries FOR ALL
    USING (
        auth_is_manager() AND
        timesheet_id IN (SELECT id FROM timesheets WHERE organization_id = auth_org_id())
    )
    WITH CHECK (
        timesheet_id IN (SELECT id FROM timesheets WHERE organization_id = auth_org_id())
    );

CREATE POLICY "timesheet_disputes: read via timesheet" ON timesheet_disputes FOR SELECT
    USING (
        raised_by = auth_staff_id() OR
        (auth_is_manager() AND
         timesheet_id IN (SELECT id FROM timesheets WHERE organization_id = auth_org_id()))
    );
CREATE POLICY "timesheet_disputes: self insert" ON timesheet_disputes FOR INSERT
    WITH CHECK (raised_by = auth_staff_id());
CREATE POLICY "timesheet_disputes: managers resolve" ON timesheet_disputes FOR UPDATE
    USING (
        auth_is_manager() AND
        timesheet_id IN (SELECT id FROM timesheets WHERE organization_id = auth_org_id())
    );

-- ============================================
-- Activity log — read org (managers), write anyone in org (server actions log their own actions)
-- ============================================
CREATE POLICY "activity_log: managers read" ON activity_log FOR SELECT
    USING (organization_id = auth_org_id() AND auth_is_manager());
CREATE POLICY "activity_log: org insert" ON activity_log FOR INSERT
    WITH CHECK (organization_id = auth_org_id() AND actor_id = auth_staff_id());
