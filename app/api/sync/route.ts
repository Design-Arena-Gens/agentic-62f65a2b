import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const globalStore = globalThis as typeof globalThis & {
  driverHelperSync?: {
    payload: unknown;
    timestamp: string;
  };
};

export async function POST(request: Request) {
  const body = await request.json();
  globalStore.driverHelperSync = {
    payload: body.payload,
    timestamp: body.timestamp ?? new Date().toISOString()
  };
  return NextResponse.json({ status: 'ok', receivedAt: globalStore.driverHelperSync.timestamp });
}

export async function GET() {
  return NextResponse.json(globalStore.driverHelperSync ?? { status: 'no-data' });
}
