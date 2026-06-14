-- Phase 1: RLS for extended tables

ALTER TABLE logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE root_causes ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE vulnerabilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE simulations ENABLE ROW LEVEL SECURITY;
ALTER TABLE dora_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE slo_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE cost_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Read access for authenticated users
CREATE POLICY "auth_read_logs" ON logs FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_read_root_causes" ON root_causes FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_read_alerts" ON alerts FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_read_vulnerabilities" ON vulnerabilities FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_read_simulations" ON simulations FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_read_dora_metrics" ON dora_metrics FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_read_slo_metrics" ON slo_metrics FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_read_cost_metrics" ON cost_metrics FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_read_audit_logs" ON audit_logs FOR SELECT TO authenticated USING (true);

-- Write policies
CREATE POLICY "auth_insert_logs" ON logs FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "auth_manage_root_causes" ON root_causes FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_manage_alerts" ON alerts FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_manage_vulnerabilities" ON vulnerabilities FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_insert_simulations" ON simulations FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "auth_read_own_simulations" ON simulations FOR SELECT TO authenticated USING (created_by = auth.uid() OR created_by IS NULL);
CREATE POLICY "auth_insert_dora_metrics" ON dora_metrics FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "auth_insert_slo_metrics" ON slo_metrics FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "auth_insert_cost_metrics" ON cost_metrics FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "auth_insert_audit_logs" ON audit_logs FOR INSERT TO authenticated WITH CHECK (true);

-- Admin-only audit log reads (admins see all; others see own actions)
CREATE POLICY "users_read_own_audit" ON audit_logs FOR SELECT TO authenticated
  USING (
    user_id = auth.uid()
    OR EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin')
  );
