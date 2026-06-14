// AegisOps DeployGuard AI — Supabase client with Mock fallback
import { createClient } from '@supabase/supabase-js';
import { 
  mockDeployments, 
  mockIncidents, 
  mockTeams, 
  mockIntegrations,
  Deployment,
  Incident,
  TeamPerformance,
  Integration
} from './mockData';
import {
  mockDORAMetrics,
  mockSLOMetrics,
  mockCostMetrics,
  mockLogs,
  mockVulnerabilities,
  mockTelemetryMetrics,
} from './mockExtended';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Detect new sb_publishable key format.
// These work for DB queries (PostgREST) but NOT for auth endpoints.
export const isPublishableKey = !!(supabaseAnonKey && supabaseAnonKey.startsWith('sb_publishable'));

// Supabase is available for DB queries as long as URL + key are set.
export const isRealSupabaseAvailable = !!(supabaseUrl && supabaseAnonKey);

// isRealAuthAvailable: only true when using the legacy JWT anon key (eyJ...)
export const isRealAuthAvailable = isRealSupabaseAvailable && !isPublishableKey;

export const realSupabase = isRealSupabaseAvailable
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null;

/** Wraps a Supabase auth promise with an 8-second timeout */
export async function withAuthTimeout<T>(promise: Promise<T>): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('SUPABASE_TIMEOUT')), 8000)
    ),
  ]);
}

class MockQueryBuilder<T> {
  private data: T[];
  private tableName: string;

  constructor(data: T[], tableName: string) {
    this.data = [...data];
    this.tableName = tableName;
  }

  select(columns: string = '*'): this {
    return this;
  }

  order(column: string, { ascending = true }: { ascending?: boolean } = {}): this {
    this.data.sort((a: any, b: any) => {
      const valA = a[column];
      const valB = b[column];
      if (valA < valB) return ascending ? -1 : 1;
      if (valA > valB) return ascending ? 1 : -1;
      return 0;
    });
    return this;
  }

  limit(count: number): this {
    this.data = this.data.slice(0, count);
    return this;
  }

  eq(column: string, value: any): this {
    this.data = this.data.filter((item: any) => {
      const camel = column.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
      return item[column] === value || item[camel] === value;
    });
    return this;
  }

  async insert(item: any): Promise<{ data: T[] | null; error: any }> {
    const items = Array.isArray(item) ? item : [item];
    if (this.tableName === 'deployments') {
      mockDeployments.unshift(...items);
    } else if (this.tableName === 'incidents') {
      mockIncidents.unshift(...items);
    }
    return { data: items, error: null };
  }

  async update(item: any): Promise<{ data: T[] | null; error: any }> {
    if (this.tableName === 'incidents') {
      // Find and update item in mockIncidents
      for (const updateObj of (Array.isArray(item) ? item : [item])) {
        const index = mockIncidents.findIndex(x => x.id === updateObj.id);
        if (index !== -1) {
          mockIncidents[index] = { ...mockIncidents[index], ...updateObj };
        }
      }
    }
    return { data: this.data, error: null };
  }

  async then(resolve: (res: { data: T[] | null; error: any }) => void) {
    await new Promise((r) => setTimeout(r, 100));
    resolve({ data: this.data, error: null });
  }
}

