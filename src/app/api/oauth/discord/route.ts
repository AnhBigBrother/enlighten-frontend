import { DISCORD_CLIENT_ID, DISCORD_GET_CONSENT_URL, DISCORD_REDIRECT_URI } from "@/constants";
import { createRandomString } from "@/lib/functions";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
	const url = new URL(DISCORD_GET_CONSENT_URL);
	url.searchParams.set("client_id", DISCORD_CLIENT_ID);
	url.searchParams.set("redirect_uri", DISCORD_REDIRECT_URI);
	url.searchParams.set("response_type", "code");
	url.searchParams.set("scope", "identify email openid");
	url.searchParams.set("state", createRandomString(12));
	return NextResponse.json({ url: url.toString() });
}
