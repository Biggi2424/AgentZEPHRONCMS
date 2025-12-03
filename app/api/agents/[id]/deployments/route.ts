import { NextRequest, NextResponse } from "next/server";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  const deployments = [
    {
      id: "deploy-1",
      agentId: id,
      packageName: "Office 365",
      status: "pending",
    },
  ];

  return NextResponse.json({ deployments });
}