export const supabase = {
  from(table: 'deployments' | 'incidents' | 'teams' | 'integrations' | string) {
    if (isRealSupabaseAvailable && realSupabase) {
      return realSupabase.from(table);
    }
    
    switch (table) {
      case 'deployments':
        return new MockQueryBuilder<Deployment>(mockDeployments, 'deployments');
      case 'incidents':
        return new MockQueryBuilder<Incident>(mockIncidents, 'incidents');
      case 'teams':
        return new MockQueryBuilder<TeamPerformance>(mockTeams, 'teams');
      case 'integrations':
        return new MockQueryBuilder<Integration>(mockIntegrations, 'integrations');
      case 'dora_metrics':
        return new MockQueryBuilder([{
          team_id: 'team-1',
          deployment_frequency: mockDORAMetrics.deploymentFrequency,
          lead_time_hours: mockDORAMetrics.leadTimeHours,
          mttr_minutes: mockDORAMetrics.meanTimeToRestoreMinutes,
          change_failure_rate: mockDORAMetrics.changeFailureRatePercent,
          tier: mockDORAMetrics.tier,
          period_end: new Date().toISOString(),
        }], 'dora_metrics');
      case 'slo_metrics':
        return new MockQueryBuilder(mockSLOMetrics.map(s => ({
          slo_id: s.sloId,
          name: s.name,
          target_percent: s.targetPercent,
          current_percent: s.currentPercent,
          error_budget_percent: s.errorBudgetPercent,
          status: s.status,
          recorded_at: new Date().toISOString(),
        })), 'slo_metrics');
      case 'cost_metrics':
        return new MockQueryBuilder(mockCostMetrics.map(c => ({
          service_name: c.serviceName,
          provider: c.provider,
          current_cost: c.currentCost,
          previous_cost: c.previousCost,
          forecast_cost: c.forecastCost,
          anomaly_detected: c.anomalyDetected,
          recorded_at: new Date().toISOString(),
        })), 'cost_metrics');
      case 'metrics':
        return new MockQueryBuilder(mockTelemetryMetrics.map(m => ({
          service_id: m.serviceId,
          metric_name: m.metricName,
          value: m.value,
          timestamp: m.timestamp,
        })), 'metrics');
      case 'logs':
        return new MockQueryBuilder(mockLogs.map(l => ({
          id: l.id,
          service_id: l.serviceId,
          level: l.level,
          message: l.message,
          timestamp: l.timestamp,
        })), 'logs');
      case 'vulnerabilities':
        return new MockQueryBuilder(mockVulnerabilities.map(v => ({
          id: v.id,
          service_id: v.serviceId,
          cve_id: v.cveId,
          severity: v.severity,
          package_name: v.packageName,
          risk_score: v.riskScore,
        })), 'vulnerabilities');
      default:
        return new MockQueryBuilder<any>([], table);
    }
  },

  auth: {
    signUp: async (credentials: any) => {
      if (isRealSupabaseAvailable && realSupabase) {
        return realSupabase.auth.signUp(credentials);
      }
      await new Promise(r => setTimeout(r, 500));
      const mockUser = {
        id: "mock-user-id",
        email: credentials.email,
        created_at: new Date().toISOString(),
        user_metadata: credentials.options?.data || {},
      };
      return { data: { user: mockUser, session: { user: mockUser } }, error: null };
    },
    signInWithPassword: async (credentials: any) => {
      if (isRealSupabaseAvailable && realSupabase) {
        return realSupabase.auth.signInWithPassword(credentials);
      }
      await new Promise(r => setTimeout(r, 500));
      const mockUser = {
        id: "mock-user-id",
        email: credentials.email,
        created_at: new Date().toISOString(),
        user_metadata: {},
      };
      return { data: { user: mockUser, session: { user: mockUser } }, error: null };
    },
    signOut: async () => {
      if (isRealSupabaseAvailable && realSupabase) {
        return realSupabase.auth.signOut();
      }
      await new Promise(r => setTimeout(r, 200));
      return { error: null };
    },
    getSession: async () => {
      if (isRealSupabaseAvailable && realSupabase) {
        return realSupabase.auth.getSession();
      }
      return { data: { session: null }, error: null };
    },
    onAuthStateChange: (callback: Parameters<NonNullable<typeof realSupabase>["auth"]["onAuthStateChange"]>[0]) => {
      if (isRealSupabaseAvailable && realSupabase) {
        return realSupabase.auth.onAuthStateChange(callback);
      }
      return { data: { subscription: { unsubscribe: () => {} } } };
    },
    resetPasswordForEmail: async (email: string, options?: { redirectTo?: string }) => {
      if (isRealSupabaseAvailable && realSupabase) {
        return realSupabase.auth.resetPasswordForEmail(email, options);
      }
      await new Promise(r => setTimeout(r, 500));
      return { data: {}, error: null };
    },
  },
  
  async checkConnection(): Promise<boolean> {
    if (isRealSupabaseAvailable && realSupabase) {
      try {
        const { error } = await realSupabase.from('deployments').select('id').limit(1);
        return !error;
      } catch (e) {
        return false;
      }
    }
    await new Promise((r) => setTimeout(r, 200));
    return true; 
  }
};
