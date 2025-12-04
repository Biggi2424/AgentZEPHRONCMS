export type TicketStatus = "new" | "in_progress" | "waiting" | "resolved" | "closed";
export type TicketPriority = "low" | "normal" | "high" | "critical";

export interface Ticket {
  id: string;
  tenantId: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  requesterUserId: string;
  assigneeUserId: string | null;
  source: "portal" | "email" | "agent";
  createdAt: string;
  updatedAt: string;
}

export interface Agent {
  id: string;
  tenantId: string;
  deviceName: string;
  userName: string;
  osVersion: string;
  neyraqVersion: string;
  onlineStatus: "online" | "offline";
  lastSeenAt: string;
  tags: string[];
}

export interface CatalogItem {
  id: string;
  tenantId: string;
  type: "software" | "service";
  title: string;
  description: string;
  iconUrl: string | null;
  category: string;
  requiresApproval: boolean;
}
