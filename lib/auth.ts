export type UserRole = "owner" | "admin" | "operator" | "viewer";

export type TenantType = "user" | "company";
export type PersonaRole = "user" | "company_admin" | "company_agent";
export type PlanType = "trial" | "free" | "pro" | "enterprise";
export type ThrottleState = "normal" | "warning" | "throttled";

export interface SessionUser {
  id: string;
  tenantId: string;
  tenantType: TenantType;
  personaRole: PersonaRole;
  email: string;
  displayName: string;
  role: UserRole;
  plan: PlanType;
  trialExpiresAt: string;
  tokensUsedPeriod: number;
  tokensQuotaPeriod: number;
  throttleState: ThrottleState;
}

/**
 * Platzhalter fuer spaetere Entra ID / OpenID-Integration.
 * Im MVP liefern wir einen festen Demo-User zurueck.
 */
export async function getCurrentUser(): Promise<SessionUser> {
  return {
    id: "demo-user",
    tenantId: "demo-tenant",
    tenantType: "user",
    personaRole: "user",
    email: "neyraq.user@vdma.example",
    displayName: "Issam",
    role: "owner",
    plan: "trial",
    trialExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    tokensUsedPeriod: 18450,
    tokensQuotaPeriod: 50000,
    throttleState: "normal",
  };
}
