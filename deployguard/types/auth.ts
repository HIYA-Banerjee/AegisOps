export type UserRole = 'admin' | 'sre' | 'developer' | 'executive';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
}

export interface Session {
  accessToken: string;
  expiresAt: number;
  user: User;
}

export interface Team {
  id: string;
  name: string;
  avatar: string;
  stabilityScore: number;
  successRate: number;
  riskRanking: number;
  commits: number;
  deployments: number;
  failures: number;
  preventedFailures: number;
  leadTimeDays: number;
}

export interface TeamMember {
  id: string;
  teamId: string;
  userId: string;
  role: 'leader' | 'member';
}
