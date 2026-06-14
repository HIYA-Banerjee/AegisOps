import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const SignupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  team: z.string().min(1, "Please select a team"),
  role: z.enum(["admin", "sre", "developer", "executive"]),
});

export const DeploymentSchema = z.object({
  version: z.string().min(1, "Version is required"),
  env: z.enum(["prod", "staging", "dev"]),
  msg: z.string().min(1, "Commit message/description is required"),
  commitHash: z.string().min(7, "Commit hash must be at least 7 characters"),
  author: z.string().min(1, "Author is required"),
  team: z.string().min(1, "Team is required"),
  testCoverage: z.number().min(0).max(100),
  failedBuilds: z.number().nonnegative(),
  dependencyChanges: z.number().nonnegative(),
  commitVelocity: z.number().nonnegative(),
  buildDuration: z.number().nonnegative(),
});

export const IncidentSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  severity: z.enum(["P0", "P1", "P2"]),
  status: z.enum(["active", "resolved", "investigating"]),
  service: z.string().min(1, "Service is required"),
  cost: z.number().nonnegative(),
  affectedUsers: z.number().nonnegative(),
  rootCause: z.string().min(5, "Root cause details are required"),
});
