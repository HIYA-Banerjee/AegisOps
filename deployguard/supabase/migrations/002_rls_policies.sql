-- AegisOps DeployGuard AI — RLS Policies Migration

-- Enable Row Level Security (RLS)
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE deployments ENABLE ROW LEVEL SECURITY;
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;

-- General SELECT access for authenticated users
CREATE POLICY "Allow read access for authenticated users on teams" ON teams FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow read access for authenticated users on users" ON users FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow read access for authenticated users on team_members" ON team_members FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow read access for authenticated users on services" ON services FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow read access for authenticated users on deployments" ON deployments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow read access for authenticated users on incidents" ON incidents FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow read access for authenticated users on metrics" ON metrics FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow read access for authenticated users on predictions" ON predictions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow read access for authenticated users on integrations" ON integrations FOR SELECT TO authenticated USING (true);

-- User self-management policy
CREATE POLICY "Allow users to update their own profile" ON users FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Write/Modify access policies
CREATE POLICY "Allow deployment inserts by authenticated users" ON deployments FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow incident inserts/updates by authenticated users" ON incidents FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow integrations management by authenticated users" ON integrations FOR ALL TO authenticated USING (true) WITH CHECK (true);
