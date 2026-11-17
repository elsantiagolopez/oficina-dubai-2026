import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import os from "os";

const BROADCAST_FILE = path.join(os.tmpdir(), "pixel-agents-broadcast.json");

interface BroadcastConfig {
  broadcast: boolean;
  showPaths: boolean;
}

function readBroadcastConfig(): BroadcastConfig {
  try {
    return JSON.parse(fs.readFileSync(BROADCAST_FILE, "utf8"));
  } catch {
    return { broadcast: false, showPaths: true };
  }
}

function writeConfig(config: BroadcastConfig): void {
  fs.writeFileSync(BROADCAST_FILE, JSON.stringify(config), "utf8");
}

export async function GET() {
  return NextResponse.json(readBroadcastConfig());
}

export async function POST(req: Request) {
  const body = await req.json();
  const current = readBroadcastConfig();
  const updated: BroadcastConfig = {
    broadcast: body.broadcast !== undefined ? Boolean(body.broadcast) : current.broadcast,
    showPaths: body.showPaths !== undefined ? Boolean(body.showPaths) : current.showPaths,
  };
  writeConfig(updated);
  return NextResponse.json(updated);
}
